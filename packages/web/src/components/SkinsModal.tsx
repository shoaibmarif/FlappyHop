import React from 'react';
import { X, Check } from 'lucide-react';
import { BIRD_SKINS, SkinId } from '@flappy-bird/core';

interface SkinsModalProps {
  isOpen: boolean;
  currentSkinId: SkinId;
  bestScore?: number;
  onSelectSkin: (id: SkinId) => void;
  onClose: () => void;
}

export const SkinsModal: React.FC<SkinsModalProps> = ({
  isOpen,
  currentSkinId,
  onSelectSkin,
  onClose
}) => {
  if (!isOpen) return null;

  const skinsList = Object.values(BIRD_SKINS);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Bird Paints & Skins
              </h3>
              <div className="text-xs text-amber-500 font-semibold">
                100% Free • All Styles Unlocked
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Skins Grid */}
        <div className="overflow-y-auto py-4 space-y-3 flex-1 pr-1">
          {skinsList.map(skin => {
            const isSelected = currentSkinId === skin.id;

            return (
              <div
                key={skin.id}
                onClick={() => onSelectSkin(skin.id)}
                className={`p-3.5 rounded-2xl border flex items-center gap-4 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-400 ring-2 ring-amber-400/50'
                    : 'bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              >
                {/* Mini Swatch / Preview */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center relative shadow-sm border border-black/10 shrink-0"
                  style={{ backgroundColor: skin.primaryColor }}
                >
                  <div
                    className="w-5 h-5 rounded-full border border-black/20"
                    style={{ backgroundColor: skin.wingColor }}
                  />
                  <div
                    className="w-2.5 h-2.5 rounded-full absolute -right-1 top-2"
                    style={{ backgroundColor: skin.beakColor }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {skin.name}
                    </div>
                    {isSelected && (
                      <span className="text-[10px] bg-amber-500 text-zinc-950 font-black px-1.5 py-0.2 rounded-md">
                        EQUIPPED
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400 truncate">
                    {skin.description}
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="shrink-0">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-zinc-950">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <button className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-slate-700 dark:text-zinc-300 transition-colors">
                      Equip
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 font-bold text-sm text-slate-800 dark:text-zinc-200 transition-colors mt-2"
        >
          Done
        </button>
      </div>
    </div>
  );
};

