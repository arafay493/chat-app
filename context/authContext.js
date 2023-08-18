import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { auth, db } from "@/firebase/firebase_config";
import { doc, getDoc } from "firebase/firestore";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clear = () => {
    setCurrentUser(null);
    setIsLoading(false);
  };

  const authStateChanged = async (user) => {
    setIsLoading(true);
    if (!user) {
      clear();
      return;
    }

    const userData = await getDoc(doc(db, "users", user.uid));
    setCurrentUser(userData.data());
    setIsLoading(false);
  };

  const signOut = () => {
    authSignOut(auth)
      .then(() => clear())
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, authStateChanged);
  }, []);

  return (
    <UserContext.Provider
      value={{ currentUser, setCurrentUser, isLoading, setIsLoading, signOut }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
