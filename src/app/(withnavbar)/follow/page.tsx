"use client";

import { useEffect, useState } from "react";
import { Avatar, Button, ScrollShadow, Spinner } from "@nextui-org/react";
import Link from "next/link";

import { usePatronSuggestion, useFollowUser } from "@/src/hooks/user.hooks";
import { useUser } from "@/src/context/user.provider";
import { IUser, TFollowUser } from "@/src/types";

export default function FollowPage() {
  const { user: currentUser } = useUser();
  const profileId = currentUser?._id;
  const { data, isLoading, error, refetch } = usePatronSuggestion(profileId!);

  const [following, setFollowing] = useState<{ [key: string]: boolean }>({});

  // Follow user hook
  const { mutate: handleFollowUser, isPending: followLoading } = useFollowUser(
    profileId!,
  );

  useEffect(() => {
    if (profileId) {
      refetch();
    }
  }, [profileId]);

  useEffect(() => {
    if (data?.data.length > 0) {
      // Set initial follow state for all suggested users
      const initialFollowingState = data.data.reduce(
        (acc: { [key: string]: boolean }, user: IUser) => {
          if (user._id) {
            // Check if user._id exists
            const isFollowing = currentUser?.following?.some(
              (f: TFollowUser) => f.id === user._id,
            );

            acc[user._id] = !!isFollowing; // Set following state
          }

          return acc;
        },
        {},
      );

      setFollowing(initialFollowingState);
    }
  }, [data, currentUser]);

  const handleFollowUnfollow = (targetUserId: string) => {
    handleFollowUser(targetUserId); // Call the follow/unfollow API
    setFollowing((prev) => ({
      ...prev,
      [targetUserId]: !prev[targetUserId], // Toggle follow/unfollow state
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center">
        <Spinner color="primary" size="lg" className="my-8" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ScrollShadow
      className="flex flex-col justify-center items-center"
      hideScrollBar
    >
      <div className="w-full mt-0 flex flex-col items-center">
        {data && data.data.length > 0 && (
          <div className="w-full bg-white z-10">
            <h1 className="text-center text-lg my-3">
              Suggested Patrons to Follow
            </h1>
          </div>
        )}
        <div
          className="grid grid-cols-1 gap-1 w-full md:w-3/4 mb-3"
          style={{
            marginTop: "2.5vh",
          }}
        >
          {data && data.data.length > 0 ? (
            data.data.map(
              (user: IUser) =>
                user.role === "USER" && (
                  <div
                    key={user._id} // Assuming user._id exists for all
                    className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 w-auto mb-2"
                  >
                    <div className="flex items-center">
                      {/* Profile Picture */}
                      <Avatar
                        className="border-4 object-cover mr-4"
                        src={
                          user.displayPicture ||
                          "https://i.ibb.co/wcv1QBQ/5951752.png"
                        }
                      />
                      <div>
                        {/* Patron Name */}
                        <h4 className="font-semibold">
                          <Link href={`/profile/${user._id}`}>{user.name}</Link>
                        </h4>
                      </div>
                    </div>

                    {/* Follow/Unfollow Button */}
                    <div>
                      {following[user._id!] ? (
                        <Button
                          className="bg-gray-400"
                          disabled={followLoading}
                          size="md"
                          onClick={() =>
                            user._id && handleFollowUnfollow(user._id)
                          } // Ensure user._id exists
                        >
                          {followLoading ? "Unfollowing..." : "Unfollow"}
                        </Button>
                      ) : (
                        <Button
                          color="primary"
                          disabled={followLoading}
                          size="md"
                          onClick={() =>
                            user._id && handleFollowUnfollow(user._id)
                          } // Ensure user._id exists
                        >
                          {followLoading ? "Following..." : "Follow"}
                        </Button>
                      )}
                    </div>
                  </div>
                ),
            )
          ) : (
            <p
              className="text-center"
              style={{
                marginTop: "1.5vh",
              }}
            >
              No suggested patrons available.
            </p>
          )}
        </div>
      </div>
    </ScrollShadow>
  );
}

// export default function FollowLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <section
//       className="flex flex-col justify-center items-center w-full"
//       style={{
//         marginTop: "5%",
//       }}
//     >
//       <div className="w-screen flex flex-col justify-center items-center">
//         {children}
//       </div>
//     </section>
//   );
// }
