import { useState, useCallback } from "react";

/**
 * Custom Hook: useForm
 * Syllabus Concept: Custom Hooks, Controlled Forms, useCallback, Input Validation
 * Handles form state, change events, validation rules, and error tracking.
 */
export function useForm(initialValues = {}, validateFn = null) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (validateFn) {
      const fieldErrors = validateFn({
        ...values,
        [name]: type === "checkbox" ? checked : value
      });
      setErrors(fieldErrors || {});
    }
  }, [values, validateFn]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setValues,
    resetForm
  };
}
