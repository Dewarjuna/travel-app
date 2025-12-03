import { useState, useCallback } from 'react';
import { activityService } from '../api/services/activityService';
import { notifySuccess, notifyError } from '../components/ui/notifications';
import Swal from 'sweetalert2';

export const useActivityManagement = (refresh) => {
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleCreate = useCallback(
    async (payload) => {
      setSaving(true);
      try {
        await activityService.create(payload);
        await refresh();
        notifySuccess('Activity created successfully!');
        return true;
      } catch (err) {
        console.error('Failed to create activity:', err);
        notifyError(
          err.response?.data?.message || 'Failed to create activity'
        );
        return false;
      } finally {
        setSaving(false);
      }
    },
    [refresh]
  );

  const handleUpdate = useCallback(
    async (id, payload) => {
      setSaving(true);
      try {
        await activityService.update(id, payload);
        await refresh();
        notifySuccess('Activity updated successfully!');
        return true;
      } catch (err) {
        console.error('Failed to update activity:', err);
        notifyError(
          err.response?.data?.message || 'Failed to update activity'
        );
        return false;
      } finally {
        setSaving(false);
      }
    },
    [refresh]
  );

  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: 'Delete Activity?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        reverseButtons: true,
      });

      if (!result.isConfirmed) return false;

      setDeletingId(id);
      try {
        await activityService.remove(id);
        await refresh();
        notifySuccess('Activity deleted successfully!');
        return true;
      } catch (err) {
        console.error('Failed to delete activity:', err);

        const errorMessage = err.response?.data?.errors || err.response?.data?.message;

        if (
          typeof errorMessage === 'string' &&
          errorMessage.includes('carts_activityId_fkey')
        ) {
          notifyError(
            'Cannot delete: This activity is in one or more user carts.'
          );
        } else {
          notifyError('Failed to delete activity. Please try again.');
        }
        return false;
      } finally {
        setDeletingId(null);
      }
    },
    [refresh]
  );

  const handleSubmit = useCallback(
    async (payload, id) => {
      if (id) {
        return handleUpdate(id, payload);
      }
      return handleCreate(payload);
    },
    [handleCreate, handleUpdate]
  );

  return {
    saving,
    deletingId,
    handleSubmit,
    handleDelete,
  };
};