import BackRouter from '@/src/components/UI/BackRouter';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center">
      <div className="sticky top-0 z-50 bg-zinc-100 px-2 py-3 w-full h-[5vh]">
        <BackRouter />
      </div>
      <div className="w-full">{children}</div>
    </section>
  );
}
