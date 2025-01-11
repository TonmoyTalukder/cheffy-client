"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Divider,
  Textarea,
  Snippet,
  Modal,
  ModalBody,
  ModalFooter,
  ModalContent,
  useDisclosure,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useState, useEffect, useRef } from "react";
import { FaRegClock, FaRegEdit } from "react-icons/fa";
import { IoArrowDown, IoDocumentLockOutline } from "react-icons/io5";
import Image from "next/image";
import {
  MdClear,
  MdDeleteForever,
  MdEdit,
  MdOutlineReportProblem,
} from "react-icons/md";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { PiPrinterFill, PiShareDuotone } from "react-icons/pi";
import { useReactToPrint } from "react-to-print";
import { IoMdArrowUp } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import Link from "next/link";

import {
  useDeleteComment,
  useDeleteRecipe,
  useFetchComments,
  useGetSingleRecipe,
  usePostComment,
  useRateRecipe,
  useReportRecipe,
  useUpdateComment,
  useVoteRecipe,
} from "@/src/hooks/post.hooks";
import { useUser } from "@/src/context/user.provider";
import { Ingredient, InstructionStep, IRating, IVote } from "@/src/types";
import UpdateRecipeForm from "@/src/components/post/UpdateRecipeForm";
import { useGetSingleUser } from "@/src/hooks/user.hooks";

import { timeAgo } from "../feed/RecipeCard";

interface IProps {
  params: {
    recipeId: string;
  };
}

const SingleRecipe = ({ params: { recipeId } }: IProps) => {
  const {
    data: recipeData,
    isLoading: recipeLoading,
    error: recipeError,
  } = useGetSingleRecipe(recipeId);
  const deleteRecipeMutation = useDeleteRecipe();
  const { mutate: voteRecipe } = useVoteRecipe();
  const { mutate: rateRecipe } = useRateRecipe();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { user: searchingUser } = useUser();
  const { data: loggedUserData } = useGetSingleUser(searchingUser?._id!);
  const loggedUser = loggedUserData?.data;

  const reportRecipeMutation = useReportRecipe();

  const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null); // Track the logged-in user's rating
  const [averageRating, setAverageRating] = useState<number>(0); // Calculated average rating
  const [ratingCount, setRatingCount] = useState<number>(0); // Number of ratings
  const [ratingData, setRatingData] = useState({
    id: loggedUser?._id,
    rating: userRating,
  });
  const [voteData, setVoteData] = useState({
    id: loggedUser?._id,
    upvote: false,
    downvote: false,
  });

  const isRecipeOwner = loggedUser?._id === recipeData?.authorId._id;
  const isPremiumContent =
    recipeData?.premium && !loggedUser?.isPremium && !isRecipeOwner;

  // Calculate upvotes and downvotes based on the votes array
  const calculateVotes = (votes: IVote[]) => {
    let upvoteCount = 0;
    let downvoteCount = 0;

    votes.forEach((vote) => {
      if (vote.upvote) upvoteCount++;
      if (vote.downvote) downvoteCount++;
    });

    const clacUpvote = upvoteCount;
    const clacDownvote = downvoteCount;

    return { clacUpvote, clacDownvote };
  };

  // const { clacUpvote: initialUpvotes, clacDownvote: initialDownvotes } =
  //   calculateVotes(recipeData?.votes || []);

  // console.log("upvoteCount initial: => ", initialUpvotes);

  const [upvoteCount, setUpvoteCount] = useState(0);
  const [downvoteCount, setDownvoteCount] = useState(0);

  useEffect(() => {
    const { clacUpvote: initialUpvotes, clacDownvote: initialDownvotes } =
      calculateVotes(recipeData?.votes || []);

    setUpvoteCount(initialUpvotes);
    setDownvoteCount(initialDownvotes);
  }, [recipeData]);

  // console.log("recipeData?.votes: => ", recipeData?.votes);

  // Calculate the average rating based on the `ratings` array
  const calculateAverageRating = (ratings: IRating[]) => {
    if (!ratings || ratings.length === 0)
      return { averageRating: 0, ratingCount: 0 };

    const totalRating = ratings.reduce((acc, curr) => acc + curr.rating, 0);

    return {
      averageRating: totalRating / ratings.length,
      ratingCount: ratings.length,
    };
  };

  useEffect(() => {
    if (loggedUser && recipeData?.votes?.length > 0) {
      const userVoteData = recipeData.votes.find(
        (vote: { id: string | undefined }) => vote.id === loggedUser._id,
      );

      if (userVoteData) {
        setUserVote(userVoteData.upvote ? "upvote" : "downvote");
        userVoteData.upvote
          ? setVoteData({
              id: loggedUser?._id,
              upvote: true,
              downvote: false,
            })
          : setVoteData({
              id: loggedUser?._id,
              upvote: false,
              downvote: true,
            });
      }
    }

    // Calculate the average rating and find the user's rating
    const { averageRating, ratingCount } = calculateAverageRating(
      recipeData?.ratings || [],
    );

    setAverageRating(averageRating);
    setRatingCount(ratingCount);

    const userRatingData = recipeData?.ratings.find(
      (rating: IRating) => rating.id === loggedUser?._id,
    );

    if (userRatingData) {
      setUserRating(userRatingData.rating);
    }
  }, [loggedUser, recipeData]);

  // Handle upvote
  const handleUpvote = () => {
    if (userVote === "upvote") {
      // Undo upvote
      setUserVote(null);
      setUpvoteCount(upvoteCount - 1);
      setVoteData({
        id: loggedUser?._id,
        upvote: false,
        downvote: false,
      });
    } else if (userVote === "downvote") {
      // Switch from downvote to upvote
      setUserVote("upvote");
      setUpvoteCount(upvoteCount + 1);
      setDownvoteCount(downvoteCount - 1);
      setVoteData({
        id: loggedUser?._id,
        upvote: true,
        downvote: false,
      });
    } else {
      // Normal upvote
      setUserVote("upvote");
      setUpvoteCount(upvoteCount + 1);
      setVoteData({
        id: loggedUser?._id,
        upvote: true,
        downvote: false,
      });
    }
    // if (loggedUser?._id) {
    //   console.log("Vote Data ===> ", voteData);
    //   voteRecipe({ recipeId, userId: loggedUser?._id, voteData });
    // }
  };

  // Handle downvote
  const handleDownvote = () => {
    if (userVote === "downvote") {
      // Undo downvote
      setUserVote(null);
      setDownvoteCount(downvoteCount - 1);
      setVoteData({
        id: loggedUser!._id,
        upvote: false,
        downvote: false,
      });
    } else if (userVote === "upvote") {
      // Switch from upvote to downvote
      setUserVote("downvote");
      setUpvoteCount(upvoteCount - 1);
      setDownvoteCount(downvoteCount + 1);
      setVoteData({
        id: loggedUser?._id,
        upvote: false,
        downvote: true,
      });
    } else {
      // Normal downvote
      setUserVote("downvote");
      setDownvoteCount(downvoteCount + 1);
      setVoteData({
        id: loggedUser!._id,
        upvote: false,
        downvote: true,
      });
    }

    // if (loggedUser?._id) {
    //   console.log("Vote Data ===> ", voteData);
    //   voteRecipe({ recipeId, userId: loggedUser?._id, voteData });
    // }
  };

  useEffect(() => {
    // console.log("userVote => ", userVote);
    // console.log("UpvoteCount  => ", upvoteCount);
    // console.log("DownvoteCount  => ", downvoteCount);
    // console.log("Vote Data => ", voteData);

    // console.log("User Rating => ", userRating);
    // console.log("Rating Count => ", ratingCount);
    // console.log("Avg Rating => ", averageRating);
    // console.log("Rating Data => ", ratingData);

    if (loggedUser?._id && (voteData.downvote || voteData.upvote)) {
      console.log("Vote Data ===> ", voteData);
      voteRecipe({
        recipeId,
        userId: loggedUser?._id,
        voteData: {
          ...voteData,
          id: loggedUser._id, // Set `id` explicitly to ensure it's a string
        },
      });
    }
  }, [userVote, userRating]);

  const handleDelete = (id: string, title: string) => {
    if (
      window.confirm(`Are you sure you want to delete the recipe "${title}"?`)
    ) {
      deleteRecipeMutation.mutate(id); // Trigger the mutation to delete the recipe
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
    const recipeUrl = `${window.location.origin}/recipe/${recipeData._id}`;

    // navigator.clipboard.writeText(recipeUrl).then(() => alert("Link copied!"));

    if (navigator.share) {
      // Web Share API for mobile or supported browsers
      navigator
        .share({
          title: recipeData.title,
          text: recipeData.description,
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

  const handlePremiumAccess = () => {
    console.log("Premium content");
  };

  // Handle rating update
  const handleRatingUpdate = (newRating: number) => {
    setUserRating(newRating);

    let updatedRatings;

    // Check if the user has already rated before
    const existingRating = recipeData.ratings.find(
      (rating: IRating) => rating.id === loggedUser?._id,
    );

    if (existingRating) {
      // Update the user's existing rating
      updatedRatings = recipeData.ratings.map((rating: IRating) =>
        rating.id === loggedUser?._id
          ? { ...rating, rating: newRating }
          : rating,
      );
    } else {
      // Add new rating for the user
      updatedRatings = [
        ...recipeData.ratings,
        { id: loggedUser?._id, rating: newRating },
      ];
    }

    // Update rating count and calculate new average
    setRatingCount(updatedRatings.length);
    const { averageRating } = calculateAverageRating(updatedRatings);

    setAverageRating(averageRating);

    setRatingData({
      id: loggedUser?._id,
      rating: newRating,
    });

    if (loggedUser?._id) {
      rateRecipe({
        recipeId,
        userId: loggedUser?._id,
        ratingData: {
          id: loggedUser._id,
          rating: newRating,
        },
      });
    }
  };

  const renderRatingStars = (currentRating: number) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          onClick={() => handleRatingUpdate(i)}
          className="focus:outline-none"
        >
          {i <= currentRating ? (
            <AiFillStar className="text-yellow-500" size={20} />
          ) : (
            <AiOutlineStar className="text-gray-400" size={20} />
          )}
        </button>,
      );
    }

    return stars;
  };

  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef });

  //! Comment
  const [content, setContent] = useState<string>("");
  const { mutate: postComment } = usePostComment();
  const { data: commentsData } = useFetchComments(recipeId);
  const { mutate: updateComment } = useUpdateComment();
  const { mutate: deleteComment } = useDeleteComment();

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");

  const handleAddComment = () => {
    if (content.trim() && loggedUser?._id) {
      postComment({
        recipeId,
        commentData: {
          authorId: loggedUser._id,
          content,
        },
      });
      setContent(""); // Clear form after submission
      console.log({
        authorId: loggedUser._id,
        content,
      });
    }
  };

  const handleCommentEdit = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditedContent(currentContent);
  };

  const handleCommentSaveEdit = (commentId: string) => {
    if (editedContent.trim()) {
      updateComment({
        commentId,
        updatedContent: { content: editedContent },
      });
    }

    console.log("Saving edited comment:", commentId, editedContent);
    setEditingCommentId(null);
    setEditedContent("");
  };

  const handleCommentDelete = (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      // Implement delete functionality here
      deleteComment({ commentId });
      console.log("Deleting comment:", commentId);
    }
  };

  console.log("CommentsData => ", commentsData);

  if (recipeLoading)
    return (
      <div
        style={{
          marginTop: "10%",
        }}
        className="flex flex-col justify-center items-center"
      >
        <Spinner color="primary" size="lg" className="my-8" />
        {/* <LoadingRecipeCard /> */}
      </div>
    );
  if (recipeError) return <div>Error: {recipeError.message}</div>;

  return (
    <div
      style={{
        // marginTop: "5%",
        overflowX: "hidden",
      }}
      className="flex flex-col items-center justify-center w-full p-4 mt-0 gap-2"
    >
      <Card
        ref={contentRef}
        className="w-full shadow-lg rounded-lg overflow-hidden"
      >
        <CardHeader className="flex justify-between p-4">
          <div className="flex items-center gap-4">
            <Avatar
              isBordered
              radius="full"
              size="lg"
              src={recipeData.authorId.displayPicture}
              alt="Author Image"
            />
            <div>
              <Link href={`/profile/${recipeData.authorId._id}`}>
                <h4 className="font-bold text-lg hover:underline">
                  {recipeData.authorId.name}
                </h4>
              </Link>
              <p className="text-gray-400 text-sm">
                {/* {new Date(recipeData.createdAt).toLocaleDateString()} */}
                {timeAgo(recipeData.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isRecipeOwner ? (
              <div className="flex flex-row gap-2">
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
                      onPress={() =>
                        handleDelete(recipeData._id, recipeData.title)
                      }
                    >
                      <span className="flex flex-row items-center gap-1 hover:text-red-500">
                        <MdDeleteForever
                          className="hover:text-red-500"
                          size={18}
                        />
                        Delete
                      </span>
                    </DropdownItem>
                    <DropdownItem key="share" onPress={handleShare}>
                      <span className="flex flex-row items-center gap-1 hover:text-blue-500">
                        <PiShareDuotone
                          className="hover:text-blue-500"
                          size={18}
                        />
                        Share
                      </span>
                    </DropdownItem>
                    <DropdownItem key="print" onPress={() => handlePrint()}>
                      <span className="flex flex-row items-center gap-1 hover:text-blue-500">
                        <PiPrinterFill
                          className="hover:text-blue-500"
                          size={18}
                        />
                        Print
                      </span>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            ) : (
              <div className="flex flex-row gap-2">
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
                    <DropdownItem key="share" onPress={handleShare}>
                      <span className="flex flex-row items-center gap-1 hover:text-blue-500">
                        <PiShareDuotone
                          className="hover:text-blue-500"
                          size={18}
                        />
                        Share
                      </span>
                    </DropdownItem>
                    <DropdownItem
                      key="report"
                      onPress={() =>
                        handleReport(recipeData._id, recipeData.title)
                      }
                    >
                      <span className="flex flex-row items-center gap-1 hover:text-red-500">
                        <MdOutlineReportProblem
                          className="hover:text-red-500"
                          size={18}
                        />
                        Report
                      </span>
                    </DropdownItem>
                    <DropdownItem key="print" onPress={() => handlePrint()}>
                      <span className="flex flex-row items-center gap-1 hover:text-blue-500">
                        <PiPrinterFill
                          className="hover:text-blue-500"
                          size={18}
                        />
                        Print
                      </span>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            )}
          </div>
        </CardHeader>

        {/* Modal for editing recipe */}
        <Modal
          backdrop={"blur"}
          isOpen={isOpen}
          scrollBehavior={"outside"}
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                {/* <ModalHeader className="flex flex-col gap-1"></ModalHeader> */}
                <ModalBody>
                  <UpdateRecipeForm
                    recipe={{
                      ...recipeData,
                      authorId: recipeData.authorId._id,
                    }}
                    recipeId={recipeId}
                  />
                </ModalBody>
                <ModalFooter className="flex justify-center items-center w-full">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <div className="relative w-full h-64 md:h-80 overflow-hidden">
          <Image
            src={recipeData.image}
            alt={recipeData.title}
            fill
            style={{ objectFit: "cover" }}
            className="w-full h-full object-cover"
          />
        </div>

        <CardBody className="px-4 py-6">
          <h1 className="font-bold text-2xl mb-2">{recipeData.title}</h1>
          <div className="flex flex-row justify-start items-start gap-4">
            <p className="text-gray-600 font-bold">
              {recipeData.diet === "veg" ? (
                <span className="text-lime-500">Veg</span>
              ) : recipeData.diet === "vegan" ? (
                <span className="text-green-500">Vegan</span>
              ) : (
                <span className="text-red-500">Non Veg</span>
              )}
            </p>
            <p className="text-gray-600 flex flex-row items-center gap-1">
              <FaRegClock /> {recipeData.cookingTime} mins
            </p>
          </div>

          {isPremiumContent ? (
            <Button
              startContent={<IoDocumentLockOutline size={18} />}
              className="mt-4 bg-amber-400"
              size="md"
              onPress={handlePremiumAccess}
            >
              Premium Content
            </Button>
          ) : (
            <>
              <div
                className="mt-4 text-gray-600"
                dangerouslySetInnerHTML={{ __html: recipeData.description }}
              />

              <div className="mt-4">
                <Divider />
                <h2 className="font-bold text-xl mt-4">Ingredients</h2>
                <ul className="list-disc list-inside text-gray-600">
                  {recipeData.ingredients.map(
                    (ingredient: Ingredient, idx: number) => (
                      <li key={idx}>
                        {ingredient.name} - {ingredient.amount}
                      </li>
                    ),
                  )}
                </ul>

                <h2 className="font-bold text-xl mt-4">Instructions</h2>
                <ol className="list-decimal list-inside text-gray-600">
                  {recipeData.instructions.map(
                    (instruction: InstructionStep, idx: number) => (
                      <li
                        key={idx}
                        dangerouslySetInnerHTML={{
                          __html: instruction.details,
                        }}
                      />
                    ),
                  )}
                </ol>

                <div className="flex flex-wrap gap-2 mt-2">
                  {recipeData.tags.map((tag: string, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-full bg-blue-100 text-blue-700"
                    >
                      <Snippet symbol="#" hideCopyButton>
                        <span>{tag}</span>
                      </Snippet>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          <Divider className="my-4" />
          <div className="flex flex-col sm:flex-row items-start gap-4 mt-4">
            <div className="flex flex-row gap-1 items-center">
              <Button
                size="sm"
                startContent={<IoMdArrowUp />}
                variant="flat"
                color={userVote === "upvote" ? "primary" : "default"}
                // className="bg-transparent"
                onPress={handleUpvote}
              >
                {upvoteCount}
              </Button>
              <Button
                size="sm"
                startContent={<IoArrowDown />}
                variant="flat"
                color={userVote === "downvote" ? "danger" : "default"}
                // className="bg-transparent"
                onPress={handleDownvote}
              >
                {downvoteCount}
              </Button>
              <div className="ml-2 flex items-center">
                {renderRatingStars(userRating || 0)}
                <p className="ml-4">
                  {averageRating.toFixed(1)} ({ratingCount} ratings)
                </p>
              </div>

              <div className="ml-2">
                {userRating && (
                  <MdClear
                    onClick={() => handleRatingUpdate(0)}
                    className="text-red-500 cursor-pointer"
                    size={24}
                  />
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      <Card className="w-full shadow-lg rounded-lg overflow-hidden">
        <CardBody className="px-4 py-6">
          <div className="flex items-start justify-start gap-4 bg-white">
            <img
              src={
                loggedUser?.displayPicture ||
                "https://i.ibb.co.com/wcv1QBQ/5951752.png"
              }
              alt="user avatar"
              className="w-12 h-12 rounded-full"
            />
            <div
              style={{
                marginLeft: "-1vw",
                paddingTop: "1vh",
                paddingBottom: "1vh",
              }}
              className="w-full"
            >
              <p className="text-lg font-bold ml-2">{loggedUser?.name}</p>
              <input
                className="w-full p-2 text-lg border-none rounded-full focus:ring-2 focus:ring-transparent focus:outline-none"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex justify-end w-full">
                <Button
                  className="mt-2"
                  variant="solid"
                  radius="full"
                  onPress={() => {
                    handleAddComment();
                    setTimeout(() => {
                      window.location.reload(); // Reload the window after 1 second
                    }, 500);
                  }}
                >
                  Comment
                </Button>
              </div>
            </div>
          </div>
          <Divider className="my-4" />
          <div className="my-4">
            {commentsData?.length! > 0 && (
              <h2 className="font-bold text-xl">
                Comments ({commentsData?.length})
              </h2>
            )}
            {commentsData?.map((comment) => (
              <div key={comment._id} className="flex flex-col mt-4 w-full">
                <div className="flex items-start gap-4">
                  <Avatar
                    key={`avatar-${comment._id}`} // Add unique key here
                    src={comment.authorId.displayPicture}
                    alt={comment.authorId.name}
                    size="lg"
                    isBordered
                    radius="full"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <strong className="text-lg">
                          {comment.authorId.name}
                        </strong>
                        <p className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {loggedUser?._id === comment.authorId._id && (
                        <div className="flex gap-2">
                          <Button
                            key={`edit-btn-${comment._id}`} // Add unique key here
                            size="sm"
                            variant="flat"
                            startContent={
                              <MdEdit className="text-blue-500" size={20} />
                            }
                            onPress={() =>
                              handleCommentEdit(comment._id, comment.content)
                            }
                          />
                          <Button
                            key={`delete-btn-${comment._id}`} // Add unique key here
                            size="sm"
                            variant="flat"
                            startContent={
                              <MdDeleteForever
                                className="text-red-500"
                                size={20}
                              />
                            }
                            onPress={() => handleCommentDelete(comment._id)}
                          />
                        </div>
                      )}
                    </div>

                    {editingCommentId === comment._id ? (
                      <div className="mt-2">
                        <Textarea
                          key={`textarea-${comment._id}`} // Add unique key here
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          placeholder="Edit your comment"
                          minRows={2}
                          maxRows={4}
                          className="mb-2"
                        />
                        <Button
                          key={`save-btn-${comment._id}`} // Add unique key here
                          className="mr-2"
                          variant="solid"
                          color="primary"
                          onPress={() => handleCommentSaveEdit(comment._id)}
                        >
                          Save
                        </Button>
                        <Button
                          key={`cancel-btn-${comment._id}`} // Add unique key here
                          variant="light"
                          color="danger"
                          onPress={() => setEditingCommentId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <p className="text-gray-600 mt-2">{comment.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* <Textarea
            placeholder="Write your comment..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              // setTimeout(() => {
              //   window.location.reload(); // Reload the window after 1 second
              // }, 1000);
            }}
            className="mb-2"
          />
          <Button
            className="mt-2"
            variant="solid"
            onPress={() => {
              handleAddComment();
              setTimeout(() => {
                window.location.reload(); // Reload the window after 1 second
              }, 500);
            }}
          >
            Add Comment
          </Button> */}
        </CardBody>
      </Card>
    </div>
  );
};

export default SingleRecipe;
