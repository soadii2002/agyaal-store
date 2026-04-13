export default function ProductSkeleton({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="skeleton aspect-square w-full" />
          <div className="p-4 space-y-3">
            <div className="skeleton h-3 w-1/3 rounded-full" />
            <div className="skeleton h-4 w-3/4 rounded-full" />
            <div className="skeleton h-5 w-1/2 rounded-full" />
          </div>
        </div>
      ))}
    </>
  );
}
