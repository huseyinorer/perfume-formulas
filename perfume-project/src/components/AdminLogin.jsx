// src/components/AdminLogin.jsx
import React, { useState } from "react";
import { Button } from "./ui/button";
import * as Dialog from "@radix-ui/react-dialog";

const AdminLogin = ({ open, onClose, onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const user = await response.json();
        console.log(user);
        if (user.isAdmin === true) {
          onLogin();
          onClose();
        } else {
          setError("Yetkisiz giriş");
        }
      } else {
        setError("Geçersiz kullanıcı adı veya şifre");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Giriş sırasında bir hata oluştu");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-md bg-white rounded-lg p-6 dark:bg-gray-800 dark:border dark:border-gray-700">
          <Dialog.Title className="text-lg font-bold mb-4 dark:text-gray-100">Admin Girişi</Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium block dark:text-gray-200">Kullanıcı Adı</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium block dark:text-gray-200">Şifre</label>
              <input
                type="password"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>

            {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

            <Button type="submit" className="w-full">
              Giriş Yap
            </Button>
          </form>

          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400" aria-label="Close">
              ✕
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AdminLogin;
