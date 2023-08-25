import React, { useRef, useState } from "react";
import Icon from "./Icon";
import { CgAttachment } from "react-icons/cg";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import ComposeBar from "./ComposeBar";
import EmojiPicker from "emoji-picker-react";
import ClickAwayListener from "react-click-away-listener";
import { useChats } from "@/context/chatContext";
import { IoClose } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
const ChatFooter = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  //   const [file , setFile] = useState(null)
  const {
    isTyping,
    editMsg,
    setEditMsg,
    inputText,
    setInputText,
    attachment,
    setAttachment,
    attachmentPreview,
    setAttachmentPreview,
  } = useChats();

  // const fileInputRef = useRef(null);
  const onEmojiClick = (emojiData, event) => {
    let text = inputText;
    setInputText((text += emojiData.emoji));
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    // fileInputRef.current = file;
    setAttachment(file);
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setAttachmentPreview(blobUrl);
    }

    // const newFile = e.target.files[0];
    // if (attachment === null || newFile !== attachment) {
    //   setAttachment(newFile);
    //   if (newFile) {
    //     const blobUrl = URL.createObjectURL(newFile);
    //     setAttachmentPreview(blobUrl);
    //   }
    // } else {
    //   // Same file selected again, clear the input
    //   clearFileInput();
    // }

    // console.log(e.target.files);
    // const emptyFileList = {
    //   0: null, // Replace 'null' with 'undefined' if necessary
    //   length: 0,
    // };

    // e.target.files = emptyFileList;

    // console.log(e.target.files);
  };
  //   function clearFileInput() {
  //     if (fileInputRef.current) {
  //       fileInputRef.current.value = null;
  //     }
  //     setAttachment(null);
  //     // setSelectedFile(null);
  //   }

  //   console.log(fileInputRef)
  //   if(fileInputRef.current){

  //       console.log(fileInputRef.current.files[0]);
  //   }
  // console.log(fileInputRef);
  return (
    <div className="flex items-center p-2 bg-c1/50 rounded-xl relative">
      {attachmentPreview && (
        <div className="absolute w-[100px] h-[100px] bottom-16 left-0 bg-c1 p-2 rounded-md">
          <img src={attachmentPreview} />
          <div
            className="w-6 h-6 rounded-full bg-red-500 flex justify-center items-center absolute -right-2 -top-2 cursor-pointer"
            onClick={(e) => {
              setAttachment(null);
              setAttachmentPreview(null);
              //   fileInputRef.current.files[0] = {}
              //   console.log(document.getElementById('fileUploader').files)
              //   fileInputRef.current.files = [];
              // if (fileInputRef.current) {
              //   fileInputRef.current = null;
              // }
            }}
          >
            <MdDeleteForever size={14} />
          </div>
        </div>
      )}
      <div className="shrink-0">
        <input
          type="file"
          id="fileUploader"
          className="hidden"
          onChange={onFileChange}
          // ref={fileInputRef}
        />
        <label htmlFor="fileUploader">
          <Icon
            size={"large"}
            icon={<CgAttachment size={20} />}
            className={"text-c3"}
          />
        </label>
      </div>
      <div className="shrink-0 relative">
        <Icon
          size={"large"}
          icon={
            <HiOutlineEmojiHappy
              size={24}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />
          }
          className={"text-c3"}
        />
        {showEmojiPicker && (
          <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
            <div className="absolute left-0 bottom-12 shadow-lg">
              <EmojiPicker
                emojiStyle="apple"
                theme="dark"
                onEmojiClick={onEmojiClick}
                autoFocusSearch={false}
              />
            </div>
          </ClickAwayListener>
        )}
      </div>

      {isTyping && (
        <div className="absolute -top-6 left-4 bg-c2 w-full h-6">
          <div className="flex gap-2 w-full h-full opacity-50 text-sm text-white">
            {"User is typing"}
            <img src="/assets/typing.svg" alt="typinh indicator" />
          </div>
        </div>
      )}

      {editMsg && (
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-c4 flex items-center gap-2 py-2 px-4 rounded-full text-sm cursor-pointer shadow-lg"
          onClick={() => setEditMsg(null)}
        >
          <span>Cancel Edit</span>
          <IoClose size={20} className="text-white" />
        </div>
      )}

      <ComposeBar />
    </div>
  );
};

export default ChatFooter;
