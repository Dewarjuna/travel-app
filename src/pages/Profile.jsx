import { useEffect, useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { userService } from '../api/services/userService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';

const Profile = () => {
  const { logout } = useAuth();
  const { addToast } = useToast();
  const [profileData, setProfileData] = useState({
    email: '',
    name: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await userService.profile();
      const data = res.data;
      
      setProfileData({
        email: data.email || '',
        name: data.name || '',
        phone: data.phoneNumber || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      addToast('Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!profileData.name || profileData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (profileData.phone && !/^\d+$/.test(profileData.phone)) {
      newErrors.phone = 'Phone must contain only numbers';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      await userService.updateProfile({
        name: profileData.name,
        phone: profileData.phone,
      });
      addToast('Profile updated successfully!', 'success');
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 py-10">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-linear-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
                  <div className="h-12 bg-linear-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 py-10">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg">
              <UserCircleIcon className="w-14 h-14 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 text-lg mt-1">Manage your account information</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                value={profileData.email}
                disabled
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <span>🔒</span> Email cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                value={profileData.name}
                onChange={(e) => {
                  setProfileData(prev => ({ ...prev, name: e.target.value }));
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-medium">
                  <span>⚠️</span> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="08xxxxxxxxxx"
                value={profileData.phone}
                onChange={(e) => {
                  setProfileData(prev => ({ ...prev, phone: e.target.value }));
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                }}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-medium">
                  <span>⚠️</span> {errors.phone}
                </p>
              )}
            </div>

            <Button type="submit" disabled={saving} loading={saving} fullWidth>
              Save Changes
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={logout}
              className="w-full px-6 py-4 border-2 border-red-500 rounded-xl text-red-600 font-bold hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;