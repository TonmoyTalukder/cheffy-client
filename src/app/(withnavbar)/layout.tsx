import SideNavbar from "@/src/components/UI/SideNavbar";
import SuggestionBar from "@/src/components/UI/Suggestionbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full max-w-screen-xl mx-auto">
        <main className="mt-5 sm:mt-0">
          <div className="flex flex-row">
            {/* Sidebar */}
            <div className="hidden md:block basis-1/5 md:max-w-16 lg:max-w-full">
              {/*max-w-64 */}
              <SideNavbar />
            </div>

            <div className="basis-full md:flex-grow md:basis-4/5 mx-2 md:mx-1">
              <div className="flex flex-row">
                {/* Main Content */}
                <div className="basis-full md:basis-3/5 mx-2 sm:mx-1">
                  {children}
                </div>

                {/* Column 3 - Suggestion Bar */}
                <div
                  className="basis-2/5 hidden md:block border-l border-gray-300"
                  style={{
                    position: "relative", // Base position for the column
                  }}
                >
                  <div
                    style={{
                      position: "sticky",
                      top: "0", // Adjust to add space from the top
                      zIndex: 10,
                      minHeight: "100vh",
                    }}
                  >
                    <SuggestionBar />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="fixed w-screen bottom-0 md:hidden h-[5vh] border-t-2 border-gray-300 bg-white">
            <p>Mobile Navbar</p>
          </div>
        </main>
      </div>
    </>
  );
}
