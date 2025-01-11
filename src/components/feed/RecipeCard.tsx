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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaRegClock, FaRegComment, FaRegEdit } from "react-icons/fa";
import { IoArrowDown, IoDocumentLockOutline } from "react-icons/io5";
import { MdDeleteForever, MdOutlineReportProblem } from "react-icons/md";
import { PiSealCheckFill, PiShareDuotone } from "react-icons/pi";
import clsx from "clsx";
import { BsThreeDots } from "react-icons/bs";
import { IoMdArrowUp } from "react-icons/io";
import { useRouter } from "next/navigation";

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

export function timeAgo(date: Date | string): string {
  // Ensure `date` is a Date object
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  // Check if `date` is still invalid after conversion
  if (isNaN(date.getTime())) {
    throw new TypeError("Invalid date provided.");
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, "seconds");
  } else if (diffInSeconds < 3600) {
    const diffInMinutes = Math.floor(diffInSeconds / 60);

    return rtf.format(-diffInMinutes, "minutes");
  } else if (diffInSeconds < 86400) {
    const diffInHours = Math.floor(diffInSeconds / 3600);

    return rtf.format(-diffInHours, "hours");
  } else if (diffInSeconds < 172800) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
}

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

  const router = useRouter();

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

  const handlePushRecipePage = (id: string) => {
    router.push(`/recipe/${id}`); // Navigate to the previous route
  };

  console.log("Recipe: ", recipe);

  return (
    <div
      className={clsx(
        "w-full shadow-lg transition-transform transform hover:scale-105 rounded-lg overflow-hidden my-4 border p-4 mb-4 shadow-sm rounded-lg text-left",
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
            {/* {new Date(recipe.createdAt).toLocaleDateString()} */}
            {timeAgo(recipe.createdAt)}
          </p>
        </div>

        {recipeOwner ? (
          <Dropdown className="ml-auto">
            <DropdownTrigger>
              <Button
                size="sm"
                radius="full"
                isIconOnly
                className="bg-transparent text-gray-500 font-bold ml-auto"
              >
                <BsThreeDots />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions" variant="faded">
              <DropdownItem key="edit" onPress={onOpen}>
                <span className="flex flex-row items-center gap-1 hover:text-blue-500">
                  <FaRegEdit className="hover:text-blue-500" size={18} />
                  Edit
                </span>
              </DropdownItem>
              <DropdownItem
                key="delete"
                onPress={() => handleDelete(recipe._id, recipe.title)}
              >
                <span className="flex flex-row items-center gap-1 hover:text-red-500">
                  <MdDeleteForever className="hover:text-red-500" size={18} />
                  Delete
                </span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Dropdown className="ml-auto">
            <DropdownTrigger>
              <Button
                size="sm"
                radius="full"
                isIconOnly
                className="bg-transparent text-gray-500 font-bold ml-auto"
                onPress={() => setIsModalOpen(true)}
              >
                <BsThreeDots />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions" variant="faded">
              <DropdownItem
                key="report"
                onPress={() => handleReport(recipe._id, recipe.title)}
              >
                <span className="flex flex-row items-center gap-1 hover:text-red-500">
                  <MdOutlineReportProblem
                    className="hover:text-red-500"
                    size={18}
                  />
                  Report
                </span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
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

      <div className="flex flex-row justify-start items-start gap-4">
        <p className="text-gray-600">
          {recipe.diet === "veg" ? (
            <span className="text-lime-500">Veg</span>
          ) : recipe.diet === "vegan" ? (
            <span className="text-green-500">Vegan</span>
          ) : (
            <span className="text-red-500">Non Veg</span>
          )}
        </p>
        <p className="text-gray-600 flex flex-row items-center gap-1">
          <FaRegClock /> {recipe.cookingTime} mins
        </p>
      </div>
      <div className="text-gray-500 mt-2 dark:text-gray-50">
        {expandedRecipe === recipe._id ? (
          <div dangerouslySetInnerHTML={{ __html: recipe.description }} />
        ) : (
          `${stripHtmlTags(recipe.description).substring(0, 100)}${
            stripHtmlTags(recipe.description).length > 100 ? "..." : ""
          }`
        )}
        {(!recipe.premium ||
          loggedUser?.isPremium ||
          loggedUser?._id === recipe.authorId?._id) &&
          expandedRecipe !== recipe._id && (
            <span
              onClick={toggleReadMore}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") toggleReadMore();
              }}
              role="button"
              tabIndex={0}
              className="font-bold"
            >
              &nbsp;Read More
            </span>
          )}
      </div>

      {/* Premium or Read More Button */}
      {!loggedUser?.isPremium &&
        recipe.premium &&
        loggedUser?._id !== recipe.authorId?._id && (
          <Button
            startContent={<IoDocumentLockOutline size={18} />}
            onPress={() => setIsModalOpen(true)}
            className="mt-2 bg-amber-400"
            size="sm"
          >
            Premium Recipe
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
          <h1 className="text-gray-600 font-bold">Ingredients:</h1>
          <ul className="list-disc list-inside ml-2">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx}>
                {ingredient.name} - {ingredient.amount}
              </li>
            ))}
          </ul>
          <h1 className="text-gray-600 font-bold mt-2">Instructions:</h1>
          <ol className="list-decimal list-inside ml-2">
            {recipe.instructions.map((instruction, idx) => (
              <li key={idx}>{stripHtmlTags(instruction.details)}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Voting and Sharing */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-1 items-center">
          <Button
            startContent={<IoMdArrowUp className="text-green-500" size={24} />}
            size="sm"
            variant="flat"
            className="bg-transparent"
            onPress={() => handleVote("upvote")}
          >
            {getVoteCounts().upvoteCount}
          </Button>
          <Button
            startContent={<IoArrowDown className="text-red-500" size={24} />}
            size="sm"
            variant="flat"
            className="bg-transparent"
            onPress={() => handleVote("downvote")}
          >
            {getVoteCounts().downvoteCount}
          </Button>
          <Button
            startContent={<FaRegComment className="text-blue-500" size={22} />}
            size="sm"
            variant="flat"
            className="bg-transparent"
            onPress={() => {
              handlePushRecipePage(recipe._id);
            }}
          >
            {recipe.comments.length}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            startContent={<PiShareDuotone size={24} />}
            size="sm"
            variant="flat"
            className="bg-transparent"
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
