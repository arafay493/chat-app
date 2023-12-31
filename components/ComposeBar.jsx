import { useAuth } from "@/context/authContext";
import { useChats } from "@/context/chatContext";
import { db, storage } from "@/firebase/firebase_config";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React from "react";
import { TbSend } from "react-icons/tb";
import { v4 as uuid } from "uuid";

const ComposeBar = () => {
  const {
    inputText,
    setInputText,
    data,
    attachment,
    setAttachment,
    setAttachmentPreview,
  } = useChats();
  const { currentUser } = useAuth();

  const handleTyping = (e) => {
    setInputText(e.target.value);
  };

  const handleSend = async () => {
    if (attachment) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, attachment);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          // setProgressBarWidth(progress)
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: inputText,
                sender: currentUser.uid,
                date: Timestamp.now(),
                read: false,
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: inputText,
          sender: currentUser.uid,
          date: Timestamp.now(),
          read: false,
        }),
      });
    }

    let msg = { text: inputText };
    if (attachment) {
      msg.img = true;
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: msg,
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text: inputText,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setInputText("");
    setAttachment(null);
    setAttachmentPreview(null);
  };

  const onkeyup = (e) => {
    if (e.key === "Enter" && (inputText || attachment)) {
      handleSend();
    }
  };
  return (
    <div className="flex items-center gap-2 grow">
      <input
        type="text"
        className="grow w-full outline-0 p-2 text-white bg-transparent outline-none placeholder:text-c3 text-base"
        placeholder="Type a message"
        value={inputText}
        onChange={handleTyping}
        onKeyUp={onkeyup}
      />
      <button
        className={`h-10 w-10 flex justify-center items-center rounded-xl shrink-0 ${
          inputText.trim().length > 0 ? "bg-c4" : ""
        }`}
        onClick={handleSend}
      >
        <TbSend size={20} className="text-white" />
      </button>
    </div>
  );
};

export default ComposeBar;
