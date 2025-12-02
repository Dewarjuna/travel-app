// src/components/ui/FormField.jsx
import { memo } from 'react';

const FormField = memo(({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  disabled = false,
  className = '',
  helperText,
  rows,
  options, // for select
  children, // for custom content
  ...props
}) => {
  const baseInputClasses = `
    w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-200
    focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500
    disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500
    ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}
  `;

  const renderInput = () => {
    if (children) return children;

    if (type === 'textarea') {
      return (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows || 4}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseInputClasses} resize-y`}
          {...props}
        />
      );
    }

    if (type === 'select') {
      return (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${baseInputClasses} cursor-pointer`}
          {...props}
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={baseInputClasses}
        {...props}
      />
    );
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      {renderInput()}
      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-600" role="alert">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;