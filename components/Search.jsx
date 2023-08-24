import { db } from "@/firebase/firebase_config";
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import React, { useState } from "react";
import { RiSearch2Line } from "react-icons/ri";
import Avatar from "./Avatar";
import { useAuth } from "@/context/authContext";
import { useChats } from "@/context/chatContext";
const Search = () => {
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const onkeyup = async (e) => {
    if (e.code === "Enter" && !!userName) {
      try {
        setErr(false);
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("displayName", "==", userName));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setErr(true);
          setUser(null);
        } else {
          querySnapshot.forEach((doc) => {
            setUser(doc.data());
          });
        }
      } catch (error) {
        console.error(error);
        setErr(error);
      }
    }
  };

  const { currentUser } = useAuth();
  const { dispatch } = useChats();

  const handleSelectChat = async () => {
    try {
      const combinedId = currentUser.uid + user.uid;
      const docRef = await getDoc(doc(db, "chats", combinedId));

      if (!docRef.exists()) {
        // If Chat not available in the chat list
        await setDoc(doc(db, "chats", combinedId), {
          messages: [],
        });

        const currentUserChatRef = await getDoc(
          doc(db, "userChats", currentUser.uid)
        );

        const userChatRef = await getDoc(doc(db, "userChats", user.uid));

        if (!currentUserChatRef.exists()) {
          await setDoc(doc(db, "userChats", currentUser.uid), {});
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"] : {
            uid: user.uid,
            displayName : user.displayName,
            photoURL : user.photoURL || null,
            color: user.color
          },
          [combinedId + ".date"] : serverTimestamp(),
        });

        if (!userChatRef.exists()) {
          await setDoc(doc(db, "userChats", user.uid), {});
        }

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"] : {
            uid: currentUser.uid,
            displayName : currentUser.displayName,
            photoURL : currentUser.photoURL || null,
            color: currentUser.color
          },
          [combinedId + ".date"] : serverTimestamp(),
        });
      } else {
        // If chat is already available in a chat list
      }


      setUser(null)
      setUserName("")
      dispatch({type : "CHANGE_USER" , payload : user})
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="shrink-0">
      <div className="relative">
        <RiSearch2Line className="absolute top-4 left-4 text-c3" />
        <input
          type="text"
          placeholder="Search User..."
          onChange={(e) => setUserName(e.target.value)}
          onKeyUp={onkeyup}
          value={userName}
          autoFocus
          className="w-full h-12 rounded-xl bg-c1/50 pl-11 pr-16 placeholder:text-c3 outline-none text-base"
        />
        <span className="absolute top-[14px] right-4 cursor-pointer text-sm text-c3">
          Enter
        </span>
      </div>

      {err && <>
        <div className="mt-5 w-full text-center text-sm">
            User Not Found
        </div>
        <div className="w-full h-[1px] bg-white/10 mt-5"></div>
      </>}

      {user && (
        <>
          <div
            className="mt-5 flex items-center gap-4 rounded-xl hover:bg-c5 cursor-pointer py-2 px-4"
            key={user.id}
            onClick={() => handleSelectChat()}
          >
            <Avatar size={"large"} user={user} />
            <div className="flex flex-col gap-1 grow">
              <div className="text-base text-white flex items-center justify-between">
                <div className="font-medium">{user.displayName}</div>
              </div>
              <p className="text-sm text-c3">{user.email}</p>
            </div>
          </div>
          <div className="w-full h-[1px] bg-white/10 mt-5"></div>
        </>
      )}
    </div>
  );
};

export default Search;
