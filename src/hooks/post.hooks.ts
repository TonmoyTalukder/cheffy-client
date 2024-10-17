// post.hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FieldValues } from "react-hook-form";

import {
  createRecipe,
  deleteRecipe,
  getRecipe,
  getSingleRecipe,
  rateRecipe,
  updateRecipe,
  voteRecipe,
} from "../services/PostService";

// Create Recipe Hook
export const useCreatePost = () => {
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
