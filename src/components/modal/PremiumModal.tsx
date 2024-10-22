/* eslint-disable no-console */
"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import { PiSealCheckFill } from "react-icons/pi";

import { IUser } from "@/src/types";
import { usePremiumPayment, useUpdateUser } from "@/src/hooks/user.hooks";
import envConfig from "@/src/config/envConfig";

interface IEditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser;
}

const PremiumModal = ({ isOpen, onClose, user }: IEditProfileModalProps) => {
  const [loggedUser, setloggedUser] = useState<typeof user>(user);

  const {
    // mutate: initiatePayment,
    isPending: premiumPayPending,
  } = usePremiumPayment(loggedUser._id!);

  const { mutate: handleUpdateUserApi } = useUpdateUser(loggedUser._id!);

  const handleClose = () => {
    onClose(); // Call the provided onClose function
  };

  const handleUpdatePremiumUser = async (updatedData: any) => {
    setloggedUser((prevUser) => ({ ...prevUser, ...updatedData }));
    console.log("Updated Data => ", updatedData);
    handleUpdateUserApi(updatedData);

    // const res = initiatePayment();
    const response = await axios.post(
      `${envConfig.baseApi}/payment/initiate-payment/${user._id}`,
    );

    const paymentUrl = response.data?.paymentSession?.payment_url;

    console.log("Payment res: ", response.data.paymentSession.payment_url);

    if (paymentUrl) {
      // Redirect user to the payment URL in the current tab
      window.location.href = paymentUrl;
    }
  };

  return (
    <Modal
      isDismissable={false}
      isOpen={isOpen}
      scrollBehavior="outside"
      onOpenChange={onClose}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            Be Premium Member
          </ModalHeader>
          <ModalBody>
            <Button
              color="warning"
              onPress={() => {
                handleUpdatePremiumUser({
                  _id: user._id,
                  isPremium: true,
                });
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
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={handleClose}>
              Cancel
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default PremiumModal;
