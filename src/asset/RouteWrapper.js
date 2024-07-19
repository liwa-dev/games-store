import React, { Fragment } from "react";
import { useLocation, Link } from "react-router-dom";
import styles from "../styles/RouteWrapper.module.css";

const RouteWrapper = ({ children }) => {
  const location = useLocation();

  const getPathParts = () => {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts.map((part, index) => ({
      name: part.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      path: "/" + parts.slice(0, index + 1).join("/"),
    }));
  };

  const pathParts = getPathParts();

  return (
    <div className={styles.routeWrapper}>
      {pathParts.length > 1 && (
        <nav className={styles.breadcrumbs}>
          {pathParts.map((part, index) => (
            <Fragment key={part.path}>
              {index > 0 && <span className={styles.separator}>/</span>}
              {index === pathParts.length - 1 ? (
                <span className={styles.currentPage}>{part.name}</span>
              ) : (
                <span className={styles.breadcrumbLink}>{part.name}</span>
              )}
            </Fragment>
          ))}
        </nav>
      )}
      {children}
    </div>
  );
};

export default RouteWrapper;
