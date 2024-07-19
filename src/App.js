import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./pages/Header";
// import Product from "./pages/Product";
// import Profile from "./pages/Profile";
import { ModalProvider } from "./provider/ModalProvider";
import NotificationProvider from "./provider/NotificationProvider";
import { ThemeProvider } from "./provider/ThemeProvider";
// import Settings from "./pages/Settings";
// import Account from "./pages/Account";
import CustomLoader from "./asset/CustomLoader";
import RouteWrapper from "./asset/RouteWrapper";
import AdminPanel from "./pages/AdminPanel";
import Category from "./pages/Category";
import { HeaderProvider } from "./provider/HeaderProvider";
import PurchaseWindow from "./pages/PurchaseWindow";
import Home from "./pages/Home";
import { withAuthCheck } from "./supabase/withAuthCheck";
import { decodeJWT, getAuthToken, isTokenValid, removeAuthToken } from "./supabase/authUtils";
import { checkUserSession, getUserByEmail, getUserById } from "./supabase/getData";
import { LanguageProvider } from "./provider/LanguageProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { G2A } from "./asset/G2A";


const USER_TYPES = {
  GUEST: "guest",
  NORMAL: "user",
  ADMIN: "admin",
};

const Product = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("./pages/Category")), 1500);
  });
});

const Settings = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("./pages/Settings")), 2500);
  });
});


const Login = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("./pages/Login")), 2500);
  });
});

const Account = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("./pages/Account")), 2500);
  });
});

const Profile = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("./pages/Profile")), 2500);
  });
});


const AuthenticatedProfile = withAuthCheck(Profile);
const AuthenticatedAccount = withAuthCheck(Account);
const AuthenticatedSettings = withAuthCheck(Settings);
const AuthenticatedAdminPanel = withAuthCheck(AdminPanel);



function App() {
  const [currentResource, setCurrentResource] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({});
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState("");
  const [currentUser, setCurrentUser] = useState({
    isLoggedIn: null,
    user: null,
  });

  const [isPerspectiveOn, setIsPerspectiveOn] = useState(false);

  const toggleBodyPerspective = () => {
    const container = document.querySelector('.card-inner');
    const frontContent = document.querySelector('.frontContent');
  
    setIsPerspectiveOn(prev => {
      frontContent.classList.add('hide');
      container.classList.toggle('bodyPerspective', !prev);
      if (!prev) {
        // Transitioning to backContent
        frontContent.style.opacity = '0'; // Start fading out the frontContent
      } else {
        // Transitioning back to frontContent
        frontContent.style.display = ''; // Remove display none before starting opacity transition
        frontContent.style.opacity = '1'; // Fade in the frontContent
      }
      return !prev;
    });
  
    container.addEventListener('transitionend', () => {
      setTimeout(() => {
        if (container.classList.contains('bodyPerspective')) {
          // Transition to backContent completed
          frontContent.classList.add('hide'); // Ensure frontContent is hidden after it fades out
          setTimeout(() => {
            frontContent.style.display = 'none'; // Apply display none after the hide class is added
            document.body.style.overflow = '';
          }, 300); // Short delay to ensure the class change has taken effect
        } else {
          // Transitioning back to frontContent
          document.body.style.overflow = '';
          frontContent.classList.remove('hide'); // Remove hide to make frontContent interactable
          frontContent.style.display = ''; // Ensure display is not none
        }   
      }, 300);

    }, { once: true });
  };

  useEffect(() => {
    setCurrentUser({
      isLoggedIn: false,
      userType: USER_TYPES.GUEST,
    });
  }, []);


  useEffect(() => {
    const checkAuthStatus = async () => {
      const tokenData = getAuthToken();
      if (tokenData && tokenData.provider === 'google') {
        try {
          const decodedToken = decodeJWT(tokenData.token);
          const user = await getUserByEmail(decodedToken.email);
          if (user) {
            setCurrentUser({
              isLoggedIn: true,
              user: user,
            });
          } else {
            }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else if (tokenData && tokenData.provider === 'facebook') {
        try {  
          const user = await getUserById(tokenData.userId);  
          if (user) {
            setCurrentUser({
              isLoggedIn: true,
              user: user,
            });
          } else {
            }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
  
    checkAuthStatus();
  }, []);
  
  

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const user = await checkUserSession();
        setCurrentUser({
          isLoggedIn: !!user,
          user: user,
        });
      } catch (error) {
        console.error('Authentication error:', error);
        setCurrentUser({
          isLoggedIn: false,
          user: null,
        });
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const path = location.pathname;
    let resource = "Unknown";
    switch (path) {
      case "/home":
        resource = "Home";
        break;
      case "/login":
        resource = "Login";
        break;
      case "/categorie/:categoryName":
        resource = "Category";
        break;
      case "/user":
        resource = "User";
        break;
      case "/admin-panel":
        resource = "Admin";
        break;
      case "/my-account":
        resource = "My Account";
        break;
      case "/settings":
        resource = "Settings";
        break;
      default:
        resource = "NoPage";
    }
    setCurrentResource(resource);
  }, [location]);


  useEffect(() => {
    }, [currentUser.isLoggedIn]);



  return (
  <GoogleOAuthProvider clientId="351635756854-93tsjad2n6mecb6h1abs56fa0gghiuc0.apps.googleusercontent.com">
    <LanguageProvider>
    <ThemeProvider>
      <HeaderProvider>
      <NotificationProvider>
        <ModalProvider>
          <div className="card">
            <div className="card-inner">
            <div className="frontContent">
              <Header
                isLoggedIn={currentUser.isLoggedIn}
                userType={currentUser.user}
                setCurrentUser={setCurrentUser}
                currentUser={currentUser}
                setCurrentPage={setCurrentPage} // Pass setCurrentPage here
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
              <Suspense
                fallback={<CustomLoader resourceName={currentResource} />}
              >
                <RouteWrapper>
                <Routes location={location} key={location.path}>
                <Route path="" element={<Navigate to="/home" />} />
                  <Route
                    path="/home"
                    element={
                      <PublicElement>
                      <Home  setActiveCategory={setActiveCategory}/>
                    </PublicElement>
                    }
                  />
                  <Route
                        path="/categorie/:categoryName"
                        element={
                      <Category onTogglePerspective={toggleBodyPerspective} setData={setData} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
                    }
                    
                  />
                  {/* <Route
                    path="/my-account"
                    element={currentUser.isLoggedIn ? <AuthenticatedAccount /> : <Navigate to="/" />}
                  /> */}
                  <Route
                    path="/user"
                    element={
                        <User currentUser={currentUser} />
                    }
                  />
                  <Route
                    path="/admin-panel"
                    element={
                      <AuthenticatedAdminPanel currentUser={currentUser} />
                    }
                  />
                  <Route
                    path="/my-account/profile"
                    element={currentUser.isLoggedIn ? <AuthenticatedProfile /> : <Navigate to="/login" />}
                  />

                  <Route
                    path="/login"
                    element={!currentUser.isLoggedIn ? <Login setCurrentUser={setCurrentUser} /> : <Navigate to="/" />}
                  />


                  <Route
                    path="/settings"
                    element={currentUser.isLoggedIn ? <AuthenticatedSettings currentUser={currentUser} /> : <Navigate to="/login" />}
                  />
                </Routes>
                </RouteWrapper>
              </Suspense>
            </div>
            <div className="backContent">
              <PurchaseWindow onTogglePerspective={toggleBodyPerspective} data={data}></PurchaseWindow>
            </div>
          </div>
          </div>
        </ModalProvider>
      </NotificationProvider>
      </HeaderProvider>
    </ThemeProvider>
    </LanguageProvider>
    </GoogleOAuthProvider>
  );
}

function User({ currentUser }) {
  if (
    currentUser.userType === USER_TYPES.ADMIN ||
    currentUser.userType === USER_TYPES.NORMAL
  ) {
    return <div>User</div>;
  }
  return <Navigate to="/" />;
}

function NoPage() {
  return <div>NoPage</div>;
}

function PublicElement({ children }) {
  return children;
}

function UserElement({ children }) {
  return <div>{children}</div>;
}

function AdminElement({ children }) {
  return <div>{children}</div>;
}

export default App;