// services/PostService.ts
"use server";

import { FieldValues } from "react-hook-form";

import axiosInstance from "@/src/lib/AxiosInstance";
import { IComment, IRecipe } from "@/src/types";

export const createRecipe = async (postData: FieldValues): Promise<IRecipe> => {
  try {
    console.log("axiosInstance : ", axiosInstance);
    const { data } = await axiosInstance.post<IRecipe>(`/recipes`, postData);

    return data;
  } catch (error: any) {
    console.error(
      "Error creating recipe:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to create recipe. Please try again.",
    );
  }
};

export const getRecipe = async () => {
  try {
    const { data } = await axiosInstance.get(`/recipes`);

    if (data.success) {
      console.log("Recipe data => ", data);
    }

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getSingleRecipe = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/recipes/${id}`);

    if (data.success) {
      console.log("Recipe data => ", data);
    }

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteRecipe = async (id: string): Promise<void> => {
  try {
    const { data } = await axiosInstance.delete(`/recipes/${id}`);

    if (data.success) {
      console.log("Recipe deleted successfully");
    }
  } catch (error: any) {
    console.error(
      "Error deleting recipe:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to delete recipe. Please try again.",
    );
  }
};

export const voteRecipe = async (
  recipeId: string,
  userId: string,
  voteData: { id: string; upvote: boolean; downvote: boolean },
): Promise<IRecipe> => {
  try {
    const { data } = await axiosInstance.put<IRecipe>(
      `/recipes/${recipeId}/votes/${userId}`,
      voteData,
    );

    console.log("Vote updated successfully", data);

    return data;
  } catch (error: any) {
    console.error(
      "Error updating vote:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to update vote. Please try again.",
    );
  }
};

export const rateRecipe = async (
  recipeId: string,
  userId: string,
  ratingData: { id: string; rating: number },
): Promise<IRecipe> => {
  try {
    const { data } = await axiosInstance.put<IRecipe>(
      `/recipes/${recipeId}/ratings/${userId}`,
      ratingData,
    );

    console.log("Rating updated successfully", data);

    return data;
  } catch (error: any) {
    console.error(
      "Error updating vote:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to update ratings. Please try again.",
    );
  }
};

export const updateRecipe = async (
  recipeId: string,
  postData: FieldValues,
): Promise<IRecipe> => {
  try {
    console.log("axiosInstance : ", axiosInstance);
    const { data } = await axiosInstance.put<IRecipe>(
      `/recipes/${recipeId}`,
      postData,
    );

    return data;
  } catch (error: any) {
    console.error(
      "Error updating recipe:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to uppdate recipe. Please try again.",
    );
  }
};

// // Fetch personalized feed of ranked recipes
// export const getFeedRecipes = async (userId: string) => {
//   try {
//     const { data } = await axiosInstance.get(`/recipes/feed/${userId}`);

//     if (data.success) {
//       console.log("Feed recipe data => ", data);
//     }

//     return data;
//   } catch (error: any) {
//     throw new Error(
//       error.response?.data?.message || "Failed to fetch feed recipes.",
//     );
//   }
// };

// Fetch personalized feed of ranked recipes with pagination (infinite scroll support)
export const getFeedRecipes = async (
  userId: string,
  page: number,
  limit: number = 5,
) => {
  try {
    const { data } = await axiosInstance.get(`/recipes/feed/${userId}`, {
      params: {
        page,
        limit, // Limit number of recipes per page (default is 10)
      },
    });

    if (data.success) {
      console.log("Feed recipe data => ", data);
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch feed recipes.",
    );
  }
};

// Post a new comment to a recipe
export const postComment = async (
  recipeId: string,
  commentData: { authorId: string; content: string },
): Promise<IComment> => {
  try {
    const { data } = await axiosInstance.post<IComment>(
      `/recipes/${recipeId}/comments`,
      commentData,
    );

    console.log("Comment posted successfully:", data);

    return data;
  } catch (error: any) {
    console.error(
      "Error posting comment:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to post comment. Please try again.",
    );
  }
};

// Get all comments for a specific recipe
export const getComments = async (recipeId: string): Promise<IComment[]> => {
  try {
    const { data } = await axiosInstance.get<IComment[]>(
      `/recipes/${recipeId}/comments`,
    );

    console.log("Comments fetched successfully:", data);

    return data;
  } catch (error: any) {
    console.error(
      "Error fetching comments:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch comments. Please try again.",
    );
  }
};

// Update a specific comment
export const updateComment = async (
  commentId: string,
  updatedContent: { content: string },
): Promise<IComment> => {
  try {
    const { data } = await axiosInstance.put<IComment>(
      `/recipes/comments/${commentId}`,
      updatedContent,
    );

    console.log("Comment updated successfully:", data);

    return data;
  } catch (error: any) {
    console.error(
      "Error updating comment:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to update comment. Please try again.",
    );
  }
};

// Delete a comment by its ID
export const deleteComment = async (commentId: string): Promise<void> => {
  try {
    const { data } = await axiosInstance.delete(
      `/recipes/comments/${commentId}`,
    );

    console.log("Comment deleted successfully", data);
  } catch (error: any) {
    console.error(
      "Error deleting comment:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to delete comment. Please try again.",
    );
  }
};
