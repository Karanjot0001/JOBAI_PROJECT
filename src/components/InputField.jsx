import React from "react";

/**
 * Reusable Controlled Input Field Component
 * Syllabus Concept: Controlled Components, Props Validation, Accessible Labels, Error States
 */
export default function InputField({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder = "",
  required = false,
  error = "",
  as = "input",
  options = [],
  rows = 4,
  disabled = false,
  helperText = ""
}) {
  const inputId = id || name;

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId}>
          {label} {required && <span style={{ color: "var(--danger)" }}>*</span>}
        </label>
      )}

      {as === "select" ? (
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
        >
          {options.map((opt) => {
            const val = typeof opt === "string" ? opt : opt.value;
            const text = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={val} value={val}>
                {text}
              </option>
            );
          })}
        </select>
      ) : as === "textarea" ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          rows={rows}
          disabled={disabled}
          aria-invalid={Boolean(error)}
        />
      ) : (
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
        />
      )}

      {error && <span className="error-text">{error}</span>}
      {helperText && !error && <small style={{ color: "var(--text-muted)", fontSize: "11.5px" }}>{helperText}</small>}
    </div>
  );
}
