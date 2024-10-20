/* eslint-disable no-console */
import { useState, ChangeEvent, KeyboardEvent } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
} from "@nextui-org/react";
import { FiX } from "react-icons/fi";
import { FormProvider, useForm } from "react-hook-form";

import { IUser } from "@/src/types";
import CFAsyncSelect from "@/src/components/form/CFAsyncSelect";
import { fetchCities } from "@/src/components/UI/fetchCities";
import { uploadImageFile } from "@/src/utils/uploadImage";

// Reuse the image upload function from the signup component
// const uploadImageFile = async (file: File): Promise<string | null> => {
//   // Similar image upload logic as in SignUpPage
//   try {
//     const imgData = new FormData();

//     imgData.append("photo", file);
//     const response = await fetch(
//       `https://cheffy-server.vercel.app/api/image-upload/`,
//       {
//         method: "POST",
//         body: imgData,
//       },
//     );

//     // Log the response for debugging
//     console.log("Response Status:", response.status);

//     if (!response.ok) {
//       throw new Error("Image upload failed with status " + response.status);
//     }

//     const data = await response.json();

//     return data.data.path || data.data.url;
//   } catch (error) {
//     console.error("Error uploading image:", error);

//     return "";
//   }
// };

interface IEditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: IUser;
  onUpdate: (updatedData: IUser) => void;
}

const EditProfileModal = ({
  isOpen,
  onClose,
  userData,
  onUpdate,
}: IEditProfileModalProps) => {
  const [updatedData, setUpdatedData] = useState<IUser>(userData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    userData.displayPicture || null,
  );
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    userData.coverPicture || null,
  );

  const [inputTopic, setInputTopic] = useState<string>("");
  const [topics, setTopics] = useState<string[]>(userData.topics || []);

  const methods = useForm({
    defaultValues: {
      city: updatedData.city || "", // Set city default value
    },
  }); // Initialize form methods

  const handleClose = () => {
    setUpdatedData(userData); // Reset the form data to original user data
    setImageFile(null); // Reset the image file
    setCoverImageFile(null); // Reset the cover image file
    setImagePreview(userData.displayPicture || null); // Reset the image preview
    setCoverImagePreview(userData.coverPicture || null); // Reset the image preview
    setTopics(userData.topics || []); // Reset the topics
    onClose(); // Call the provided onClose function
  };

  const onSubmit = (data: any) => {
    console.log(data);
  };

  // Handle form inputs
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUpdatedData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle image changes
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);
      const reader = new FileReader();

      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Clear image input
  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Handle cover image changes
  const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();

      reader.onloadend = () => setCoverImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Clear cover image input
  const clearCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview(null);
  };

  // Handle topics input
  const handleTopicInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputTopic(e.target.value);
  };

  const handleTopicKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputTopic.trim()) {
      e.preventDefault();
      setTopics([...topics, inputTopic.trim()]);
      setInputTopic("");
    }
  };

  const removeTopic = (topicToRemove: string) => {
    setTopics(topics.filter((topic) => topic !== topicToRemove));
  };

  const handleUpdate = async () => {
    let uploadedDisplayPictureUrl = imagePreview;
    let uploadedCoverPictureUrl = coverImagePreview;

    if (imageFile) {
      uploadedDisplayPictureUrl = await uploadImageFile(imageFile);
      if (!uploadedDisplayPictureUrl) {
        alert("Display image upload failed");

        return;
      }
    }

    if (coverImageFile) {
      uploadedCoverPictureUrl = await uploadImageFile(coverImageFile);
      if (!uploadedCoverPictureUrl) {
        alert("Cover image upload failed");

        return;
      }
    }

    const finalData = {
      ...updatedData,
      displayPicture: uploadedDisplayPictureUrl || "",
      coverPicture: uploadedCoverPictureUrl || "",
      topics,
    };

    onUpdate(finalData);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    handleClose();
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
            Edit Profile
          </ModalHeader>
          <ModalBody>
            <FormProvider {...methods}>
              <form
                className="space-y-4"
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                {/* Name */}
                <div>
                  <label className="block font-medium" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="w-full p-2 border rounded-md"
                    id="name"
                    name="name"
                    type="text"
                    value={updatedData.name}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-medium" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="w-full p-2 border rounded-md"
                    id="email"
                    name="email"
                    type="email"
                    value={updatedData.email}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-medium" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    className="w-full p-2 border rounded-md"
                    id="phone"
                    name="phone"
                    type="text"
                    value={updatedData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                {/* City */}
                <div>
                  {/* <label className="block font-medium" htmlFor="city">
                      City
                    </label> */}

                  <CFAsyncSelect
                    label="City"
                    loadOptions={fetchCities} // Your function to load city options
                    name="city"
                    placeholder="Type your city"
                    //   onChange={(e) => console.log("Selected city: ", e)}
                    onChange={(selectedCity) => {
                      // Update the city in the form state
                      setUpdatedData((prevData) => ({
                        ...prevData,
                        city: selectedCity, // selectedCity will be the string value
                      }));
                    }}
                  />
                </div>

                {/* Food Habit */}
                <div>
                  <label className="block font-medium" htmlFor="foodHabit">
                    Food Habit
                  </label>
                  <input
                    className="w-full p-2 border rounded-md"
                    id="foodHabit"
                    name="foodHabit"
                    type="text"
                    value={updatedData.foodHabit}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block font-medium" htmlFor="sex">
                    Gender
                  </label>
                  <input
                    className="w-full p-2 border rounded-md"
                    id="sex"
                    name="sex"
                    type="text"
                    value={updatedData.sex}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block font-medium" htmlFor="bio">
                    Bio
                  </label>
                  <input
                    className="w-full p-2 border rounded-md"
                    id="bio"
                    name="bio"
                    type="text"
                    value={updatedData.bio || ""}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Image Upload */}
                <div className="py-3">
                  <label className="block font-medium" htmlFor="image">
                    Upload Display Picture
                  </label>
                  <Input
                    id="image"
                    name="image"
                    size="md"
                    type="file"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="relative my-5 flex justify-center">
                      <div className="relative size-48 rounded-xl border-2 border-dashed border-default-300 p-2">
                        <img
                          alt="profile"
                          className="h-full w-full object-cover object-center rounded-md"
                          src={imagePreview}
                        />
                        <button
                          className="absolute top-0 right-0 bg-white p-1 rounded-full"
                          onClick={clearImage}
                        >
                          <FiX className="text-red-500" size={24} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cover Image Upload */}
                <div className="py-3">
                  <label className="block font-medium" htmlFor="coverImage">
                    Upload Cover Picture
                  </label>
                  <Input
                    id="coverImage"
                    name="coverImage"
                    size="md"
                    type="file"
                    onChange={handleCoverImageChange}
                  />
                  {coverImagePreview && (
                    <div className="relative my-5 flex justify-center">
                      <div className="relative rounded-xl border-2 border-dashed border-default-300 p-2">
                        <img
                          alt="cover"
                          className="h-full w-full object-cover object-center rounded-md"
                          src={coverImagePreview}
                        />
                        <button
                          className="absolute top-0 right-0 bg-white p-1 rounded-full"
                          onClick={clearCoverImage}
                        >
                          <FiX className="text-red-500" size={24} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Topics */}
                <div>
                  <label className="block font-medium" htmlFor="topics">
                    Topics
                  </label>
                  <Input
                    label="Topics"
                    placeholder="Enter a topic and press enter"
                    value={inputTopic}
                    onChange={handleTopicInputChange}
                    onKeyDown={handleTopicKeyPress}
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <div
                        key={topic}
                        className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-full"
                      >
                        <span className="text-black">{topic}</span>
                        <FiX
                          className="cursor-pointer text-red-500"
                          onClick={() => removeTopic(topic)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </FormProvider>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={handleClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={() => {
                handleUpdate();
                // setTimeout(() => {
                //   window.location.reload(); // Reload the window
                // }, 1000);
              }}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default EditProfileModal;
