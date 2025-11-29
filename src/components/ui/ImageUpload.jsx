import { useCallback, useRef, useState } from 'react';
import { useUploadImage } from '../../hooks/useUploadImage';
import Button from './Button';

const ImageUpload = ({
  label = 'Images',
  value = [],
  onChange,
  multiple = true,
  maxImages = 5,
  helperText,
}) => {
  const fileInputRef = useRef(null);
  const { upload, uploading, error } = useUploadImage();
  const [localError, setLocalError] = useState(null);

  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(
    async (event) => {
      const files = Array.from(event.target.files || []);
      if (!files.length || !onChange) return;

      setLocalError(null);

      try {
        const remainingSlots = maxImages ? maxImages - value.length : files.length;
        const filesToUpload = maxImages ? files.slice(0, remainingSlots) : files;

        const uploadedUrls = [];

        // Upload sequentially to keep it simple and avoid rate spikes
        for (const file of filesToUpload) {
          const url = await upload(file);
          uploadedUrls.push(url);
        }

        onChange([...value, ...uploadedUrls]);
      } catch (err) {
        setLocalError(err?.message || 'Failed to upload image');
      } finally {
        // Allow selecting the same file again later
        event.target.value = '';
      }
    },
    [onChange, upload, value, maxImages]
  );

  const handleRemove = useCallback(
    (urlToRemove) => {
      if (!onChange) return;
      onChange(value.filter((url) => url !== urlToRemove));
    },
    [onChange, value]
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={handleButtonClick}
          loading={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload image'}
        </Button>
        {helperText && (
          <p className="text-xs text-gray-500">
            {helperText}
          </p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />

      {(error || localError) && (
        <p className="text-xs text-red-600">
          {localError || error?.message}
        </p>
      )}

      {value?.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((url) => (
            <div key={url} className="group relative">
              <img
                src={url}
                alt=""
                className="h-20 w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;