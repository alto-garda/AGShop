export default function Loading() {
  return (
    <div className="flex min-h-[70dvh] w-full items-center justify-center">
      <div className="flex flex-col items-center">

        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-pulse rounded-[1.75rem] bg-[#1668E8]/10" />

          <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white p-3 shadow-lg dark:bg-slate-900">
            <img
              src="/logo.png"
              alt="AG Shop"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <p className="mt-5 text-lg font-bold tracking-tight">
          AG Shop
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Magazzino Alto Garda
        </p>

        <div className="mt-5 flex gap-1.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#1668E8]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#1668E8] [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#1668E8] [animation-delay:300ms]" />
        </div>

      </div>
    </div>
  );
}
