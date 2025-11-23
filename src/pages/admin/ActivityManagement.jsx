import { useState, useMemo } from 'react';
import { activityService } from '../../api/services/activityService';
import { useActivities } from '../../hooks/useActivities';
import Pagination from '../../components/ui/Pagination';
import Button from '../../components/ui/Button';
import fallbackimg from '../../assets/candi.jpg';

const ITEMS_PER_PAGE = 10;

const ActivityManagement = () => {
  const { activities, loading, error, refresh } = useActivities();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Filter activities by search query
  const filteredActivities = useMemo(() => {
    if (!search) return activities;
    const s = search.toLowerCase();
    return activities.filter(
      (a) =>
        a.title?.toLowerCase().includes(s) ||
        a.city?.toLowerCase().includes(s) ||
        a.province?.toLowerCase().includes(s) ||
        (a.category?.name?.toLowerCase().includes(s) ?? false)
    );
  }, [search, activities]);
  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const visibleActivities = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredActivities.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredActivities, currentPage]);

  const startCreate = () => {
    setFormState({});
    setSelected(null);
    setShowForm(true);
  };

  const startEdit = (activity) => {
    setFormState(activity);
    setSelected(activity);
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((f) => ({ ...f, [name]: value }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    setDeletingId(id);
    try {
      await activityService.remove(id);
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
        await activityService.update(selected.id, formState);
      } else {
        await activityService.create(formState);
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
        <h1 className="text-2xl font-bold">Manage Activities</h1>
        <Button onClick={startCreate}>+ Add Activity</Button>
      </div>
      <div className="mb-4 flex items-center gap-4">
        <input
          className="px-4 py-2 border border-gray-300 rounded-lg w-64"
          placeholder="Search by title city province"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={refresh} type="button">Refresh</Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">Error loading activities</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow rounded-xl border">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleActivities.map((activity) => (
                  <tr key={activity.id} className="border-b">
                    <td className="px-4 py-2">
                      <img
                        src={activity.imageUrls?.[0] || fallbackimg}
                        onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackimg; }}
                        alt={activity.title}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-4 py-2 font-semibold">{activity.title}</td>
                    <td className="px-4 py-2 text-gray-700">{activity.city}, {activity.province}</td>
                    <td className="px-4 py-2">{activity.category?.name}</td>
                    <td className="px-4 py-2">{activity.price?.toLocaleString('id-ID') ?? '-'}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button size="sm" onClick={() => startEdit(activity)}>Edit</Button>
                      <Button
                        size="sm"
                        type="button"
                        color="danger"
                        onClick={() => handleDelete(activity.id)}
                        loading={deletingId === activity.id}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {visibleActivities.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500 py-8">
                      No activities found.
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
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl">
            <h2 className="font-bold text-lg mb-4">
              {selected ? 'Edit Activity' : 'Add Activity'}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Title</label>
                <input
                  name="title"
                  value={formState.title || ''}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">City</label>
                <input
                  name="city"
                  value={formState.city || ''}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Province</label>
                <input
                  name="province"
                  value={formState.province || ''}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formState.price || ''}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border"
                  required
                />
              </div>
              {/* Add more fields as needed (category, imageUrls, etc) */}
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

export default ActivityManagement;