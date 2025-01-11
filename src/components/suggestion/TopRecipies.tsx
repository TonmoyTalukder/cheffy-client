"use client";

import { useEffect, useState } from "react";
import { Card, Avatar, Tooltip, CardBody, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { useFetchRecipes } from "@/src/hooks/post.hooks";
import { IRecipeResponse } from "@/src/types";
import { useUser } from "@/src/context/user.provider";

import { timeAgo } from "../feed/RecipeCard";

const TopRecipes = () => {
  const [topRecipes, setTopRecipes] = useState<IRecipeResponse[]>([]);
  const { data: recipesData } = useFetchRecipes();
  const { user } = useUser();
  const profileId = user?._id;

  const router = useRouter();

  const handlePushRecipePage = (id: string) => {
    router.push(`/recipe/${id}`); // Navigate to the previous route
  };

  useEffect(() => {
    if (recipesData && recipesData.length > 0) {
      const rankedRecipes = recipesData
        .filter((recipe: IRecipeResponse) => recipe.authorId?._id !== profileId)
        .map((recipe: IRecipeResponse) => ({
          ...recipe,
          avgRating:
            recipe.ratings.reduce((acc, r) => acc + r.rating, 0) /
              recipe.ratings.length || 0,
          votesCount: recipe.votes.length,
        }))
        .sort(
          (a: any, b: any) =>
            b.avgRating - a.avgRating || b.votesCount - a.votesCount,
        )
        .slice(0, 3);

      setTopRecipes(rankedRecipes);
    }
  }, [recipesData]);

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-bold text-center mb-6">Top Recipes</h2>
      <div className="grid grid-cols-1 gap-6">
        {topRecipes.map((recipe) => (
          <Card key={recipe._id} className="bg-white shadow-md">
            <div className="relative">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="h-48 w-full object-cover rounded-t-lg"
              />
              <Tooltip content={`Rating: ${recipe.avgRating?.toFixed(1)} / 5`}>
                <div className="absolute top-2 right-2 bg-yellow-500 text-white font-bold px-2 py-1 rounded-lg">
                  {recipe.avgRating?.toFixed(1)}
                </div>
              </Tooltip>
            </div>
            <CardBody className="p-4">
              <h3 className="text-lg font-bold text-gray-800">
                {recipe.title}
              </h3>
              <div className="flex items-center mt-2">
                <Avatar
                  src={recipe.authorId?.displayPicture || "/default-avatar.png"}
                  size="sm"
                  className="mr-2"
                />
                <p className="text-gray-600 text-sm">
                  {recipe.authorId?.name || "Unknown Author"}
                </p>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Published: {timeAgo(recipe.createdAt)}
              </p>
              <Button
                className="mt-4 hover:text-white hover:bg-blue-500"
                onPress={() => {
                  handlePushRecipePage(recipe._id);
                }}
              >
                View Recipe
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TopRecipes;
