import React, { useState, useEffect, useRef } from "react";
import "../styles/index.css";
import { Search, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useHeader } from "../provider/HeaderProvider";
import Button from "../libs/Button";
import { logoutUser } from "../supabase/authUtils";
import SelectLanguage from "../asset/SelectLanguage";
import { useLanguage } from "../provider/LanguageProvider";
import logo from "../logo.png";

function Header({ isLoggedIn, userType, setCurrentUser, currentUser, setCurrentPage, activeCategory, setActiveCategory }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { headerConfig } = useHeader();
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/categorie/SEARCH:${encodeURIComponent(searchTerm.trim())}`);
      setActiveCategory("");
    }
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const currentCategory = headerConfig.categories.find(
      (category) => category.path === currentPath
    );
    if (currentCategory) {
      setActiveCategory(currentCategory.path);
    }
  }, [location, headerConfig.categories, setActiveCategory]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    document.body.classList.toggle('mobile-menu-open');
  };

  useEffect(() => {
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, []);

  const renderCategories = (categories) => {
    return categories.map((category, index) => (
      <div key={index} className="nav-item">
        <Link
          to={category.path}
          className={`${category.path === activeCategory ? "active" : ""}`}
          style={{
            opacity: category.path === activeCategory ? 1 : 0.7,
            transition: "opacity 0.3s ease",
          }}
          onClick={() => {
            setActiveCategory(category.path);
            setCurrentPage(1);
            if (mobileMenuOpen) {
              toggleMobileMenu();
            }
          }}
        >
          {category.name}
        </Link>
      </div>
    ));
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser({ isLoggedIn: false, userType: null });
    navigate("/home");
  };

  const getTranslation = (path, defaultValue) => {
    return (
      path
        .split(".")
        .reduce(
          (obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined),
          translations
        ) || defaultValue
    );
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header glass-effect">
      <div className="header-top">
        <div className="header-left">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="search-container">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchInputChange}
              placeholder={getTranslation(
                "header.search",
                "What are you looking for?"
              )}
              className="search-input"
            />
          </form>
        </div>
        <div className="header-right">
          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            <Menu size={24} />
          </button>
          <SelectLanguage />
          {isLoggedIn ? (
            <div className="user-avatar">
              <img
                src="https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=Liwa"
                alt="User Avatar"
                onClick={toggleDropdown}
              />
              {dropdownOpen && (
                <div className="dropdown-menu">
                  {/* <Link to="/my-account" onClick={() => setDropdownOpen(false)}>
                    {translations.header.dropMenu.myAccount}
                  </Link> */}
                  <Link to="/settings" onClick={() => setDropdownOpen(false)}>
                    {translations.header.dropMenu.privacysetting}
                  </Link>
                  <button className="dropdown-menu-button" onClick={handleLogout}>
                    {translations.header.dropMenu.logout}
                  </button>
                  {currentUser.user.role === "admin" && (
                    <Link to="/admin-panel" onClick={() => setDropdownOpen(false)}>
                      {translations.header.dropMenu.controlPanel}
                    </Link>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-button">
              <Button color="blue">
                {translations?.header?.logiNRegister}
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className="header-bottom">
        <nav className="nav-links">
          {renderCategories(headerConfig.categories)}
        </nav>
      </div>
      <nav
        className={`mobile-menu ${mobileMenuOpen ? "open" : "close"}`}
      >
        <button className="mobile-menu-close" onClick={toggleMobileMenu}>
          <X size={24} />
        </button>
        <div className="mobile-menu-content">
          <SelectLanguage />
          {isLoggedIn ? (
            <div className="user-avatar">
              <img
                src="https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=Liwa"
                alt="User Avatar"
              />
            </div>
          ) : (
            <Link to="/login" className="login-button" onClick={toggleMobileMenu}>
              <Button color="blue">
                {translations?.header?.logiNRegister}
              </Button>
            </Link>
          )}
          {renderCategories(headerConfig.categories)}
          {isLoggedIn && (
            <div className="mobile-user-menu">
              {/* <Link to="/my-account" onClick={toggleMobileMenu}>
                {translations.header.dropMenu.myAccount}
              </Link> */}
              <Link to="/settings" onClick={toggleMobileMenu}>
                {translations.header.dropMenu.privacysetting}
              </Link>
              <button onClick={() => { handleLogout(); toggleMobileMenu(); }}>
                {translations.header.dropMenu.logout}
              </button>
              {currentUser.user.role === "admin" && (
                <Link to="/admin-panel" onClick={toggleMobileMenu}>
                  {translations.header.dropMenu.controlPanel}
                </Link>
              )}
            </div>
          )}
        </div>
        <div className="search-container mobile">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchInputChange}
              placeholder={getTranslation(
                "header.search",
                "What are you looking for?"
              )}
              className="search-input"
            />
          </form>
        </div>
      </nav>

    </header>
  );
}

export default Header;