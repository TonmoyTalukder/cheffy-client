// LoadingRecipeCard.tsx

import { Avatar, Button, Skeleton } from "@nextui-org/react";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { FaShareFromSquare } from "react-icons/fa6";
import { MdOutlineReportProblem } from "react-icons/md";

const LoadingRecipeCard: React.FC = () => {
  return (
    <div className="recipe-card border p-4 mb-4 shadow-sm rounded-lg w-full">
      <div className="flex items-center mb-3">
        <Skeleton
          as={Avatar}
          isBordered
          radius="full"
          size="lg"
          className="w-12 h-12"
        />
        <div className="ml-3">
          <Skeleton className="w-24 h-4 mb-2" />
          <Skeleton className="w-16 h-3" />
        </div>
        <Button
          startContent={
            <MdOutlineReportProblem className="text-red-500" size={24} />
          }
          size="sm"
          variant="flat"
          className="ml-auto"
          isDisabled
        />
      </div>

      {/* Recipe Image Skeleton */}
      <div className="relative w-full h-56 mb-4">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Recipe Info Skeleton */}
      <Skeleton className="w-3/4 h-6 mb-2" />
      <Skeleton className="w-1/3 h-4 mb-2" />

      <div className="text-gray-500 mt-2">
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-5/6 h-4" />
      </div>

      {/* Voting and Sharing Skeleton */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          <Button
            startContent={<BiUpvote className="text-green-500" size={24} />}
            size="sm"
            variant="flat"
            isDisabled
          >
            <Skeleton className="w-8 h-4" />
          </Button>
          <Button
            startContent={<BiDownvote className="text-red-500" size={24} />}
            size="sm"
            variant="flat"
            isDisabled
          >
            <Skeleton className="w-8 h-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            startContent={<FaRegEdit className="text-yellow-500" size={24} />}
            size="sm"
            variant="flat"
            isDisabled
          />
          <Button
            startContent={<FaShareFromSquare size={24} />}
            size="sm"
            variant="flat"
            isDisabled
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingRecipeCard;
