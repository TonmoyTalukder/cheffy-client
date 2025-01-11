/* eslint-disable no-console */
"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { PiSealCheckFill } from "react-icons/pi";
import Link from "next/link";
import axios from "axios";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineReportProblem,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import { SlLocationPin } from "react-icons/sl";
import { LuVegan } from "react-icons/lu";
import { BsThreeDots } from "react-icons/bs";

import { IUser, TFollowUser } from "@/src/types";
import {
  useFollowUser,
  useGetSingleUser,
  usePremiumPayment,
  useReportUser,
  useUpdateUser,
} from "@/src/hooks/user.hooks";
import EditProfileModal from "@/src/components/modal/EditProfileModal";
import envConfig from "@/src/config/envConfig";
import UserRecipePost from "@/src/components/post/UserRecipePost";
interface IProps {
  params: {
    profileId: string;
  };
}

const ProfileDetailPage = ({ params: { profileId } }: IProps) => {
  const { data, isLoading, error, refetch } = useGetSingleUser(profileId);

  console.log("user data", data);
  const {
    // mutate: initiatePayment,
    isPending: premiumPayPending,
  } = usePremiumPayment(profileId);
  const reportUserMutation = useReportUser();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

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

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      setActiveTab("about");
    }
  }, [user]);

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

  const handleReport = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to report "${name}"?`)) {
      reportUserMutation.mutate(id);
      console.log("Reported id = ", id);
    }
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
    <div className="w-full mt-0">
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
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6 rounded-b mt-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Avatar
              className="border-4 w-20 h-20 text-large -mt-10"
              src={user.displayPicture}
            />
          </div>

          {/* Follow/Followed Button */}
          {!isOwner && (
            <div className="flex justify-end mt-1 gap-1">
              <Dropdown backdrop="blur">
                <DropdownTrigger>
                  <Button
                    size="sm"
                    radius="full"
                    isIconOnly
                    className="bg-transparent border-1 border-double border-gray-500 text-gray-500 font-bold"
                    onPress={() => setIsModalOpen(true)}
                  >
                    <BsThreeDots />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions" variant="faded">
                  <DropdownItem
                    key="report"
                    onClick={() => handleReport(user._id!, user.name)}
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
              {isFollowing ? (
                <Button
                  size="sm"
                  radius="full"
                  className="bg-transparent border-1 border-double border-gray-500 text-gray-500 font-bold"
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
                  disabled={followLoading}
                  size="sm"
                  radius="full"
                  className="bg-transparent border-1 border-double border-gray-500 text-blue-500 font-bold"
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
            <div className="flex justify-end mt-1 gap-1">
              <Button
                size="sm"
                radius="full"
                className="bg-transparent border-1 border-double border-gray-500 text-gray-500 font-bold"
                onPress={() => setIsModalOpen(true)}
              >
                Edit Profile
              </Button>
            </div>
          )}
        </div>

        <div className="mx-1 pt-1 pb-2 border-b-1">
          <div className="flex flex-row">
            <h1 className="text-2xl font-semibold">{user.name}</h1>{" "}
            {user.isPremium && <PiSealCheckFill />}
            {user.role === "ADMIN" && <MdOutlineAdminPanelSettings />}
            {isOwner && (
              <>
                {!user.isPremium && user.role === "USER" && (
                  <Button
                    className="ml-2 bg-transparent border-1 border-double border-gray-500 text-gray-500"
                    radius="full"
                    size="sm"
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
                      <span className="flex flex-row">
                        Get Premiums&nbsp;
                        <PiSealCheckFill />
                      </span>
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
          {/* Intro Section */}
          <div className="py-2 w-full max-h-fit text-left">
            <p className="text-gray-500 mt-2">{user.bio}</p>
            <div className="mt-2 text-left">
              <div className="flex flex-row items-center gap-2">
                <p className="flex flex-row items-center">
                  <SlLocationPin />
                  &nbsp;{user.city}
                </p>
                <p>
                  {user.foodHabit === "vegan" ? (
                    <span className="flex flex-row items-center text-green-500">
                      <LuVegan />
                      &nbsp;Vegan
                    </span>
                  ) : user.foodHabit === "veg" ? (
                    <span className="flex flex-row items-center text-lime-500">
                      <LuVegan />
                      &nbsp;Vegan
                    </span>
                  ) : (
                    <span className="flex flex-row items-center text-red-500">
                      <LuVegan />
                      &nbsp;Non Veg
                    </span>
                  )}
                </p>
              </div>
              <p className="text-blue-500">
                {user.topics?.map((topic) => `#${topic}`).join(" ")}
              </p>
            </div>
          </div>
          {user.role === "USER" && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-2 mt-2">
              <Link href={`/profile/${profileId}/followers`}>
                <span className="text-gray-500 font-medium hover:underline">
                  {user?.followers!.length} Followers
                </span>
              </Link>

              <Link href={`/profile/${profileId}/followings`}>
                <span className="text-gray-500 font-medium hover:underline">
                  {user?.following!.length} Following
                </span>
              </Link>

              {followsYou && (
                <span className="text-blue-500 font-medium">Follows you</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isModalOpen}
        userData={user} // Send all user data to the modal
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateUser}
      />

      <div>
        {/* Posts */}
        <div>
          <div className="flex flex-col items-center justify-center w-full rounded-lg shadow-lg mt-1">
            <UserRecipePost profileId={profileId} />
          </div>

          {/* {activeTab === 'followers' && (
            <div className="p-6 rounded-lg shadow-lg">
              {user.followers?.length === 0 ? (
                <p className="text-gray-500 mt-2">No followers yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-1 lg:w-6/12 xl:w-6/12 md:w-7/12 mb-3 mx-auto">
                  {user.followers?.map((follower, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 w-auto"
                    >
                      <div className="flex items-center">
                        <Avatar
                          className="border-4 object-cover mr-4"
                          src={follower.profilePicture}
                        />
                        <div>
                          <h4 className="font-semibold">
                            <Link href={`/profile/${follower.id}`}>
                              {follower.name}
                            </Link>
                          </h4>
                        </div>
                      </div>

                      <div>
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
                          {followLoading ? 'Following...' : 'Follow'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )} */}

          {/* {activeTab === 'following' && (
            <div className="p-6 rounded-lg shadow-lg">
              {user.following?.length === 0 ? (
                <p className="text-gray-500 mt-2">Not following anyone yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-1 lg:w-6/12 xl:w-6/12 md:w-7/12 mb-3 mx-auto">
                  {user.following?.map((follow, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 w-auto"
                    >
                      <div className="flex items-center">
                        <Avatar
                          className="border-4 object-cover mr-4"
                          src={follow.profilePicture}
                        />
                        <div>
                          <h4 className="font-semibold">
                            <Link href={`/profile/${follow.id}`}>
                              {follow.name}
                            </Link>
                          </h4>
                        </div>
                      </div>
                      <div>
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
                          {followLoading ? 'Unfollowing...' : 'Unfollow'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )} */}

          {/* {activeTab === 'about' && (
            <div className="p-6 rounded-lg shadow-lg">
              <About profileId={profileId} />
   
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailPage;
