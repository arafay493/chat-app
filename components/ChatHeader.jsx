import { useChats } from "@/context/chatContext";
import React, { useState } from "react";
import Avatar from "./Avatar";
import Icon from "./Icon";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import ChatMenu from "./ChatMenu";

const ChatHeader = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { users, data } = useChats();

  const online = users[data.user.uid]?.isOnline;
  const user = users[data.user.uid];
  return (
    <div className="flex justify-between items-center pb-5 border-b border-white/5">
      {user && (
        <div className="flex items-center gap-3">
          <Avatar size={"large"} user={user} />
          <div>
            <div className="font-medium">{user.displayName}</div>
            <div className="text-c3 text-sm">
              {online ? "Online" : "Offline"}
            </div>
          </div>
        </div>
      )}
      <div className="relative flex items-center gap-2">
        <Icon
          size={"large"}
          onClick={() => setShowMenu(!showMenu)}
          className={showMenu ? "bg-c1" : ""}
          icon={<IoEllipsisVerticalSharp size={20} className="text-c3"/>}
        />
        {showMenu && <ChatMenu showMenu = {showMenu} setShowMenu = {setShowMenu}/>}
      </div>
    </div>
  );
};

export default ChatHeader;
