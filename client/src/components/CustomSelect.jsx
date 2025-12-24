import React from "react";
import { CFormSelect, CFormLabel } from "@coreui/react";

export const CustomSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  required = false,
}) => {
  return (
    <div className="mb-3">
      {label && <CFormLabel htmlFor={name}>{label}</CFormLabel>}
      <CFormSelect
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      >
        <option value="" disabled>
          {placeholder || "Seleccione una opción"}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </CFormSelect>
    </div>
  );
};
