/* eslint-disable no-console */
"use client";

import { ChangeEvent, useState, KeyboardEvent, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { FiX } from "react-icons/fi";
import { Input } from "@nextui-org/input";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { NextPage } from "next";
import Image from "next/image";

import CFForm from "@/src/components/form/CFForm";
import CFInput from "@/src/components/form/CFInput";
import CFSelect from "@/src/components/form/CFSelect";
import CFAsyncSelect from "@/src/components/form/CFAsyncSelect";
import CFTextarea from "@/src/components/form/CFTextArea";
import { fetchCities } from "@/src/components/UI/fetchCities";
import { useUser } from "@/src/context/user.provider";
import { useUserRegistration } from "@/src/hooks/auth.hooks";
import { uploadImageFile } from "@/src/utils/uploadImage";

const SignUpPage: NextPage = () => {
  const { setIsLoading: userLoading } = useUser();
  const {
    mutate: handleUserSignUp,
    isPending,
    isSuccess,
  } = useUserRegistration();
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get("redirect");

  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [inputTopic, setInputTopic] = useState<string>("");
  const [cityInputValue, setCityInputValue] = useState<string>("");
  // const [isCityInputNotEmpty, setIsCityInputNotEmpty] =
  //   useState<boolean>(false);
  const [isNext, setIsNext] = useState<boolean>(false);

  // useEffect(() => {
  //   setIsCityInputNotEmpty(cityInputValue.length > 0);
  // }, [cityInputValue]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    sex: "",
    city: "",
    bio: "",
    foodHabit: "",
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);

    const fileInput = document.getElementById("image") as HTMLInputElement;

    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async () => {
    let uploadedImageUrl: string | null = null;

    if (imageFile) {
      // Upload image file first
      uploadedImageUrl = await uploadImageFile(imageFile);
      console.log(uploadedImageUrl);
      if (!uploadedImageUrl) {
        alert("Image upload failed. Please try again.");
        uploadedImageUrl =
          "https://i.ibb.co.com/M5JS5qL/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png";

        return;
      }
    }

    const userData = {
      displayPicture:
        uploadedImageUrl ||
        "https://i.ibb.co.com/M5JS5qL/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png",
      ...formData,
      topics: topics,
    };

    console.log("Sign Up Data =>", userData);

    handleUserSignUp(userData);
    userLoading(true);
  };

  useEffect(() => {
    if (!isPending && isSuccess) {
      if (redirect) {
        router.push(redirect);
      } else {
        router.replace("/");
      }
    }
  }, [isPending, isSuccess]);

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const previousStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.phone;
      case 2:
        return (
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          formData.sex
        );
      case 3:
        // return formData.city;
        // Make city optional
        return true;
      case 4:
        // return !!imageFile;
        // Make imageFile optional
        return true;
      case 5:
        console.log("formData after 5th step next button click => ", formData);

        return formData.bio;
      case 6:
        return formData.foodHabit && topics;
      default:
        return true;
    }
  };

  const handleInputChange = (name: string, value: string) => {
    console.log("Input change detected:", name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "city" && value.length > 0) {
      setIsNext(true);
    }
  };

  const handleCityChange = (value: string | null) => {
    if (value) {
      handleInputChange("city", value);
    } else {
      handleInputChange("city", cityInputValue);
    }
  };

  const handleCityInputChange = (inputValue: string) => {
    setCityInputValue(inputValue);
  };

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

  return (
    <div className="w-full">
      <div className="flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center">
        <div className="flex items-center gap-2">
          <Image
            alt="Logo"
            height={Number(50)}
            src="/cheffy.svg"
            width={Number(50)}
          />
          <p className="font-bold text-inherit text-4xl">Cheffy</p>
        </div>
        <h3 className="my-2 text-xl font-bold">Sign Up</h3>
        <p className="mb-4">Create your account in a few steps</p>
        <div className="w-[75%] md:w-[55%] lg:w-[35%]">
          <CFForm onSubmit={onSubmit}>
            {step === 1 && (
              <>
                <div className="py-3">
                  <CFInput
                    isRequired
                    label="Name"
                    name="name"
                    type="text"
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="py-3">
                  <CFInput
                    isRequired
                    label="Email"
                    name="email"
                    type="email"
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div className="py-3">
                  <CFInput
                    isRequired
                    label="Phone Number"
                    name="phone"
                    // type="tel"
                    type="text"
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                <Button
                  className="my-3 w-full rounded-md bg-default-900 font-semibold text-default"
                  size="lg"
                  type="button"
                  onClick={nextStep}
                >
                  Next
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="py-3">
                  <CFInput
                    isRequired
                    label="Password"
                    name="password"
                    type="password"
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                  />
                </div>
                <div className="py-3">
                  <CFInput
                    isRequired
                    label="Confirm Password"
                    name="confirm_password"
                    type="password"
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                  />
                </div>
                <div className="py-3">
                  <CFSelect
                    isRequired
                    label="Sex"
                    name="sex"
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                    ]}
                    onChange={(value) => handleInputChange("sex", value)} // Directly pass the value
                  />
                </div>
                <div className="flex justify-between">
                  <Button
                    className="my-3 rounded-md bg-default-500 font-semibold text-default"
                    size="lg"
                    type="button"
                    onClick={previousStep}
                  >
                    Previous
                  </Button>
                  <Button
                    className="my-3 rounded-md bg-default-900 font-semibold text-default"
                    size="lg"
                    type="button"
                    onClick={nextStep}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="py-3">
                  <CFAsyncSelect
                    label="City"
                    loadOptions={fetchCities}
                    name="city"
                    placeholder="Type your city"
                    // onChange={(value) => {
                    //   console.log("Location Value => ", value);
                    //   handleInputChange("city", value);
                    // }}
                    onInputChange={handleCityInputChange}
                    onChange={handleCityChange}
                  />
                </div>
                <div className="flex justify-between">
                  <Button
                    className="my-3 rounded-md bg-default-500 font-semibold text-default"
                    size="lg"
                    type="button"
                    onClick={previousStep}
                  >
                    Previous
                  </Button>
                  <Button
                    className="my-3 rounded-md bg-default-900 font-semibold text-default"
                    size="lg"
                    type="button"
                    onClick={nextStep}
                  >
                    {!isNext ? <span>SKip</span> : <span>Next</span>}
                  </Button>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div className="py-3">
                  <Input
                    isRequired
                    label="Upload Image"
                    name="image"
                    size="md"
                    type="file"
                    variant="bordered"
                    onChange={handleImageChange}
                  />
                </div>
                {imagePreview && (
                  <div className="relative my-5 w-full flex justify-center">
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
                <div className="flex justify-between">
                  <Button
                    className="my-3 rounded-md bg-default-500 font-semibold text-default"
                    size="lg"
                    type="button"
                    onClick={previousStep}
                  >
                    Previous
                  </Button>
                  <Button
                    className="my-3 rounded-md bg-default-900 font-semibold text-default"
                    size="lg"
                    type="button"
                    onClick={nextStep}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <div className="py-3">
                  <CFTextarea
                    isRequired
                    label="Bio"
                    name="bio"
                    onChange={(value) => handleInputChange("bio", value)}
                  />
                </div>
                <div className="flex justify-between">
                  <Button
                    className="my-3 rounded-md bg-default-500 font-semibold text-default"
                    size="lg"
                    type="button"
                    onClick={previousStep}
                  >
                    Previous
                  </Button>
                  <Button
                    className="my-3 rounded-md bg-default-900 font-semibold text-default"
                    size="lg"
                    type="button"
                    onClick={nextStep}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {step === 6 && (
              <>
                <div className="py-3">
                  <CFSelect
                    isRequired
                    label="Food Habit"
                    name="foodHabit"
                    options={[
                      { label: "Vegan", value: "vegan" },
                      { label: "Vegetarian", value: "veg" },
                      { label: "Non-Vegetarian", value: "non_veg" },
                    ]}
                    onChange={(value) => handleInputChange("foodHabit", value)}
                  />
                </div>
                <div className="py-3">
                  <Input
                    label="Cuisine Topics"
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
                <div className="flex justify-between">
                  <Button
                    className="my-3 rounded-md bg-default-500 font-semibold text-default"
                    size="lg"
                    type="button"
                    onClick={previousStep}
                  >
                    Previous
                  </Button>
                  <Button
                    className="my-3 rounded-md bg-default-900 font-semibold text-default"
                    size="lg"
                    type="submit"
                  >
                    Sign Up
                  </Button>
                </div>
              </>
            )}

            <div className="text-center">
              Already have account ?{" "}
              <Link
                className="text-[#daa611] hover:text-[#a58a40] underline"
                href={"/login"}
              >
                Login here
              </Link>
            </div>
          </CFForm>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
