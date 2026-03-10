# MindEase Focus

## 🚀 Firebase Setup (Vite + React)

Este projeto utiliza Firebase configurado via variáveis de ambiente usando Vite.

![Preview](docs/images/preview.png)

## 📦 1. Criar projeto no Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto
3. Vá em **Project Settings → General → Your Apps**
4. Crie um **App Web**
5. Copie as credenciais fornecidas

## 🔐 2. Habilitar Authentication

1. No menu lateral do Firebase Console, vá em **Authentication**
2. Clique em **Get Started**
3. Em **Sign-in method**, habilite o método **Email/Password**

## 🗄️ 3. Habilitar Firestore Database

1. No menu lateral, vá em **Firestore Database**
2. Clique em **Create Database**
3. Escolha **Start in test mode** (para desenvolvimento)
4. Selecione a região recomendada

## 🔒 4. Configurar regras do Firestore

Para garantir que cada usuário só possa acessar seus próprios dados, configure as seguintes regras no **Firestore**.

1. No **Firebase Console**, vá em **Firestore Database**
2. Clique na aba **Rules**
3. Substitua pelas regras abaixo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /tasks/{taskId} {
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## ⚙️ 5. Criar arquivo .env

Na raiz do projeto crie um arquivo chamado .env:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

⚠️ Todas variáveis devem começar com VITE_ para serem acessíveis no Vite.

## 6. ▶️ Rodar o projeto

```bash
# instalar dependências
npm install

# iniciar servidor de desenvolvimento
npm run dev
```

Abra no navegador:
http://localhost:5173

## 🏗️ 7. Arquitetura do Projeto

O projeto foi desenvolvido utilizando **Clean Architecture**, organizada em **módulos de domínio**, para manter o código desacoplado, escalável e fácil de manter.

Cada módulo representa uma funcionalidade da aplicação (por exemplo: autenticação, tarefas, etc.) e contém suas próprias camadas de domínio, aplicação e infraestrutura.

### Camadas utilizadas

**Domain**

Contém as regras de negócio da aplicação:

- entidades
- interfaces de repositórios
- regras de domínio

Essa camada não depende de nenhuma outra.

**Application**

Responsável pelos **casos de uso da aplicação**.

Aqui ficam:

- use cases
- DTOs
- regras de orquestração da aplicação

**Infrastructure**

Implementações externas da aplicação, como:

- Firebase
- repositórios concretos
- serviços externos

**Presentation**

Camada responsável pela interface do usuário:

- páginas
- componentes
- hooks
- estado da aplicação

---

### Vantagens dessa arquitetura

✔ **Baixo acoplamento** entre as camadas  
✔ **Facilidade para testar regras de negócio**  
✔ **Escalabilidade do projeto**  
✔ **Separação clara de responsabilidades**  
✔ **Facilidade para trocar tecnologias externas (ex: Firebase)**  

Além disso, a organização **por módulos** permite que cada funcionalidade evolua de forma independente, tornando o projeto mais fácil de manter conforme ele cresce.

## 📂 8. Estrutura de Pastas

mindease-focus/
├─── app/
├─── modules/
│   ├─── auth/
│   │   ├─── application/
│   │   │   └─── use-cases/
│   │   ├─── domain/
│   │   │   ├─── entities/
│   │   │   └─── repositories/
│   │   ├─── infrastructure/
│   │   │   └─── firebase/
│   │   └─── presentation/
│   │       ├─── components/
│   │       ├─── pages/
│   │       └─── schemas/
│   ├─── focus/
│   │   ├─── application/
│   │   ├─── domain/
│   │   │   ├─── constants/
│   │   │   └─── entities/
│   │   └─── presentation/
│   │       ├─── components/
│   │       └─── pages/
│   └─── task/
│       ├─── application/
│       │   ├─── dtos/
│       │   └─── use-cases/
│       ├─── domain/
│       │   ├─── entities/
│       │   └─── repositories/
│       ├─── infrastructure/
│       │   └─── firebase/
│       └─── presentation/
│           ├─── components/
│           │   └─── task-filters/
│           ├─── pages/
│           └─── utils/
└─── shared/
    ├─── lib/
    │   └─── firebase/
    ├─── styles/
    ├─── types/
    ├─── ui/
    │   ├─── assets/
    │   ├─── components/
    │   │   ├─── cognitive-panel/
    │   │   ├─── form/
    │   │   ├─── sidebar/
    │   │   └─── ui/
    │   ├─── hooks/
    │   ├─── providers/
    │   ├─── routes/
    │   └─── store/
    └─── tils/
        ├─── date/
        └─── translate/