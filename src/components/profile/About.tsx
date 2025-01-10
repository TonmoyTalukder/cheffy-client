'use client';

import { Tabs, Tab, Card, CardBody } from '@nextui-org/react';
import { FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { FaCity, FaGenderless, FaUtensils } from 'react-icons/fa';

import { useGetSingleUser } from '@/src/hooks/user.hooks';
import { useChangePassword } from '@/src/hooks/auth.hooks';
import { useUser } from '@/src/context/user.provider';

interface IProps {
  profileId: string;
}

const About = ({ profileId }: IProps) => {
  const { data: visitingUserData } = useGetSingleUser(profileId);
  const { user: loggedUser } = useUser();
  const { mutate: changePassword, isPending } = useChangePassword();
  const visitingUser = visitingUserData?.data;

  const isOwner = profileId === loggedUser?._id ? true : false;

  const [premiumTimeLeft, setPremiumTimeLeft] = useState<string | null>(null);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  useEffect(() => {
    if (visitingUser?.isPremium) {
      const updatePremiumTimeLeft = () => {
        const premiumExpiry = moment(visitingUser.premiumExpiryDate);
        const now = moment();
        const duration = moment.duration(premiumExpiry.diff(now));

        // Calculate days, hours, minutes, and seconds
        const days = Math.floor(duration.asDays());
        const hours = Math.floor(duration.hours());
        const minutes = Math.floor(duration.minutes());
        const seconds = Math.floor(duration.seconds());

        // Format the time as dd:hh:mm:ss
        setPremiumTimeLeft(
          `${days.toString().padStart(2, '0')}:${hours
            .toString()
            .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`,
        );
      };

      // Update the time left every second
      const intervalId = setInterval(updatePremiumTimeLeft, 1000);

      // Call the function once immediately to avoid initial delay
      updatePremiumTimeLeft();

      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [visitingUser]);

  const handleSubmit = () => {
    const data = {
      oldPassword: oldPass,
      newPassword: newPass,
      email: visitingUser?.email,
    };

    console.log(data);
    changePassword(data);
    setOldPass('');
    setNewPass('');
  };

  return (
    <div className="flex flex-col overflow-x-auto">
      <div className="flex w-full flex-col items-center">
        <Tabs aria-label="User Information" isVertical={true}>
          {/* Basic Info Tab */}
          <Tab key="basic-info" title="Basic Info">
            <Card className="xl:w-96 lg:w-96 md:w-80 sm:w-40 max-w-md">
              <CardBody>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <FiUser className="text-gray-500" />
                    <span className="font-bold">Name: </span>
                    <span>{visitingUser?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaGenderless className="text-gray-500" />
                    <strong>Sex:</strong> {visitingUser?.sex}
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    <FiStar className="text-gray-500" />
                    <span className="font-bold">Role: </span>
                    <span>{visitingUser?.role || "N/A"}</span>
                  </div> */}
                  <div className="flex items-center space-x-2">
                    <FaCity className="text-gray-500" />
                    <span className="font-bold">City: </span>
                    <span>{visitingUser?.city || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaUtensils className="text-gray-500" />
                    <span className="font-bold">Food Habit: </span>
                    {visitingUser?.foodHabit === 'vegan' ? (
                      <span>Vegan</span>
                    ) : visitingUser?.foodHabit === 'veg' ? (
                      <span>Vegan</span>
                    ) : visitingUser?.foodHabit === 'non_veg' ? (
                      <span>Non Veg</span>
                    ) : (
                      <span>N/A</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <strong>Topics:</strong> {visitingUser?.topics?.join(', ')}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Tab>

          {/* Contact Tab */}
          <Tab key="contact" title="Contact">
            <Card className="xl:w-96 lg:w-96 md:w-80 sm:w-40 max-w-md">
              <CardBody>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <FiMail className="text-gray-500" />
                    <span className="font-bold">Email: </span>
                    <span>{visitingUser?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiPhone className="text-gray-500" />
                    <span className="font-bold">Phone: </span>
                    <span>{visitingUser?.phone || 'N/A'}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Tab>

          {/* Premium Status Tab */}
          <Tab key="premium-status" title="Premium Status">
            <Card className="xl:w-96 lg:w-96 md:w-80 sm:w-40 max-w-md">
              <CardBody>
                {visitingUser?.isPremium ? (
                  <div className="text-left">
                    <div className="text-2xl font-bold text-green-500">
                      Premium Active
                    </div>
                    <div className="text-lg">
                      Expires in:{' '}
                      <span className="font-bold">
                        {premiumTimeLeft || 'Loading...'}
                      </span>{' '}
                      (dd:hh:mm:ss)
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      Not a Premium User
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </Tab>

          {/* Change Password Tab */}
          {isOwner && (
            <Tab key="change-password" title="Change Password">
              <Card className="xl:w-96 lg:w-96 md:w-80 sm:w-40 max-w-md">
                <CardBody>
                  <div className="space-y-8">
                    <div className="flex flex-col items-start gap-1 space-x-2">
                      <span className="font-bold flex flex-row items-center gap-1">
                        <FiLock className="text-gray-500" /> Current Password:{' '}
                      </span>
                      <input
                        type="password"
                        className="border border-gray-300 rounded-md px-2 py-1"
                        placeholder="Enter current password"
                        onChange={(e) => {
                          setOldPass(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex flex-col items-start gap-1 space-x-2">
                      <span className="font-bold  flex flex-row items-center gap-1">
                        <FiLock className="text-gray-500" />
                        New Password:{' '}
                      </span>
                      <input
                        type="password"
                        className="border border-gray-300 rounded-md px-2 py-1"
                        placeholder="Enter new password"
                        onChange={(e) => {
                          setNewPass(e.target.value);
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      onClick={handleSubmit}
                    >
                      Change Password
                    </button>
                  </div>
                </CardBody>
              </Card>
            </Tab>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default About;
