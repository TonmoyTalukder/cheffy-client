// user.service.ts
"use server";

import { FieldValues } from "react-hook-form";

import axiosInstance from "@/src/lib/AxiosInstance";

export const getSingleUser = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/users/${id}`);

    if (data.success) {
      console.log("user data => ", data);
    }

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updateUser = async (id: string, userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.put(`/users/${id}`, userData);


    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const followUser = async (id: string, targetId: string) => {
  try {
    const { data } = await axiosInstance.put(`/users/${id}/follow/${targetId}`);

    return data;
  } catch (error: any) {
    console.log("error => ", error);
    throw new Error(error);
  }
};

// export const patronSuggestion = async (id: string) => {
//   try {
//     const { data } = await axiosInstance.get(`/users/${id}/patron-suggestion`);

//     if (data.success) {
//       console.log("patron Suggestion data => ", data);
//     }

//     return data;
//   } catch (error: any) {
//     throw new Error(error);
//   }
// };


export const patronSuggestion = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/users/users/${id}/unfollowed`);

    if (data.success) {
      console.log("user data => ", data);
    }

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
