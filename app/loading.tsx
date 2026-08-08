export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-pulse rounded-2xl bg-[#1668E8]/10" />

        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full w-1/2 animate-[loading_1s_ease-in-out_infinite] rounded-full bg-[#1668E8]" />
        </div>
      </div>
    </div>
  );
}
