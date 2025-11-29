<<<<<<< HEAD
=======
// src/components/ui/Button.jsx

>>>>>>> 8d79e2b82949478a72ec7735a5ecdc4a5d3b9f32
const baseClasses = `
  inline-flex items-center justify-center gap-2
  font-semibold rounded-lg
  transition-all duration-150 ease-in-out
  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
  disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
`;

const variants = {
  primary: `
    bg-gradient-to-b from-blue-500 to-blue-600 
    text-white
    shadow-[0_4px_10px_rgba(37,99,235,0.4)]
    hover:from-blue-600 hover:to-blue-700 hover:shadow-[0_6px_18px_rgba(37,99,235,0.55)]
    active:from-blue-700 active:to-blue-800 active:shadow-inner
  `,
  secondary: `
    bg-white text-blue-600 border border-blue-300
    hover:bg-blue-50 hover:border-blue-400
    shadow-sm hover:shadow
  `,
  outline: `
    bg-transparent text-blue-600 border border-blue-500
    hover:bg-blue-50
  `,
  ghost: `
    bg-transparent text-gray-700
    hover:bg-gray-100
  `,
  danger: `
    bg-gradient-to-b from-red-500 to-red-600 
    text-white
    shadow-[0_4px_10px_rgba(248,113,113,0.4)]
    hover:from-red-600 hover:to-red-700 hover:shadow-[0_6px_18px_rgba(248,113,113,0.55)]
    active:from-red-700 active:to-red-800 active:shadow-inner
  `,
  success: `
    bg-gradient-to-b from-emerald-500 to-emerald-600 
    text-white
    shadow-[0_4px_10px_rgba(16,185,129,0.4)]
    hover:from-emerald-600 hover:to-emerald-700 hover:shadow-[0_6px_18px_rgba(16,185,129,0.55)]
    active:from-emerald-700 active:to-emerald-800 active:shadow-inner
  `,
  soft: `
    bg-blue-50 text-blue-700
    hover:bg-blue-100
  `,
  subtle: `
    bg-gray-50 text-gray-800
    hover:bg-gray-100
  `,
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
  xl: 'px-6 py-3.5 text-base',
};

const iconOnlySizes = {
  xs: 'p-1.5',
  sm: 'p-2',
  md: 'p-2.5',
  lg: 'p-3',
  xl: 'p-3.5',
};

const Button = ({
  children,
  onClick,
  loading = false,
  disabled = false,
  fullWidth = false,
  variant = 'primary',
  size = 'md',
  type = 'button',
  leftIcon,
  rightIcon,
  className = '',
  ariaLabel,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const hasText = Boolean(children);
  const isIconOnly = !hasText && (leftIcon || rightIcon);

  const content = loading ? (
    <>
      <span
        className={`
          h-4 w-4 border-2 rounded-full animate-spin
          ${
            variant === 'secondary' ||
            variant === 'outline' ||
            variant === 'ghost' ||
            variant === 'subtle'
              ? 'border-blue-500 border-t-transparent'
              : 'border-white border-t-transparent'
          }
        `}
      />
      <span className="sr-only">Loading…</span>
    </>
  ) : (
    <>
      {leftIcon && <span className="inline-flex items-center">{leftIcon}</span>}
      {hasText && <span className="whitespace-nowrap">{children}</span>}
      {rightIcon && <span className="inline-flex items-center">{rightIcon}</span>}
    </>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
      aria-label={ariaLabel}
      className={`
        ${baseClasses}
        ${variants[variant] || variants.primary}
        ${isIconOnly ? iconOnlySizes[size] : sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;