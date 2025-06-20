/**
 * An animated leaf which can be used as a loading page.
 */
export default function Loader() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <svg
        className="w-12 h-12 animate-[leaf-sway_1.6s_ease-in-out_infinite]"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <path
          d="M32 4C18 12 6 26 4 42C12 48 24 54 32 60C40 54 52 48 60 42C58 26 46 12 32 4Z"
          fill="#10B981"
        />
        <path
          d="M32 4C28 26 28 40 32 60"
          stroke="#065F46"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <style>
        {`
        @keyframes leaf-sway {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(6deg);
          }
        }
      `}
      </style>
    </div>
  );
}
