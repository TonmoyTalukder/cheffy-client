'use client';

import { useUser } from '@/src/context/user.provider';
import { GoArrowLeft } from 'react-icons/go';
import { useRouter } from 'next/navigation';

const BackRouter = () => {
  const { user } = useUser();
  const router = useRouter();

  const handleBack = () => {
    router.back(); // Navigate to the previous route
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-1 text-lg font-bold text-gray-500 h-full"
      style={{ zIndex: 100 }}
    >
      <GoArrowLeft
        style={{
          fontWeight: 'bold',
          strokeWidth: 1.2,
        }}
      />
      <p>{user?.name}</p>
    </button>
  );
};

export default BackRouter;
