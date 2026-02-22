import { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { isTokenExpired } from '../helpers/isTokenExpired.js';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState({
    isAuth: false,
    user: null,
    status: "loading"
  });

  useEffect(() => {
    function checkToken() {
      const token = localStorage.getItem("token");

      if (token && !isTokenExpired()) {
        const decodedToken = jwtDecode(token);
        setAuth({
          isAuth: true,
          user: {
            username: decodedToken.sub,
            isAdmin: decodedToken.roles?.includes('ROLE_ADMIN') || false
          },
          status: "done"
        });
      } else {
        localStorage.removeItem("token");
        setAuth({
          isAuth: false,
          user: null,
          status: "done"
        });
      }
    }

    checkToken();
  }, []);

  function login(username) {
    const token = localStorage.getItem("token");
    const decodedToken = token ? jwtDecode(token) : null;
    setAuth({
      isAuth: true,
      user: {
        username,
        isAdmin: decodedToken?.roles?.includes('ROLE_ADMIN') || false
      },
      status: "done"
    });
  }

  function logout() {
    localStorage.removeItem("token");
    setAuth({
      isAuth: false,
      user: null,
      status: "done"
    });
  }

  const data = {
    isAuth: auth.isAuth,
    user: auth.user,
    login: login,
    logout: logout
  };

  return (
    <AuthContext.Provider value={data}>
      {auth.status === "done" ? children : <p>Loading...</p>}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
