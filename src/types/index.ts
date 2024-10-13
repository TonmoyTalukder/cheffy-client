import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface IInput {
  variant?: "flat" | "bordered" | "faded" | "underlined";
  size?: "sm" | "md" | "lg";
  required?: boolean;
  type?: string;
  label: string;
  name: string;
  disabled?: boolean;
}

export const USER_ROLE = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
} as const;

export type TFollowUser = {
  id: string; // User's unique identifier
  name: string; // User's name
  email: string; // User's email
  profilePicture?: string; // Optional profile picture
};

export interface IUser {
  _id: string;
  name: string;
  displayPicture?: string;
  email: string;
  phone: string;
  password?: string;
  role: keyof typeof USER_ROLE;
  status: keyof typeof USER_STATUS;
  bio?: string;
  city: string;
  coverPicture?: string;
  followers?: Array<TFollowUser>;
  following?: Array<TFollowUser>;
  foodHabit: string;
  sex: string;
  topics?: Array<string>;
  isPremium?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
