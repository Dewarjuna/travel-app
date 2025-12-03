import { memo, useCallback, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '../../../components/modal';
import FormField from '../../../components/ui/FormField';
import ImageUpload from '../../../components/ui/ImageUpload';
import Button from '../../../components/ui/Button';
import { useFormState } from '../../../hooks/useFormState';

const EMPTY_FORM = {
  name: '',
  imageUrl: '',
};

const VALIDATORS = {
  name: (value) => (!value?.trim() ? 'Category name is required' : null),
  imageUrl: (value) => (!value?.trim() ? 'Image is required' : null),
};

const CategoryFormModal = memo(
  ({ isOpen, onClose, onSubmit, category, saving }) => {
    const isEditMode = Boolean(category);

    const {
      formState,
      formErrors,
      handleChange,
      setFieldValue,
      resetForm,
      validateFields,
      setFormState,
    } = useFormState(EMPTY_FORM);

    // Populate form when editing or reset when creating
    useEffect(() => {
      if (isOpen && category) {
        setFormState({
          name: category.name || '',
          imageUrl: category.imageUrl || '',
        });
      } else if (isOpen) {
        resetForm(EMPTY_FORM);
      }
    }, [isOpen, category, setFormState, resetForm]);

    // Handle image change (single image)
    const handleImageChange = useCallback(
      (urls) => {
        setFieldValue('imageUrl', urls[0] || '');
      },
      [setFieldValue]
    );

    // Handle form submit
    const handleSubmit = useCallback(
      async (e) => {
        e.preventDefault();

        const isValid = validateFields(VALIDATORS);
        if (!isValid) return;

        const payload = {
          name: formState.name.trim(),
          imageUrl: formState.imageUrl.trim(),
        };

        await onSubmit(payload, category?.id);
      },
      [formState, validateFields, onSubmit, category?.id]
    );

    return (
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <form onSubmit={handleSubmit}>
          <ModalHeader
            title={isEditMode ? 'Edit Category' : 'Add New Category'}
            subtitle={`Fill in the details to ${isEditMode ? 'update' : 'create'} a category`}
            onClose={onClose}
          />

          <ModalBody className="space-y-5">
            {/* Category Name */}
            <FormField
              label="Category Name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              error={formErrors.name}
              placeholder="e.g., Beach, Mountain, City Tour"
              required
              autoFocus
            />

            {/* Image Upload */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Category Image <span className="text-red-500">*</span>
              </label>
              <ImageUpload
                value={formState.imageUrl ? [formState.imageUrl] : []}
                onChange={handleImageChange}
                multiple={false}
                maxImages={1}
                helperText="Upload one image for this category"
              />
              {formErrors.imageUrl && (
                <p className="flex items-center gap-1 text-xs text-red-600">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {formErrors.imageUrl}
                </p>
              )}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {isEditMode ? 'Update Category' : 'Create Category'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
);

CategoryFormModal.displayName = 'CategoryFormModal';

export default CategoryFormModal;