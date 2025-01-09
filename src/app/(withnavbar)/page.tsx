'use client';

import { useEffect } from 'react';

import { useUser } from '@/src/context/user.provider';
import FeedMenu from '@/src/components/feed/FeedMenu';

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionStorage.getItem('reloaded')) {
      // Reload the page and set a flag to avoid infinite loop
      sessionStorage.setItem('reloaded', 'true');
      window.location.reload();
    }
  }, []);
  const { user, isLoading } = useUser();

  const loggedUserId = user?._id;

  console.log('User => ', user);
  console.log('isLoading => ', isLoading);

  return (
    <section className="flex flex-col items-center justify-center mt-0">
      {loggedUserId && <FeedMenu userId={loggedUserId} />}
    </section>
  );
}
