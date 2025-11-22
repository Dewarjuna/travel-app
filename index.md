# Project Analysis — travel-app

This document provides a complete analysis of the project's code and features, and explains the code flow and logic. This is a factual, recommendation-free summary intended for review and presentation.

---

## Overview

- Project: `travel-app` (DewaTravel) — a React single-page application for browsing and booking travel activities.
- Stack: React 19, React Router v7, Vite, Tailwind CSS, Axios, Heroicons.

---

## Features (User-facing)

- Browse activity listings with search and category filters
- View detailed activity pages with image gallery, price, rating
- Add activities to cart with adjustable quantity
- Manage cart (update quantity, remove items)
- Checkout with selectable payment method
- View transaction history and transaction details
- User authentication: register, login, logout, profile management
- Toast notifications for user feedback
- Protected routes for authenticated pages (cart, transactions, profile)

---

## Code Map (important files and folders)

- `src/main.jsx` — application entry, mounts React app
- `src/App.jsx` — top-level layout and routes
- `src/context/AuthContext.jsx` — authentication context and session initialization
- `src/api/axios.js` — configured axios instance with interceptors
- `src/api/services/*` — service functions that call API endpoints (activityService, authService, cartService, etc.)
- `src/hooks/apiData.js` — reusable data-fetching hook (`useApiData`)
- `src/hooks/*` — small hooks built on `useApiData` (useActivities, useBanners, useCategories, usePromos) and custom hooks (`useTransactions`, `useCart`, `useAuth`)
- `src/components/layout/*` — `Header`, `Navbar`, `Footer`, `ProtectedRoute`, `ErrorBoundary`
- `src/components/ui/*` — `Button`, `Toast` (global notification provider)
- `src/pages/*` — page components: `Home`, `Activities`, `ActivityDetail`, `Cart`, `Transactions`, `Profile`, `Login`, `Register`, `NotFound`

---

## Detailed Project Structure

Below is a file-tree view of the `src/` directory to help you quickly locate important code.

```
src/
	index.css
	App.css
	main.jsx
	App.jsx
	assets/
		react.svg
	context/
		AuthContext.jsx
	api/
		axios.js
		services/
			activityService.js
			authService.js
			bannerService.js
			cartService.js
			categoryService.js
			paymentMethod.js
			promoService.js
			transactionService.js
			uploadService.js
			userService.js
	components/
		layout/
			Header.jsx
			Navbar.jsx
			Footer.jsx
			ProtectedRoute.jsx
			ErrorBoundary.jsx
		ui/
			Button.jsx
			Toast.jsx
		home/
			Hero.jsx
			CategoryGrid.jsx
			FeaturedActivities.jsx
			PromoGrid.jsx
	hooks/
		apiData.js
		useActivities.js
		useAuth.js
		useTransactions.js
		usePromos.js
		usePaymentMethod.js
		useCategories.js
		useCart.js
		useBanners.js
	pages/
		Home.jsx
		Activities.jsx
		ActivityDetail.jsx
		Cart.jsx
		Login.jsx
		Register.jsx
		Profile.jsx
		Transactions.jsx
		NotFound.jsx
```


## Runtime Initialization and App Startup Flow

1. `src/main.jsx` mounts the React tree and renders `<App />` inside `#root`.
2. `App.jsx` composes global providers: `AuthProvider` and `ToastProvider`, then `BrowserRouter` and layout components (`Header`, `Footer`).
3. `AuthProvider` (`AuthContext.jsx`) runs initialization on first render:
	 - Reads `localStorage.getItem('token')`.
	 - If token exists, sets `token` state and calls `authService.me()` to fetch and set the `user` state.
	 - Sets `loading` state to false after initialization.
4. Routes are declared in `App.jsx`. Pages that require authentication are wrapped with `ProtectedRoute`, and many pages are wrapped with `ErrorBoundary` for render-time safety.

---

## Authentication Flow (detailed logic)

- Register / Login:
	- `authService.register(data)` makes POST `/api/v1/register` and returns API response.
	- `authService.login({ email, password })` makes POST `/api/v1/login`. On success the service stores the returned token to `localStorage` and returns response data.
	- `AuthContext.login` calls `authService.login`, and on success sets `token`, `user` in context state and persists token in `localStorage`.
- Session Persistence:
	- On app load, `AuthProvider` reads token from `localStorage` and attempts to call `authService.me()` to populate `user`.
- Logout:
	- `AuthContext.logout` calls `authService.logout()` (GET `/api/v1/logout`), clears `user` and `token` state and removes token from `localStorage`.

---

## API Client and Interceptor Logic

- `src/api/axios.js` creates an Axios instance `api` with `baseURL` read from `import.meta.env.VITE_API_BASE_URL` and an `apiKey` header from `VITE_API_KEY`.
- Request interceptor behavior:
	- Before each request, the interceptor reads `localStorage.getItem('token')` and, if present, sets `Authorization: Bearer <token>` header on the request.
- Response interceptor behavior:
	- If a response error has HTTP status `401`, the interceptor removes `token` from `localStorage` and navigates the user to `/login` (full navigation logic is performed in the interceptor).
	- Other errors are propagated to the caller.

---

## Services Layer (how API calls are organized)

- Each `src/api/services/*.js` file exports a plain object of functions that call the `api` Axios instance. Example patterns:
	- `list` endpoints: `api.get('/api/v1/activities').then(r => r.data)`
	- `byId` endpoints: `api.get(`/api/v1/activity/${id}`).then(r => r.data)`
	- `create` / `update` endpoints: `api.post('/api/v1/create-activity', data).then(r => r.data)`
	- `remove` endpoints: `api.delete('/api/v1/delete-activity/${id}').then(r => r.data)`

- Services return the API response payload (commonly `res.data`) so callers get normalized payloads.

---

## Data Fetching Hooks and Patterns

- `useApiData(fetcher, deps)` implements a standard data-fetch pattern across the app:
	- Accepts a `fetcher` callback (async) and a `deps` array.
	- Manages `data`, `loading`, and `error` state.
	- Invokes `fetcher()` on mount (and when `deps` change) and exposes `refresh` to re-run the fetch.
	- Normalizes returned value using `result?.data ?? result ?? []` so it supports services that either return `res` or `res.data`.

- Specific wrapper hooks use `useApiData` to provide typed semantics to components:
	- `useActivities` — fetches activities list (and a variation for `byId`)
	- `useBanners` — fetches banners
	- `useCategories` — fetches categories
	- `usePromos` — fetches promos

- `useTransactions` is a custom hook that:
	- Fetches the current user's transactions via `transactionService.myList()`.
	- Sorts transactions by date (it expects a date field such as `orderDate` or a provided date key).
	- Exposes `createTransaction(cartIds, paymentMethodId)` which calls `transactionService.create(...)`, and then refreshes the transaction list.

---

## Page and Component Logic (flows for core user actions)

The following descriptions explain the logic for key user flows and how code executes:

### 1) Browse Activities (`Activities.jsx`)

- On mount, the page fetches categories (`categoryService.list()`) and activities (`activityService.list()` or `activityService.byCategory(categoryId)`).
- Search and category filters are implemented by updating the URL query params using `useSearchParams`. Changes to search or category trigger a re-fetch of activities.
- The component performs client-side filtering (title, description, city, province) to refine results.
- UI state:
	- `loading` shows skeleton placeholders while fetching
	- If no activities match, an empty-state UI with a CTA is rendered

### 2) View Activity Detail (`ActivityDetail.jsx`)

- `useParams()` reads `id` from the route.
- The component calls `activityService.byId(id)` and sets the returned activity into state.
- The UI shows an image gallery and details (price, discount, rating, description).
- Add-to-cart flow:
	- If user is not authenticated, `addToast` instructs to login and the user is navigated to `/login`.
	- If authenticated, `cartService.add(activity.id, quantity)` is called.
	- If adding multiple quantity, the code lists cart items (`cartService.list()`), locates the added item, and calls `cartService.update(addedItem.id, quantity)` to update the quantity.
	- On success, `addToast` displays confirmation and resets quantity.

### 3) Cart Management (`Cart.jsx`)

- On mount, the page fetches both cart items (`cartService.list()`) and payment methods (`paymentMethodService.list()`) in parallel.
- The component computes `total` by summing `price_discount * quantity` per item.
- Quantity updates and removal:
	- `handleUpdateQuantity` calls `cartService.update(cartId, newQty)` then refreshes data
	- `handleRemove` calls `cartService.remove(cartId)` then refreshes
	- Success and failure are surfaced via `addToast`
- Checkout:
	- Validates `selectedPaymentMethod` and non-empty cart
	- Calls `transactionService.create(cartIds, selectedPaymentMethod)`
	- On success navigates to `/transactions` and shows a success toast

### 4) Transactions (`Transactions.jsx`)

- The page uses `transactionService.myList()` (via `useTransactions` or direct call) to fetch orders.
- Each transaction shows status (mapped to visual label/icon), date, items, and total.
- Clicking a transaction opens a details view (same page) showing items, totals, and metadata.

### 5) Profile (`Profile.jsx`)

- On mount, `userService.profile()` fetches the current user's profile.
- The form allows editing `name` and `phone`. On submit, it calls `userService.updateProfile({ name, phone })` and shows a success or error toast.

### 6) Auth Pages (`Login.jsx`, `Register.jsx`)

- `Login.jsx` collects email and password and runs `AuthContext.login(email, password)`.
- On success it navigates the user (the `AuthProvider` sets `token` and `user`), and a toast is shown.

---

## State Management Summary

- Global state is minimal and focused on authentication (`AuthContext` with `user`, `token`, `loading`).
- Local component state is used extensively for form inputs, loading flags, and temporary UI state (e.g., `addingToCart`, `creating`).
- Data fetching state is standardized by `useApiData` which provides `loading` and `error` for read flows; mutation flows use local `loading` flags per component or custom hooks like `useTransactions`'s `creating` state.

---

## Data Normalization & Shape Expectations

- Services often return `res.data`. The `useApiData` hook normalizes responses using `result?.data ?? result ?? []` so callers receive the payload reliably.
- Transaction items and activity objects may include fields such as `id`, `title`, `price`, `price_discount`, `imageUrls`, `rating`, `city`, `province`, and `createdAt` or `orderDate`.

---

## Error Handling Flow

- Network and API errors bubble back to the caller. Pages catch errors from service calls and show user-facing messages using the Toast provider (`addToast`).
- `ErrorBoundary.jsx` wraps pages to catch render-time exceptions and show a retry UI for unexpected errors.

---

## Search & Routing Behavior

- Searching and filtering in `Activities.jsx` is URL-driven: `useSearchParams` updates query params `q` and `category` so results are shareable via URL.
- Routing uses `react-router-dom` with `Routes` and `Route` elements; protected pages are guarded by `ProtectedRoute` which uses `AuthContext.loading` and `isAuthenticated` to decide rendering or redirect to `/login`.

---

## Summary of Logical Flow (concise)

1. App boots and `AuthProvider` initializes auth state from `localStorage`.
2. Router renders pages; `ProtectedRoute` controls access to auth-required pages.
3. Data reads use `useApiData` or custom hooks to load lists and individual items.
4. Mutations (add to cart, update profile, checkout) call service functions which call Axios; components show loading states and toasts around these calls.
5. Axios interceptors attach token to requests and redirect on 401.

---

End of analysis (no recommendations included). 