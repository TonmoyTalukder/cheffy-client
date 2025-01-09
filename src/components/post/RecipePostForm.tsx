"use client";

import { useState, ChangeEvent } from "react";
import { Button, Input, Checkbox, Select, SelectItem } from "@nextui-org/react";
import { FaRegClock } from "react-icons/fa6";
import { FiX } from "react-icons/fi";

import { IRecipe, Ingredient, InstructionStep } from "@/src/types";
import { uploadImageFile } from "@/src/utils/uploadImage";
import { useUser } from "@/src/context/user.provider";
import { useCreatePost } from "@/src/hooks/post.hooks";

import RichTextEditor from "./RichTextEditor";

const RecipePostForm = () => {
  const { mutate: handleCreatePost } = useCreatePost(); //isPending, isSuccess

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>(""); // Rich text for description
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    name: "",
    amount: "",
  });
  const [instructions, setInstructions] = useState<InstructionStep[]>([]);
  const [newInstruction, setNewInstruction] = useState<string>(""); // Rich text for new instruction step
  const [instructionTime, setInstructionTime] = useState<number>(0); // Time for each instruction
  const [cookingTime, setCookingTime] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>(""); // Input for new tag
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [diet, setDiet] = useState<Set<string>>(new Set());
  const { user } = useUser();
  const profileId = user?._id;

  // Show loading if user data is being fetched
  if (!profileId) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  // Handle image change
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

  // Handle adding ingredients
  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.amount) {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient({ name: "", amount: "" });
    }
  };

  // Handle adding instructions
  const handleAddInstruction = () => {
    if (newInstruction) {
      setInstructions([
        ...instructions,
        { details: newInstruction, time: instructionTime },
      ]);
      setNewInstruction("");
      setInstructionTime(0);
    }
  };

  // Handle adding a tag
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const diets = [
    { key: "veg", label: "Veg" },
    { key: "vegan", label: "Vegan" },
    { key: "non veg", label: "Non Veg" },
  ];

  // Handle form submission
  const handleFormSubmit = async () => {
    let uploadedImageUrl: string | null = null;

    if (imageFile) {
      uploadedImageUrl = await uploadImageFile(imageFile);
      if (!uploadedImageUrl) {
        alert("Image upload failed. Please try again.");

        return;
      }
    }

    const selectedDiet = Array.from(diet).join(", ");

    const newRecipe: Omit<IRecipe, "_id"> = {
      title,
      description,
      ingredients,
      instructions,
      image: uploadedImageUrl || "",
      cookingTime,
      ratings: [],
      ratingsCount: 0,
      tags,
      votes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: profileId!.toString(),
      premium: isPremium,
      comments: [],
      diet: selectedDiet,
      report: "0",
    };

    console.log(newRecipe);
    handleCreatePost(newRecipe);

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 rounded-lg shadow-lg border border-gray-200">
      {/* <h2 className="text-3xl font-bold text-center mb-6">Post a New Recipe</h2> */}

      {/* Recipe Title */}
      <div className="mb-6">
        <Input
          fullWidth
          required
          label="Recipe Title"
          placeholder="Enter recipe title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label
          className="block text-lg font-medium mb-2"
          htmlFor="recipe-description"
        >
          Description
        </label>
        <RichTextEditor value={description} onChange={setDescription} />
      </div>

      {/* Ingredients */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Ingredients</h3>
        <div className="flex space-x-4 mb-4">
          <Input
            placeholder="Ingredient name"
            value={newIngredient.name}
            onChange={(e) =>
              setNewIngredient({ ...newIngredient, name: e.target.value })
            }
          />
          <Input
            placeholder="Amount"
            value={newIngredient.amount}
            onChange={(e) =>
              setNewIngredient({ ...newIngredient, amount: e.target.value })
            }
          />
          <Button onClick={handleAddIngredient}>Add</Button>
        </div>

        <ul className="list-disc pl-5">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="text-gray-700">
              {ingredient.amount} of {ingredient.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Cooking Instructions */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Instructions</h3>
        <RichTextEditor value={newInstruction} onChange={setNewInstruction} />
        <br />
        <Input
          label="Instruction step time (minutes)"
          placeholder="Time (minutes)"
          startContent={
            <FaRegClock className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          type="number"
          value={instructionTime.toString()}
          onChange={(e) => setInstructionTime(Number(e.target.value))}
        />
        <Button className="mt-4" onClick={handleAddInstruction}>
          Add Instruction
        </Button>

        <ul className="list-decimal pl-5 mt-4">
          {instructions.map((instruction, index) => (
            <li key={index} className="text-gray-700">
              {instruction.details} - {instruction.time} minutes
            </li>
          ))}
        </ul>
      </div>

      {/* Cooking Time */}
      <div className="mb-6">
        <Input
          fullWidth
          required
          label="Cooking Time (minutes)"
          placeholder="Enter cooking time"
          startContent={
            <FaRegClock className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          type="number"
          value={cookingTime.toString()}
          onChange={(e) => setCookingTime(Number(e.target.value))}
        />
      </div>

      {/* Tags */}
      <div className="mb-6">
        <Input
          fullWidth
          label="Tags"
          placeholder="Add a tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
        />
        <div className="flex space-x-2 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-1 bg-gray-200 text-black px-2 py-1 rounded-full"
            >
              {tag}
              <FiX
                className="cursor-pointer text-red-500"
                onClick={() => removeTag(tag)}
              />
            </span>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2" htmlFor="image">
          Upload Image
        </label>
        <input
          accept="image/*"
          id="image"
          type="file"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <div className="relative my-5 w-full flex justify-center">
            <div className="relative size-48 rounded-xl border-2 border-dashed border-default-300 p-2">
              <img
                alt="Preview"
                className="h-full w-full object-cover object-center rounded-md"
                src={imagePreview}
              />
              <button
                className="absolute top-0 right-0 p-1 rounded-full"
                onClick={clearImage}
              >
                <FiX className="text-red-500" size={24} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Diet Selection */}
      <div className="mb-6">
        <label className="text-lg font-medium" htmlFor="diet">
          Food Diet
        </label>
        <Select
          label="Select food diet"
          selectedKeys={diet}
          className="max-w-xs"
          onSelectionChange={
            (keys) => setDiet(new Set(Array.from(keys).map(String))) // Convert to array and then to strings
          }
        >
          {diets.map((diet) => (
            <SelectItem key={diet.key}>{diet.label}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Premium Option */}
      <div className="mb-6 flex items-center">
        <Checkbox
          className="mr-2"
          isSelected={isPremium}
          onChange={(e) => setIsPremium(e.target.checked)}
        />
        <label className="text-lg font-medium" htmlFor="premium-recipe">
          Premium Recipe
        </label>
      </div>

      {/* Submit */}
      <div className="text-center">
        <Button size="lg" onClick={handleFormSubmit}>
          Submit Recipe
        </Button>
      </div>
    </div>
  );
};

export default RecipePostForm;
