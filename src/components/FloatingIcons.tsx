"use client";

export default function FloatingIcons() {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40">
      {/* Mascot Icon 1 - Headset */}
      <button
        type="button"
        className="w-14 h-14 bg-white rounded-lg shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow group overflow-hidden"
        aria-label="Chat support"
      >
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full" />
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-6 bg-white rounded-full" />
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
            <div className="w-1.5 h-1.5 bg-gray-800 rounded-full" />
            <div className="w-1.5 h-1.5 bg-gray-800 rounded-full" />
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-3 border-t-2 border-gray-600 rounded-t-full" />
          <div className="absolute top-0 left-0 w-2 h-4 bg-gray-600 rounded-l-md" />
          <div className="absolute top-0 right-0 w-2 h-4 bg-gray-600 rounded-r-md" />
        </div>
        <span className="absolute -top-1 right-0 text-xs bg-orange-500 text-white px-1 rounded">
          Help
        </span>
      </button>

      {/* Mascot Icon 2 - Wave */}
      <button
        type="button"
        className="w-14 h-14 bg-white rounded-lg shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow overflow-hidden"
        aria-label="Assistant"
      >
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full" />
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-6 bg-white rounded-full" />
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
            <div className="w-1.5 h-1.5 bg-gray-800 rounded-full" />
            <div className="w-1.5 h-1.5 bg-gray-800 rounded-full" />
          </div>
          <div className="absolute top-4.5 left-1/2 -translate-x-1/2 w-3 h-1.5 bg-gray-800 rounded-b-full" />
          <div className="absolute -right-1 top-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
            👋
          </div>
        </div>
      </button>

      {/* VR Icon */}
      <button
        type="button"
        className="w-14 h-14 bg-white rounded-lg shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow group"
        aria-label="VR Tour"
      >
        <div className="text-orange-500 font-bold text-sm flex flex-col items-center">
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <ellipse cx="8" cy="11" rx="2" ry="3" fill="currentColor" />
            <ellipse cx="16" cy="11" rx="2" ry="3" fill="currentColor" />
            <path d="M6 8h12a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a2 2 0 012-2z" />
          </svg>
          <span className="text-xs mt-0.5">VR</span>
        </div>
      </button>
    </div>
  );
}
