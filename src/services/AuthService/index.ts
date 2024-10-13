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
    throw new Error(error);
    console.log("error: ", error);
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
    throw new Error(error);
  }
};

export const logout = () => {
  cookies().delete("accessToken");
  cookies().delete("refreshToken");
};

export const getCurrentUser = async () => {
  const accessToken = cookies().get("accessToken")?.value;

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
    };

    return userData;
  }

  return decodedToken;
};
