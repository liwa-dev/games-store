import React from 'react';
import styles from '../styles/Toggle.module.css';

const Toggle = ({ isOn, handleToggle, label, groupName }) => {
  return (
    <div className={styles.checkboxWrapper}>
      <input
        type="checkbox"
        id={`cbx-${groupName ? `${groupName}-${label}` : label}`}
        className={styles.inpCbx}
        checked={isOn}
        onChange={handleToggle}
        name={groupName}
      />
      <label htmlFor={`cbx-${groupName ? `${groupName}-${label}` : label}`} className={styles.cbx}>
        <span>
          <svg viewBox="0 0 12 10" height="10px" width="12px">
            <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
          </svg>
        </span>
        <span className={isOn ? styles.slideUp : styles.slideDown}>
          {!label ? isOn ? "ON" : "OFF" : label}
        </span>
      </label>
    </div>
  );
};

const ToggleGroup = ({ items, groupName, onChange, selectedItems }) => {
  const handleToggle = (label) => {
    const newSelectedItems = selectedItems.includes(label)
      ? selectedItems.filter(item => item !== label)
      : [...selectedItems, label];
    onChange(newSelectedItems);
  };

  return (
    <div className={styles.toggleGroup}>
      {items.map(item => (
        <Toggle
          key={item.label}
          isOn={selectedItems.includes(item.label)}
          handleToggle={() => handleToggle(item.label)}
          label={item.label}
          groupName={groupName}
        />
      ))}
    </div>
  );
};

export { Toggle, ToggleGroup };