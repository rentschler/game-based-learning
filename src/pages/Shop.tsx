import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { addCoins, getCoins } from '../utils/coins';

interface ShopProps {
  onClose: () => void;
  onRemoveAdsClick: () => void;
  onCoinsUpdate: () => void;
}

const Shop = ({ onClose, onRemoveAdsClick, onCoinsUpdate }: ShopProps) => {
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set());

  const coinPackages = [
    { id: 'handful', name: 'Handful', coins: 100, price: 10, emoji: '💰', bonus: '' },
    { id: 'bag', name: 'Bag', coins: 550, price: 50, emoji: '🎒', bonus: '10% bonus' },
    { id: 'chest', name: 'Chest', coins: 1200, price: 100, emoji: '🏰', bonus: '20% bonus' },
    { id: 'vault', name: 'Treasure Vault', coins: 2800, price: 200, emoji: '💎', bonus: '40% bonus' },
  ];

  const arScenes = [
    { id: 'notredame', name: 'Notre-Dame Cathedral Construction', image: '/src/assets/monetization/notredame_package.png' },
    { id: 'viking', name: 'Viking Settlement Life', image: '/src/assets/monetization/placeholder.png' },
  ];

  const handleCoinPurchase = (packageId: string, coins: number) => {
    // Add coins (prototype - no actual payment)
    addCoins(coins);
    onCoinsUpdate();
    // Could add a success animation here
  };

  const handleARScenePurchase = (sceneId: string) => {
    // Mark as purchased (prototype - no actual payment)
    setPurchasedItems(prev => new Set(prev).add(sceneId));
    // Could add a success animation here
  };

  return (
    <div className="absolute inset-0 z-50 bg-amber-100 overflow-y-auto">
      {/* Top Bar */}
      <div className="sticky top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-amber-100 to-transparent border-b-2 border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900">
            <Sparkles className="w-5 h-5 text-amber-900" />
            <span className="font-medium text-lg">Shop</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white border border-amber-200 shadow-sm hover:bg-amber-50 transition-colors"
            aria-label="Close shop"
          >
            <X className="w-6 h-6 text-amber-800" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 pt-4">
        {/* Remove Ads Section - Prominent at Top */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-500/30 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-purple-500/30 text-purple-800 text-xs font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
                <h2 className="text-2xl font-serif text-amber-900 mb-1">Remove Ads</h2>
                <p className="text-amber-700 text-sm">Enjoy an uninterrupted exploration experience</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-amber-900">50 kr</p>
              </div>
            </div>
            <button
              onClick={onRemoveAdsClick}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
            >
              Purchase Remove Ads
            </button>
          </div>
        </div>

        {/* Coin Packages Section */}
        <div className="mb-8">
          <h3 className="text-xl font-serif text-amber-900 mb-4">Coin Packages</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {coinPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex-shrink-0 w-48 bg-white rounded-xl border border-amber-200 shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="p-4">
                  <div className="text-4xl mb-3 text-center">{pkg.emoji}</div>
                  <h4 className="text-lg font-semibold text-amber-900 mb-1 text-center">{pkg.name}</h4>
                  {pkg.bonus && (
                    <p className="text-xs text-green-600 font-medium text-center mb-2">{pkg.bonus}</p>
                  )}
                  <div className="text-center mb-4">
                    <p className="text-2xl font-bold text-amber-900">{pkg.coins}</p>
                    <p className="text-sm text-amber-700">coins</p>
                    <p className="text-lg font-semibold text-amber-800 mt-2">{pkg.price} kr</p>
                  </div>
                  <button
                    onClick={() => handleCoinPurchase(pkg.id, pkg.coins)}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all text-sm"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AR Scenes Section */}
        <div className="mb-8">
          <h3 className="text-xl font-serif text-amber-900 mb-4">AR Scenes</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {arScenes.map((scene) => {
              const isPurchased = purchasedItems.has(scene.id);
              return (
                <div
                  key={scene.id}
                  className="flex-shrink-0 w-64 bg-white rounded-xl border border-amber-200 shadow-md overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="relative">
                    <div className="w-64 h-40 bg-amber-100 flex items-center justify-center">
                      <img
                        src={scene.image}
                        alt={scene.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image doesn't exist
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-amber-600">AR Scene Preview</div>';
                        }}
                      />
                    </div>
                    {isPurchased && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Owned
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-amber-900 mb-2">{scene.name}</h4>
                    <button
                      onClick={() => handleARScenePurchase(scene.id)}
                      disabled={isPurchased}
                      className={`w-full py-2 rounded-lg font-medium shadow-sm transition-all text-sm ${
                        isPurchased
                          ? 'bg-amber-100 text-amber-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-600 to-orange-500 text-white hover:shadow-md'
                      }`}
                    >
                      {isPurchased ? 'Owned' : 'Purchase'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
