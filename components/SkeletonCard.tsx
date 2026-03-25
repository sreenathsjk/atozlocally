export default function SkeletonCard() {
  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/[0.06] p-4">
      <div className="flex items-start gap-4">
        <div className="skeleton w-16 h-16 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-32 rounded-lg" />
          <div className="skeleton h-5 w-20 rounded-md" />
          <div className="skeleton h-3 w-40 rounded-lg" />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-white/[0.04] flex justify-between">
        <div className="skeleton h-3 w-24 rounded-lg" />
        <div className="skeleton h-8 w-24 rounded-xl" />
      </div>
    </div>
  );
}
