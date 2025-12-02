import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Button } from "./ui/button";
import { Sparkles, Heart } from "lucide-react";
import { Perfume } from "../types/api.types";

interface PerfumeDetailsProps {
  perfume: Perfume;
  creativeFormula: any; // TODO: Type this properly if possible, currently 'any' in App.tsx usage context
  onFavoriteToggle: (id: number) => void;
}

export const PerfumeDetails: React.FC<PerfumeDetailsProps> = ({
  perfume,
  creativeFormula,
  onFavoriteToggle,
}) => {
  return (
    <div className="mb-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFavoriteToggle(perfume.id)}
        className="flex items-center gap-2 mb-2 pl-0 hover:bg-transparent"
      >
        <Heart
          className={`h-4 w-4 ${
            perfume.is_favorite
              ? "fill-red-500 text-red-500"
              : "text-gray-400 dark:text-gray-500"
          }`}
        />
        <span className="text-sm">
          {perfume.is_favorite ? "Favorilerden Çıkar" : "Favoriye Ekle"}
        </span>
      </Button>
      <Accordion type="single" collapsible defaultValue="perfume-info">
        <AccordionItem value="perfume-info">
          <AccordionTrigger className="bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg hover:no-underline">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold text-base">Parfüm Bilgileri</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-4">
            <div className="space-y-3">
              {/* Temel Bilgiler - 2 sütun */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Marka:</span>
                  <span className="ml-2 font-medium">{perfume.brand}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">İsim:</span>
                  <span className="ml-2 font-medium">{perfume.name}</span>
                </div>
                {perfume.olfactive_family && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Koku Ailesi:</span>
                    <span className="ml-2 font-medium">{perfume.olfactive_family}</span>
                  </div>
                )}
                {perfume.type && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Tip:</span>
                    <span className="ml-2 font-medium">{perfume.type}</span>
                  </div>
                )}
              </div>

              {/* Piramit Notu */}
              {perfume.pyramid_note && (
                <div className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Piramit Notu:</span>
                  <span className="ml-2 font-medium">{perfume.pyramid_note}</span>
                </div>
              )}

              {/* Notlar - 2 sütun */}
              {creativeFormula && (
                <div className="border-t pt-3 mt-2">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Üst Notalar:</span>
                      <div className="font-medium mt-1">{creativeFormula.top_notes}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Orta Notalar:</span>
                      <div className="font-medium mt-1">{creativeFormula.middle_notes}</div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500 dark:text-gray-400">Alt Notalar:</span>
                      <div className="font-medium mt-1">{creativeFormula.base_notes}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Önerilen Kullanım Oranı */}
              {perfume.recommended_usage && (
                <div className="border-t pt-2 mt-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Önerilen Kullanım Oranı:
                  </span>
                  <div className="font-medium mt-1">{perfume.recommended_usage}</div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
