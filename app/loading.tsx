export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background text-foreground transition-colors duration-300">
      <div className="flex flex-col items-center">

        <div className="relative flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-[2rem] bg-[#1668E8]/10" />

          <div className="relative flex h-24 w-24 animate-[loadingLogo_1.8s_ease-in-out_infinite] items-center justify-center rounded-[2rem] bg-white p-4 shadow-xl dark:bg-slate-900">
            <img
              src="/logo.png"
              alt="AG Shop"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <h1 className="mt-7 text-xl font-bold tracking-tight">
          AG Shop
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Magazzino Alto Garda
        </p>

        <div className="mt-7 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#1668E8]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#1668E8] [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#1668E8] [animation-delay:300ms]" />
        </div>

      </div>
    </div>
  );
}
