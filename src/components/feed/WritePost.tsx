'use client';

import { Button } from '@nextui-org/button';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { CiCircleList } from 'react-icons/ci';
import { GiNotebook } from 'react-icons/gi';
import { FaRegClock, FaHashtag } from 'react-icons/fa';
import { LuVegan } from 'react-icons/lu';
import { AiOutlineStar } from 'react-icons/ai';
import { BsDot } from 'react-icons/bs';
import { IoMdAdd } from 'react-icons/io';
import { useEffect, useRef, useState } from 'react';

import { useUser } from '@/src/context/user.provider';

import RichTextEditor from '../post/RichTextEditor';
import { FiX } from 'react-icons/fi';
import { Ingredient, InstructionStep, IRecipe } from '@/src/types';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/react';
import { useCreatePost } from '@/src/hooks/post.hooks';
import { uploadImageFile } from '@/src/utils/uploadImage';

const hash = '#';

const WritePost = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);
  const [isAddingInstruction, setIsAddingInstruction] = useState(false);
  const [isAddCookingTime, setIsAddCookingTime] = useState(false);
  const [isAddDiet, setIsAddDiet] = useState(false);
  const [isAddTag, setIsAddTag] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    name: '',
    amount: '',
  });
  const [instructions, setInstructions] = useState<InstructionStep[]>([]);
  const [newInstruction, setNewInstruction] = useState<string>('');
  const [cookingTime, setCookingTime] = useState<number>(0);
  const [instructionTime, setInstructionTime] = useState<number>(0);
  const [diet, setDiet] = useState<Set<string>>(new Set());
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>('');
  const [isPremium, setIsPremium] = useState<boolean>(false);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: handleCreatePost } = useCreatePost();

  const { user, isLoading } = useUser();
  const profileId = user?._id;
  const avatarUrl =
    user?.displayPicture || 'https://i.ibb.co.com/wcv1QBQ/5951752.png';

  const handleImageButtonClick = () => {
    setIsEditing(true);
    setIsAddingInstruction(false);
    setIsAddCookingTime(false);
    setIsAddingIngredient(false);
    setIsAddDiet(false);
    setIsAddTag(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File uploaded:', file);
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
    const fileInput = document.getElementById('image') as HTMLInputElement;

    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Handle adding ingredients
  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.amount) {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient({ name: '', amount: '' });
      setIsAddingIngredient(false);
    }
  };

  const handleDeleteIngredient = (index: number) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  // Handle adding instructions
  const handleAddInstruction = () => {
    if (newInstruction) {
      setInstructions([
        ...instructions,
        { details: newInstruction, time: instructionTime },
      ]);
      setNewInstruction('');
      setInstructionTime(0);
      setIsAddingInstruction(false);
    }
  };

  const handleDeleteInstruction = (index: number) => {
    const updatedInstructions = instructions.filter((_, i) => i !== index);
    setInstructions(updatedInstructions);
  };

  const stripHtmlTags = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  // Handle adding a tag
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags((prevTags) => {
        const updatedTags = [...prevTags, newTag];
        setNewTag('');
        setIsAddTag(false);
        return updatedTags;
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Diet options
  const diets = [
    { key: 'veg', label: 'Veg' },
    { key: 'vegan', label: 'Vegan' },
    { key: 'non_veg', label: 'Non Veg' },
  ];

  // handle premium
  const handlePremium = () => {
    if (isPremium) {
      setIsEditing(true);
      setIsAddingInstruction(false);
      setIsAddCookingTime(false);
      setIsAddingIngredient(false);
      setIsAddDiet(false);
      setIsAddTag(false);
      setIsPremium(false);
    } else {
      setIsEditing(true);
      setIsAddingInstruction(false);
      setIsAddCookingTime(false);
      setIsAddingIngredient(false);
      setIsAddDiet(false);
      setIsAddTag(false);
      setIsPremium(true);
    }
  };

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  // Handle create Post
  const handleSubmitPost = async () => {
    let uploadedImageUrl: string | null = null;

    if (imageFile) {
      uploadedImageUrl = await uploadImageFile(imageFile);
      if (!uploadedImageUrl) {
        alert('Image upload failed. Please try again.');

        return;
      }
    }

    const selectedDiet = Array.from(diet).join(', ');

    const newRecipe: Omit<IRecipe, '_id' | 'report'> = {
      title,
      description,
      ingredients,
      instructions,
      image: uploadedImageUrl || '',
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
    };

    console.log(newRecipe);
    handleCreatePost(newRecipe);

    // setTimeout(() => {
    //   window.location.reload();
    // }, 2000);
  };

  return (
    <div className="px-1 pb-4 border-b-1 mb-2">
      <div>
        <div className="flex items-start gap-2">
          <img
            src={avatarUrl}
            alt="user avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="w-full">
            {!isEditing && (
              <input
                type="text"
                placeholder="What's your new recipe?"
                readOnly
                className="w-full p-2 text-lg border-none rounded-full focus:ring-2 focus:ring-transparent focus:outline-none"
                onClick={() => setIsEditing(true)}
              />
            )}

            {isEditing && (
              <div>
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full p-2 text-lg border-none rounded-full focus:ring-2 focus:ring-transparent focus:outline-none"
                  ref={titleInputRef}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div className="ml-2 w-full">
                  <h3 className="text-zinc-700 text-lg">Description</h3>
                  <RichTextEditor
                    value={description}
                    onChange={setDescription}
                  />
                </div>
              </div>
            )}

            {/* Ingredients */}
            {ingredients.length > 0 && (
              <div className="my-2 ml-2">
                <h3 className="text-zinc-700 text-lg">Ingredients</h3>
                <ul className="list-disc pl-1">
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-700 flex items-center">
                      <BsDot />
                      {ingredient.amount} of {ingredient.name}
                      <Button
                        className="ml-2 p-1 rounded-full bg-transparent"
                        onClick={() => handleDeleteIngredient(index)}
                        isIconOnly
                      >
                        <FiX className="text-red-500" size={16} />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cooking Time */}
            {cookingTime > 0 && (
              <div className="my-2 ml-2 text-gray-700 flex items-center gap-1">
                <FaRegClock className="text-xl" />
                Cooking time {cookingTime} minutes.
              </div>
            )}

            {/* Cooking Instructions */}
            {instructions.length > 0 && (
              <div className="my-2 ml-2">
                <h3 className="text-zinc-700 text-lg">Instructions</h3>
                <ul className="list-disc pl-1">
                  {instructions.map((instruction, index) => (
                    <li key={index} className="text-gray-700 flex items-center">
                      <p>{index + 1}&nbsp;&nbsp;</p>
                      {stripHtmlTags(instruction.details)}
                      <Button
                        className="ml-2 p-1 rounded-full bg-transparent"
                        onClick={() => handleDeleteInstruction(index)}
                        isIconOnly
                      >
                        <FiX className="text-red-500" size={16} />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Diet */}
            {diet.size > 0 && (
              <div className="my-2 ml-2 flex items-center gap-1">
                {diet.has('veg') && (
                  <p className="text-green-500 flex flex-row items-center gap-1">
                    <LuVegan className="text-lg" /> Veg
                  </p>
                )}
                {diet.has('vegan') && (
                  <p className="text-lime-500 flex flex-row items-center gap-1">
                    <LuVegan className="text-lg" /> Vegan
                  </p>
                )}
                {diet.has('non_veg') && (
                  <p className="text-red-500 flex flex-row items-center gap-1">
                    <LuVegan className="text-lg" /> Non Veg
                  </p>
                )}
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="my-2 ml-2">
                <div className="flex space-x-2 mt-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 bg-gray-200 text-blue-500 px-2 py-1 rounded-full"
                    >
                      {hash}
                      {tag}
                      <FiX
                        className="cursor-pointer text-red-500"
                        onClick={() => removeTag(tag)}
                      />
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Premium */}
            {isPremium && (
              <div className="my-2 ml-2">
                <span className="flex items-center gap-1 text-yellow-600 px-2 py-1 rounded-full">
                  <AiOutlineStar className="text-lg" />
                  Premium Recipe
                </span>
              </div>
            )}

            {imagePreview && (
              <div className="relative my-5 w-full flex justify-center">
                <Button
                  className="absolute p-1 rounded-full z-10 bg-transparent"
                  onClick={clearImage}
                  isIconOnly
                  style={{ top: '-10px', right: '-5px' }} // Adjust the top value as needed
                >
                  <FiX className="text-red-500" size={24} />
                </Button>
                <div className="relative rounded-xl border-2 border-dashed border-default-300 p-2">
                  <img
                    alt="Preview"
                    className="h-full w-full object-cover object-center rounded-md"
                    src={imagePreview}
                  />
                </div>
              </div>
            )}

            <div className="my-3 ml-2">
              {isAddingIngredient && (
                <div className="flex space-x-4 mb-4">
                  <Input
                    placeholder="Ingredient name"
                    value={newIngredient.name}
                    onChange={(e) =>
                      setNewIngredient({
                        ...newIngredient,
                        name: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Amount"
                    value={newIngredient.amount}
                    onChange={(e) =>
                      setNewIngredient({
                        ...newIngredient,
                        amount: e.target.value,
                      })
                    }
                  />
                  <Button
                    isIconOnly
                    radius="full"
                    onClick={handleAddIngredient}
                  >
                    <IoMdAdd />
                  </Button>
                </div>
              )}

              {isAddCookingTime && (
                <div className="my-3 ml-2 sm:w-1/2 w-full">
                  <Input
                    required
                    label="Cooking Time (minutes)"
                    placeholder="Enter cooking time"
                    startContent={
                      <FaRegClock className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    type="number"
                    value={cookingTime.toString()}
                    onChange={(e) => setCookingTime(Number(e.target.value))}
                    onBlur={() => setIsAddCookingTime(false)}
                  />
                </div>
              )}

              {isAddingInstruction && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Instructions</h3>
                  <RichTextEditor
                    value={newInstruction}
                    onChange={setNewInstruction}
                  />
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
                </div>
              )}

              {isAddDiet && (
                <div className="flex flex-col gap-1">
                  <label className="text-lg font-medium" htmlFor="diet">
                    Food Diet
                  </label>
                  <Select
                    label="Select food diet"
                    selectedKeys={diet}
                    className="max-w-xs"
                    onSelectionChange={(keys) => {
                      setDiet(new Set(Array.from(keys).map(String)));
                      setIsAddDiet(false);
                    }}
                  >
                    {diets.map((diet) => (
                      <SelectItem key={diet.key}>{diet.label}</SelectItem>
                    ))}
                  </Select>
                </div>
              )}

              {isAddTag && (
                <div>
                  <Input
                    fullWidth
                    label="Tags"
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => {
                      setNewTag(e.target.value);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div>
            <Button
              radius="full"
              isIconOnly
              className="font-bold text-blue-500 bg-transparent"
              onClick={handleImageButtonClick}
            >
              <HiOutlinePhotograph size={20} />
            </Button>
            {/* Hidden input for file upload */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".png, .jpeg, .jpg"
              onChange={handleFileChange}
            />

            <Button
              radius="full"
              isIconOnly
              className="font-bold text-blue-500 bg-transparent"
              onClick={() => {
                setIsEditing(true);
                setIsAddingInstruction(false);
                setIsAddCookingTime(false);
                setIsAddDiet(false);
                setIsAddTag(false);
                setIsAddingIngredient(true);
              }}
            >
              <CiCircleList size={20} />
            </Button>

            <Button
              radius="full"
              isIconOnly
              className="font-bold text-blue-500 bg-transparent"
              onClick={() => {
                setIsEditing(true);
                setIsAddingInstruction(false);
                setIsAddingIngredient(false);
                setIsAddDiet(false);
                setIsAddTag(false);
                setIsAddCookingTime(true);
              }}
            >
              <FaRegClock size={20} />
            </Button>

            <Button
              radius="full"
              isIconOnly
              className="font-bold text-blue-500 bg-transparent"
              onClick={() => {
                setIsEditing(true);
                setIsAddingIngredient(false);
                setIsAddCookingTime(false);
                setIsAddDiet(false);
                setIsAddTag(false);
                setIsAddingInstruction(true);
              }}
            >
              <GiNotebook size={20} />
            </Button>

            <Button
              radius="full"
              isIconOnly
              className="font-bold text-blue-500 bg-transparent"
              onClick={() => {
                setIsEditing(true);
                setIsAddingInstruction(false);
                setIsAddCookingTime(false);
                setIsAddingIngredient(false);
                setIsAddTag(false);
                setIsAddDiet(true);
              }}
            >
              <LuVegan size={20} />
            </Button>

            <Button
              radius="full"
              isIconOnly
              className="font-bold text-blue-500 bg-transparent"
              onClick={() => {
                setIsEditing(true);
                setIsAddingInstruction(false);
                setIsAddCookingTime(false);
                setIsAddingIngredient(false);
                setIsAddDiet(false);
                setIsAddTag(true);
              }}
            >
              <FaHashtag size={20} />
            </Button>

            <Button
              radius="full"
              isIconOnly
              className="font-bold text-blue-500 bg-transparent"
              onClick={handlePremium}
            >
              <AiOutlineStar size={20} />
            </Button>
          </div>
          <Button
            radius="full"
            className="font-bold text-black bg-zinc-300"
            onClick={handleSubmitPost}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WritePost;
