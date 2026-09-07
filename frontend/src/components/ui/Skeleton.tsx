import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`skeleton-shimmer rounded-xl ${className}`}
      {...props}
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`glass-card p-5 rounded-2xl border border-white/60 space-y-4 ${className}`}>
      <Skeleton className="h-44 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-6 w-5/6 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-4/6 rounded-md" />
      </div>
      <div className="pt-2 flex items-center justify-between border-t border-gray-100/60">
        <Skeleton className="h-3 w-28 rounded-md" />
        <Skeleton className="h-3 w-16 rounded-md" />
      </div>
    </div>
  );
};

export const SkeletonNewsGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export const SkeletonTeacherCard: React.FC = () => {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/60 text-center flex flex-col items-center space-y-4">
      <Skeleton className="w-28 h-28 rounded-full" />
      <div className="space-y-2 w-full flex flex-col items-center">
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
        <Skeleton className="h-3 w-2/3 rounded-md" />
      </div>
      <div className="pt-2 w-full border-t border-gray-100/60 flex justify-center">
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  );
};

export const SkeletonTeacherGrid: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonTeacherCard key={i} />
      ))}
    </div>
  );
};

export const SkeletonEventList: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-card p-5 rounded-2xl border border-white/60 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
        >
          <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
          <div className="flex-grow space-y-2 w-full">
            <Skeleton className="h-5 w-2/3 rounded-md" />
            <Skeleton className="h-4 w-1/3 rounded-md" />
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </div>
          <Skeleton className="h-9 w-28 rounded-xl flex-shrink-0 hidden sm:block" />
        </div>
      ))}
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="glass-card rounded-2xl border border-white/60 overflow-hidden">
      <div className="p-4 bg-forest-900/5 border-b border-forest-100/60 flex items-center justify-between">
        <Skeleton className="h-5 w-40 rounded-md" />
        <Skeleton className="h-8 w-48 rounded-lg" />
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="space-y-2 flex-grow">
              <Skeleton className="h-4 w-3/5 rounded-md" />
              <Skeleton className="h-3 w-1/4 rounded-md" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonPageHeader: React.FC = () => {
  return (
    <div className="space-y-3 max-w-2xl mx-auto text-center py-6">
      <Skeleton className="h-4 w-32 mx-auto rounded-full" />
      <Skeleton className="h-10 w-3/4 mx-auto rounded-xl" />
      <Skeleton className="h-4 w-full mx-auto rounded-md" />
      <Skeleton className="h-4 w-2/3 mx-auto rounded-md" />
    </div>
  );
};
