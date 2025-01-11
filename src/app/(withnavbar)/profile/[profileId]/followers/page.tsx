"use client";

import { Button, Avatar, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { Key, useState, useEffect } from "react";

import { useUser } from "@/src/context/user.provider";
import { useFollowUser, useGetSingleUser } from "@/src/hooks/user.hooks";

interface IProps {
  params: {
    profileId: string;
  };
}

interface Follower {
  profilePicture: string | undefined;
  id: string;
  name: string;
}

const FollowersPage = ({ params: { profileId } }: IProps) => {
  const { data: userData, isLoading, error } = useGetSingleUser(profileId);
  const [followStates, setFollowStates] = useState<Record<string, boolean>>({});

  const { user: visitorUser, setIsLoading: userLoading } = useUser();
  const { mutate: handleFollowUser, isPending: followLoading } = useFollowUser(
    visitorUser?._id!,
  );

  const user = userData?.data;

  const checkIfFollowsYou = (followingId: string) => {
    if (visitorUser && followingId === visitorUser?._id) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (user?.followers) {
      const initialFollowStates = user.followers.reduce(
        (acc: Record<string, boolean>, follower: Follower) => {
          acc[follower.id] = checkIfFollowsYou(follower.id);

          return acc;
        },
        {},
      );

      setFollowStates(initialFollowStates);
    }
  }, [user?.followers, visitorUser]);

  const handleFollowUnfollow = (followerId: string) => {
    if (!visitorUser?._id) return;

    handleFollowUser(followerId, {
      onSuccess: () => {
        setFollowStates((prev) => ({
          ...prev,
          [followerId]: !prev[followerId],
        }));
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-red-500 text-xl font-semibold">
          Failed to load followers
        </p>
        <Button onClick={() => window.location.reload()} color="danger">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="p-4 rounded-lg shadow-lg">
        {user.followers?.length === 0 ? (
          <p className="text-gray-500 mt-2">No followers yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-1 w-full mb-3 mx-auto">
            {user.followers?.map((follower: Follower, index: Key) => (
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
                  <div className="flex flex-col items-start justify-start ">
                    {/* Follower Name */}
                    <h4 className="font-semibold">
                      <Link href={`/profile/${follower.id}`}>
                        {follower.name}
                      </Link>
                    </h4>
                    {followStates[follower.id] && (
                      <p className="text-xs text-left text-gray-500">
                        Follows You
                      </p>
                    )}
                  </div>
                </div>

                {/* Follow/Unfollow Button */}
                <div>
                  {followStates[follower.id] ? (
                    <Button
                      size="sm"
                      radius="full"
                      className="bg-transparent border-1 border-double border-gray-500 text-gray-500 font-bold"
                      disabled={followLoading}
                      onClick={() => handleFollowUnfollow(follower.id)}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      radius="full"
                      className="bg-transparent border-1 border-double border-gray-500 text-blue-500 font-bold"
                      disabled={followLoading}
                      onClick={() => handleFollowUnfollow(follower.id)}
                    >
                      Follow
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowersPage;
