// user.hooks.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { FieldValues } from "react-hook-form";

import {
  followUser,
  getAllUsers,
  getSingleUser,
  patronSuggestion,
  premiumPayment,
  reportUser,
  updateUser,
} from "../services/UserService";

// Fetch all users
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["GET_ALL_USERS"], // Unique query key for caching
    queryFn: async () => {
      try {
        const data = await getAllUsers(); // Call the service function to fetch all users

        console.log("Users data from hooks =>", data);

        return data;
      } catch (error) {
        toast.error("Failed to fetch users data.");
        throw error; // Ensure react-query handles it as an error
      }
    },
  });
};

// Fetch single user
export const useGetSingleUser = (id: string) => {
  return useQuery({
    queryKey: ["GET_SINGLE_USER", id], // Include the id in the query key for caching
    queryFn: () => {
      try {
        const data = getSingleUser(id); // Pass the id to the service function

        console.log("User data from hooks =>", data);

        return data;
      } catch (error) {
        toast.error("Failed to fetch user data.");
        throw error; // Ensure react-query handles it as an error
      }
    },
    enabled: !!id, // Ensure the query only runs if id is defined
  });
};

// Update user
export const useUpdateUser = (id: string) => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["USER_UPDATE"],
    mutationFn: async (userData: FieldValues) => {
      console.log("Sending user data:", userData); // Log the userData being sent
      const response = await updateUser(id, userData);

      console.log("Response from server:", response); // Log the response from the server

      return response;
    },
    onSuccess: () => {
      toast.success("User updated successfully.");
    },
    onError: (error: { message: any }) => {
      toast.error(error.message);
      console.log(error);
    },
  });
};

export const useUpdateUserDynamicID = () => {
  return useMutation<any, Error, { id: string; userData: FieldValues }>({
    mutationKey: ["USER_UPDATE"],
    mutationFn: async ({ id, userData }) => {
      console.log("Sending user data:", userData); // Log the userData being sent
      const response = await updateUser(id, userData);

      console.log("Response from server:", response); // Log the response from the server

      return response;
    },
    onSuccess: () => {
      toast.success("User updated successfully.");
    },
    onError: (error: { message: any }) => {
      toast.error(error.message);
      console.log(error);
    },
  });
};

// Report user
export const useReportUser = () => {
  return useMutation<any, Error, string>({
    mutationKey: ["USER_REPORT"],
    mutationFn: async (userId: string) => {
      console.log("Reporting user:", userId); // Log the userId being reported
      const response = await reportUser(userId);

      console.log("Response from server:", response); // Log the response from the server

      return response;
    },
    onSuccess: () => {
      toast.success("User reported successfully.");
    },
    onError: (error: { message: any }) => {
      toast.error(error.message || "Error reporting the user.");
      console.log(error);
    },
  });
};

// Follow user
export const useFollowUser = (id: string) => {
  return useMutation({
    mutationKey: ["FOLLOW_USER", id],
    mutationFn: async (targetId: string) => {
      // Accept targetId as a parameter
      console.log(`Following user Id: ${id}`);
      console.log(`Target Id: ${targetId}`);
      const response = await followUser(id, targetId);

      console.log("Response from server:", response);

      return response;
    },
    onSuccess: () => {
      toast.success("User followed successfully.");
    },
    onError: (error: { message: any }) => {
      toast.error(error.message);
      console.log("Error hook =>", error);
    },
  });
};

// Patron suggestion
export const usePatronSuggestion = (id: string) => {
  return useQuery({
    queryKey: ["PATRON_SUGGESTION", id],
    queryFn: async () => {
      try {
        const data = await patronSuggestion(id);

        console.log("Patron data from hooks =>", data);

        return data; // Ensure data is returned
      } catch (error: any) {
        console.error("Error fetching patron suggestions:", error); // Log the error
        toast.error("Error fetching patron suggestions:", error);
        throw error; // Rethrow error for react-query to handle
      }
    },
    enabled: !!id, // Only run if id is defined
  });
};

// Premium payment hook
export const usePremiumPayment = (id: string) => {
  return useMutation({
    mutationKey: ["PREMIUM_PAYMENT", id], // Unique key for this mutation
    mutationFn: async () => {
      console.log(`Initiating premium payment for user Id: ${id}`); // Log the initiation
      const response = await premiumPayment(id); // Call the service to initiate payment

      console.log("Premium payment response from server:", response); // Log the server response

      return response; // Return the response data
    },
    onSuccess: () => {
      toast.success("Premium payment initiated successfully."); // Show success notification
    },
    onError: (error: any) => {
      toast.error(`Failed to initiate premium payment: ${error.message}`); // Show error notification
      console.error("Error initiating premium payment =>", error); // Log the error
    },
  });
};
