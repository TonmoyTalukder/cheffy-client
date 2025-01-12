'use client';

import { useEffect, useState } from 'react';
import { Card, Avatar, Tooltip, CardBody, Button } from '@nextui-org/react';

import { useFollowUser, useGetAllUsers } from '@/src/hooks/user.hooks';
import { useUser } from '@/src/context/user.provider';
import { IUser } from '@/src/types';
import Link from 'next/link';

const WhomToFollow = () => {
  const { data: usersFetchedData } = useGetAllUsers();
  const usersData = usersFetchedData?.data || [];
  const { user } = useUser();
  const profileId = user?._id;
  const { mutate: handleFollowUser, isPending: followLoading } = useFollowUser(
    profileId!,
  );

  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (usersData.length && user) {
      const notFollowedUsers = usersData.filter(
        (u: IUser) =>
          !user.following?.some((f) => f.email === u.email) &&
          u._id !== user._id,
      );

      const rankedUsers = notFollowedUsers
        .map((u: IUser) => {
          let rank = 0;

          if (u.foodHabit === user.foodHabit) rank += 5;
          if (u.city === user.city) rank += 2;

          return { ...u, rank };
        })
        .sort((a: any, b: any) => b.rank - a.rank);

      setFilteredUsers(rankedUsers.slice(0, 3));
    }
  }, [usersData, user]);

  const handleFollowUnfollow = (targetUserId: string) => {
    handleFollowUser(targetUserId);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg w-full">
      <h2 className="text-xl font-bold text-center mb-4">Who to Follow</h2>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
        {filteredUsers.map((u: IUser) => (
          <Card
            key={u._id}
            isHoverable
            isPressable
            className="bg-white shadow-md rounded-lg"
          >
            <Link className="w-full" href={`/profile/${u._id}`}>
              <CardBody className="flex flex-row items-start justify-start gap-0 w-full">
                <div>
                  <Avatar
                    src={u.displayPicture}
                    size="sm"
                    className="mr-4 rounded-full"
                    isBordered
                  />
                </div>
                <div className="flex flex-row items-start justify-between w-full">
                  <div>
                    <h3 className="text-lg font-medium">{u.name}</h3>
                    <p className="text-sm text-gray-500">{u.city}</p>
                    <p className="text-sm text-gray-400">
                      Food Habit: {u.foodHabit}
                    </p>
                  </div>
                  <Tooltip content={`Follow ${u.name}`}>
                    {/* <button className="text-blue-500 font-bold bg-transparent">
                    Follow
                  </button> */}
                    <Button
                      className="text-blue-500 font-bold bg-transparent"
                      disabled={followLoading}
                      size="md"
                      onClick={() =>
                        user?._id && handleFollowUnfollow(user._id)
                      }
                    >
                      {followLoading ? 'Following...' : 'Follow'}
                    </Button>
                  </Tooltip>
                </div>
              </CardBody>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WhomToFollow;
