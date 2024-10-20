// user.service.ts
"use server";

import { FieldValues } from "react-hook-form";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

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

    if (data.success) {
      // Retrieve the current access token from cookies
      const currentAccessToken = cookies().get("accessToken")?.value;
      const currentRefreshToken = cookies().get("refreshToken")?.value;

      if (currentAccessToken) {
        // Decode the access token to get the user data
        const decodedToken: any = jwtDecode(currentAccessToken);

        // Manually update the decoded token's user data with the new data
        const updatedUser = {
          ...decodedToken,
          ...userData, // Merge the updated user fields from userData
        };

        cookies().set("accessToken", currentAccessToken);

        return updatedUser;
      }

      if (currentRefreshToken) {
        // Decode the access token to get the user data
        const decodedToken: any = jwtDecode(currentRefreshToken);

        // Manually update the decoded token's user data with the new data
        const updatedUser = {
          ...decodedToken,
          ...userData, // Merge the updated user fields from userData
        };

        cookies().set("refreshToken", currentRefreshToken);

        return updatedUser;
      }
    }

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

export const patronSuggestion = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/users/users/${id}/unfollowed`);

    if (data.success) {
      console.log("patronSuggestion data => ", data);
    }

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const premiumPayment = async (id: string) => {
  try {
    const { data } = await axiosInstance.post(
      `/payment/initiate-payment/${id}`,
    );

    if (data.success) {
      console.log("Premium Payment data =>", data);
    }

    return data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message); // Throw Axios-specific error message
    } else {
      throw new Error("Failed to initiate premium payment"); // Default error message
    }
  }
};
