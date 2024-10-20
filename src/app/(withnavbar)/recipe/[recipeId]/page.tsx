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
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FaShareFromSquare } from "react-icons/fa6";
import { IoDocumentLockOutline } from "react-icons/io5";
import Image from "next/image";
import { MdClear, MdDeleteForever, MdEdit } from "react-icons/md";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BiDownvote, BiUpvote } from "react-icons/bi";

import {
  useDeleteComment,
  useDeleteRecipe,
  useFetchComments,
  useGetSingleRecipe,
  usePostComment,
  useRateRecipe,
  useUpdateComment,
  useVoteRecipe,
} from "@/src/hooks/post.hooks";
import { useUser } from "@/src/context/user.provider";
import { Ingredient, InstructionStep, IRating, IVote } from "@/src/types";
import UpdateRecipeForm from "@/src/components/post/UpdateRecipeForm";
import { useGetSingleUser } from "@/src/hooks/user.hooks";

interface IProps {
  params: {
    recipeId: string;
  };
}

const RecipePage = ({ params: { recipeId } }: IProps) => {
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
      <div className="flex flex-col justify-center items-center">
        <Spinner color="white" size="lg" className="my-8" />
      </div>
    );
  if (recipeError) return <div>Error: {recipeError.message}</div>;

  return (
    <div
      style={{
        margin: "5%",
        overflowX: "hidden",
      }}
      className="flex flex-col items-center w-full p-4 md:p-8"
    >
      <Card className="w-full max-w-3xl shadow-lg rounded-lg overflow-hidden">
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
              <h4 className="font-bold text-lg">{recipeData.authorId.name}</h4>
              <p className="text-gray-400 text-sm">
                {new Date(recipeData.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isRecipeOwner && (
              <div className="flex flex-row gap-2">
                <Button
                  startContent={
                    <FaRegEdit className="text-yellow-500" size={20} />
                  }
                  size="sm"
                  variant="flat"
                  onPress={onOpen}
                />
                <Button
                  startContent={
                    <MdDeleteForever className="text-red-500" size={24} />
                  }
                  size="sm"
                  variant="flat"
                  onPress={() => handleDelete(recipeData._id, recipeData.title)}
                />
              </div>
            )}
            <Button
              startContent={
                <FaShareFromSquare className="text-sky-500" size={24} />
              }
              size="sm"
              variant="flat"
              onPress={handleShare}
            />
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
          <p
            className={`text-lg font-semibold ${
              recipeData.diet === "vegan" ? "text-lime-600" : "text-red-500"
            }`}
          >
            {recipeData.diet === "vegan" ? "Vegan" : "Non Veg"}
          </p>

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

                <h2 className="font-bold text-xl mt-4">Cooking Time</h2>
                <p className="text-gray-600">
                  {recipeData.cookingTime} minutes
                </p>

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

                <Divider />
                <div className="flex items-center gap-4 mt-4">
                  <Button
                    size="sm"
                    startContent={<BiUpvote />}
                    variant="flat"
                    color={userVote === "upvote" ? "primary" : "default"}
                    onPress={handleUpvote}
                  >
                    {upvoteCount}
                  </Button>
                  <Button
                    size="sm"
                    startContent={<BiDownvote />}
                    variant="flat"
                    color={userVote === "downvote" ? "danger" : "default"}
                    onPress={handleDownvote}
                  >
                    {downvoteCount}
                  </Button>

                  <div className="flex items-center mt-4">
                    <h3 className="text-lg font-semibold">Rating:</h3>
                    <div className="ml-2">
                      {renderRatingStars(userRating || 0)}
                    </div>
                    <p className="ml-4">
                      {averageRating.toFixed(1)} ({ratingCount} ratings)
                    </p>
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

                {/* <h2 className="font-bold text-xl mt-4">Tags</h2> */}
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

                <Divider className="my-4" />
                <div className="my-4">
                  <h2 className="font-bold text-xl">Comments</h2>
                  {commentsData?.map((comment) => (
                    <div
                      key={comment._id}
                      className="flex flex-col mt-4 w-full"
                    >
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
                                {new Date(
                                  comment.createdAt,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            {loggedUser?._id === comment.authorId._id && (
                              <div className="flex gap-2">
                                <Button
                                  key={`edit-btn-${comment._id}`} // Add unique key here
                                  size="sm"
                                  variant="flat"
                                  startContent={
                                    <MdEdit
                                      className="text-blue-500"
                                      size={20}
                                    />
                                  }
                                  onPress={() =>
                                    handleCommentEdit(
                                      comment._id,
                                      comment.content,
                                    )
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
                                  onPress={() =>
                                    handleCommentDelete(comment._id)
                                  }
                                />
                              </div>
                            )}
                          </div>

                          {editingCommentId === comment._id ? (
                            <div className="mt-2">
                              <Textarea
                                key={`textarea-${comment._id}`} // Add unique key here
                                value={editedContent}
                                onChange={(e) =>
                                  setEditedContent(e.target.value)
                                }
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
                                onPress={() =>
                                  handleCommentSaveEdit(comment._id)
                                }
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
                            <p className="text-gray-600 mt-2">
                              {comment.content}
                            </p>
                          )}
                        </div>
                      </div>
                      <Divider className="my-2" />
                    </div>
                  ))}
                </div>
                <Divider className="my-4" />
                {/* <h2 className="font-bold text-xl">Comments</h2>
                {recipeData.comments.map((comment: IComment, idx: number) => (
                  <div key={idx} className="mt-2">
                    <strong>{comment.authorId.name}</strong>
                    <p className="text-gray-600">{comment.content}</p>
                    <Divider />
                  </div>
                ))} */}
                <Textarea
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
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default RecipePage;
