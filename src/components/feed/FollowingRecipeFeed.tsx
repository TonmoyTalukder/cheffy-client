import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { useFetchFeedRecipes } from '@/src/hooks/post.hooks';

import RecipeCard from './RecipeCard';
import LoadingRecipeCard from './LoadingRecipeCard';
import { useUser } from '@/src/context/user.provider';

interface RecipeFeedProps {
  userId: string;
  limit?: number;
}

const FollowingRecipeFeed: React.FC<RecipeFeedProps> = ({
  userId,
  limit = 5,
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useFetchFeedRecipes(userId, limit);

  const { user, isLoading } = useUser();
  console.log('User => ', user);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [repeatedData, setRepeatedData] = useState<any[]>([]);
  const [isRepeating, setIsRepeating] = useState(false); // Added state to track repeating
  const [isLoadingRepeatedData, setIsLoadingRepeatedData] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  // Fetch the next page of data when the sentinel element is in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Continuously append the repeated data once there are no more new pages
  useEffect(() => {
    if (!hasNextPage && !isFetchingNextPage && data?.pages) {
      setIsRepeating(true); // Enter repeating mode
      setIsLoadingRepeatedData(true);

      setTimeout(() => {
        const allRecipes = data.pages.flatMap((page) => page.recipes);

        setRepeatedData((prevData) => [...prevData, ...allRecipes]);

        // Stop loading indicator after appending data
        setIsLoadingRepeatedData(false);
      }, 1000); // Simulating a delay for loading
    }
  }, [hasNextPage, isFetchingNextPage, data]);

  // Trigger a "refetch" when in repeated mode and the sentinel is in view
  useEffect(() => {
    if (inView && isRepeating && !isLoadingRepeatedData) {
      setIsLoadingRepeatedData(true);

      setTimeout(() => {
        const allRecipes = data?.pages?.flatMap((page) => page.recipes) || [];

        setRepeatedData((prevData) => [...prevData, ...allRecipes]);
        setIsLoadingRepeatedData(false);
      }, 1000); // Simulated delay
    }
  }, [inView, isRepeating, isLoadingRepeatedData, data]);

  if (status === 'pending') {
    return (
      <div className="recipe-feed-container xl:w-5/12 lg:w-5/12 md:w-7/12 sm:w-auto">
        <LoadingRecipeCard />
      </div>
    );
  }

  if (status === 'error') {
    return <p>Failed to load recipes.</p>;
  }

  const allDisplayedRecipes = [
    ...(data?.pages?.flatMap((page) => page.recipes) || []),
    ...repeatedData,
  ];

  return (
    <div className="recipe-feed-container w-auto" ref={containerRef}>
      {allDisplayedRecipes.map((recipe: any, index: number) => (
        <RecipeCard key={`${recipe._id}-${index}`} recipe={recipe} />
      ))}

      <div ref={ref} className="sentinel">
        {isFetchingNextPage || isLoadingRepeatedData ? (
          <LoadingRecipeCard />
        ) : null}
      </div>
    </div>
  );
};

export default FollowingRecipeFeed;
