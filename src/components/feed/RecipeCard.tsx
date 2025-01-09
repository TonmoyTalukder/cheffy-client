// RecipeCard.tsx

import {
  Button,
  Avatar,
  useDisclosure,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Link,
  Divider,
} from "@nextui-org/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { FaShareFromSquare } from "react-icons/fa6";
import { IoDocumentLockOutline } from "react-icons/io5";
import { MdDeleteForever, MdOutlineReportProblem } from "react-icons/md";
import { PiSealCheckFill } from "react-icons/pi";
import clsx from "clsx";

import { useUser } from "@/src/context/user.provider";
import {
  useDeleteRecipe,
  useReportRecipe,
  useVoteRecipe,
} from "@/src/hooks/post.hooks";
import { useGetSingleUser } from "@/src/hooks/user.hooks";

import { RecipeInterface } from "../post/UserRecipePost";
import UpdateRecipeForm from "../post/UpdateRecipeForm";
import PremiumModal from "../modal/PremiumModal";

interface RecipeCardProps {
  recipe: RecipeInterface;
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { user: searchingUser } = useUser();
  const { data: loggedUserData } = useGetSingleUser(searchingUser?._id!);
  const loggedUser = loggedUserData?.data;

  const { mutate: voteRecipe } = useVoteRecipe();
  const deleteRecipeMutation = useDeleteRecipe();
  const recipeOwner = loggedUser?._id === recipe.authorId._id;

  const reportRecipeMutation = useReportRecipe();

  const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(null);
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleReadMore = () => {
    setExpandedRecipe(expandedRecipe === recipe._id ? null : recipe._id);
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (loggedUser && recipe.votes.length > 0) {
      const userVoteData = recipe.votes.find(
        (vote: { id: string | undefined }) => vote.id === loggedUser._id,
      );

      if (userVoteData) {
        setUserVote(userVoteData.upvote ? "upvote" : "downvote");
      }
    }
  }, []);

  const handleVote = (voteType: "upvote" | "downvote") => {
    if (loggedUser?._id) {
      const voteData = {
        id: loggedUser?._id,
        upvote:
          voteType === "upvote" && userVote == "downvote"
            ? true
            : voteType === "upvote" && userVote == null
              ? true
              : false,
        downvote:
          voteType === "downvote" && userVote == "upvote"
            ? true
            : voteType === "downvote" && userVote == null
              ? true
              : false,
      };

      voteRecipe({
        recipeId: recipe._id,
        userId: loggedUser._id,
        voteData,
      });

      setUserVote(voteType === "upvote" ? "upvote" : "downvote");
    }
  };

  const getVoteCounts = () => {
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
  };

  const handleDelete = (id: string, title: string) => {
    if (
      window.confirm(`Are you sure you want to delete the recipe "${title}"?`)
    ) {
      deleteRecipeMutation.mutate(id);
    }
  };

  const handleReport = (id: string, title: string) => {
    if (
      window.confirm(`Are you sure you want to report the recipe "${title}"?`)
    ) {
      reportRecipeMutation.mutate(id);
      console.log("Reported id = ", id);
    }
  };

  const handleShare = () => {
    const recipeUrl = `${window.location.origin}/recipe/${recipe._id}`;

    if (navigator.share) {
      navigator
        .share({
          title: recipe.title,
          text: recipe.description,
          url: recipeUrl,
        })
        .then(() => console.log("Successfully shared"))
        .catch((error) => console.error("Error sharing", error));
    } else {
      navigator.clipboard
        .writeText(recipeUrl)
        .then(() => alert("Link copied to clipboard!"))
        .catch((error) => console.error("Failed to copy text: ", error));
    }
  };

  return (
    <div
      className={clsx(
        "recipe-card border p-4 mb-4 shadow-sm rounded-lg",
        recipe.premium ? "border-amber-500" : "border",
      )}
    >
      <div className="flex items-center mb-3">
        <Avatar
          isBordered
          radius="full"
          size="lg"
          src={recipe.authorId.displayPicture}
          alt={recipe.authorId.name}
        />
        <div className="ml-3">
          {/* <p className="font-semibold">{recipe.authorId.name}</p> */}
          <Link
            href={`${window.location.origin}/profile/${recipe.authorId._id}`}
            color="foreground"
            className="flex justify-between w-full"
          >
            <h4 className="font-bold text-lg flex flex-row">
              {recipe.authorId.name}{" "}
              {recipe.authorId?.isPremium && <PiSealCheckFill />}
            </h4>
          </Link>
          <p className="text-xs text-gray-500">
            {new Date(recipe.createdAt).toLocaleDateString()}
          </p>
        </div>
        {/* {recipe.authorId?.isPremium && <PiSealCheckFill />} */}
        {recipeOwner ? (
          <Button
            startContent={
              <MdDeleteForever className="text-red-500" size={24} />
            }
            size="sm"
            variant="flat"
            onPress={() => handleDelete(recipe._id, recipe.title)}
            className="ml-auto"
          />
        ) : (
          <Button
            startContent={
              <MdOutlineReportProblem className="text-red-500" size={24} />
            }
            size="sm"
            variant="flat"
            onPress={() => handleReport(recipe._id, recipe.title)}
            className="ml-auto"
          />
        )}
      </div>

      {/* Recipe Image */}
      <div className="relative w-full h-56 mb-4">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Recipe Info */}
      <Link
        href={`${window.location.origin}/recipe/${recipe._id}`}
        underline="hover"
        color="foreground"
      >
        <h2 className="text-xl font-bold">{recipe.title}</h2>
      </Link>

      <p className="text-gray-600">
        {recipe.diet === "veg"
          ? "Veg"
          : recipe.diet === "vegan"
            ? "Vegan"
            : "Non Veg"}
      </p>
      <div className="text-gray-500 mt-2">
        {expandedRecipe === recipe._id ? (
          <div dangerouslySetInnerHTML={{ __html: recipe.description }} />
        ) : (
          `${stripHtmlTags(recipe.description).substring(0, 100)}...`
        )}
      </div>

      {/* Premium or Read More Button */}
      {!loggedUser?.isPremium && recipe.premium ? (
        <Button
          startContent={<IoDocumentLockOutline size={18} />}
          onPress={() => setIsModalOpen(true)}
          className="mt-2 bg-amber-400"
          size="sm"
        >
          Premium Recipe
        </Button>
      ) : (
        <Button
          color="primary"
          onPress={toggleReadMore}
          className="mt-2"
          size="sm"
        >
          {expandedRecipe === recipe._id ? "Show Less" : "Read More"}
        </Button>
      )}

      {loggedUser && (
        <PremiumModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={loggedUser}
        />
      )}

      {/* Expanded Content */}
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
              <li key={idx}>{stripHtmlTags(instruction.details)}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Voting and Sharing */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          <Button
            startContent={<BiUpvote className="text-green-500" size={24} />}
            size="sm"
            variant="flat"
            onPress={() => handleVote("upvote")}
          >
            {getVoteCounts().upvoteCount}
          </Button>
          <Button
            startContent={<BiDownvote className="text-red-500" size={24} />}
            size="sm"
            variant="flat"
            onPress={() => handleVote("downvote")}
          >
            {getVoteCounts().downvoteCount}
          </Button>
        </div>
        <div className="flex gap-2">
          {recipeOwner && (
            <Button
              startContent={<FaRegEdit className="text-yellow-500" size={24} />}
              size="sm"
              variant="flat"
              onPress={onOpen}
            />
          )}
          <Button
            startContent={<FaShareFromSquare size={24} />}
            size="sm"
            variant="flat"
            onPress={handleShare}
          />
        </div>
      </div>

      {/* Update Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <UpdateRecipeForm
                  recipe={{
                    ...recipe,
                    authorId: recipe.authorId._id,
                    report: recipe.report.toString(),
                  }}
                  recipeId={recipe._id}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default RecipeCard;
