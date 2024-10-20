"use client";

import { useEffect } from "react";

import LoadingRecipeCard from "@/src/components/feed/LoadingRecipeCard";
import PremiumRecipeFeed from "@/src/components/feed/PremiumRecipeFeed";
import { useUser } from "@/src/context/user.provider";

export default function BlogPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("reloaded")) {
      // Reload the page and set a flag to avoid infinite loop
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    }
  }, []);

  const { user, isLoading } = useUser();

  const loggedUserId = user?._id;

  if (isLoading) {
    return (
      <div className="recipe-feed-container xl:w-5/12 lg:w-5/12 md:w-7/12 sm:w-auto">
        <LoadingRecipeCard />
      </div>
    );
  }

  return (
    <section
      style={{
        marginTop: "5%",
      }}
      className="flex flex-col items-center justify-center gap-4 py-8 md:py-10"
    >
      {loggedUserId && <PremiumRecipeFeed userId={loggedUserId} />}
    </section>
  );
}
