'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import TopRecipies from '../suggestion/TopRecipies';
import WhomTOFollow from '../suggestion/WhomTOFollow';
import SearchBar from '../suggestion/SearchBar';

const SuggestionBar = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const isExplorePage = pathname.startsWith('/explore');

  return (
    <div
      className="max-h-screen w-full suggestion-content"
      style={{
        zIndex: 50,
      }}
    >
      <div className="p-4 z-10 flex flex-col items-center gap-2">
        {!isExplorePage && <SearchBar />}
        <WhomTOFollow />
        <TopRecipies />
        <div className="mt-2 text-center text-sm text-gray-500">
          <p>© {currentYear} Cheffy. All rights reserved.</p>
          <p>
            Developer{' '}
            <Link href="https://tonmoytalukder.github.io/dev">
              <span className="text-amber-600 hover:underline">
                Tonmoy Talukder
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuggestionBar;
