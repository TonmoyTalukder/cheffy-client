// "use client";

// import { useEffect, useState } from "react";
// import { useUser } from "@/src/context/user.provider";
// import {
//   useDeleteRecipe,
//   useFetchFeedRecipes,
//   useVoteRecipe,
// } from "@/src/hooks/post.hooks";
// import { RecipeInterface } from "@/src/components/post/UserRecipePost";
// import {
//   Avatar,
//   Button,
//   Card,
//   CardBody,
//   CardFooter,
//   CardHeader,
//   Divider,
//   Link,
//   Modal,
//   ModalBody,
//   ModalContent,
//   ModalFooter,
//   useDisclosure,
// } from "@nextui-org/react";
// import { PiSealCheckFill } from "react-icons/pi";
// import { MdDeleteForever } from "react-icons/md";
// import Image from "next/image";
// import { IoDocumentLockOutline } from "react-icons/io5";
// import { BiDownvote, BiUpvote } from "react-icons/bi";
// import { FaRegEdit } from "react-icons/fa";
// import { FaShareFromSquare } from "react-icons/fa6";
// import UpdateRecipeForm from "@/src/components/post/UpdateRecipeForm";

// function stripHtmlTags(html: string): string {
//   return html.replace(/<[^>]*>/g, "");
// }

// export default function Home() {
//   useEffect(() => {
//     if (typeof window !== "undefined" && !sessionStorage.getItem("reloaded")) {
//       // Reload the page and set a flag to avoid infinite loop
//       sessionStorage.setItem("reloaded", "true");
//       window.location.reload();
//     }
//   }, []);

//   const { user: loggedUser, isLoading } = useUser();

//   // Conditionally call the hook only if loggedUser._id exists
//   const {
//     data: feedRecipes,
//     isPending,
//     isError,
//     error,
//   } = useFetchFeedRecipes(loggedUser?._id ?? ""); // Providing a fallback value (empty string)
//   const deleteRecipeMutation = useDeleteRecipe();
//   const { mutate: voteRecipe } = useVoteRecipe();

//   const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);
//   const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(null);

//   const { isOpen, onOpen, onOpenChange } = useDisclosure();

//   const handleDelete = (id: string, title: string) => {
//     if (
//       window.confirm(`Are you sure you want to delete the recipe "${title}"?`)
//     ) {
//       deleteRecipeMutation.mutate(id); // Trigger the mutation to delete the recipe
//     }
//   };

//   const toggleReadMore = (recipeId: string) => {
//     setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId);
//   };

//   function getVoteCounts(recipe: RecipeInterface) {
//     let upvoteCount = 0;
//     let downvoteCount = 0;

//     recipe.votes.forEach((vote) => {
//       if (vote.upvote) {
//         upvoteCount++;
//       }
//       if (vote.downvote) {
//         downvoteCount++;
//       }
//     });

//     return { upvoteCount, downvoteCount };
//   }

//   useEffect(() => {
//     if (loggedUser && feedRecipes?.votes?.length > 0) {
//       const userVoteData = feedRecipes.votes.find(
//         (vote: { id: string | undefined }) => vote.id === loggedUser._id,
//       );

//       if (userVoteData) {
//         setUserVote(userVoteData.upvote ? "upvote" : "downvote");
//       }
//     }
//   }, []);

//   const handleVote = (recipeId: string, voteType: "upvote" | "downvote") => {
//     // Use mutation for voting
//     if (loggedUser?._id) {
//       const voteData = {
//         id: loggedUser?._id,
//         upvote:
//           voteType === "upvote" && userVote == "downvote"
//             ? true
//             : voteType === "upvote" && userVote == null
//               ? true
//               : false,
//         downvote:
//           voteType === "downvote" && userVote == "upvote"
//             ? true
//             : voteType === "downvote" && userVote == null
//               ? true
//               : false,
//       };

//       console.log("Vote Data => ", voteData);

//       voteRecipe({
//         recipeId,
//         userId: loggedUser._id,
//         voteData,
//       });

//       setUserVote(voteType === "upvote" ? "upvote" : "downvote");
//     }
//   };

//   const handleShare = (recipe: RecipeInterface) => {
//     const recipeUrl = `${window.location.origin}/recipe/${recipe._id}`;

//     if (navigator.share) {
//       // Web Share API for mobile or supported browsers
//       navigator
//         .share({
//           title: recipe.title,
//           text: recipe.description,
//           url: recipeUrl,
//         })
//         .then(() => console.log("Successfully shared"))
//         .catch((error) => console.error("Error sharing", error));
//     } else {
//       // Fallback to clipboard copy for unsupported browsers
//       navigator.clipboard
//         .writeText(recipeUrl)
//         .then(() => alert("Link copied to clipboard!"))
//         .catch((error) => console.error("Failed to copy text: ", error));
//     }
//   };

//   // Check if user data is still loading or invalid
//   if (isLoading || !loggedUser?._id) {
//     return <div>Loading user data...</div>; // Handle loading or invalid user state
//   }

//   return (
//     <section
//       style={{
//         margin: "5%",
//       }}
//       className="flex flex-col items-center justify-center gap-4 py-8 md:py-10"
//     >
//       {isPending && <div>Loading feed...</div>}
//       {isError && <div>Error: {error.message}</div>}

//       <div>
//         {feedRecipes?.length === 0 && (
//           <p className="text-gray-500 mt-2">No posts yet.</p>
//         )}
//         {feedRecipes?.map((recipe: RecipeInterface) => (
//           <Card
//             key={recipe._id}
//             className="w-full max-w-lg shadow-lg transition-transform transform hover:scale-105 rounded-lg overflow-hidden my-6"
//           >
//             {/* Card Header with Author Info */}

//             <CardHeader className="flex justify-between p-4">
//               <Link
//                 href={`${window.location.origin}/recipe/${recipe._id}`}
//                 color="foreground"
//                 className="flex justify-between w-full"
//               >
//                 <div className="flex items-center gap-4 w-max">
//                   <Avatar
//                     isBordered
//                     radius="full"
//                     size="lg"
//                     src={recipe.authorId.displayPicture}
//                     alt="Author Image"
//                   />
//                   <div>
//                     <h4 className="font-bold text-lg flex flex-row">
//                       {recipe.authorId.name}{" "}
//                       {recipe.authorId?.isPremium && <PiSealCheckFill />}
//                     </h4>
//                     <p className="text-gray-400 text-sm">
//                       {new Date(recipe.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//               </Link>
//               {/* Place the button outside of the link */}
//               {loggedUser?._id === recipe.authorId._id ? (
//                 <Button
//                   startContent={
//                     <MdDeleteForever className="text-red-500" size={24} />
//                   }
//                   size="sm"
//                   variant="flat"
//                   onPress={() => handleDelete(recipe._id, recipe.title)}
//                 />
//               ) : (
//                 <Button
//                   className="bg-transparent text-foreground border-default-200"
//                   color="primary"
//                   radius="full"
//                   size="sm"
//                   variant="bordered"
//                 >
//                   Follow
//                 </Button>
//               )}
//             </CardHeader>

//             {/* Recipe Image with fixed height and cropping */}
//             <div className="relative w-full h-56 overflow-hidden">
//               <Image
//                 src={recipe.image}
//                 alt={recipe.title}
//                 fill
//                 style={{ objectFit: "cover" }}
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             {/* Card Body with Recipe Info */}
//             <CardBody className="px-4 py-2">
//               <Link
//                 href={`${window.location.origin}/recipe/${recipe._id}`}
//                 underline="hover"
//                 color="foreground"
//               >
//                 <h1 className="font-bold text-xl">{recipe.title}</h1>{" "}
//               </Link>
//               {recipe.diet === "veg" ? (
//                 <p className="text-green-600">Veg</p>
//               ) : recipe.diet === "vegan" ? (
//                 <p className="text-lime-600">Vegan</p>
//               ) : (
//                 <p className="text-red-500">Non Veg</p>
//               )}
//               <div className="text-gray-500 mt-2">
//                 {expandedRecipe === recipe._id ? (
//                   <div
//                     //   className="text-gray-500"
//                     style={{ color: "gray" }}
//                     dangerouslySetInnerHTML={{ __html: recipe.description }}
//                   />
//                 ) : (
//                   `${stripHtmlTags(recipe.description).substring(0, 100)}...`
//                 )}
//               </div>
//               {loggedUser?.isPremium && recipe.premium ? (
//                 <Button
//                   startContent={<IoDocumentLockOutline size={18} />}
//                   onPress={() => console.log("Premium Content")}
//                   className="mt-2 bg-amber-400"
//                   size="sm"
//                 >
//                   {/* {expandedRecipe === recipe._id ? "Show Less" : "Read More"} */}
//                   Premium Recipe
//                 </Button>
//               ) : (
//                 <Button
//                   color="default"
//                   onPress={() => toggleReadMore(recipe._id)}
//                   className="mt-2 max-w-fit"
//                   size="sm"
//                 >
//                   {expandedRecipe === recipe._id ? "Show Less" : "Read More"}
//                 </Button>
//               )}
//               {expandedRecipe === recipe._id && (
//                 <div className="mt-4">
//                   <Divider />
//                   <h1 className="text-gray-600 mt-2">
//                     Cooking Time: {recipe.cookingTime} mins
//                   </h1>
//                   <h1 className="text-gray-600">Ingredients:</h1>
//                   <ul className="list-disc list-inside">
//                     {recipe.ingredients.map((ingredient, idx) => (
//                       <li key={idx}>
//                         {ingredient.name} - {ingredient.amount}
//                       </li>
//                     ))}
//                   </ul>
//                   <h1 className="text-gray-600 mt-2">Instructions:</h1>
//                   <ol className="list-decimal list-inside">
//                     {recipe.instructions.map((instruction, idx) => (
//                       <li key={idx}>{stripHtmlTags(instruction.details)}</li>
//                     ))}
//                   </ol>
//                 </div>
//               )}
//             </CardBody>

//             {/* Card Footer with Upvotes, Downvotes and Date */}
//             <CardFooter className="flex justify-between p-4">
//               <div className="flex items-center gap-4">
//                 <Button
//                   startContent={
//                     <BiUpvote className="text-green-500" size={24} />
//                   }
//                   size="sm"
//                   variant="flat"
//                   onPress={() => handleVote(recipe._id, "upvote")}
//                 >
//                   {getVoteCounts(recipe).upvoteCount}
//                 </Button>
//                 <Button
//                   startContent={
//                     <BiDownvote className="text-red-500" size={24} />
//                   }
//                   size="sm"
//                   variant="flat"
//                   onPress={() => handleVote(recipe._id, "downvote")}
//                 >
//                   {getVoteCounts(recipe).downvoteCount}
//                 </Button>
//               </div>
//               {/* <p className="text-gray-400 text-sm">
//                 {new Date(recipe.createdAt).toLocaleDateString()}
//               </p> */}
//               <div className="flex items-center gap-4">
//                 {loggedUser?._id === recipe.authorId._id && (
//                   <Button
//                     startContent={
//                       <FaRegEdit className="text-yellow-500" size={24} />
//                     }
//                     size="sm"
//                     variant="flat"
//                     onPress={onOpen}
//                   />
//                 )}
//                 <Button
//                   startContent={
//                     <FaShareFromSquare className="text-sky-500" size={24} />
//                   }
//                   size="sm"
//                   variant="flat"
//                   onPress={() => handleShare(recipe)}
//                 />
//               </div>
//             </CardFooter>
//             {/* Modal for editing recipe */}
//             <Modal
//               backdrop={"blur"}
//               isOpen={isOpen}
//               scrollBehavior={"outside"}
//               onOpenChange={onOpenChange}
//             >
//               <ModalContent>
//                 {(onClose) => (
//                   <>
//                     {/* <ModalHeader className="flex flex-col gap-1"></ModalHeader> */}
//                     <ModalBody>
//                       <UpdateRecipeForm
//                         recipe={{ ...recipe, authorId: recipe.authorId._id }}
//                         recipeId={recipe._id}
//                       />
//                     </ModalBody>
//                     <ModalFooter className="flex justify-center items-center w-full">
//                       <Button color="danger" variant="light" onPress={onClose}>
//                         Close
//                       </Button>
//                     </ModalFooter>
//                   </>
//                 )}
//               </ModalContent>
//             </Modal>
//           </Card>
//         ))}
//       </div>
//     </section>
//   );
// }
