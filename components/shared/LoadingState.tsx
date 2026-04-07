interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Analyzing your impact...",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-[#BFDBFE] border-t-[#2563EB] animate-spin" />
      </div>
      <p className="text-[#2563EB] font-medium text-sm animate-pulse">
        {message}
      </p>
      <p className="text-gray-400 text-xs">This usually takes a moment...</p>
    </div>
  );
}
