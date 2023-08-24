import { useChats } from "@/context/chatContext";
import { db } from "@/firebase/firebase_config";
import { Timestamp, collection, doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { RiSearch2Line } from "react-icons/ri";
import Avatar from "./Avatar";
import { useAuth } from "@/context/authContext";
import { formateDate } from "@/utils/helpers";
const Chats = () => {
  const {
    users,
    setUsers,
    chats,
    setChats,
    seletedChat,
    setSelectedChat,
    dispatch,
  } = useChats();
  const [search, setSearch] = useState("");

  const { currentUser } = useAuth();

  useEffect(() => {
    onSnapshot(collection(db, "users"), (snapshot) => {
      const updatedUsers = {};
      snapshot.forEach((doc) => {
        updatedUsers[doc.id] = doc.data();
      });
      currentUser.uid && setUsers(updatedUsers);
    });
  }, []);

  useEffect(() => {
    const getChats = () => {
      const unSub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setChats(data);
        }
      });
    };
    getChats();
  }, []);

  const filteredChats = Object.entries(chats || {})
    .filter(
      ([, chat]) =>
        chat?.userInfo?.displayName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        chat?.lastMessage?.text.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b[1].data - a[1].date);

  const handleSelect = (user, selectedChatId) => {
    setSelectedChat(user);
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="shrink-0 sticky -top-[20px] z-10 flex justify-center w-full bg-c2 py-5">
        <RiSearch2Line className="absolute top-9 left-12 text-c3" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search username"
          className="w-[300px] h-12 rounded-xl bg-c1/50 pl-11 pr-5 placeholder:text-c3 outline-none text-base"
        />
      </div>
      <ul className="w-full flex flex-col gap-[2px] my-5">
        {Object.keys(users || {}).length > 0 &&
          filteredChats?.map((chat, i) => {
            const timeStamp = new Timestamp(
              chat[1].date.seconds,
              chat[1].date.nanoseconds
            );
            const date = timeStamp.toDate();
            const user = users[chat[1].userInfo.uid];
            return (
              <li
                className={`h-[90px] flex items-center gap-4 rounded-3xl p-4 cursor-pointer hover:bg-c1 ${
                  seletedChat?.uid === user?.uid ? "bg-c1" : ""
                }`}
                key={chat[0]}
                onClick={() => handleSelect(user, chat[0])}
              >
                <Avatar size={"x-large"} user={user} />
                <div className="flex flex-col gap-1 grow relative">
                  <div className="text-base text-white flex items-center justify-between">
                    <div className="font-medium">{user.displayName}</div>
                    <div className="text-c3 text-xs">{formateDate(date)}</div>
                  </div>
                  <p className="text-sm text-c3 line-clamp-1 break-all">
                    {chat[1]?.lastMessage?.text ||
                      (chat[1]?.lastMessage?.img && "image") ||
                      "Send first message"}
                  </p>
                  <span className="absolute right-0 top-7 min-w-[20px] h-5 rounded-full bg-red-500 flex justify-center items-center text-sm">
                    5
                  </span>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Chats;
