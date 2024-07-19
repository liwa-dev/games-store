import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/DropMenu.module.css';
import { Toggle } from './Toggle';

function DropMenu({ items, selectable = false }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const handleItemClick = (index, event) => {
    if (selectable) {
      event.preventDefault();
      event.stopPropagation();
      const newSet = new Set(selectedItems);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      setSelectedItems(newSet);
    } else {
      setDropdownOpen(false);
    }
  };

  const getButtonText = () => {
    if (selectedItems.size === 0) return "MULTI SELECT";
    if (selectedItems.size === 1) return items[Array.from(selectedItems)[0]].text;
    return `${selectedItems.size} selected`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.dropdownContainer} ref={dropdownRef}>
        <div className={styles.customButton} onClick={toggleDropdown}>
          {getButtonText()}
          <span className={styles.icon}>▼</span>
        </div>
        <div className={`${styles.dropdownContent} ${dropdownOpen ? styles.open : ''}`}>
          <ul>
            {items.map((item, index) => (
              <li key={index} onClick={(e) => handleItemClick(index, e)}>
                <a href={item.url}>
                  {selectable ? (
                    <Toggle
                      isOn={selectedItems.has(index)}
                      handleToggle={(e) => handleItemClick(index, e)}
                      label={item.text}
                    />
                  ) :item.text}

                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DropMenu;