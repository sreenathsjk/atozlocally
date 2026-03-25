"use client";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-dark-900 flex flex-col items-center justify-center z-50">
      {/* Orbs */}
      <div className="orb w-64 h-64 bg-neon-cyan opacity-10 top-1/4 left-1/4" />
      <div className="orb w-48 h-48 bg-neon-purple opacity-10 bottom-1/4 right-1/4" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center glow-cyan animate-pulse">
            <span className="font-display font-black text-3xl text-dark-900">A</span>
          </div>
        </div>

        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-white">
            AtoZ Service Hub
          </h1>
          <p className="text-white/40 text-sm mt-1 font-body">
            Connecting you to local experts
          </p>
        </div>

        {/* Loader dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-neon-cyan"
              style={{
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
