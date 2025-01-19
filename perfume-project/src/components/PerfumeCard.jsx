import { Heart } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const PerfumeCard = ({ perfume, onClick, onFavoriteToggle, isLoggedIn }) => {
  return (
    <Card 
      className="relative overflow-hidden cursor-pointer transform transition-all duration-300 
        hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] 
        active:scale-[0.98] active:translate-y-0
        bg-card hover:bg-card/95
        border border-border/40 hover:border-border/80
        flex flex-col h-full"
      onClick={onClick}
    >
      <CardContent className="p-4 relative z-10 flex flex-col flex-1">
        {isLoggedIn && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFavoriteToggle(perfume.id);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-background/80 
                    hover:bg-background transition-colors duration-200
                    hover:scale-110 active:scale-95
                    backdrop-blur-sm"
                >
                  <Heart 
                    className={`h-5 w-5 ${
                      perfume.is_favorite 
                        ? 'text-red-500 fill-current' 
                        : 'text-muted-foreground hover:text-red-500'
                    }`}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{perfume.is_favorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <div className="flex flex-col flex-1">
          <div className="border-b border-border/50 pb-3">
            <h3 className="font-semibold text-lg tracking-tight text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              {perfume.brand}
            </h3>
            <p className="font-medium text-sm text-black dark:text-[rgb(124,239,182)]">
              {perfume.name}
            </p>
          </div>

          <div className="space-y-1.5 text-[13px] text-foreground/75 mt-4">
            <p>
              <span className="font-medium text-foreground/85">Üst Notalar:</span> 
              <span className="ml-1">{perfume.top_notes || '-'}</span>
            </p>
            <p>
              <span className="font-medium text-foreground/85">Orta Notalar:</span> 
              <span className="ml-1">{perfume.middle_notes || '-'}</span>
            </p>
            <p>
              <span className="font-medium text-foreground/85">Alt Notalar:</span> 
              <span className="ml-1">{perfume.base_notes || '-'}</span>
            </p>
          </div>

          <div className="border-t border-border/50 pt-3 mt-auto">
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-medium text-foreground/85">
                Formül Sayısı
              </span>
              <span className="text-primary/75 font-medium">
                {perfume.formulaCount || 0}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerfumeCard; 