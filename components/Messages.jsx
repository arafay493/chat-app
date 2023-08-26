import { useChats } from "@/context/chatContext";
import { db } from "@/firebase/firebase_config";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data, setIsTyping } = useChats();
  const ref = useRef();

  useEffect(() => {
    return () => setMessages([]);
  }, [data.chatId]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        // console.log(doc.data())
        setMessages(doc.data().messages);
      }
    });
    return () => unsub();
  }, [data.chatId]);
  return (
    <div ref={ref} className="grow p-5 scrollbar overflow-auto flex flex-col">
      {messages === [] && (
        <h1 className="text-white relative z-20 text-4xl">
          Loading Messages................
        </h1>
      )}
      {messages !== [] &&
        messages?.map((m) => {
          return <Message message={m} key={m.id} />;
        })}
    </div>
  );
};

export default Messages;
