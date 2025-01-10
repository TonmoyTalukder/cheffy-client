'use client';

import { useEffect } from 'react';

import LoadingRecipeCard from '@/src/components/feed/LoadingRecipeCard';
import PremiumRecipeFeed from '@/src/components/feed/PremiumRecipeFeed';
import { useUser } from '@/src/context/user.provider';
import WritePost from '@/src/components/feed/WritePost';

export default function BlogPage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionStorage.getItem('reloaded')) {
      // Reload the page and set a flag to avoid infinite loop
      sessionStorage.setItem('reloaded', 'true');
      window.location.reload();
    }
  }, []);

  const { user, isLoading } = useUser();

  const loggedUserId = user?._id;

  if (isLoading) {
    return (
      <div className="recipe-feed-container w-full">
        <LoadingRecipeCard />
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 p-2">
      {/* <div className="w-full mb-0"> */}
        {/* <div className="h-[3vh] text-lg text-center font-bold text-gray-500 rounded-b-lg p-5 w-full bg-amber-50 mb-3 flex items-center justify-center">
          <span className="my-3">Premium Recipies</span>
        </div> */}
        {/* <button
          className="ml-2 my-2 text-base text-zinc-700 font-bold bg-transparent h-[4vh] border-b-1 border-zinc-300"
          disabled
        >
          Premium Recipe
        </button>
        <WritePost /> */}
      {/* </div> */}
      {loggedUserId && <PremiumRecipeFeed userId={loggedUserId} />}
    </section>
  );
}
