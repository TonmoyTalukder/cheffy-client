"use server";

import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";
import { jwtDecode } from "jwt-decode";

import axiosInstance from "@/src/lib/AxiosInstance";

export const registerUser = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/auth/register", userData);

    if (data.success) {
      cookies().set("accessToken", data?.data?.accessToken);
      cookies().set("refreshToken", data?.data?.refreshToken);
    }

    return data;
  } catch (error: any) {
    console.log("error: ", error);
    throw new Error(error);
  }
};
export const loginUser = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", userData);

    console.log("axiosInstance => ", axiosInstance);

    if (data.success) {
      cookies().set("accessToken", data?.data?.accessToken);
      cookies().set("refreshToken", data?.data?.refreshToken);
    }

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const forgetPassword = async (email: string) => {
  try {
    const { data } = await axiosInstance.post("/auth/forget-password", {
      email,
    });

    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
      "An error occurred during password recovery.",
    );
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const { data } = await axiosInstance.post(`/auth/reset-password/${token}`, {
      token,
      newPassword,
    });

    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "An error occurred during password reset.",
    );
  }
};

export const changePassword = async (passwordData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post(
      "/auth/change-password",
      passwordData,
    );

    // if (data.success) {
    //   cookies().delete("accessToken");
    //   cookies().delete("refreshToken");
    //   cookies().set("accessToken", data?.data?.accessToken);
    //   cookies().set("refreshToken", data?.data?.refreshToken);
    // }

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const logout = () => {
  const allCookies = cookies(); // Get all cookies

  cookies().delete("accessToken");
  cookies().delete("refreshToken");

  Object.keys(allCookies).forEach((cookieName) => {
    cookies().delete(cookieName); // Delete each cookie
  });
};

export const getCurrentUser = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  const refreshToken = cookies().get("refreshToken")?.value;

  let decodedToken = null;

  if (accessToken) {
    decodedToken = await jwtDecode(accessToken);

    const userData = {
      _id: decodedToken._id,
      name: decodedToken.name,
      displayPicture: decodedToken.displayPicture,
      email: decodedToken.email,
      phone: decodedToken.phone,
      role: decodedToken.role,
      status: decodedToken.status,
      bio: decodedToken.bio,
      city: decodedToken.city,
      coverPicture: decodedToken.coverPicture,
      followers: decodedToken.followers,
      following: decodedToken.following,
      foodHabit: decodedToken.foodHabit,
      sex: decodedToken.sex,
      topics: decodedToken.topics,
      isPremium: decodedToken.isPremium,
      reported: decodedToken.reported,
    };

    return userData;
  } else if (refreshToken) {
    decodedToken = await jwtDecode(refreshToken);

    const userData = {
      _id: decodedToken._id,
      name: decodedToken.name,
      displayPicture: decodedToken.displayPicture,
      email: decodedToken.email,
      phone: decodedToken.phone,
      role: decodedToken.role,
      status: decodedToken.status,
      bio: decodedToken.bio,
      city: decodedToken.city,
      coverPicture: decodedToken.coverPicture,
      followers: decodedToken.followers,
      following: decodedToken.following,
      foodHabit: decodedToken.foodHabit,
      sex: decodedToken.sex,
      topics: decodedToken.topics,
      isPremium: decodedToken.isPremium,
    };

    return userData;
  }

  return decodedToken;
};
