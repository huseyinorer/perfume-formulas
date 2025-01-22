import React from 'react';
import { Twitter, Github } from 'lucide-react';

const Footer = ({ onGuideClick, onAddFormulaClick, onFAQClick }) => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Hakkımızda Bölümü */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Hakkımızda
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Parfüm Formülleri, parfüm tutkunları için oluşturulmuş bir platformdur. 
              Kendi parfümünüzü yaratmanıza yardımcı oluyoruz.
            </p>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Hızlı Linkler
            </h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={onGuideClick}
                  className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Parfüm Rehberi
                </button>
              </li>
              <li>
                <button 
                  onClick={onAddFormulaClick}
                  className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Formül Ekle
                </button>
              </li>
              <li>
                <button
                  onClick={onFAQClick}
                  className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  SSS
                </button>
              </li>
            </ul>
          </div>

          {/* İletişim Bilgileri */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              İletişim
            </h3>
            <div className="space-y-3">
              <a 
                href="https://x.com/orerhuseyn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Twitter size={20} />
                <span>@orerhuseyn</span>
              </a>
              <a 
                href="https://github.com/huseyinorer/perfume-formulas" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Github size={20} />
                <span>@huseyinorer/perfume-formulas</span>
              </a>
            </div>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Parfüm Formülleri. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 