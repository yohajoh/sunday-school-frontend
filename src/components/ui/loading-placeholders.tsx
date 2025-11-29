import React from "react";

// Base loading components
export const LoadingPulse: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`}
  ></div>
);

export const ShimmerEffect: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
  </div>
);

// Card placeholders
export const ShimmerCard: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-lg rounded-2xl sm:rounded-3xl ${className}`}
  >
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <LoadingPulse className="h-4 w-20" />
        <LoadingPulse className="h-10 w-10 rounded-xl" />
      </div>
      <LoadingPulse className="h-8 w-16 mb-2" />
      <div className="flex items-center gap-2">
        <LoadingPulse className="h-4 w-4 rounded-full" />
        <LoadingPulse className="h-3 w-12" />
        <LoadingPulse className="h-3 w-20" />
      </div>
    </div>
    <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700">
      <div className="h-full bg-gradient-to-r from-slate-300 to-slate-400 animate-pulse"></div>
    </div>
    <ShimmerEffect className="rounded-2xl sm:rounded-3xl" />
  </div>
);

// Add these to your existing loading-placeholders.tsx file

// Posts table specific placeholders
export const ShimmerPostsTable: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border-0 shadow-xl sm:shadow-2xl overflow-hidden">
    <div className="overflow-x-auto">
      {/* Table Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center p-4 gap-4">
          <LoadingPulse className="h-4 w-12" />
          <LoadingPulse className="h-4 flex-1 min-w-[200px]" />
          <LoadingPulse className="h-4 flex-1 min-w-[150px] hidden sm:block" />
          <LoadingPulse className="h-4 flex-1 min-w-[120px] hidden md:block" />
          <LoadingPulse className="h-4 flex-1 min-w-[120px] hidden lg:block" />
          <LoadingPulse className="h-4 flex-1 min-w-[140px] hidden xl:block" />
          <LoadingPulse className="h-4 flex-1 min-w-[140px]" />
          <LoadingPulse className="h-4 flex-1 min-w-[100px]" />
          <LoadingPulse className="h-4 w-[120px]" />
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-4 p-4">
            {/* Checkbox */}
            <LoadingPulse className="h-4 w-12" />

            {/* Title with image and pin */}
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <LoadingPulse className="h-4 w-4 rounded-full" />
              <LoadingPulse className="h-10 w-10 rounded-lg" />
              <div className="space-y-2 flex-1">
                <LoadingPulse className="h-4 w-32" />
                <LoadingPulse className="h-3 w-40 hidden sm:block" />
              </div>
            </div>

            {/* Author */}
            <div className="hidden sm:flex items-center gap-2 flex-1 min-w-[150px]">
              <LoadingPulse className="h-8 w-8 rounded-full" />
              <LoadingPulse className="h-4 w-20" />
            </div>

            {/* Category */}
            <LoadingPulse className="h-6 w-16 rounded-lg hidden md:block" />

            {/* Audience */}
            <LoadingPulse className="h-6 w-16 rounded-lg hidden lg:block" />

            {/* Engagement */}
            <div className="hidden xl:flex items-center gap-4 flex-1 min-w-[140px]">
              <LoadingPulse className="h-4 w-8" />
              <LoadingPulse className="h-4 w-8" />
              <LoadingPulse className="h-4 w-8" />
            </div>

            {/* Date */}
            <LoadingPulse className="h-4 w-16" />

            {/* Status */}
            <LoadingPulse className="h-6 w-16 rounded-lg" />

            {/* Actions */}
            <div className="flex justify-end gap-2 w-[120px]">
              <LoadingPulse className="h-8 w-8 rounded-xl" />
              <LoadingPulse className="h-8 w-8 rounded-xl" />
              <LoadingPulse className="h-8 w-8 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Posts card view placeholder
export const ShimmerPostsCards: React.FC = () => (
  <div className="space-y-4 sm:space-y-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden"
      >
        {/* Card Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <LoadingPulse className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <LoadingPulse className="h-4 w-24" />
                <LoadingPulse className="h-3 w-16" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LoadingPulse className="h-4 w-4 rounded-full" />
              <LoadingPulse className="h-6 w-16 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <LoadingPulse className="h-6 w-16 rounded-lg" />
            <LoadingPulse className="h-6 w-20 rounded-lg" />
          </div>

          <LoadingPulse className="h-6 w-3/4 mb-3" />
          <LoadingPulse className="h-48 w-full rounded-xl mb-4" />

          <div className="space-y-2 mb-4">
            <LoadingPulse className="h-4 w-full" />
            <LoadingPulse className="h-4 w-2/3" />
            <LoadingPulse className="h-4 w-1/2" />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <LoadingPulse className="h-6 w-12 rounded-lg" />
            <LoadingPulse className="h-6 w-16 rounded-lg" />
            <LoadingPulse className="h-6 w-14 rounded-lg" />
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LoadingPulse className="h-8 w-16 rounded-lg" />
              <LoadingPulse className="h-8 w-16 rounded-lg" />
              <LoadingPulse className="h-8 w-16 rounded-lg" />
            </div>
            <div className="flex items-center gap-2">
              <LoadingPulse className="h-8 w-12 rounded-lg" />
              <LoadingPulse className="h-8 w-12 rounded-lg" />
              <LoadingPulse className="h-8 w-12 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const ShimmerPostsHeader: React.FC = () => (
  <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800 via-purple-900 to-pink-900 p-6 sm:p-8 text-white border border-purple-500/20">
    <div className="relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <div className="p-2 sm:p-3 bg-purple-500/20 rounded-xl sm:rounded-2xl border border-purple-400/30 flex-shrink-0">
              <LoadingPulse className="h-6 w-6 sm:h-8 sm:w-8 rounded bg-purple-400/30" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <LoadingPulse className="h-8 w-48 bg-purple-400/30" />
              <LoadingPulse className="h-4 w-64 bg-purple-300/30" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="flex gap-3 sm:gap-6 mt-4 sm:mt-6 min-w-max pb-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-shrink-0"
                >
                  <LoadingPulse className="h-4 w-4 sm:h-6 sm:w-6 rounded-full bg-white/30" />
                  <div className="min-w-0 space-y-1">
                    <LoadingPulse className="h-6 w-8 bg-white/40" />
                    <LoadingPulse className="h-3 w-12 bg-white/30" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full blur-3xl"></div>
    <ShimmerEffect className="rounded-2xl sm:rounded-3xl" />
  </div>
);

// Add these to your existing loading-placeholders.tsx file

// Assets table specific placeholders
export const ShimmerAssetsTable: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border-0 shadow-2xl overflow-hidden">
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center p-4 gap-4">
            <LoadingPulse className="h-4 w-12" />
            <LoadingPulse className="h-4 flex-1 min-w-[120px]" />
            <LoadingPulse className="h-4 flex-1 min-w-[200px]" />
            <LoadingPulse className="h-4 flex-1 min-w-[150px] hidden sm:block" />
            <LoadingPulse className="h-4 flex-1 min-w-[120px] hidden md:block" />
            <LoadingPulse className="h-4 flex-1 min-w-[100px]" />
            <LoadingPulse className="h-4 w-[120px]" />
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-4 p-4">
              {/* Checkbox */}
              <LoadingPulse className="h-4 w-12" />

              {/* Code */}
              <div className="flex items-center gap-2 min-w-[120px]">
                <LoadingPulse className="h-4 w-4 rounded-full" />
                <LoadingPulse className="h-4 w-16" />
              </div>

              {/* Name & Description */}
              <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                <LoadingPulse className="h-8 w-8 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <LoadingPulse className="h-4 w-32" />
                  <LoadingPulse className="h-3 w-40 hidden sm:block" />
                  <div className="sm:hidden flex gap-2">
                    <LoadingPulse className="h-4 w-16 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Category */}
              <LoadingPulse className="h-6 w-16 rounded-lg hidden sm:block" />

              {/* Condition */}
              <LoadingPulse className="h-6 w-16 rounded-lg hidden md:block" />

              {/* Status */}
              <LoadingPulse className="h-6 w-16 rounded-lg" />

              {/* Actions */}
              <div className="flex justify-end gap-2 w-[120px]">
                <div className="hidden sm:flex gap-2">
                  <LoadingPulse className="h-8 w-8 rounded-xl" />
                  <LoadingPulse className="h-8 w-8 rounded-xl" />
                  <LoadingPulse className="h-8 w-8 rounded-xl" />
                </div>
                <div className="sm:hidden">
                  <LoadingPulse className="h-8 w-8 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const ShimmerAssetsHeader: React.FC = () => (
  <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800 via-amber-900 to-orange-900 p-6 sm:p-8 text-white border border-amber-500/20">
    <div className="relative z-10">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-400/30 self-start sm:self-auto">
              <LoadingPulse className="h-6 w-6 sm:h-8 sm:w-8 rounded bg-amber-400/30" />
            </div>
            <div className="space-y-2">
              <LoadingPulse className="h-8 w-48 bg-amber-400/30" />
              <LoadingPulse className="h-4 w-64 bg-amber-300/30" />
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-3 sm:gap-6 mt-4 sm:mt-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-1 sm:flex-none"
              >
                <LoadingPulse className="h-4 w-4 sm:h-6 sm:w-6 rounded-full bg-white/30" />
                <div className="min-w-0 space-y-1">
                  <LoadingPulse className="h-6 w-8 bg-white/40" />
                  <LoadingPulse className="h-3 w-12 bg-white/30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
    <ShimmerEffect className="rounded-2xl sm:rounded-3xl" />
  </div>
);

// Add this to your existing loading-placeholders.tsx file
export const ShimmerUsersTable: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border-0 shadow-xl sm:shadow-2xl overflow-hidden">
    <div className="overflow-x-auto">
      {/* Table Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center p-4 gap-4">
          <LoadingPulse className="h-4 w-12" />
          <LoadingPulse className="h-4 flex-1 min-w-[120px]" />
          <LoadingPulse className="h-4 flex-1 min-w-[200px]" />
          <LoadingPulse className="h-4 flex-1 min-w-[200px] hidden md:block" />
          <LoadingPulse className="h-4 flex-1 min-w-[150px] hidden lg:block" />
          <LoadingPulse className="h-4 flex-1 min-w-[100px]" />
          <LoadingPulse className="h-4 flex-1 min-w-[100px]" />
          <LoadingPulse className="h-4 w-[140px]" />
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-4 p-4">
            {/* Checkbox */}
            <LoadingPulse className="h-4 w-12" />

            {/* Student ID */}
            <LoadingPulse className="h-4 flex-1 min-w-[120px]" />

            {/* User Info */}
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <LoadingPulse className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <LoadingPulse className="h-4 w-32" />
                <LoadingPulse className="h-3 w-24 hidden sm:block" />
              </div>
            </div>

            {/* Email */}
            <LoadingPulse className="h-4 flex-1 min-w-[200px] hidden md:block" />

            {/* Phone */}
            <LoadingPulse className="h-4 flex-1 min-w-[150px] hidden lg:block" />

            {/* Role Badge */}
            <LoadingPulse className="h-6 w-16 rounded-lg" />

            {/* Status Badge */}
            <LoadingPulse className="h-6 w-16 rounded-lg" />

            {/* Actions */}
            <div className="flex justify-end gap-2 w-[140px]">
              <LoadingPulse className="h-8 w-8 rounded-xl" />
              <LoadingPulse className="h-8 w-8 rounded-xl" />
              <LoadingPulse className="h-8 w-8 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const ShimmerHeader: React.FC = () => (
  <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800 via-emerald-900 to-violet-900 p-6 sm:p-8 text-white border border-emerald-500/20">
    <div className="relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <div className="p-2 sm:p-3 bg-emerald-500/20 rounded-xl sm:rounded-2xl border border-emerald-400/30 flex-shrink-0">
              <LoadingPulse className="h-6 w-6 sm:h-8 sm:w-8 rounded bg-emerald-400/30" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <LoadingPulse className="h-8 w-48 bg-emerald-400/30" />
              <LoadingPulse className="h-4 w-64 bg-emerald-300/30" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="flex gap-3 sm:gap-6 mt-4 sm:mt-6 min-w-max pb-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-shrink-0"
                >
                  <LoadingPulse className="h-4 w-4 sm:h-6 sm:w-6 rounded-full bg-white/30" />
                  <div className="min-w-0 space-y-1">
                    <LoadingPulse className="h-6 w-8 bg-white/40" />
                    <LoadingPulse className="h-3 w-12 bg-white/30" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-violet-500/10 to-transparent rounded-full blur-3xl"></div>
    <ShimmerEffect className="rounded-2xl sm:rounded-3xl" />
  </div>
);

export const ShimmerQuickAction: React.FC = () => (
  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700/50 w-full">
    <LoadingPulse className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl" />
    <div className="flex-1 min-w-0 space-y-2">
      <LoadingPulse className="h-4 w-32" />
      <LoadingPulse className="h-3 w-40" />
    </div>
    <LoadingPulse className="h-4 w-4 rounded-full" />
  </div>
);

export const ShimmerActivity: React.FC = () => (
  <div className="flex items-center gap-3 sm:gap-4 py-3 sm:py-5 px-4 sm:px-6">
    <LoadingPulse className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl" />
    <div className="flex-1 min-w-0 space-y-2">
      <LoadingPulse className="h-4 w-40" />
      <LoadingPulse className="h-3 w-32" />
    </div>
    <div className="flex flex-col items-end space-y-1">
      <LoadingPulse className="h-3 w-12" />
      <LoadingPulse className="h-3 w-16 hidden sm:block" />
    </div>
  </div>
);

// Table placeholders
export const ShimmerTable: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => (
  <div className="w-full">
    {/* Table Header */}
    <div className="flex gap-4 p-4 border-b border-slate-200 dark:border-slate-700">
      {Array.from({ length: columns }).map((_, index) => (
        <LoadingPulse key={index} className="h-4 flex-1" />
      ))}
    </div>

    {/* Table Rows */}
    <div className="divide-y divide-slate-200 dark:divide-slate-700">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <LoadingPulse
              key={colIndex}
              className="h-4 flex-1"
              style={{
                maxWidth: colIndex === 0 ? "60px" : "auto",
                width: colIndex === columns - 1 ? "80px" : "auto",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const ShimmerTableRow: React.FC<{ columns: number }> = ({ columns }) => (
  <div className="flex gap-4 p-4 border-b border-slate-200 dark:border-slate-700">
    {Array.from({ length: columns }).map((_, index) => (
      <LoadingPulse
        key={index}
        className="h-4 flex-1"
        style={{
          maxWidth: index === 0 ? "60px" : "auto",
          width: index === columns - 1 ? "80px" : "auto",
        }}
      />
    ))}
  </div>
);

// Grid placeholders
export const ShimmerGrid: React.FC<{
  items: number;
  card?: boolean;
  className?: string;
}> = ({ items, card = false, className = "" }) => (
  <div
    className={`grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
  >
    {Array.from({ length: items }).map((_, index) =>
      card ? (
        <ShimmerCard key={index} />
      ) : (
        <LoadingPulse key={index} className="h-32 rounded-2xl" />
      )
    )}
  </div>
);

// Stats grid placeholder
export const ShimmerStatsGrid: React.FC = () => (
  <div className="overflow-x-auto">
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 min-w-max">
      {Array.from({ length: 4 }).map((_, index) => (
        <ShimmerCard key={index} />
      ))}
    </div>
  </div>
);

// Full page loading component
export const PageLoading: React.FC<{
  type?: "dashboard" | "table" | "grid";
}> = ({ type = "dashboard" }) => {
  if (type === "table") {
    return (
      <div className="space-y-6">
        <ShimmerHeader />
        <ShimmerTable rows={6} columns={5} />
      </div>
    );
  }

  if (type === "grid") {
    return (
      <div className="space-y-6">
        <ShimmerHeader />
        <ShimmerGrid items={8} card={true} />
      </div>
    );
  }

  // Default dashboard loading
  return (
    <div className="space-y-6">
      <ShimmerHeader />

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <LoadingPulse className="h-10 w-48 rounded-xl" />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <LoadingPulse className="h-9 w-24 rounded-xl" />
          <LoadingPulse className="h-9 w-24 rounded-xl" />
        </div>
      </div>

      {/* Stats Grid */}
      <ShimmerStatsGrid />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Quick Actions */}
        <div className="border-0 bg-white dark:bg-slate-800 shadow-lg sm:shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
          <div className="pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <LoadingPulse className="h-10 w-10 rounded-xl" />
              <div className="space-y-2">
                <LoadingPulse className="h-6 w-32" />
                <LoadingPulse className="h-4 w-40" />
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <ShimmerQuickAction key={index} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="border-0 bg-white dark:bg-slate-800 shadow-lg sm:shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
          <div className="pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <LoadingPulse className="h-10 w-10 rounded-xl" />
              <div className="space-y-2">
                <LoadingPulse className="h-6 w-32" />
                <LoadingPulse className="h-4 w-48" />
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {Array.from({ length: 4 }).map((_, index) => (
              <ShimmerActivity key={index} />
            ))}
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="border-0 bg-white dark:bg-slate-800 shadow-lg sm:shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
        <div className="pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <LoadingPulse className="h-10 w-10 rounded-xl" />
            <div className="space-y-2">
              <LoadingPulse className="h-6 w-40" />
              <LoadingPulse className="h-4 w-52" />
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 min-w-max">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="text-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-700/30 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-600 min-w-[200px]"
                >
                  <LoadingPulse className="h-8 w-16 mx-auto mb-2" />
                  <LoadingPulse className="h-4 w-24 mx-auto mb-1" />
                  <LoadingPulse className="h-3 w-20 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
