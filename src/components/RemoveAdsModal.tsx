import { X } from 'lucide-react';

interface RemoveAdsModalProps {
  onClose: () => void;
}

const RemoveAdsModal = ({ onClose }: RemoveAdsModalProps) => {
  const handlePurchase = () => {
    // Set ad-free flag in localStorage
    localStorage.setItem('gbl_ad_free', 'true');
    // Close modal
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 border-2 border-amber-200 overflow-hidden">
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-amber-50 hover:bg-amber-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-amber-800" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 text-center">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <img
              src="/src/assets/oboarding/logo.png"
              alt="Logo"
              className="h-20 w-auto object-contain"
              onError={(e) => {
                // Fallback if image doesn't exist
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>

          {/* Message */}
          <h2 className="text-2xl font-serif text-amber-900 mb-4">
            Enjoy ad free
          </h2>
          <p className="text-amber-700 mb-6">
            You now have an ad-free experience!
          </p>

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveAdsModal;
