import LeftNav from "@/components/LeftNav";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { signOut, currentUser, isLoading } = useAuth();

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
            <div>Sidebar</div>
            <div>Chats</div>
          </div>
        </div>
      </div>
    </>
  );
}
