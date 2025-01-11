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
  _id?: string;
  name: string;
  displayPicture?: string;
  email: string;
  phone: string;
  password?: string;
  role: keyof typeof USER_ROLE;
  status: keyof typeof USER_STATUS;
  bio?: string;
  city?: string;
  coverPicture?: string;
  followers?: Array<TFollowUser>;
  following?: Array<TFollowUser>;
  foodHabit?: string;
  sex?: string;
  diet: string;
  topics?: Array<string>;
  isPremium?: boolean;
  report?: number;
  premiumExpiryDate?: any;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface IRecipe {
  _id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  image: string;
  cookingTime: number;
  ratings: IRating[];
  ratingsCount: number;
  tags: string[];
  votes: IVote[];
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  premium: boolean;
  comments: IComment[];
  diet: string;
  report?: string;
}

export interface IRecipeResponse {
  _id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  image: string;
  cookingTime: number;
  ratings: IRating[];
  ratingsCount: number;
  tags: string[];
  votes: IVote[];
  createdAt: Date;
  updatedAt: Date;
  authorId: IAuthor;
  premium: boolean;
  comments: IComment[];
  diet: string;
  report: string;
  avgRating?: number;
}

export interface IAuthor {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  displayPicture: string;
  isPremium?: boolean;
}

export interface IRating {
  id: string;
  rating: number; // Average rating of the recipe (1-5)
}

export interface IVote {
  id: string;
  upvote: boolean;
  downvote: boolean;
}

export interface Ingredient {
  name: string; // Name of the ingredient
  amount: string; // Amount/measurement of the ingredient (e.g., "1 cup", "200g")
  type?: string; // Optional field to categorize ingredients (e.g., "spice", "vegetable")
}

export interface InstructionStep {
  details: string; // Details of the cooking step
  time: number; // Estimated time for this step in minutes
}

export interface IComment {
  _id: string; // Unique identifier for the comment
  authorId: {
    _id: string;
    name: string; // Author's name
    displayPicture: string; // Author's profile picture
    isPremium: boolean;
  };
  content: string; // Content of the comment
  createdAt: Date; // Timestamp of when the comment was made
  updatedAt?: Date; // Optional timestamp of the last comment update
}
