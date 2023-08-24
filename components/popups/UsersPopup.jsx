import React from "react";
import PopupWrapper from "./PopupWrapper";
import { useAuth } from "@/context/authContext";
import { useChats } from "@/context/chatContext";
import Avatar from "../Avatar";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase_config";
import Search from "../Search";
const UsersPopup = (props) => {
  const { currentUser } = useAuth();
  const { users , dispatch } = useChats();

  const handleSelectChat = async (user) => {
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
      dispatch({type : "CHANGE_USER" , payload : user})
      props.onHide()
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <PopupWrapper {...props}>
      <Search />
      <div className="mt-5 flex flex-col gap-2 grow relative overflow-auto scrollbar">
        <div className="absolute w-full">
          {users &&
            Object.values(users).map((user) => (
              <div
                className="flex items-center gap-4 rounded-xl hover:bg-c5 cursor-pointer py-2 px-4"
                key={user.id}
                onClick={() => handleSelectChat(user)}
              >
                <Avatar size={"large"} user={user} />
                <div className="flex flex-col gap-1 grow">
                  <div className="text-base text-white flex items-center justify-between">
                    <div className="font-medium">{user.displayName}</div>
                  </div>
                  <p className="text-sm text-c3">{user.email}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </PopupWrapper>
  );
};

export default UsersPopup;
