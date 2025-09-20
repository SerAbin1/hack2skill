import React from 'react';

const InputField = ({ icon, name, placeholder, value, onChange, label }) => {
  const inputId = `${name}-input`;
  
  return (
    <div className="space-y-10">
      <div className="label-row">
        <span className="label-icon">{icon}</span>
        <label htmlFor={inputId} className="field-label">
          {label}
        </label>
      </div>
      <div className="rounded-md shadow-sm">
        <input
          type="text"
          name={name}
          id={inputId}
          className="input-field w-full"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default InputField;
