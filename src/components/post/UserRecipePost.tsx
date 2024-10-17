import {
  Button,
  Card,
  Divider,
  CardBody,
  CardFooter,
  CardHeader,
  Avatar,
} from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { FaShareFromSquare } from "react-icons/fa6";
import { PiSealCheckFill } from "react-icons/pi";
import { FaRegEdit } from "react-icons/fa";
import { IoDocumentLockOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { Link } from "@nextui-org/react";

import { useUser } from "@/src/context/user.provider";
import { useDeleteRecipe, useFetchRecipes } from "@/src/hooks/post.hooks";
import {
  IComment,
  Ingredient,
  InstructionStep,
  IRating,
  IVote,
} from "@/src/types";

export interface IAuthor {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  displayPicture: string;
  isPremium?: boolean;
}

export interface RecipeInterface {
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
  diet?: string;
}

interface UserRecipePostProps {
  profileId: string;
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

const UserRecipePost: React.FC<UserRecipePostProps> = ({ profileId }) => {
  const {
    data: recipeData,
    isLoading: recipeLoading,
    error: recipeError,
  } = useFetchRecipes();
  const { user: loogedUser } = useUser();

  console.log("Looged User => ", loogedUser);

  const deleteRecipeMutation = useDeleteRecipe();
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  const recipeOwner = loogedUser?._id === profileId;

  // Sort the recipes by creation date (newest first)
  const sortedRecipes =
    recipeData
      ?.slice()
      .sort(
        (a: RecipeInterface, b: RecipeInterface) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ) || [];

  // Filter recipes where profileId matches recipe.authorId._id
  const filteredRecipes = sortedRecipes.filter(
    (recipe: RecipeInterface) => recipe.authorId._id === profileId,
  );

  function getVoteCounts(recipe: RecipeInterface) {
    let upvoteCount = 0;
    let downvoteCount = 0;

    recipe.votes.forEach((vote) => {
      if (vote.upvote) {
        upvoteCount++;
      }
      if (vote.downvote) {
        downvoteCount++;
      }
    });

    return { upvoteCount, downvoteCount };
  }

  const toggleReadMore = (recipeId: string) => {
    setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId);
  };

  const handleShare = (recipe: RecipeInterface) => {
    const recipeUrl = `${window.location.origin}/recipe/${recipe._id}`;

    if (navigator.share) {
      // Web Share API for mobile or supported browsers
      navigator
        .share({
          title: recipe.title,
          text: recipe.description,
          url: recipeUrl,
        })
        .then(() => console.log("Successfully shared"))
        .catch((error) => console.error("Error sharing", error));
    } else {
      // Fallback to clipboard copy for unsupported browsers
      navigator.clipboard
        .writeText(recipeUrl)
        .then(() => alert("Link copied to clipboard!"))
        .catch((error) => console.error("Failed to copy text: ", error));
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (
      window.confirm(`Are you sure you want to delete the recipe "${title}"?`)
    ) {
      deleteRecipeMutation.mutate(id); // Trigger the mutation to delete the recipe
    }
  };

  if (recipeLoading) return <div>Loading...</div>;
  if (recipeError) return <div>Error: {recipeError.message}</div>;

  // console.log("filteredRecipes => ", filteredRecipes);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {filteredRecipes.length === 0 && (
        <p className="text-gray-500 mt-2">No posts yet.</p>
      )}
      {filteredRecipes.map((recipe: RecipeInterface) => (
        <Card
          key={recipe._id}
          className="w-full max-w-md shadow-lg transition-transform transform hover:scale-105 rounded-lg overflow-hidden my-4"
        >
          {/* Card Header with Author Info */}

          <CardHeader className="flex justify-between p-4">
            <Link
              href={`${window.location.origin}/recipe/${recipe._id}`}
              color="foreground"
              className="flex justify-between w-full"
            >
              <div className="flex items-center gap-4 w-max">
                <Avatar
                  isBordered
                  radius="full"
                  size="lg"
                  src={recipe.authorId.displayPicture}
                  alt="Author Image"
                />
                <div>
                  <h4 className="font-bold text-lg flex flex-row">
                    {recipe.authorId.name}{" "}
                    {recipe.authorId?.isPremium && <PiSealCheckFill />}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {new Date(recipe.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
            {/* Place the button outside of the link */}
            {recipeOwner ? (
              <Button
                startContent={
                  <MdDeleteForever className="text-red-500" size={24} />
                }
                size="sm"
                variant="flat"
                onPress={() => handleDelete(recipe._id, recipe.title)}
              />
            ) : (
              <Button
                className="bg-transparent text-foreground border-default-200"
                color="primary"
                radius="full"
                size="sm"
                variant="bordered"
              >
                Follow
              </Button>
            )}
          </CardHeader>

          {/* Recipe Image with fixed height and cropping */}
          <div className="relative w-full h-56 overflow-hidden">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              style={{ objectFit: "cover" }}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Card Body with Recipe Info */}
          <CardBody className="px-4 py-2">
            <Link
              href={`${window.location.origin}/recipe/${recipe._id}`}
              underline="hover"
              color="foreground"
            >
              <h1 className="font-bold text-xl">{recipe.title}</h1>{" "}
            </Link>
            {recipe.diet === "veg" ? (
              <p className="text-green-600">Veg</p>
            ) : recipe.diet === "vegan" ? (
              <p className="text-lime-600">Vegan</p>
            ) : (
              <p className="text-red-500">Non Veg</p>
            )}
            <div className="text-gray-500 mt-2">
              {expandedRecipe === recipe._id ? (
                <div
                  //   className="text-gray-500"
                  style={{ color: "gray" }}
                  dangerouslySetInnerHTML={{ __html: recipe.description }}
                />
              ) : (
                `${stripHtmlTags(recipe.description).substring(0, 100)}...`
              )}
            </div>
            {!loogedUser?.isPremium && recipe.premium ? (
              <Button
                startContent={<IoDocumentLockOutline size={18} />}
                onPress={() => console.log("Premium Content")}
                className="mt-2 bg-amber-400"
                size="sm"
              >
                {/* {expandedRecipe === recipe._id ? "Show Less" : "Read More"} */}
                Premium Recipe
              </Button>
            ) : (
              <Button
                color="primary"
                onPress={() => toggleReadMore(recipe._id)}
                className="mt-2"
                size="sm"
              >
                {expandedRecipe === recipe._id ? "Show Less" : "Read More"}
              </Button>
            )}
            {expandedRecipe === recipe._id && (
              <div className="mt-4">
                <Divider />
                <h1 className="text-gray-600 mt-2">
                  Cooking Time: {recipe.cookingTime} mins
                </h1>
                <h1 className="text-gray-600">Ingredients:</h1>
                <ul className="list-disc list-inside">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <li key={idx}>
                      {ingredient.name} - {ingredient.amount}
                    </li>
                  ))}
                </ul>
                <h1 className="text-gray-600 mt-2">Instructions:</h1>
                <ol className="list-decimal list-inside">
                  {recipe.instructions.map((instruction, idx) => (
                    <li key={idx}>{instruction.details}</li>
                  ))}
                </ol>
              </div>
            )}
          </CardBody>

          {/* Card Footer with Upvotes, Downvotes and Date */}
          <CardFooter className="flex justify-between p-4">
            <div className="flex items-center gap-4">
              <Button
                startContent={<BiUpvote className="text-green-500" size={24} />}
                size="sm"
                variant="flat"
              >
                {getVoteCounts(recipe).upvoteCount}
              </Button>
              <Button
                startContent={<BiDownvote className="text-red-500" size={24} />}
                size="sm"
                variant="flat"
              >
                {getVoteCounts(recipe).downvoteCount}
              </Button>
            </div>
            {/* <p className="text-gray-400 text-sm">
                {new Date(recipe.createdAt).toLocaleDateString()}
              </p> */}
            <div className="flex items-center gap-4">
              {recipeOwner && (
                <Button
                  startContent={
                    <FaRegEdit className="text-yellow-500" size={24} />
                  }
                  size="sm"
                  variant="flat"
                />
              )}
              <Button
                startContent={
                  <FaShareFromSquare className="text-sky-500" size={24} />
                }
                size="sm"
                variant="flat"
                onPress={() => handleShare(recipe)}
              />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default UserRecipePost;
