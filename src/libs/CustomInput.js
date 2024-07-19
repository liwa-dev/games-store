import React, { useState } from 'react';
import styles from '../styles/Test.module.css'; // Ensure the path to the CSS module is correct

function CustomInput({ style, alignment = 'left', placeholder, wid, onChange, ...props }) {
  // Determine the alignment class based on the alignment prop
  const alignmentClass = styles[alignment] || styles.left;

  const [inputValue, setInputValue] = useState(""); // State for the input value
  const [multilineValue, setMultilineValue] = useState(""); // State for the multiline input value

  const handleChange = (event) => {
    setInputValue(event.target.value);
    if (onChange) onChange(event);
  };

  const handleMultilineChange = (event) => {
    setMultilineValue(event.target.value);
    if (onChange) onChange(event);
  };

  switch (style) {
    case 'standard':
      return (
        <input
          type="text"
          placeholder={placeholder}
          className={`${styles.input} ${alignmentClass}`}
          style={{ width: wid }}
          value={inputValue}
          onChange={handleChange}
          {...props}
        />
      );
    case 'fading':
      return (
        <input
          type="text"
          placeholder={placeholder}
          className={`${styles.input} ${styles.fading} ${alignmentClass}`}
          style={{ width: wid }}
          value={inputValue}
          onChange={handleChange}
          {...props}
        />
      );
    case 'multiline':
      return (
        <textarea
          placeholder={placeholder}
          className={`${styles.textarea} ${alignmentClass}`}
          style={{ width: wid }}
          value={multilineValue}
          onChange={handleMultilineChange}
          {...props}
        />
      );
    default:
      return null;
  }
}

export default CustomInput;
