import { useState } from "react";
import styles from '../styles/Selector.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';


/**
 * Callback function for handling changes in selection.
 * @param {Object} selectedItem - The item that has been selected.
 * @callback onSelectionChange
 */


export default function LoopableSelector({ items, showIndicator, isLoopable, onSelectionChange, dark=false }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
  
    const handleNext = () => {
      const newIndex = isLoopable ? (selectedIndex + 1) % items.length : Math.min(selectedIndex + 1, items.length - 1);
      setSelectedIndex(newIndex);
      onSelectionChange(items[newIndex]);
    };
  
    const handlePrevious = () => {
      const newIndex = isLoopable ? (selectedIndex - 1 + items.length) % items.length : Math.max(selectedIndex - 1, 0);
      setSelectedIndex(newIndex);
      onSelectionChange(items[newIndex]);
    };
  
    return (
      <div className={`${styles.loopableContainer} `} style={{ backgroundColor: dark? '#1a1a1a' : '#dcdcdc' }}>
        <button onClick={handlePrevious} className={`${styles.navButton} ${dark ? styles.navButtonDark : styles.navButtonLight}`} style={{ borderColor: dark? '#dcdcdc' : '#333' }}>
          <span className={styles.navButtonText} >
            <ChevronLeft />
          </span>
        </button>
        <div className={styles.selectedItemContainer}>
          <div className={styles.selectedItem} style={{ color: dark? '#dcdcdc' : '#333' }}>
            {items[selectedIndex].label}
          </div>
          {showIndicator && (
            <div className={styles.indicator}>
              {items.map((item, index) => (
                <span key={index} className={index === selectedIndex ? styles.activeDot : styles.dot} style={{ backgroundColor: index === selectedIndex ? (dark ? '#dcdcdc' : '#333') : '' }}></span>
              ))}
            </div>
          )}
        </div>
          <button onClick={handleNext} className={`${styles.navButton} ${dark ? styles.navButtonDark : styles.navButtonLight}`} style={{ borderColor: dark? '#dcdcdc' : '#333' }}>
          <span className={styles.navButtonText}>
            <ChevronRight/>
          </span>
        </button>
      </div>
    );
  }
  