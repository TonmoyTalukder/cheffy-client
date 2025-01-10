'use client';

import { useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Card,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';

const PremiumPlanPage = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    onOpen(); // Open the modal when the page loads
  }, [onOpen]);

  const handleClose = () => {
    onOpenChange(); // Close the modal
    router.back(); // Redirect to the previous page
  };

  return (
    <div>
      <Modal isOpen={isOpen} size="full" onOpenChange={handleClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="flex flex-col gap-6 items-center justify-center">
                <div className="text-center flex flex-col gap-2">
                  <h2 className="text-3xl font-bold text-gray-800">
                    Premium Plan
                  </h2>
                  <p className="text-sm text-gray-500">
                    Unlock exclusive benefits for just $30/month
                  </p>
                </div>
                <div className="flex flex-col items-center gap-6 w-full lg:w-1/5 bg-transparent">
                  {/* Benefits Section */}
                  <div className="flex flex-col gap-4 w-fit">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full">
                        <i className="fas fa-star"></i>
                      </div>
                      <p className="text-lg text-gray-700 font-medium">
                        Post Premium Recipes
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full">
                        <i className="fas fa-book-open"></i>
                      </div>
                      <p className="text-lg text-gray-700 font-medium">
                        Read Premium Recipes
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-yellow-500 text-white rounded-full">
                        <i className="fas fa-crown"></i>
                      </div>
                      <p className="text-lg text-gray-700 font-medium">
                        Access Exclusive Content
                      </p>
                    </div>
                  </div>
                  {/* Pricing Section */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800">
                      $30 / Month
                    </h3>
                    <p className="text-sm text-gray-500">
                      Cancel anytime, no hidden fees
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex flex-col items-end">
                <Button
                  className="bg-red-600 hover:bg-gray-200 text-white hover:text-gray-700 font-medium py-3 rounded-lg w-fit"
                  onPress={handleClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PremiumPlanPage;
