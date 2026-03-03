export function translateAuthError(error: any): string {
  const code = error?.code;

  switch (code) {
    case "auth/user-not-found":
      return "Usuário não encontrado.";

    case "auth/wrong-password":
      return "Senha incorreta.";

    case "auth/email-already-in-use":
      return "Este e-mail já está em uso.";

    case "auth/invalid-credential":
      return "Credenciais inválidas.";

    case "auth/invalid-email":
      return "E-mail inválido.";

    case "auth/weak-password":
      return "A senha deve ter no mínimo 6 caracteres.";

    default:
      return "Ocorreu um erro inesperado.";
  }
}