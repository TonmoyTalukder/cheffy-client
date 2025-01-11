"use client";

import { Spinner } from "@nextui-org/react";
import moment from "moment";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FiLock, FiMail, FiPhone, FiEye, FiEyeOff } from "react-icons/fi";

import { useChangePassword } from "@/src/hooks/auth.hooks";
import { useUser } from "@/src/context/user.provider";

const SettingPage = () => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [premiumTimeLeft, setPremiumTimeLeft] = useState<string | null>(null);

  const { user } = useUser();
  const { mutate: changePassword, isPending } = useChangePassword();

  useEffect(() => {
    if (user && user?.isPremium) {
      const updatePremiumTimeLeft = () => {
        const premiumExpiry = moment(user.premiumExpiryDate);
        const now = moment();
        const duration = moment.duration(premiumExpiry.diff(now));

        // Calculate days, hours, minutes, and seconds
        const days = Math.floor(duration.asDays());
        const hours = Math.floor(duration.hours());
        const minutes = Math.floor(duration.minutes());
        const seconds = Math.floor(duration.seconds());

        // Format the time as dd:hh:mm:ss
        setPremiumTimeLeft(
          `${days.toString().padStart(2, "0")}:${hours
            .toString()
            .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`,
        );
      };

      // Update the time left every second
      const intervalId = setInterval(updatePremiumTimeLeft, 1000);

      // Call the function once immediately to avoid initial delay
      updatePremiumTimeLeft();

      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const handleSubmit = () => {
    const data = {
      oldPassword: oldPass,
      newPassword: newPass,
      email: user?.email,
    };

    changePassword(data);
    setOldPass("");
    setNewPass("");
  };

  <div className="flex justify-center items-center h-screen">
    <Spinner size="lg" />
  </div>;

  return (
    <div>
      <div>
        <Accordion defaultExpandedKeys={["2"]}>
          <AccordionItem
            key="1"
            aria-label="Contact Information"
            subtitle="Expand to view your contact details"
            title="Contact Information"
          >
            <div className="px-5 py-2 space-y-4">
              <div className="flex items-center space-x-2 text-lg">
                <FiMail className="text-gray-500" />
                <span>{user?.email || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2 text-lg">
                <FiPhone className="text-gray-500" />
                <span>{user?.phone || "N/A"}</span>
              </div>
            </div>
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Change Password"
            subtitle={<span>Change your password</span>}
            title="Change Password"
          >
            <div className="px-5 py-2 space-y-4">
              {/* Current Password */}
              <div className="flex flex-col items-start gap-1">
                <span className="font-bold flex flex-row items-center gap-1">
                  <FiLock className="text-gray-500" /> Current Password:
                </span>
                <div className="relative w-auto max-w-xl">
                  <input
                    type={showOldPass ? "text" : "password"}
                    className="border border-gray-300 rounded-md px-2 py-1 w-full"
                    placeholder="Enter current password"
                    onChange={(e) => setOldPass(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                    onClick={() => setShowOldPass(!showOldPass)}
                  >
                    {showOldPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="flex flex-col items-start gap-1">
                <span className="font-bold flex flex-row items-center gap-1">
                  <FiLock className="text-gray-500" />
                  New Password:
                </span>
                <div className="relative w-auto max-w-xl">
                  <input
                    type={showNewPass ? "text" : "password"}
                    className="border border-gray-300 rounded-md px-2 py-1 w-full"
                    placeholder="Enter new password"
                    onChange={(e) => setNewPass(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                    onClick={() => setShowNewPass(!showNewPass)}
                  >
                    {showNewPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                // onClick={handleSubmit}
              >
                {isPending ? "Changing..." : "Change Password"}
              </button>
            </div>
          </AccordionItem>
          <AccordionItem
            key="3"
            aria-label="Premium Status"
            subtitle="Expand to check premium status expiration"
            title="Premium Status"
          >
            {user?.isPremium ? (
              <div className="px-5 py-2 space-y-4 text-left">
                <div className="text-2xl font-bold text-green-500">
                  Premium Active
                </div>
                <div className="text-lg">
                  Expires in:{" "}
                  <span className="font-bold">
                    {premiumTimeLeft || "Loading..."}
                  </span>{" "}
                  (dd:hh:mm:ss)
                </div>
              </div>
            ) : (
              <div className="px-5 py-2 space-y-4 text-xl font-bold text-red-500 text-left">
                Not a Premium User
              </div>
            )}
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default SettingPage;
