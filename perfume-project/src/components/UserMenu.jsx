import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ChevronDown, 
  ChevronUp,
  ClipboardList, 
  Sprout, 
  KeyRound,
  LogOut,
  User,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const UserMenu = ({ 
  pendingRequestsCount = 0,
  onPendingRequestsClick,
  onAddPerfumeClick,
  onChangePasswordClick,
  onLogout,
  username,
  isAdmin = false,
  className = "",
  onFavoritesClick
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleMenuItemClick = (handler) => {
    setTimeout(() => {
      handler();
      setIsOpen(false);
    }, 100);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`relative flex items-center gap-2 px-3 py-2 text-white dark:text-white rounded-md ${className}`}
        >
          <User className="h-4 w-4" />
          <span className="font-medium">{username}</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          {isAdmin === true && pendingRequestsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {pendingRequestsCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {isAdmin === true && (
          <>
            <DropdownMenuItem 
              onSelect={(e) => {
                e.preventDefault();
                handleMenuItemClick(onPendingRequestsClick);
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <ClipboardList className="h-4 w-4" />
              <span>Bekleyen İstekler</span>
              {pendingRequestsCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {pendingRequestsCount}
                </span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onSelect={(e) => {
                e.preventDefault();
                handleMenuItemClick(onAddPerfumeClick);
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Sprout className="h-4 w-4" />
              <span>Parfüm Yönetimi</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem 
          onSelect={(e) => {
            e.preventDefault();
            handleMenuItemClick(onChangePasswordClick);
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <KeyRound className="h-4 w-4" />
          <span>Şifre Değiştir</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onSelect={(e) => {
            e.preventDefault();
            handleMenuItemClick(onFavoritesClick);
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Heart className="h-4 w-4" />
          <span>Favorilerim</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onSelect={(e) => {
            e.preventDefault();
            handleMenuItemClick(onLogout);
          }}
          className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          <span>Çıkış Yap</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;