// src/hooks/useCategoryManagement.js
import { useState, useCallback } from 'react';
import { categoryService } from '../api/services/categoryService';
import { notifySuccess, notifyError } from '../components/ui/notifications';
import Swal from 'sweetalert2';

export const useCategoryManagement = (refresh) => {
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleCreate = useCallback(
    async (payload) => {
      setSaving(true);
      try {
        await categoryService.create(payload);
        await refresh();
        notifySuccess('Category created successfully!');
        return true;
      } catch (err) {
        console.error('Failed to create category:', err);
        notifyError(err.response?.data?.message || 'Failed to create category');
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
        await categoryService.update(id, payload);
        await refresh();
        notifySuccess('Category updated successfully!');
        return true;
      } catch (err) {
        console.error('Failed to update category:', err);
        notifyError(err.response?.data?.message || 'Failed to update category');
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
        title: 'Delete Category?',
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
        await categoryService.remove(id);
        await refresh();
        notifySuccess('Category deleted successfully!');
        return true;
      } catch (err) {
        console.error('Failed to delete category:', err);

        const errorMessage =
          err.response?.data?.errors || err.response?.data?.message;

        if (
          typeof errorMessage === 'string' &&
          (errorMessage.includes('foreign key') ||
            errorMessage.includes('constraint') ||
            errorMessage.includes('activities'))
        ) {
          notifyError('Cannot delete: This category is used by activities.');
        } else {
          notifyError('Failed to delete category. Please try again.');
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