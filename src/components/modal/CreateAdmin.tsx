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

interface ICreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newAdmin: IUser) => void;
}

const CreateAdminModal = ({
  isOpen,
  onClose,
  onCreate,
}: ICreateAdminModalProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null,
  );

  const [inputTopic, setInputTopic] = useState<string>("");
  const [topics, setTopics] = useState<string[]>([]);

  const methods = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      foodHabit: "",
      sex: "",
      bio: "",
    },
  });

  const handleClose = () => {
    methods.reset(); // Reset form data
    setImageFile(null); // Reset the image file
    setCoverImageFile(null); // Reset the cover image file
    setImagePreview(null); // Reset the image preview
    setCoverImagePreview(null); // Reset the cover image preview
    setTopics([]); // Reset the topics
    onClose(); // Close the modal
  };

  const onSubmit = async (data: any) => {
    console.log("Form Submitted", data); // Log form data
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

    const finalData: IUser = {
      ...data,
      displayPicture: uploadedDisplayPictureUrl || "",
      coverPicture: uploadedCoverPictureUrl || "",
      topics,
    };

    console.log("Final Data => ", finalData); // Log final admin data
    onCreate(finalData);
    handleClose();
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

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();

      reader.onloadend = () => setCoverImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

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

  // Wrap submit with type compatibility for PressEvent
  const handlePressSubmit = () => {
    methods.handleSubmit(onSubmit)();
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
            Create New User
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
                    type="text"
                    {...methods.register("name", { required: true })}
                    placeholder="Enter name"
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
                    type="email"
                    {...methods.register("email", { required: true })}
                    placeholder="Enter email"
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
                    type="text"
                    {...methods.register("phone", { required: true })}
                    placeholder="Enter phone number"
                  />
                </div>

                {/* City */}
                <div>
                  <CFAsyncSelect
                    label="City"
                    loadOptions={fetchCities}
                    name="city"
                    placeholder="Type your city"
                    onChange={(selectedCity) => {
                      methods.setValue("city", selectedCity);
                    }}
                  />
                </div>

                {/* Food Habit */}
                <div>
                  <label className="block font-medium" htmlFor="foodHabit">
                    Food Habit
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    id="foodHabit"
                    {...methods.register("foodHabit")}
                  >
                    <option value="">Select food habit</option>
                    <option value="veg">Vegetarian</option>
                    <option value="non_veg">Non-Vegetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="block font-medium" htmlFor="sex">
                    Gender
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    id="sex"
                    {...methods.register("sex")}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Bio */}
                <div>
                  <label className="block font-medium" htmlFor="bio">
                    Bio
                  </label>
                  <input
                    className="w-full p-2 border rounded-md"
                    id="bio"
                    type="text"
                    {...methods.register("bio")}
                    placeholder="Enter bio"
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
                      <div className="relative size-48 rounded-xl border-2 border-dashed border-default-300 p-2">
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
                  <input
                    className="w-full p-2 border rounded-md"
                    id="topics"
                    type="text"
                    value={inputTopic}
                    onChange={handleTopicInputChange}
                    onKeyPress={handleTopicKeyPress}
                    placeholder="Add a topic and press enter"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {topics.map((topic, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 border p-2 rounded-md"
                      >
                        <span>{topic}</span>
                        <button
                          className="text-red-500"
                          onClick={() => removeTopic(topic)}
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <Button color="primary" onPress={handlePressSubmit}>
                  Create User
                </Button>
              </form>
            </FormProvider>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" color="danger" onPress={handleClose}>
              Close
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default CreateAdminModal;
