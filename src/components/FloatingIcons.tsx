"use client";

export default function FloatingIcons() {
  return (
    <div className="fixed right-2 md:right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 md:gap-3 z-40">
      {/* Mascot Icon 1 - Headset */}
      <button
        type="button"
        className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-lg shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow group overflow-hidden relative"
        aria-label="Chat support"
      >
        <div className="relative w-7 h-7 md:w-10 md:h-10">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full" />
          <div className="absolute top-0.5 md:top-1 left-1/2 -translate-x-1/2 w-5 md:w-8 h-4 md:h-6 bg-white rounded-full" />
          <div className="absolute top-1.5 md:top-2.5 left-1/2 -translate-x-1/2 flex gap-1 md:gap-1.5">
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-gray-800 rounded-full" />
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-gray-800 rounded-full" />
          </div>
        </div>
        <span className="absolute -top-1 right-0 text-[8px] md:text-xs bg-orange-500 text-white px-1 rounded hidden md:block">
          Help
        </span>
      </button>

      {/* Mascot Icon 2 - Wave */}
      <button
        type="button"
        className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-lg shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow overflow-hidden"
        aria-label="Assistant"
      >
        <div className="relative w-7 h-7 md:w-10 md:h-10">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full" />
          <div className="absolute top-0.5 md:top-1 left-1/2 -translate-x-1/2 w-5 md:w-8 h-4 md:h-6 bg-white rounded-full" />
          <div className="absolute top-1.5 md:top-2.5 left-1/2 -translate-x-1/2 flex gap-1 md:gap-1.5">
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-gray-800 rounded-full" />
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-gray-800 rounded-full" />
          </div>
        </div>
      </button>

      {/* VR Icon */}
      <button
        type="button"
        className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-lg shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow group"
        aria-label="VR Tour"
      >
        <div className="text-orange-500 font-bold text-xs md:text-sm flex flex-col items-center">
          <svg
            className="w-5 h-5 md:w-8 md:h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <rect x="2" y="7" width="20" height="10" rx="2" />
            <circle cx="8" cy="12" r="2" fill="currentColor" />
            <circle cx="16" cy="12" r="2" fill="currentColor" />
          </svg>
          <span className="text-[8px] md:text-xs mt-0.5">VR</span>
        </div>
      </button>
    </div>
  );
}
