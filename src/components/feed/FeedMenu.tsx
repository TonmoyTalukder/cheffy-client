import React from "react";
import { Tabs, Tab } from "@nextui-org/react";

import RecipeFeed from "./RecipeFeed";
import FollowingRecipeFeed from "./FollowingRecipeFeed";
import WritePost from "./WritePost";

interface FeedMenuProps {
  userId: string;
  limit?: number;
}
const FeedMenu: React.FC<FeedMenuProps> = ({ userId }) => {
  return (
    <div>
      <Tabs
        aria-label="Tabs variants"
        variant="underlined"
        className="sticky top-0 h-[5vh] py-2 mt-0 mb-2 z-10 bg-white w-full"
      >
        <Tab key="foryou" title="For You" className="px-0">
          <div className="mt-3">
            <WritePost />
            <RecipeFeed userId={userId} />
          </div>
        </Tab>
        <Tab key="following" title="Following">
          <div className="mt-3">
            <WritePost />
            <FollowingRecipeFeed userId={userId} />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default FeedMenu;
