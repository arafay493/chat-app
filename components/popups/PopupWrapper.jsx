import React from "react";
import Icon from "../Icon";
import { IoClose } from "react-icons/io5";

const PopupWrapper = (props) => {
  return (
    <div className="w-full h-full fixed top-0 left-0 z-20 flex justify-center items-center">
      <div className="absolute w-full h-full glass-effect" onClick={props.onHide}></div>
      <div className="flex flex-col w-[600px] max-h-[80%] min-h-[600px] relative bg-c2 z-10 rounded-3xl">
        <div className="shrink-0 p-6 flex justify-between items-center">
          <div className="text-lg font-semibold">{props.title}</div>
          <Icon
            size={"small"}
            icon={<IoClose size={20} />}
            onClick={props.onHide}
          />
        </div>
        <div className="grow flex flex-col p-6 pt-0">{props.children}</div>
      </div>
    </div>
  );
};

export default PopupWrapper;
