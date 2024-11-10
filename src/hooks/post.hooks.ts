// post.hooks.ts
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { FieldValues } from "react-hook-form";

import {
  createRecipe,
  deleteComment,
  deleteRecipe,
  getComments,
  getFeedRecipes,
  getRecipe,
  getSingleRecipe,
  postComment,
  rateRecipe,
  reportRecipe,
  updateComment,
  updateRecipe,
  voteRecipe,
} from "../services/PostService";

// Create Recipe Hook
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, FieldValues>({
    mutationKey: ["CREATE_RECIPE"],
    mutationFn: async (postData: FieldValues) => {
      console.log("Sending post data:", postData);
      const response = await createRecipe(postData);

      console.log("Response from server:", response);

      return response;
    },
    onSuccess: () => {
      toast.success("Recipe created successfully!");
      queryClient.invalidateQueries({ queryKey: ["FETCH_FEED_RECIPES"] });
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while creating the recipe.",
      );
      console.error("Error creating recipe:", error);
    },
  });
};

// Fetch Recipes Hook
export const useFetchRecipes = () => {
  return useQuery({
    queryKey: ["FETCH_RECIPES"], // Unique key for caching
    queryFn: async () => {
      try {
        const data = await getRecipe(); // Call the service function to fetch recipes

        console.log("Fetched recipes data:", data); // Log the fetched data

        return data; // Return the fetched data
      } catch (error) {
        console.error("Error fetching recipes:", error); // Log the error
        toast.error("Failed to fetch recipes."); // Show error toast notification
        throw error; // Rethrow the error to let react-query handle it
      }
    },
    // // Add any other configurations you need here
    // refetchOnWindowFocus: true, // Refetch on window focus if desired
  });
};

// Fetch single recipe
export const useGetSingleRecipe = (id: string) => {
  return useQuery({
    queryKey: ["GET_SINGLE_RECIPE", id], // Include the id in the query key for caching
    queryFn: async () => {
      try {
        const data = await getSingleRecipe(id); // Pass the id to the service function

        console.log("Recipe data from hooks =>", data);

        return data;
      } catch (error) {
        toast.error("Failed to fetch Recipe data.");
        toast.error("Failed to fetch recipe.");
        throw error; // Ensure react-query handles it as an error
      }
    },
    enabled: !!id, // Ensure the query only runs if id is defined
  });
};

// Delete Recipe Hook
export const useDeleteRecipe = () => {
  const queryClient = useQueryClient(); // Access react-query's cache

  return useMutation({
    mutationKey: ["DELETE_RECIPE"], // Unique key for this mutation
    mutationFn: async (id: string) => {
      console.log(`Deleting recipe with id: ${id}`);
      await deleteRecipe(id); // Call the delete service function
    },
    onSuccess: () => {
      toast.success("Recipe deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["FETCH_FEED_RECIPES"] });
      queryClient.invalidateQueries({
        queryKey: ["FETCH_RECIPES"],
      }); // Invalidate recipes query to refetch after deletion
    },
    onError: (error: any) => {
      toast.error(
        error.message || "An error occurred while deleting the recipe.",
      );
      console.error("Error deleting recipe:", error);
    },
  });
};

// Vote updating of a Recipe
export const useVoteRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["VOTE_RECIPE"], // Unique key for this mutation
    mutationFn: async ({
      recipeId,
      userId,
      voteData,
    }: {
      recipeId: string;
      userId: string;
      voteData: { id: string; upvote: boolean; downvote: boolean };
    }) => {
      console.log(`Voting on recipe with id: ${recipeId} by user: ${userId}`);
      const response = await voteRecipe(recipeId, userId, voteData);

      return response;
    },
    onSuccess: () => {
      // toast.success("Vote updated successfully!");
      // Optionally refetch the recipes or the single recipe to update the UI
      queryClient.invalidateQueries({ queryKey: ["FETCH_RECIPES"] });
      queryClient.invalidateQueries({ queryKey: ["FETCH_FEED_RECIPES"] });
      queryClient.invalidateQueries({ queryKey: ["GET_SINGLE_RECIPE"] });
    },
    onError: (error: any) => {
      toast.error(
        error.message || "An error occurred while updating the vote.",
      );
      console.error("Error updating vote:", error);
    },
  });
};

// Rate a Recipe
export const useRateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["RATE_RECIPE"], // Unique key for this mutation
    mutationFn: async ({
      recipeId,
      userId,
      ratingData,
    }: {
      recipeId: string;
      userId: string;
      ratingData: { id: string; rating: number };
    }) => {
      console.log(`Rating on recipe with id: ${recipeId} by user: ${userId}`);
      const response = await rateRecipe(recipeId, userId, ratingData);

      return response;
    },
    onSuccess: () => {
      // toast.success("Vote updated successfully!");
      // Optionally refetch the recipes or the single recipe to update the UI
      queryClient.invalidateQueries({ queryKey: ["FETCH_RECIPES"] });
      queryClient.invalidateQueries({ queryKey: ["GET_SINGLE_RECIPE"] });
    },
    onError: (error: any) => {
      toast.error(
        error.message || "An error occurred while updating the rating.",
      );
      console.error("Error updating rating:", error);
    },
  });
};

// Update Recipe Hook
export const useUpdateRecipe = () => {
  const queryClient = useQueryClient(); // Access react-query's cache

  return useMutation({
    mutationKey: ["UPDATE_RECIPE"], // Unique key for this mutation
    mutationFn: async ({
      recipeId,
      postData,
    }: {
      recipeId: string;
      postData: FieldValues;
    }) => {
      console.log(`Updating recipe with id: ${recipeId}`);
      const response = await updateRecipe(recipeId, postData); // Call the service function to update the recipe

      return response; // Return the updated recipe data
    },
    onSuccess: (data) => {
      toast.success("Recipe updated successfully!"); // Show success toast
      queryClient.invalidateQueries({ queryKey: ["FETCH_FEED_RECIPES"] }); // Invalidate the recipe list query to refetch
      queryClient.invalidateQueries({ queryKey: ["FETCH_RECIPES"] }); // Invalidate the recipe list query to refetch
      queryClient.invalidateQueries({
        queryKey: ["GET_SINGLE_RECIPE", data._id],
      }); // Invalidate the single recipe query to refetch
    },
    onError: (error: any) => {
      toast.error(
        error.message || "An error occurred while updating the recipe.",
      ); // Show error toast
      console.error("Error updating recipe:", error); // Log the error
    },
  });
};

// Report Recipe Hook
export const useReportRecipe = () => {
  const queryClient = useQueryClient(); // Access react-query's cache

  return useMutation({
    mutationKey: ["RECIPE_REPORT"], // Unique key for this mutation
    mutationFn: async (recipeId: string) => {
      console.log(`Reporting recipe with id: ${recipeId}`);
      const response = await reportRecipe(recipeId); // Call the service function to report the recipe

      return response; // Return the updated recipe data
    },
    onSuccess: (data) => {
      toast.success("Recipe reported successfully!"); // Show success toast
      queryClient.invalidateQueries({ queryKey: ["FETCH_FEED_RECIPES"] }); // Invalidate recipe list to refetch
      queryClient.invalidateQueries({
        queryKey: ["GET_SINGLE_RECIPE", data._id],
      }); // Invalidate the single recipe query to refetch the reported recipe
    },
    onError: (error: any) => {
      toast.error(
        error.message || "An error occurred while reporting the recipe.",
      ); // Show error toast
      console.error("Error reporting recipe:", error); // Log the error
    },
  });
};

// // Fetch personalized recipe feed  useFetchFeedRecipes
// export const useFetchFeedRecipes = (userId: string) => {
//   return useQuery({
//     queryKey: ["FETCH_FEED_RECIPES", userId], // Query key for caching and invalidating
//     queryFn: async () => {
//       if (!userId) {
//         throw new Error("User ID is required to fetch feed recipes.");
//       }

//       try {
//         const data = await getFeedRecipes(userId); // Call the service function

//         console.log("Fetched feed recipes data:", data); // Log the fetched data

//         return data; // Return the fetched data
//       } catch (error: any) {
//         console.error("Error fetching feed recipes:", error); // Log the error
//         toast.error("Failed to fetch feed recipes."); // Show error toast notification
//         throw error; // Rethrow the error to let react-query handle it
//       }
//     },
//     enabled: !!userId, // Enable the query only if userId is defined
//     refetchOnWindowFocus: true, // Optionally refetch when window is focused
//   });
// };

// Fetch personalized recipe feed using infinite scroll
export const useFetchFeedRecipes = (userId: string, limit: number = 5) => {
  return useInfiniteQuery({
    queryKey: ["FETCH_FEED_RECIPES", userId], // Query key for caching and invalidating
    queryFn: async ({ pageParam = 1 }) => {
      if (!userId) {
        throw new Error("User ID is required to fetch feed recipes.");
      }

      try {
        const data = await getFeedRecipes(userId, pageParam, limit); // Pass page and limit

        console.log("Fetched feed recipes data:", data); // Log the fetched data

        return data; // Return the fetched data
      } catch (error: any) {
        console.error("Error fetching feed recipes:", error); // Log the error
        toast.error("Failed to fetch feed recipes."); // Show error toast notification
        throw error; // Rethrow the error to let react-query handle it
      }
    },
    enabled: !!userId, // Enable the query only if userId is defined
    getNextPageParam: (lastPage, pages) => {
      const { currentPage, totalPages } = lastPage;

      if (currentPage < totalPages) {
        return currentPage + 1; // Return the next page number if more pages are available
      }

      return undefined; // If there are no more pages, return undefined
    },
    refetchOnWindowFocus: true, // Optionally refetch when window is focused
    initialPageParam: 1, // Set the initial page parameter
  });
};

// Hook for posting a new comment
export const usePostComment = () => {
  const queryClient = useQueryClient(); // React Query cache access

  return useMutation({
    mutationKey: ["POST_COMMENT"], // Unique mutation key
    mutationFn: async ({
      recipeId,
      commentData,
    }: {
      recipeId: string;
      commentData: { authorId: string; content: string };
    }) => {
      console.log(`Posting comment to recipe with id: ${recipeId}`);
      const response = await postComment(recipeId, commentData);

      return response;
    },
    onSuccess: (data, { recipeId }) => {
      toast.success("Comment posted successfully!");
      queryClient.invalidateQueries({ queryKey: ["FETCH_COMMENTS", recipeId] }); // Refetch comments for the recipe
    },
    onError: (error: any) => {
      toast.error(
        error.message || "An error occurred while posting the comment.",
      );
      console.error("Error posting comment:", error);
    },
  });
};

// Hook for fetching comments for a recipe
export const useFetchComments = (recipeId: string) => {
  return useQuery({
    queryKey: ["FETCH_COMMENTS", recipeId], // Cache key for fetching comments
    queryFn: async () => {
      try {
        const data = await getComments(recipeId);

        console.log("Fetched comments:", data);

        return data;
      } catch (error: any) {
        console.error("Error fetching comments:", error);
        toast.error("Failed to fetch comments.");
        throw error;
      }
    },
    enabled: !!recipeId, // Run query only if recipeId exists
  });
};

// Hook for updating a comment
export const useUpdateComment = () => {
  const queryClient = useQueryClient(); // React Query cache access

  return useMutation({
    mutationKey: ["UPDATE_COMMENT"], // Unique mutation key
    mutationFn: async ({
      commentId,
      updatedContent,
    }: {
      commentId: string;
      updatedContent: { content: string };
    }) => {
      console.log(`Updating comment with id: ${commentId}`);
      const response = await updateComment(commentId, updatedContent);

      return response;
    },
    onSuccess: () => {
      toast.success("Comment updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["FETCH_COMMENTS"] }); // Refetch the updated comments
      queryClient.invalidateQueries({ queryKey: ["GET_SINGLE_RECIPE"] }); // Refetch the post
    },
    onError: (error: any) => {
      toast.error(
        error.message || "An error occurred while updating the comment.",
      );
      console.error("Error updating comment:", error);
    },
  });
};

// Hook for deleting a comment
export const useDeleteComment = () => {
  const queryClient = useQueryClient(); // React Query cache access

  return useMutation({
    mutationKey: ["DELETE_COMMENT"], // Unique mutation key
    mutationFn: async ({ commentId }: { commentId: string }) => {
      console.log(`Deleting comment with id: ${commentId}`);
      await deleteComment(commentId);
    },
    onSuccess: (data) => {
      toast.success("Comment deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["FETCH_COMMENTS"] });
    },
    onError: (error: any) => {
      toast.error(
        error.message || "An error occurred while deleting the comment.",
      );
      console.error("Error deleting comment:", error);
    },
  });
};
