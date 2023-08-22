import React, { useState } from "react";
import { BiCheck, BiEdit } from "react-icons/bi";
import { BsFillCheckCircleFill } from "react-icons/bs";
import Avatar from "./Avatar";
import { useAuth } from "@/context/authContext";
import { FiPlus } from "react-icons/fi";
import { IoClose, IoLogOutOutline } from "react-icons/io5";
import { MdPhotoCamera, MdAddAPhoto, MdDeleteForever } from "react-icons/md";

import Icon from "./Icon";
import { profileColors } from "@/utils/constants";
import { toast } from "react-toastify";
import ToastMessage from "./ToastMessage";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { auth, db, storage } from "@/firebase/firebase_config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import UsersPopup from "./popups/UsersPopup";

const LeftNav = () => {
  const [avalibleUsers, setAvalibleUsers] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [nameEdited, setNameEdited] = useState(false);
  // const [profile , setProfile] = useState(null)
  // const [progressBarWidth, setProgressBarWidth] = useState("");
  const { currentUser, signOut, setCurrentUser } = useAuth();

  // let progress;
  const uploadImageToFirestore = (file) => {
    try {
      if (file) {
        const storageRef = ref(storage, `profile_images/${currentUser.email}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
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
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log("File available at", downloadURL);
                handleUpdateProfile("photo", downloadURL);
                await updateProfile(auth.currentUser, {
                  photoURL: downloadURL,
                });
                console.log(currentUser);
              }
            );
          }
        );
      }

      // console.log(currentUser);
      // console.log(auth.currentUser);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProfile = (type, value) => {
    // name, color, photo, remove-photo
    const obj = { ...currentUser };
    switch (type) {
      case "name":
        obj.displayName = value;
        break;
      case "color":
        obj.color = value;
        break;
      case "photo":
        obj.photoURL = value;
        break;
      case "photo-remove":
        obj.photoURL = value;
        break;
      default:
        break;
    }
    try {
      toast.promise(
        async () => {
          const docRef = doc(db, "users", currentUser.uid);
          await updateDoc(docRef, obj);
          setCurrentUser(obj);

          if (type === "photo-remove") {
            await updateProfile(auth.currentUser, {
              photoURL: value,
            });
          }
          if (type === "name") {
            await updateProfile(auth.currentUser, {
              displayName: value,
            });
            setNameEdited(false);
          }
          if (type === "color") {
            await updateProfile(auth.currentUser, {
              color: value,
            });
          }
          if (type === "photo") {
            await updateProfile(auth.currentUser, {
              photoURL: value,
            });
          }
          // updateCurrentUser
        },
        {
          pending: "Updating Profile",
          success: "Profile Updated Successfully",
          error: "Profile Update Failed!",
        },
        {
          autoClose: 3000,
        }
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  const onkeyup = (event) => {
    if (event.target.innerText.trim() !== currentUser.displayName) {
      // name is edited
      setNameEdited(true);
    } else {
      // name is not edited
      setNameEdited(false);
    }
  };
  const onkeydown = (event) => {
    if (event.key === "Enter" && event.keyCode === 13) {
      event.preventDefault();
    }
  };

  const editProfileContainer = () => {
    return (
      <div className="relative flex flex-col  justify-center items-center">
        <ToastMessage />
        <Icon
          size={"small"}
          className={"absolute top-0 right-5 hover:bg-c2"}
          icon={<IoClose size={20} />}
          onClick={() => setEditProfile(!editProfile)}
        />
        <div className="relative group">
          <Avatar size={"xx-large"} user={currentUser} />
          <div className="absolute top-0 left-0 justify-center items-center w-full h-full bg-black/[0.5] rounded-full hidden group-hover:flex">
            <label htmlFor="fileUpload" className="cursor-pointer">
              {currentUser.photoURL ? (
                <MdPhotoCamera size={34} />
              ) : (
                <MdAddAPhoto size={34} />
              )}
            </label>
            <input
              type="file"
              id="fileUpload"
              className="hidden"
              onChange={(e) => {
                uploadImageToFirestore(e.target.files[0]);
              }}
            />
          </div>
          {currentUser.photoURL && (
            <div
              className="w-6 h-6 bg-red-500 rounded-full flex justify-center items-center absolute right-0 bottom-0 cursor-pointer"
              onClick={() => handleUpdateProfile("photo-remove", null)}
            >
              <MdDeleteForever />
            </div>
          )}
        </div>
        <div className="mt-5 flex flex-col items-center">
          <div className="flex gap-2 items-center">
            {!nameEdited ? (
              <BiEdit className="text-c3" />
            ) : (
              <BsFillCheckCircleFill
                className="text-c4 cursor-pointer"
                onClick={() => {
                  handleUpdateProfile(
                    "name",
                    document.getElementById("displayNameEdit").innerText
                  );
                }}
              />
            )}
            <div
              contentEditable
              className="bg-transparent border-none outline-none text-center"
              id="displayNameEdit"
              onKeyUp={onkeyup}
              onKeyDown={onkeydown}
            >
              {currentUser.displayName}
            </div>
          </div>
          <span className="text-c3 text-sm">{currentUser.email}</span>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-5">
          {profileColors.map((color, index) => (
            <span
              key={index}
              className="rounded-full w-10 h-10 flex justify-center items-center cursor-pointer transition-transform hover:scale-125"
              style={{ backgroundColor: color }}
              onClick={() => {
                handleUpdateProfile("color", color);
              }}
            >
              {color === currentUser.color && <BiCheck size={24} />}
            </span>
          ))}
        </div>
      </div>
    );
  };
  // console.log("outside", currentUser);

  return (
    <div
      className={`${
        editProfile ? "w-[350px]" : "w-[80px] items-center"
      } flex flex-col justify-between  py-5 shrink-0 transition-all`}
    >
      {editProfile ? (
        editProfileContainer()
      ) : (
        <div
          className="relative group cursor-pointer"
          onClick={() => setEditProfile(!editProfile)}
        >
          <Avatar size="large" user={currentUser} />
          <div className="w-full h-full rounded-full bg-black/[0.5] absolute top-0 left justify-center items-center hidden group-hover:flex">
            <BiEdit size={14} />
          </div>
        </div>
      )}

      {/* <div className="flex flex-col gap-2 justify-center w-[300px] m-auto">
        <span>Profile Image Uploading</span>
        <div className="w-full h-[10px] bg-c3 flex rounded-3xl">
          <span
            className={`h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  rounded-3xl transition-all`}
            style={{ width: progress }}
          ></span>
        </div>
        <span className="text-end w-[300px]">{progress}</span>
      </div> */}

      <div
        className={`flex gap-5 ${
          editProfile ? "ml-5" : "flex-col items-center"
        }`}
      >
        <Icon
          size={"x-large"}
          className={"bg-green-500 hover:bg-gray-600"}
          icon={<FiPlus size={24} />}
          onClick={() => {
            setAvalibleUsers(!avalibleUsers);
          }}
        />
        <Icon
          size={"x-large"}
          className={"hover:bg-c2"}
          icon={<IoLogOutOutline size={24} />}
          onClick={signOut}
        />
      </div>
      {avalibleUsers && (
        <UsersPopup onHide={() => setAvalibleUsers(!avalibleUsers)} title = "Available Users" />
      )}
    </div>
  );
};

export default LeftNav;
