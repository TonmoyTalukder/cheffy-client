// services/PostService.ts
"use server";

import { FieldValues } from "react-hook-form";

import axiosInstance from "@/src/lib/AxiosInstance";
import { IRecipe } from "@/src/types";

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
