import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { auth, db } from "@/firebase/firebase_config";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { IoLogoFacebook, IoLogoGoogle } from "react-icons/io";
import { profileColors } from "@/utils/constants";
import { doc, setDoc } from "firebase/firestore";
import Loader from "@/components/Loader";

const gProvider = new GoogleAuthProvider();
const fProvider = new FacebookAuthProvider();

const register = () => {
  const router = useRouter();
  const { currentUser, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading && currentUser) {
      router.push("/");
    }
  }, [currentUser, isLoading]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, gProvider);
    } catch (error) {
      console.error(error);
    }
  };

  const signInWithFacebook = async () => {
    // try {
    //   await signInWithPopup(auth, fProvider);
    // } catch (error) {
    //   console.error(error);
    // }
    alert("Currently Working on this Authentication");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const colorIndex = Math.floor(Math.random() * profileColors.length);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName,
        email,
        color: profileColors[colorIndex],
      });
      await setDoc(doc(db, "userChats", user.uid), {});
      await updateProfile(user, {
        displayName,
      });
      router.push("/");
    } catch (error) {
      if (error.message === "Firebase: Error (auth/email-already-in-use).") {
        alert("You Have Already Register with this email");
      } else {
        console.error(error);
        console.log(error.message);
        alert(error.message);
      }
    }
  };

  return isLoading || (!isLoading && currentUser) ? (
    <Loader />
  ) : (
    <div className="h-screen flex justify-center items-center bg-c1 select-none">
      <div className="flex flex-col justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold">Create New Account</div>
          <div className="mt-3 text-c3">
            Connect and Chat with anyone, anywhere
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 w-full mt-7 mb-5">
            <div
              className="w-1/2 h-14 rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px] cursor-pointer"
              onClick={signInWithGoogle}
            >
              <div className="flex justify-center items-center gap-3 h-full w-full bg-c1 rounded-md">
                <IoLogoGoogle size={24} />
                <span>Login to Google</span>
              </div>
            </div>
            <div
              className="w-1/2 h-14 rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px] cursor-pointer"
              onClick={signInWithFacebook}
            >
              <div className="flex justify-center items-center gap-3 h-full w-full bg-c1 rounded-md">
                <IoLogoFacebook size={24} />
                <span>Login to Facebook</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center gap-1">
            <span className="w-5 h-[1px] bg-c3"></span>
            <span className="text-c3 font-semibold">OR</span>
            <span className="w-5 h-[1px] bg-c3"></span>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 mt-5 w-[500px]"
          >
            <input
              type="text"
              autoComplete="off"
              placeholder="Name"
              className="bg-c5 rounded-xl border-none outline-none h-14 px-5"
            />
            <input
              type="email"
              autoComplete="off"
              placeholder="Email"
              className="bg-c5 rounded-xl border-none outline-none h-14 px-5"
            />
            <input
              type="password"
              autoComplete="off"
              placeholder="Password"
              className="bg-c5 rounded-xl border-none outline-none h-14 px-5"
            />
            <button
              type="submit"
              className="mt-4 bg-gradient-to-r h-14 rounded-xl from-indigo-500 via-purple-500 to-pink-500"
            >
              Sign Up
            </button>
            <div className="text-center text-c3 flex items-center justify-center gap-1">
              <span>Already have an account?</span>
              <Link
                href={"/login"}
                className="text-white underline underline-offset-4"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default register;
