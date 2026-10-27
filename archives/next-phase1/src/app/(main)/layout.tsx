import { BottomNav } from "@/components/ui/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-ivory">
      <main className="app-scroll mx-auto w-full max-w-md px-4 pt-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
