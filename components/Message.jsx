import { useAuth } from "@/context/authContext";
import React, { useState } from "react";
import Avatar from "./Avatar";
import { useChats } from "@/context/chatContext";
import Image from "next/image";
import ImageViewer from "react-simple-image-viewer";
import { Timestamp } from "firebase/firestore";
import { formateDate } from "@/utils/helpers";
import { GoChevronDown } from "react-icons/go";
import Icon from "./Icon";
import MessageMenu from "./MessageMenu";

const Message = ({ message }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { currentUser } = useAuth();
  const { users, data, imageViewer, setImageViewer } = useChats();
  const self = message.sender === currentUser.uid;

  const timeStamp = new Timestamp(
    message?.date?.seconds,
    message?.date?.nanoseconds
  );
  const date = timeStamp.toDate();

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
                className={`rounded-3xl ${
                  !imageViewer ? "cursor-zoom-in" : ""
                }`}
                onClick={() => {
                  setImageViewer({
                    msgId: message.id,
                    url: message.img,
                  });
                }}
              />

              {imageViewer && imageViewer.msgId === message.id && (
                <ImageViewer
                  src={[imageViewer.url]}
                  currentIndex={0}
                  disableScroll={false}
                  closeOnClickOutside={true}
                  onClose={() => setImageViewer(null)}
                />
              )}
            </div>
          )}
          {message.text && (
            <div className={`text-sm h-auto ${message.img ? "w-[250px]" : ""}`}>
              {message.text}
            </div>
          )}
          <div
            className={`${
              showMenu ? "" : "hidden"
            } group-hover:flex absolute top-2 ${
              self ? "left-2 bg-c5" : "right-2 bg-c1"
            }`}
            onClick={() => setShowMenu(!showMenu)}
          >
            <Icon
              size={"medium"}
              className={"hover:bg-inherit rounded-none"}
              icon={<GoChevronDown size={24} className="text-c3" />}
            />
            {showMenu && (
              <MessageMenu
                self={self}
                showMenu={showMenu}
                setShowMenu={setShowMenu}
              />
            )}
          </div>
        </div>
      </div>
      <div
        className={`flex items-end ${
          self ? "justify-start flex-row-reverse mr-12" : "ml-12"
        }`}
      >
        <div className="text-xs text-c3">{formateDate(date)}</div>
      </div>
    </div>
  );
};

export default Message;
