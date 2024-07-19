import React from "react";
import styles from "../styles/Switch.module.css";
const darkenColor = (color, amount) => {
  let usePound = false;
  if (color[0] === "#") {
    color = color.slice(1);
    usePound = true;
  }

  const num = parseInt(color, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  r = r > 255 ? 255 : r < 0 ? 0 : r;
  g = g > 255 ? 255 : g < 0 ? 0 : g;
  b = b > 255 ? 255 : b < 0 ? 0 : b;

  const result = (usePound ? "#" : "") + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
  return result;
};

const Switch = ({ isOn, handleToggle, fillBackground, color = "#1768ea" }) => {
  const fillOnColor = darkenColor(color, -100); // Darken the color more significantly
  return (
    <div
      className={`${styles.switch} ${fillBackground ? styles.fill : styles.outline} ${!fillBackground ? (isOn ? styles.onBg : styles.offBg) : ''}`}
      onClick={handleToggle}
      style={{backgroundColor:fillBackground?(isOn? fillOnColor:''):''}}
    >
      <div className={`${styles.slider} ${fillBackground ? (isOn ? styles.on : styles.off) : (isOn ? styles.outlineOn : styles.outlineOff)}`} style={{backgroundColor:isOn? color: ''}} />
    </div>
  );
};

export default Switch;