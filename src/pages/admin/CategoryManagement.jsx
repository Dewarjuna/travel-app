import { useState, useMemo } from 'react';
import { categoryService } from '../../api/services/categoryService';
import { useCategories } from '../../hooks/useCategories';
import Pagination from '../../components/ui/Pagination';
import Button from '../../components/ui/Button';
import fallbackimg from '../../assets/candi.jpg';
const ITEMS_PER_PAGE = 10;

const CategoryManagement = () => {
  const { categories, loading, error, refresh } = useCategories();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Filter categories by search string
  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    return categories.filter(
      cat =>
        cat.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, categories]);
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const visibleCategories = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCategories.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCategories, currentPage]);

  // Modal show/hide
  const startCreate = () => {
    setFormState({});
    setSelected(null);
    setShowForm(true);
  };

  const startEdit = (category) => {
    setFormState(category);
    setSelected(category);
    setShowForm(true);
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((f) => ({ ...f, [name]: value }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    setDeletingId(id);
    try {
      await categoryService.remove(id);
      await refresh();
    } finally {
      setDeletingId(null);
    }
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (selected) {
        await categoryService.update(selected.id, formState);
      } else {
        await categoryService.create(formState);
      }
      setShowForm(false);
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <Button onClick={startCreate}>+ Add Category</Button>
      </div>
      <div className="mb-4 flex items-center gap-4">
        <input
          className="px-4 py-2 border border-gray-300 rounded-lg w-64"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={refresh} type="button">Refresh</Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">Error loading categories</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow rounded-xl border">
            <table className="w-full min-w-[400px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleCategories.map(category => (
                  <tr key={category.id} className="border-b">
                    <td className="px-4 py-2">
                      <img
                        src={category.imageUrl || fallbackimg}
                        alt={category.name}
                        onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackimg; }}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-4 py-2 font-semibold">
                      {category.name}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button size="sm" onClick={() => startEdit(category)}>Edit</Button>
                      <Button
                        size="sm"
                        type="button"
                        color="danger"
                        onClick={() => handleDelete(category.id)}
                        loading={deletingId === category.id}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {visibleCategories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-500 py-8">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
            <h2 className="font-bold text-lg mb-4">
              {selected ? 'Edit Category' : 'Add Category'}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  name="name"
                  value={formState.name || ''}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formState.imageUrl || ''}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button type="submit" loading={saving}>
                  Save
                </Button>
                <Button type="button" onClick={() => setShowForm(false)} variant="secondary">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;