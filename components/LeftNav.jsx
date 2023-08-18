import React from "react";
import { BiEdit } from "react-icons/bi";
import Avatar from "./Avatar";
import { useAuth } from "@/context/authContext";
import { FiPlus } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";
import Icon from "./Icon";
const LeftNav = () => {
  const { currentUser , signOut } = useAuth();
  return (
    <div className="w-[80px] flex flex-col justify-between items-center py-5 shrink-0 transition-all">
      <div className="relative group cursor-pointer">
        <Avatar size="large" user={currentUser} />
        <div className="w-full h-full rounded-full bg-black/[0.5] absolute top-0 left justify-center items-center hidden group-hover:flex">
          <BiEdit size={14} />
        </div>
      </div>

      <div className="flex flex-col gap-5 items-center">
        <Icon
          size={"x-large"}
          className={"bg-green-500 hover:bg-gray-600"}
          icon={<FiPlus size={24} />}
          onClick={() => {}}
        />
        <Icon
          size={"x-large"}
          className={"hover:bg-c2"}
          icon={<IoLogOutOutline size={24} />}
          onClick={signOut}
        />
      </div>
    </div>
  );
};

export default LeftNav;
