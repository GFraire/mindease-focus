# MindEase Focus

## 🚀 Firebase Setup (Vite + React)

Este projeto utiliza Firebase configurado via variáveis de ambiente usando Vite.

---

## 📦 1. Criar projeto no Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto
3. Vá em: Project Settings → General → Your Apps
4. Crie um App Web
5. Copie as credenciais fornecidas

---

## ⚙️ 2. Criar arquivo `.env`
Teste
Na raiz do projeto crie: .env

Adicione:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

⚠️ Todas variáveis devem começar com VITE_.