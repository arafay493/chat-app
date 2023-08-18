import React, { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "@/firebase/firebase_config";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { IoLogoFacebook, IoLogoGoogle } from "react-icons/io";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import ToastMessage from "@/components/ToastMessage";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
const gProvider = new GoogleAuthProvider();
const fProvider = new FacebookAuthProvider();
const login = () => {
  const router = useRouter();
  const { currentUser, isLoading } = useAuth();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!isLoading && currentUser) {
      router.push("/");
    }
  }, [currentUser, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  };

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

  const resetPassword = () => {
    toast.promise(
      async () => {
        await sendPasswordResetEmail(auth, email);
      },
      {
        pending: "Generating Reset Link",
        success: "Reset link send to your email",
        error: "You may have entered wrong email id",
      },
      {
        autoClose: 5000,
      }
    );
  };

  return isLoading || (!isLoading && currentUser) ? (
    <Loader />
  ) : (
    <div className="h-screen flex justify-center items-center bg-c1 select-none">
      <ToastMessage />
      <div className="flex flex-col justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold">Login to Your Account</div>
          <div className="mt-3 text-c3">
            Connect and Chat with anyone, anywhere
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 w-full mt-10 mb-5">
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
              type="email"
              autoComplete="off"
              placeholder="Email"
              className="bg-c5 rounded-xl border-none outline-none h-14 px-5"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              autoComplete="off"
              placeholder="Password"
              className="bg-c5 rounded-xl border-none outline-none h-14 px-5"
            />
            {/* <div>
            </div> */}
            <span
              className="text-end text-c3 cursor-pointer"
              onClick={resetPassword}
            >
              Forget Password?
            </span>
            <button
              type="submit"
              className="mt-4 bg-gradient-to-r h-14 rounded-xl from-indigo-500 via-purple-500 to-pink-500"
            >
              Login to Your Account
            </button>
            <div className="text-center text-c3 flex items-center justify-center gap-1">
              <span>Don't have an account?</span>
              <Link
                href={"/register"}
                className="text-white underline underline-offset-4"
              >
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default login;
