"use client";

import { useEffect } from "react";

import { useUser } from "@/src/context/user.provider";
import RecipeFeed from "@/src/components/feed/RecipeFeed";

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("reloaded")) {
      // Reload the page and set a flag to avoid infinite loop
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    }
  }, []);
  const { user, isLoading } = useUser();

  const loggedUserId = user?._id;

  console.log("User => ", user);
  console.log("isLoading => ", isLoading);

  return (
    <section
      style={{
        marginTop: "5%",
      }}
      className="flex flex-col items-center justify-center gap-4 py-8 md:py-10"
    >
      {loggedUserId && <RecipeFeed userId={loggedUserId} />}
    </section>
  );
}
