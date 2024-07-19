import React from "react";
import styles from "./Cards.module.css";
import netflix from "../imgs/netflix.png";
import windows from "../imgs/windows.png";
import google from "../imgs/google.png";
import card1 from "../imgs/card1.png";
function Card1() {
  return (
    <div className={styles.card3D}>
      <img className={styles.card1} src={card1} alt="card" />
    </div>
  );
}

function Card2() {
  return (
    <div className={styles.container3D}>
      <div className={styles.glass3D}>
        <img src={windows} alt="windows" />
      </div>
      <div className={styles.glass3D}>
        <img src={google} alt="google" />
      </div>
      <div className={styles.glass3D}>
        <img src={netflix} alt="netflix" />
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div className={styles.content}></div>
      </div>
    </div>
  );
}

export { Card1, Card2, Card3 };
