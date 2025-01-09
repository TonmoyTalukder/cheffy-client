'use client';

import { useUser } from '@/src/context/user.provider';
import { Button } from '@nextui-org/button';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { CiCircleList } from 'react-icons/ci';
import { GiNotebook } from 'react-icons/gi';
import { FaRegClock, FaHashtag } from 'react-icons/fa';
import { LuVegan } from 'react-icons/lu';
import { AiOutlineStar } from 'react-icons/ai';
import { useEffect, useRef, useState } from 'react';
import RichTextEditor from '../post/RichTextEditor';

const WritePost = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  const { user, isLoading } = useUser();
  const avatarUrl =
    user?.displayPicture || 'https://i.ibb.co.com/wcv1QBQ/5951752.png';
  return (
    <div className="px-1 pb-4">
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
                <div className=" ml-2 w-full">
                  <label
                    className="text-zinc-700 text-lg"
                    htmlFor="Description"
                  >
                    Description
                  </label>
                  <RichTextEditor
                    value={description}
                    onChange={setDescription}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div>
            <Button
              radius="full"
              isIconOnly
              className="font-bold text-blue-500 bg-transparent"
            >
              <HiOutlinePhotograph size={20} />
            </Button>
            <Button
              radius="full"
              isIconOnly
              className="font-bold text-blue-500 bg-transparent"
            >
              <CiCircleList size={20} />
            </Button>
            <Button
              radius="full"
              isIconOnly
              className="font-bold text-blue-500 bg-transparent"
            >
              <FaRegClock size={20} />
            </Button>
            <Button
              radius="full"
              isIconOnly
              className="font-bold text-blue-500 bg-transparent"
            >
              <GiNotebook size={20} />
            </Button>
            <Button
              radius="full"
              isIconOnly
              className="font-bold text-blue-500 bg-transparent"
            >
              <LuVegan size={20} />
            </Button>
            <Button
              radius="full"
              isIconOnly
              className="font-bold text-blue-500 bg-transparent"
            >
              <FaHashtag size={20} />
            </Button>
            <Button
              radius="full"
              isIconOnly
              className="font-bold text-blue-500 bg-transparent"
            >
              <AiOutlineStar size={20} />
            </Button>
          </div>
          <Button radius="full" className="font-bold text-black bg-zinc-300 ">
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WritePost;
