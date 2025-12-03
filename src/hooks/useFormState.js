import { useState, useCallback } from 'react';

export const useFormState = (initialState = {}) => {
  const [formState, setFormState] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormState((prev) => ({ ...prev, [name]: newValue }));
    setIsDirty(true);

    // Clear error when user starts typing
    setFormErrors((prev) => {
      if (!prev[name]) return prev;
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const setFieldValue = useCallback((name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
    setFormErrors((prev) => {
      if (!prev[name]) return prev;
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const setFieldError = useCallback((name, error) => {
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const resetForm = useCallback((newState = initialState) => {
    setFormState(newState);
    setFormErrors({});
    setIsDirty(false);
  }, [initialState]);

  const validateFields = useCallback((validators) => {
    const errors = {};
    
    Object.entries(validators).forEach(([field, validator]) => {
      const error = validator(formState[field], formState);
      if (error) errors[field] = error;
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formState]);

  return {
    formState,
    formErrors,
    isDirty,
    handleChange,
    setFieldValue,
    setFieldError,
    setFormErrors,
    resetForm,
    validateFields,
    setFormState,
  };
};