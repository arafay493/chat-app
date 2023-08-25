import { useAuth } from "@/context/authContext";
import React from "react";
import Avatar from "./Avatar";
import { useChats } from "@/context/chatContext";
import Image from "next/image";

const Message = ({ message }) => {
  const { currentUser } = useAuth();
  const { users, data } = useChats();
  const self = message.sender === currentUser.uid;
  return (
    <div className={`mb-5 max-w-[75%] ${self ? "self-end" : ""}`}>
      <div
        className={`flex items-end gap-3 mb-1 ${
          self ? "justify-start flex-row-reverse" : ""
        }`}
      >
        <Avatar
          size={"small"}
          user={self ? currentUser : users[data.user.uid]}
        />
        <div
          className={`group flex flex-col gap-4 p-4 rounded-3xl relative break-all ${
            self ? "rounded-br-md bg-c5" : "rounded-bl-md bg-c1"
          }`}
        >
          {message.img && (
            <div className="text-sm relative w-[250px] h-[250px]">
              <Image
                src={message.img}
                fill
                alt={"attachment"}
                className="rounded-3xl cursor-zoom-in"
                onClick={() => {

                }}
              />
            </div>
          )}
          {message.text && (
            <div className={`text-sm h-auto ${message.img ? "w-[250px]" : ""}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
      <div>date</div>
    </div>
  );
};

export default Message;
