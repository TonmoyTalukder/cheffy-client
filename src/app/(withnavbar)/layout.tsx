import { Navbar } from "@/src/components/UI/navbar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main
        style={{
          overflowX: "hidden",
        }}
      >
        {children}
      </main>
    </div>
  );
}
