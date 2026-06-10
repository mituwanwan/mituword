export function CardSkeleton() {
  return (
    <div className="glass rounded-xl overflow-hidden animate-pulse">
      <div className="h-48 dark:bg-void-deeper/50 bg-realm-sky/20" />
      <div className="p-6 space-y-3">
        <div className="h-6 dark:bg-void-purple/20 bg-realm-sky/30 rounded w-3/4" />
        <div className="h-4 dark:bg-void-purple/10 bg-realm-sky/20 rounded w-full" />
        <div className="h-4 dark:bg-void-purple/10 bg-realm-sky/20 rounded w-2/3" />
        <div className="flex gap-2 mt-4">
          <div className="h-6 dark:bg-void-purple/10 bg-realm-sky/20 rounded-full w-16" />
          <div className="h-6 dark:bg-void-purple/10 bg-realm-sky/20 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 dark:bg-void-purple/10 bg-realm-sky/20 rounded"
          style={{ width: `${100 - (i * 15)}%` }}
        />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-4 animate-pulse">
        <div className="h-12 dark:bg-void-purple/20 bg-realm-sky/30 rounded w-1/3 mx-auto" />
        <div className="h-6 dark:bg-void-purple/10 bg-realm-sky/20 rounded w-1/4 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
