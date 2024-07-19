export const setAuthToken = (token, provider = 'email') => {
  const tokenData = {
    token,
    provider,
    exp: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours from now
  };
  console.log('Setting auth token with expiration:', new Date(tokenData.exp).toString());
  localStorage.setItem('authToken', JSON.stringify(tokenData)); // Use consistent key name 'authToken'
};

export const setFacebookToken = (userData) => {
  const token = btoa(JSON.stringify({
    userId: userData.id,
    email: userData.email,
    provider: 'facebook',
    exp: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours from now
  }));
  
  localStorage.setItem('authToken', token);
  return token;
};

export const setGoogleToken = (token) => {
  console.log("This is the token", token);
  const tokenData = {
    token,
    provider: 'google',
    exp: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours from now
  };
  localStorage.setItem('authToken', btoa(JSON.stringify(tokenData)));
};

export const getAuthToken = () => {
  try {
    const token = localStorage.getItem('authToken');
    if (token) {
      const tokenData = JSON.parse(atob(token)); // Decode token from base64

      // Check token expiration
      const { exp } = tokenData;
      const now = new Date().getTime();
      if (now >= exp) {
        // Token expired, remove it from localStorage
        localStorage.removeItem('authToken');
        return null;
      }

      // Token valid and not expired, return tokenData
      return tokenData;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};





export const decodeJWT = (token) => {

  
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const isTokenValid = () => {
  const tokenData = getAuthToken();
  return tokenData !== null;
};

export const logoutUser = () => {
  removeAuthToken();
};
