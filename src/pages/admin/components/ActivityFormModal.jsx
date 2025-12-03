import { memo, useCallback, useEffect, useMemo } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../../components/modal';
import FormField from '../../../components/ui/FormField';
import ImageUpload from '../../../components/ui/ImageUpload';
import Button from '../../../components/ui/Button';
import { useFormState } from '../../../hooks/useFormState';

const EMPTY_FORM = {
  categoryId: '',
  title: '',
  description: '',
  city: '',
  province: '',
  price: '',
  price_discount: '',
  imageUrls: [],
};

const VALIDATORS = {
  categoryId: (value) => (!value ? 'Category is required' : null),
  title: (value) => (!value?.trim() ? 'Title is required' : null),
  city: (value) => (!value?.trim() ? 'City is required' : null),
  province: (value) => (!value?.trim() ? 'Province is required' : null),
  price: (value) => {
    const num = Number(value);
    if (isNaN(num) || num <= 0) return 'Price must be greater than 0';
    return null;
  },
  imageUrls: (value) =>
    !value?.length ? 'At least one image is required' : null,
};

const ActivityFormModal = memo(({
  isOpen,
  onClose,
  onSubmit,
  activity,
  categories,
  categoriesLoading,
  categoriesError,
  saving,
}) => {
  const isEditMode = Boolean(activity);

  const {
    formState,
    formErrors,
    handleChange,
    setFieldValue,
    resetForm,
    validateFields,
    setFormState,
  } = useFormState(EMPTY_FORM);

  // Populate form when editing
  useEffect(() => {
    if (isOpen && activity) {
      setFormState({
        categoryId: activity.categoryId || activity.category?.id || '',
        title: activity.title || '',
        description: activity.description || '',
        city: activity.city || '',
        province: activity.province || '',
        price: activity.price?.toString() ?? '',
        price_discount: activity.price_discount?.toString() ?? '',
        imageUrls: activity.imageUrls || [],
      });
    } else if (isOpen) {
      resetForm(EMPTY_FORM);
    }
  }, [isOpen, activity, setFormState, resetForm]);

  // Category options for select
  const categoryOptions = useMemo(() => {
    const defaultOption = {
      value: '',
      label: categoriesLoading ? 'Loading categories...' : 'Select a category',
      disabled: true,
    };

    if (!Array.isArray(categories)) return [defaultOption];

    return [
      defaultOption,
      ...categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
    ];
  }, [categories, categoriesLoading]);

  // Handle image change
  const handleImageChange = useCallback(
    (urls) => {
      setFieldValue('imageUrls', urls);
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
        ...formState,
        price: formState.price ? Number(formState.price) : undefined,
        price_discount: formState.price_discount
          ? Number(formState.price_discount)
          : undefined,
      };

      await onSubmit(payload, activity?.id);
    },
    [formState, validateFields, onSubmit, activity?.id]
  );

  // Handle close with confirmation if form is dirty
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <form onSubmit={handleSubmit}>
        <ModalHeader
          title={isEditMode ? 'Edit Activity' : 'Add New Activity'}
          subtitle={`Fill in the details to ${isEditMode ? 'update' : 'create'} an activity`}
          onClose={handleClose}
        />

        <ModalBody className="space-y-5">
          {/* Category Field */}
          {categoriesError ? (
            <FormField
              label="Category"
              name="categoryId"
              value={formState.categoryId}
              onChange={handleChange}
              placeholder="Paste category ID manually"
              error={formErrors.categoryId}
              helperText="Failed to load categories. Please enter ID manually."
              required
            />
          ) : (
            <FormField
              label="Category"
              name="categoryId"
              type="select"
              value={formState.categoryId}
              onChange={handleChange}
              options={categoryOptions}
              error={formErrors.categoryId}
              disabled={categoriesLoading}
              required
            />
          )}

          {/* Image Upload */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Images <span className="text-red-500">*</span>
            </label>
            <ImageUpload
              value={formState.imageUrls}
              onChange={handleImageChange}
              helperText="Upload one or more images"
            />
            {formErrors.imageUrls && (
              <p className="flex items-center gap-1 text-xs text-red-600">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {formErrors.imageUrls}
              </p>
            )}
          </div>

          {/* Title & Price Row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Title"
              name="title"
              value={formState.title}
              onChange={handleChange}
              error={formErrors.title}
              placeholder="Enter activity title"
              required
            />
            <FormField
              label="Price"
              name="price"
              type="number"
              value={formState.price}
              onChange={handleChange}
              error={formErrors.price}
              placeholder="0"
              min={0}
              required
            />
          </div>

          {/* Location Row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="City"
              name="city"
              value={formState.city}
              onChange={handleChange}
              error={formErrors.city}
              placeholder="Enter city"
              required
            />
            <FormField
              label="Province"
              name="province"
              value={formState.province}
              onChange={handleChange}
              error={formErrors.province}
              placeholder="Enter province"
              required
            />
          </div>

          {/* Optional Fields */}
          <FormField
            label="Discount Price"
            name="price_discount"
            type="number"
            value={formState.price_discount}
            onChange={handleChange}
            placeholder="Optional discount price"
            min={0}
          />

          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formState.description}
            onChange={handleChange}
            placeholder="Describe the activity..."
            rows={4}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {isEditMode ? 'Update Activity' : 'Create Activity'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
});

ActivityFormModal.displayName = 'ActivityFormModal';

export default ActivityFormModal;