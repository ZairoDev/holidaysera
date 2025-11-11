import { Skeleton } from '@/components/ui/skeleton';

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-lg">
      <Skeleton className="h-64 w-full" />
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="mb-3 h-4 w-1/2" />
        <div className="mb-3 flex gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-baseline justify-between border-t pt-3">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export function PropertyDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-4 h-10 w-24" />
        <div className="mb-8">
          <Skeleton className="mb-4 h-12 w-3/4" />
          <Skeleton className="mb-8 h-6 w-1/2" />
          <Skeleton className="mb-8 h-[500px] w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
