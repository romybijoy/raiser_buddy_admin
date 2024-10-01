import { useContext, createContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  FacebookAuthProvider
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [dbUser, setDbUser] = useState("user");

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
    //  signInWithRedirect(auth, provider)
  };

  const facebookSignIn = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider);
    //  signInWithRedirect(auth, provider)
  };

  const dbUserSignIn = () => {
    setDbUser(null);
  };

  const logOut = () => {
      signOut(auth)
  }

  useEffect(() => {
    if(dbUser != null){
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // console.log('User', currentUser)
    });
    return () => {
      unsubscribe();
    };
  }
  
  }, [onAuthStateChanged]);

  return (
    <AuthContext.Provider value={{ googleSignIn, logOut, dbUserSignIn, dbUser, user, facebookSignIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};