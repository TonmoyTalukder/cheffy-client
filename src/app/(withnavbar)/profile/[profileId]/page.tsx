/* eslint-disable no-console */
"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import {
  FaPhone,
  FaCity,
  FaGenderless,
  FaUtensils,
  FaEnvelope,
} from "react-icons/fa";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { PiSealCheckFill } from "react-icons/pi";
import Link from "next/link";
import axios from "axios";
import { FaEdit } from "react-icons/fa";

import { IUser, TFollowUser } from "@/src/types";
import {
  useFollowUser,
  useGetSingleUser,
  usePremiumPayment,
  useUpdateUser,
} from "@/src/hooks/user.hooks";
import EditProfileModal from "@/src/components/modal/EditProfileModal";
import envConfig from "@/src/config/envConfig";
import RecipePostForm from "@/src/components/post/RecipePostForm";
import UserRecipePost from "@/src/components/post/UserRecipePost";

interface IProps {
  params: {
    profileId: string;
  };
}

const ProfileDetailPage = ({ params: { profileId } }: IProps) => {
  const { data, isLoading, error, refetch } = useGetSingleUser(profileId);
  const {
    // mutate: initiatePayment,
    isPending: premiumPayPending,
  } = usePremiumPayment(profileId);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("reloaded")) {
      // Reload the page and set a flag to avoid infinite loop
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    }
  }, []);

  // State
  const [user, setUser] = useState<IUser | null>(null);
  const [visitorUser, setVisitorUser] = useState<IUser | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followsYou, setFollowsYou] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data for the current visitor
  const [touristId, setTouristId] = useState<string | null>(null);
  const { data: currentUserData } = useGetSingleUser(touristId || "");

  const {
    mutate: handleUpdateUserApi,
    isPending: updatePending,
    isSuccess: updateSuccess,
  } = useUpdateUser(profileId);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      const touristUser = jwtDecode<IUser>(accessToken);

      if (touristUser !== null) {
        setTouristId(touristUser._id!); // Set tourist ID for useGetSingleUser to trigger
      }
    }
  }, []);

  useEffect(() => {
    if (currentUserData) {
      const currentUser = currentUserData.data;

      console.log("Current user => ", currentUser);

      if (currentUser) {
        setVisitorUser(currentUser);

        // Check if the visitor is the profile owner
        setIsOwner(currentUser._id === profileId);

        // Check if visitor follows the profile user
        if (
          currentUser.following?.some(
            (following: TFollowUser) => following.id === profileId,
          )
        ) {
          setIsFollowing(true);
        }

        // Check if profile user follows the visitor
        if (
          data?.data.following?.some(
            (following: TFollowUser) => following.id === currentUser._id,
          )
        ) {
          setFollowsYou(true);
        }
      }
    }
  }, [currentUserData, data, profileId]);

  useEffect(() => {
    if (data) {
      setUser(data.data);
      console.log("Data from Profile => ", data.data);
    }
  }, [data]);

  const handleUpdateUser = (updatedData: any) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedData }));
    console.log("Updated Data => ", updatedData);
    handleUpdateUserApi(updatedData, {
      onSuccess: () => {
        // Re-fetch user data after successful update
        refetch();
      },
    });
  };

  const handleUpdatePremiumUser = async (updatedData: any) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedData }));
    console.log("Updated Data => ", updatedData);
    handleUpdateUserApi(updatedData, {
      onSuccess: () => {
        // Re-fetch user data after successful update
        refetch();
      },
    });

    // const res = initiatePayment();
    const response = await axios.post(
      `${envConfig.baseApi}/payment/initiate-payment/${profileId}`,
    );

    const paymentUrl = response.data?.paymentSession?.payment_url;

    console.log("Payment res: ", response.data.paymentSession.payment_url);

    if (paymentUrl) {
      // Redirect user to the payment URL in the current tab
      window.location.href = paymentUrl;
    }
  };

  // Display notifications and handle loading state
  useEffect(() => {
    if (updatePending) {
      toast("Updating user information, please wait...", {
        duration: Infinity,
      });
    }

    if (updateSuccess) {
      toast.dismiss(); // Dismiss loading notification
      toast.success("Profile updated successfully!");
    }
  }, [updatePending, updateSuccess]);

  const { mutate: handleFollowUser, isPending: followLoading } = useFollowUser(
    visitorUser?._id!,
    // profileId,
  );

  const handleFollowUnfollow = (targetUserId: string) => {
    if (!visitorUser?._id) return;

    handleFollowUser(targetUserId);
  };

  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center">
        <Spinner color="white" size="lg" className="my-8" />
      </div>
    );
  if (error) {
    return (
      <div className="text-red-500 text-center">Error loading user data</div>
    );
  }
  if (!user) return null; // Or return a suitable fallback UI

  // Static cover picture fallback
  const coverPicture =
    user.coverPicture ||
    "https://www.bayarea.com/wp-content/uploads/2017/07/CookingClass_main.jpg"; // Fallback cover image

  console.log("User => ", user);

  return (
    <div className="w-full lg:w-9/12 xl:w-9/12 mx-auto mt-14">
      {/* Cover Photo */}
      <div className="relative w-full h-60 rounded-lg">
        <Image
          alt="Cover Picture"
          className="w-full h-full object-cover rounded-b-lg"
          height={400}
          priority={true}
          src={coverPicture}
          width={1280}
        />
        {/* <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black opacity-40" />
        <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black opacity-40" /> */}
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6 rounded-b mt-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Avatar
              className="border-4 w-20 h-20 text-large -mt-10"
              src={user.displayPicture}
            />
            <div className="ml-4 mt-2">
              <div className="flex">
                <h1 className="text-3xl font-semibold">{user.name}</h1>{" "}
                {user.isPremium && <PiSealCheckFill />}
                {isOwner && (
                  <>
                    {!user.isPremium && (
                      <Button
                        className="ml-2"
                        size="md"
                        onClick={() => {
                          handleUpdatePremiumUser({
                            _id: user._id,
                            isPremium: true,
                          });
                          // setTimeout(() => {
                          //   window.location.reload(); // Reload the window
                          // }, 1000);
                        }}
                      >
                        {premiumPayPending ? (
                          "Processing..."
                        ) : (
                          <p className="flex">
                            Be Premium User &nbsp; <PiSealCheckFill />
                          </p>
                        )}
                      </Button>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-gray-500 font-medium">
                  {user.followers!.length} Followers
                </span>
                <span className="text-gray-500 font-medium">
                  {user.following!.length} Following
                </span>
                {followsYou && (
                  <span className="text-green-500 font-medium">
                    Follows you
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Follow/Followed Button */}
          {!isOwner && (
            <div>
              {isFollowing ? (
                <Button
                  className="bg-gray-400"
                  size="md"
                  onClick={() => {
                    handleFollowUser(profileId);
                    setTimeout(() => {
                      window.location.reload(); // Reload the window
                    }, 500);
                  }}
                >
                  {followLoading ? "Unfollowing..." : "Unfollow"}
                </Button>
              ) : (
                <Button
                  color="primary"
                  disabled={followLoading}
                  size="md"
                  onClick={() => {
                    handleFollowUser(profileId);
                    setTimeout(() => {
                      window.location.reload(); // Reload the window
                    }, 500);
                  }}
                >
                  {followLoading ? "Following..." : "Follow"}
                </Button>
              )}
            </div>
          )}

          {/* If user is the owner, show Edit button */}
          {isOwner && (
            <div className="flex justify-end">
              <Button color="primary" onPress={() => setIsModalOpen(true)}>
                Edit Profile
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Intro Section */}
      <div className="block md:hidden lg:hidden xl:hidden p-6 rounded-lg shadow-lg sm:w-full max-h-fit">
        <h3 className="text-xl font-semibold">Intro</h3>
        <p className="text-gray-500 mt-2">{user.bio}</p>
        <div className="mt-4 text-left">
          <p>
            <strong>City:</strong> {user.city}
          </p>
          <p>
            <strong>Food Habit:</strong> {user.foodHabit}
          </p>
          <p>
            <strong>Topics:</strong> {user.topics?.join(", ")}
          </p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isModalOpen}
        userData={user} // Send all user data to the modal
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateUser}
      />

      {/* Tab Menu */}
      <div className="p-3">
        <div className="flex justify-around space-x-4 text-lg font-semibold">
          <button
            className={`px-4 py-2 ${
              activeTab === "about" ? "border-b-4 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "posts" ? "border-b-4 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "followers" ? "border-b-4 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab("followers")}
          >
            Followers
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "following" ? "border-b-4 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab("following")}
          >
            Following
          </button>
        </div>
      </div>

      <div>
        {/* Right Column for Posts and others */}
        <div>
          {activeTab === "posts" && (
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Intro Section */}
              <div className="hidden md:block lg:block xl:block p-6 rounded-lg shadow-lg w-1/3  max-h-fit">
                <h3 className="text-xl font-semibold">Intro</h3>
                <p className="text-gray-500 mt-2">{user.bio}</p>
                <div className="mt-4 text-left">
                  <p>
                    <strong>City:</strong> {user.city}
                  </p>
                  <p>
                    <strong>Food Habit:</strong> {user.foodHabit}
                  </p>
                  <p>
                    <strong>Topics:</strong> {user.topics?.join(", ")}
                  </p>
                </div>
              </div>

              <div className="w-full lg:w-2/3 min-h-min flex flex-col items-center">
                <div className="min-h-min mx-auto flex flex-col items-center justify-center w-full">
                  {/* <Button onPress={onOpen}>Open Modal</Button> */}
                  {isOwner && (
                    <Button
                      className="flex items-center w-[70%] px-4 py-2 mt-5 border border-gray-500 rounded-md shadow-sm text-gray-500 hover:text-gray-200 hover:bg-gray-500 text-left"
                      style={{ textAlign: "left" }}
                      onPress={onOpen}
                    >
                      <FaEdit className="mr-2 text-gray-400" />
                      Write a new recipe...
                    </Button>
                  )}
                  <Modal
                    backdrop={"blur"}
                    isOpen={isOpen}
                    scrollBehavior={"outside"}
                    onOpenChange={onOpenChange}
                  >
                    <ModalContent>
                      {(onClose) => (
                        <>
                          <ModalHeader className="flex flex-col gap-1">
                            <span>{user.name}, write a new recipe.</span>
                          </ModalHeader>
                          <ModalBody>
                            <RecipePostForm />
                          </ModalBody>
                          <ModalFooter className="flex justify-center items-center w-full">
                            <Button
                              color="danger"
                              variant="light"
                              onPress={onClose}
                            >
                              Close
                            </Button>
                          </ModalFooter>
                        </>
                      )}
                    </ModalContent>
                  </Modal>
                  <div className="flex flex-col items-center justify-center w-full p-6 rounded-lg shadow-lg">
                    {/* <h3 className="text-xl font-semibold">Posts</h3> */}
                    <UserRecipePost profileId={profileId} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "followers" && (
            <div className="p-6 rounded-lg shadow-lg">
              {/* <h3 className="text-xl font-semibold pb-5">Followers</h3> */}
              {user.followers?.length === 0 ? (
                <p className="text-gray-500 mt-2">No followers yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-1 w-full mb-3">
                  {user.followers?.map((follower, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 w-auto"
                    >
                      <div className="flex items-center">
                        {/* Profile Picture */}
                        <Avatar
                          className="border-4 object-cover mr-4"
                          src={follower.profilePicture}
                        />
                        <div>
                          {/* Follower Name */}
                          <h4 className="font-semibold">
                            <Link href={`/profile/${follower.id}`}>
                              {follower.name}
                            </Link>
                          </h4>
                        </div>
                      </div>

                      {/* Follow/Unfollow Button */}
                      <div>
                        {/* {isFollowing ? ( */}
                        {/* <Button
                          className="bg-gray-400"
                          size="md"
                          onClick={() => {
                            handleFollowUnfollow(follower.id);
                            setTimeout(() => {
                              window.location.reload();
                            }, 500);
                          }}
                        >
                          {followLoading ? "Unfollowing..." : "Unfollow"}
                        </Button> */}
                        {/* ) : ( */}
                        <Button
                          color="primary"
                          disabled={followLoading}
                          size="md"
                          onClick={() => {
                            handleFollowUnfollow(follower.id);
                            setTimeout(() => {
                              window.location.reload();
                            }, 500);
                          }}
                        >
                          {followLoading ? "Following..." : "Follow"}
                        </Button>
                        {/* )} */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "following" && (
            <div className="p-6 rounded-lg shadow-lg">
              {/* <h3 className="text-xl font-semibold pb-5">Followers</h3> */}
              {user.following?.length === 0 ? (
                <p className="text-gray-500 mt-2">Not following anyone yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-1 w-full mb-3">
                  {user.following?.map((follow, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 w-auto"
                    >
                      <div className="flex items-center">
                        {/* Profile Picture */}
                        <Avatar
                          className="border-4 object-cover mr-4"
                          src={follow.profilePicture}
                        />
                        <div>
                          {/* Follower Name */}
                          <h4 className="font-semibold">
                            <Link href={`/profile/${follow.id}`}>
                              {follow.name}
                            </Link>
                          </h4>
                        </div>
                      </div>

                      {/* Follow/Unfollow Button */}
                      <div>
                        {/* {isFollowing ? ( */}
                        <Button
                          className="bg-gray-400"
                          size="md"
                          onClick={() => {
                            handleFollowUnfollow(follow.id);
                            setTimeout(() => {
                              window.location.reload(); // Reload the window
                            }, 500);
                          }}
                        >
                          {followLoading ? "Unfollowing..." : "Unfollow"}
                        </Button>
                        {/* ) : ( */}
                        {/* <Button
                            color="primary"
                            disabled={followLoading}
                            size="md"
                            onClick={() => {
                              handleFollowUnfollow(follow.id);
                              setTimeout(() => {
                                window.location.reload(); // Reload the window
                              }, 500);
                            }}
                          >
                            {followLoading ? "Following..." : "Follow"}
                          </Button> */}
                        {/* )} */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "about" && (
            <div className="p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-left">
                <p>
                  <FaEnvelope className="inline mr-2" />
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <FaPhone className="inline mr-2" />
                  <strong>Phone:</strong> {user.phone}
                </p>
                <p>
                  <FaCity className="inline mr-2" />
                  <strong>City:</strong> {user.city}
                </p>
                <p>
                  <FaUtensils className="inline mr-2" />
                  <strong>Food Habit:</strong> {user.foodHabit}
                </p>
                <p>
                  <FaGenderless className="inline mr-2" />
                  <strong>Gender:</strong> {user.sex}
                </p>
                <p>
                  <strong>Topics:</strong> {user.topics?.join(", ")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailPage;
