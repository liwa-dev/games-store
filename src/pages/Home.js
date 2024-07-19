import React, { useRef, useEffect } from "react";
import styles from "../styles/Home.module.css";
import playstation from "../imgs/ps.png";
import xbox from "../imgs/xbox.png";
import nintendo from "../imgs/nintendo.png";
import { Card1, Card2, Card3 } from "../asset/Cards";
import { useLanguage } from "../provider/LanguageProvider"; // Import the useLanguage hook
import { useNavigate } from "react-router-dom";
import Reviews from "../libs/Reviews";

const iconData = [
  { name: "PLAYSTATION", image: playstation },
  { name: "XBOX", image: xbox },
  { name: "NINTENDO", image: nintendo },
];

export default function Home({ setActiveCategory }) {
  const { translations } = useLanguage(); // Access translations
  const iconRefs = useRef([]);
  const lastHighlightPosition = useRef({ left: "0%", top: "0%" });
  const navigate = useNavigate();
  const sectionRefs = useRef([]);

  useEffect(() => {
    iconRefs.current.forEach((iconContainer) => {
      if (
        iconContainer &&
        iconContainer.classList.contains(styles.homeIconContainer)
      ) {
        const icon = iconContainer.querySelector(`.${styles.homeIcon}`);
        const highlight = iconContainer.querySelector(`.${styles.highlight}`);
  
        if (icon && highlight) {
          const handleMouseMove = (e) => {
            icon.style.transition = "none";
            highlight.style.transition = "none";
  
            const { width, height, left, top } = icon.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;
            const halfWidth = width / 2;
            const halfHeight = height / 2;
  
            const rotationY = ((x - halfWidth) / halfWidth) * 10;
            const rotationX = ((y - halfHeight) / halfHeight) * -10;
  
            icon.style.transform = `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`;
  
            const highlightLeft = `${(x / width) * 100 - 100}%`;
            const highlightTop = `${(y / height) * 100 - 100}%`;
  
            highlight.style.left = highlightLeft;
            highlight.style.top = highlightTop;
  
            lastHighlightPosition.current.left = highlightLeft;
            lastHighlightPosition.current.top = highlightTop;
          };
  
          const handleMouseEnter = () => {
            highlight.style.opacity = "1";
          };
  
          const handleMouseLeave = () => {
            icon.style.transition = "transform 0.5s ease-in-out";
            icon.style.transform = "rotateY(0) rotateX(0)";
            highlight.style.transition = "opacity 0.5s ease-in-out";
            highlight.style.opacity = "0";
          };
  
          iconContainer.addEventListener("mousemove", handleMouseMove);
          iconContainer.addEventListener("mouseenter", handleMouseEnter);
          iconContainer.addEventListener("mouseleave", handleMouseLeave);
  
          return () => {
            iconContainer.removeEventListener("mousemove", handleMouseMove);
            iconContainer.removeEventListener("mouseenter", handleMouseEnter);
            iconContainer.removeEventListener("mouseleave", handleMouseLeave);
          };
        }
      }
    });
  
    // New Intersection Observer setup for parallax effect
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    };
  
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.fadeIn);
        } else {
          entry.target.classList.remove(styles.fadeIn);
        }
      });
    };
  
    const observer = new IntersectionObserver(observerCallback, observerOptions);
  
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
  
    // Cleanup function
    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const handleClick = (iconName) => {
    setActiveCategory('');
    if (iconName === "PLAYSTATION") {
      navigate("/categorie/SEARCH:PLAYSTATION");
    }
    if (iconName === "XBOX") {
      navigate("/categorie/SEARCH:xbox");
    }
    if (iconName === "NINTENDO") {
      navigate("/categorie/SEARCH:nintendo");
    }
  };

  return (
    <>
            <div className={styles.news}>
            <span className={styles.bannerText}>{translations?.home?.news}</span>
            </div>
      <div className={styles.homeContainer}>
        <div className={styles.homeContent}>
        <div className={styles.homeText} ref={(el) => (sectionRefs.current[0] = el)}>
            <h1 className={styles.homeHeading}>
              {translations?.home?.HeaderMessage || "Loading"}
              <span className={styles.homeHighlight}>{translations?.home?.headerHighlight}</span>
            </h1>
            <p className={styles.homeParagraph}>
              {translations?.home?.homeParagraphe || "Loading"}
            </p>
          </div>
          <div className={styles.homeIcons} ref={(el) => (sectionRefs.current[1] = el)}>
            {iconData.map((icon, index) => (
              <div
                key={index}
                className={styles.homeIconContainer}
                ref={(el) => (iconRefs.current[index] = el)}
                onClick={() => handleClick(icon.name)}
              >
                <div className={styles.homeIcon}>
                  <img
                    src={icon.image}
                    alt={icon.name}
                    className={styles.iconImage}
                  />
                  <h3>{icon.name}</h3>
                </div>
                <div className={styles.highlight}></div>
              </div>
            ))}
          </div>
          <section className={`${styles.Section} ${styles.modernSection}`} ref={(el) => (sectionRefs.current[2] = el)}>
            <div className={styles.sectionContent}>
              <h2 className={styles.sectionTitle}>{translations?.home?.sectionTitle || "Loading"}</h2>
              <p className={styles.sectionText}>
                {translations?.home?.sectionText || "Loading"}
              </p>
            </div>
            <div className={styles.cardWrapper}>
              <Card1/>
            </div>
          </section>

          <section className={`${styles.Section} ${styles.alternateSection}`} ref={(el) => (sectionRefs.current[3] = el)}>
            <div className={styles.cardWrapper}>
              <Card3 />
            </div>
          </section>

          <section className={`${styles.Section} ${styles.modernSection}`} ref={(el) => (sectionRefs.current[4] = el)}>
            <div className={styles.cardWrapper}>
              <Card2 />
            </div>
            <div className={styles.sectionContent}>
              <h2 className={styles.sectionTitle}>{translations?.home?.section2Title || "Loading"}</h2>
              <p className={styles.sectionText}>
                {translations?.home?.sectionText2 || "Loading"}
              </p>
            </div>
          </section>
        </div>
      </div>
      <div className={styles.reviews} ref={(el) => (sectionRefs.current[5] = el)}>
        <div className={styles.reviewsTitle}><h2>{translations?.home?.reviews || "Loading"}</h2></div>
        <Reviews />
      </div>
      <footer className={styles.footer} ref={(el) => (sectionRefs.current[6] = el)}>
  <h4>{translations?.home?.footer || "Loading"}</h4>
</footer>
    </>
  );
}
