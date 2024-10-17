"use client";
import { title } from "@/src/components/primitives";
import { useUser } from "@/src/context/user.provider";

export default function Home() {
  const { user, isLoading } = useUser();

  // console.log("User => ", user);
  console.log("isLoading => ", isLoading);

  return (
    <section
      style={{
        margin: "5%",
      }}
      className="flex flex-col items-center justify-center gap-4 py-8 md:py-10"
    >
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Hello&nbsp;</span>
        <span className={title({ color: "violet" })}>Cheffy!</span>
      </div>
      <p>Hi, {user?.name}</p>
    </section>
  );
}
