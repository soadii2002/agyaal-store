export default function Spinner({ size = "md", center = false }) {
  const sizes = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <div className={center ? "flex justify-center items-center py-12" : ""}>
      <div className={`${sizes[size]} border-4 border-orange-100 border-t-primary-500 rounded-full animate-spin`} />
    </div>
  );
}
