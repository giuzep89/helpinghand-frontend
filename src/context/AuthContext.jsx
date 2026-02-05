import { createContext, useState } from 'react';
import testDatabase from '../constants/testDatabase.json';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState({
    isAuth: true,
    user: testDatabase.currentUser,
    status: "done"
  });

  function login(username) {
    const foundUser = testDatabase.users.find((user) => {
      return user.username === username;
    });

    if (foundUser) {
      setAuth({
        isAuth: true,
        user: foundUser,
        status: "done"
      });
    }
  }

  function logout() {
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
