/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // Diğer env değişkenlerini buraya ekleyebilirsiniz
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
