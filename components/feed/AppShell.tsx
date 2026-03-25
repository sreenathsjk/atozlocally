import BottomNav from "@/components/layout/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-dark-900 noise-bg">
      {/* Background orbs */}
      <div className="orb w-96 h-96 bg-neon-cyan opacity-[0.04] -top-20 -right-20 pointer-events-none" />
      <div className="orb w-80 h-80 bg-neon-purple opacity-[0.04] bottom-40 -left-20 pointer-events-none" />

      <main className="relative z-10 max-w-lg mx-auto pb-nav">{children}</main>
      <BottomNav />
    </div>
  );
}
