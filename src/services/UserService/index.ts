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

    // if (data.success) {
    // console.log("user data => ", data);

    // // Reset cookies after successful user update
    // cookies().delete("accessToken");
    // cookies().delete("refreshToken");

    // if (data?.data?.accessToken) {
    //   cookies().set("accessToken", data.data.accessToken);
    // }
    // if (data?.data?.refreshToken) {
    //   cookies().set("refreshToken", data.data.refreshToken);
    // }
    // }

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
