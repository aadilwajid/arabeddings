import { WifiOff, RefreshCw } from 'lucide-react';

export default function Offline() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#FDF8F3]">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#C4A265]/10 flex items-center justify-center">
          <WifiOff size={40} className="text-[#C4A265]" />
        </div>
        
        <h1 className="text-3xl font-serif mb-4 text-[#2D2A26]">
          You're Offline
        </h1>
        
        <p className="mb-8 text-[#5C4A32]">
          It seems you've lost your internet connection. Some features may not be available.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#C4A265] text-white rounded-lg font-medium hover:bg-[#D4B275] transition-colors"
          >
            <RefreshCw size={20} />
            Try Again
          </button>
          
          <div className="pt-4 border-t border-[#E8DFD5]">
            <p className="text-sm text-[#A09080]">
              Previously visited pages are still available offline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
