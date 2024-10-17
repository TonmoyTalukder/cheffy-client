export default function FollowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className="flex flex-col items-center justify-center w-full"
      style={{
        margin: "5%",
      }}
    >
      <div className="w-full">{children}</div>
    </section>
  );
}
