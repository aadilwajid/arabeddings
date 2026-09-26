'use client';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#F0E8DE] animate-pulse">
      <div className="aspect-square bg-[#F5EDE4]" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-[#F5EDE4] rounded w-1/4" />
        <div className="h-4 bg-[#F5EDE4] rounded w-3/4" />
        <div className="flex items-center gap-2">
          <div className="h-3 bg-[#F5EDE4] rounded w-16" />
          <div className="h-3 bg-[#F5EDE4] rounded w-12" />
        </div>
        <div className="h-5 bg-[#F5EDE4] rounded w-1/3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[500px] md:h-[600px] bg-[#F5EDE4] animate-pulse">
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-4">
            <div className="h-4 bg-[#E8DFD5] rounded w-32" />
            <div className="h-12 bg-[#E8DFD5] rounded w-3/4" />
            <div className="h-4 bg-[#E8DFD5] rounded w-full" />
            <div className="flex gap-4">
              <div className="h-12 bg-[#E8DFD5] rounded-full w-40" />
              <div className="h-12 bg-[#E8DFD5] rounded-full w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#F0E8DE] p-4 animate-pulse">
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-[#F5EDE4] rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[#F5EDE4] rounded w-3/4" />
          <div className="h-3 bg-[#F5EDE4] rounded w-1/2" />
          <div className="flex items-center justify-between">
            <div className="h-8 bg-[#F5EDE4] rounded-full w-24" />
            <div className="h-4 bg-[#F5EDE4] rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-[#F0E8DE] overflow-hidden">
      <div className="bg-[#F5EDE4] p-4">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-4 bg-[#E8DFD5] rounded animate-pulse" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-[#F0E8DE]">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 grid grid-cols-4 gap-4 animate-pulse">
            {Array.from({ length: cols }).map((_, j) => (
              <div key={j} className="h-4 bg-[#F5EDE4] rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#F0E8DE] animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-[#F5EDE4] rounded-full" />
        <div className="h-6 bg-[#F5EDE4] rounded-full w-16" />
      </div>
      <div className="h-8 bg-[#F5EDE4] rounded w-24 mb-2" />
      <div className="h-4 bg-[#F5EDE4] rounded w-32" />
    </div>
  );
}

export function StatsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-50 bg-[#FDF8F3] border-b border-[#E8DFD5] animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="h-8 bg-[#F5EDE4] rounded w-32" />
            <div className="hidden md:flex items-center space-x-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-[#F5EDE4] rounded w-16" />
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#F5EDE4] rounded-full" />
              <div className="w-10 h-10 bg-[#F5EDE4] rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <HeroSkeleton />

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <StatsGridSkeleton />
          <ProductGridSkeleton />
        </div>
      </div>
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 bg-white rounded-xl p-3 border border-[#F0E8DE] animate-pulse">
      <div className="w-20 h-20 bg-[#F5EDE4] rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-[#F5EDE4] rounded w-3/4" />
        <div className="h-3 bg-[#F5EDE4] rounded w-1/2" />
        <div className="flex items-center justify-between">
          <div className="h-8 bg-[#F5EDE4] rounded-full w-24" />
          <div className="h-4 bg-[#F5EDE4] rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export function CartSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CartItemSkeleton key={i} />
      ))}
    </div>
  );
}

export function ModalSkeleton() {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-pulse">
        <div className="grid md:grid-cols-2">
          <div className="aspect-square bg-[#F5EDE4]" />
          <div className="p-6 md:p-8 space-y-4">
            <div className="h-4 bg-[#F5EDE4] rounded w-1/4" />
            <div className="h-8 bg-[#F5EDE4] rounded w-3/4" />
            <div className="h-4 bg-[#F5EDE4] rounded w-full" />
            <div className="h-4 bg-[#F5EDE4] rounded w-full" />
            <div className="h-12 bg-[#F5EDE4] rounded w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
