import React from 'react';
import { Button } from './ui/button';
import StarRating from './ui/starRating.jsx';
import { MessageSquare, Trash2 } from 'lucide-react';
import { Formula } from '../types/api.types';

interface UserFormulasProps {
  formulas: Formula[];
  selectedFormulaId: number | null;
  showComments: boolean;
  onCommentsClick: (formula: Formula, e: React.MouseEvent) => void;
  onDeleteClick: (id: number) => void;
  isAdmin: boolean;
  onAddFormulaClick: () => void;
}

export const UserFormulas: React.FC<UserFormulasProps> = ({
  formulas,
  selectedFormulaId,
  showComments,
  onCommentsClick,
  onDeleteClick,
  isAdmin,
  onAddFormulaClick,
}) => {
  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg dark:text-gray-100">Kullanıcı Formülleri</h3>
      <div className="space-y-3">
        {formulas.length > 0 ? (
          formulas.map((formula, index) => (
            <div
              key={formula.id}
              className={`p-3 rounded-lg border transition-all ${
                selectedFormulaId === formula.id && showComments
                  ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-xs">
                    #{index + 1}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formula.created_at
                      ? new Date(formula.created_at).toLocaleDateString('tr-TR')
                      : 'Tarih belirtilmemiş'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={formula.averageRating || 0} readonly={true} size="sm" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-1 ${
                      selectedFormulaId === formula.id && showComments
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                    onClick={(e: React.MouseEvent) => onCommentsClick(formula, e)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs">{formula.reviewCount || 0}</span>
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 h-7 w-7"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onDeleteClick(formula.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                  <div className="text-gray-600 dark:text-gray-400 mb-1">Esans</div>
                  <div className="font-bold text-purple-700 dark:text-purple-300">
                    %{formula.fragrancePercentage}
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                  <div className="text-gray-600 dark:text-gray-400 mb-1">Alkol</div>
                  <div className="font-bold text-blue-700 dark:text-blue-300">
                    %{formula.alcoholPercentage}
                  </div>
                </div>
                <div className="bg-cyan-50 dark:bg-cyan-900/20 p-2 rounded">
                  <div className="text-gray-600 dark:text-gray-400 mb-1">Su</div>
                  <div className="font-bold text-cyan-700 dark:text-cyan-300">
                    %{formula.waterPercentage}
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                  <div className="text-gray-600 dark:text-gray-400 mb-1">Dinlenme</div>
                  <div className="font-bold text-green-700 dark:text-green-300">
                    {formula.restDay} Gün
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={onAddFormulaClick}
          >
            <p>Henüz bu parfüm için bir formül paylaşılmamış.</p>
            <p className="text-sm mt-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
              İlk paylaşan sen ol! ✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
