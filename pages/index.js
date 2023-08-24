import Chat from "@/components/Chat";
import Chats from "@/components/Chats";
import LeftNav from "@/components/LeftNav";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/authContext";
import { useChats } from "@/context/chatContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { signOut, currentUser, isLoading } = useAuth();
  const {data} = useChats()

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, isLoading]);
  return !currentUser ? (
    <Loader />
  ) : (
    <>
      {/* <button className="bg-black p-3" onClick={signOut}>
        Sign Out
      </button> */}
      <div className="h-screen flex bg-c1">
        <div className="flex w-full shrink-0">
          <LeftNav />
          <div className="flex bg-c2 grow">
            <div className="w-[400px] p-5 overflow-auto scrollbar border-r border-white/5">
              <div className="flex flex-ccol h-full">
                <Chats />
              </div>
            </div>
            {data.user && <Chat />}
          </div>
        </div>
      </div>
    </>
  );
}
