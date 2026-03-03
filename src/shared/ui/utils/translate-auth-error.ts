export function translateAuthError(error: any): string {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "Este e-mail já está em uso.";

    case "auth/invalid-email":
      return "E-mail inválido.";

    case "auth/weak-password":
      return "A senha deve ter no mínimo 6 caracteres.";

    default:
      return "Ocorreu um erro inesperado.";
  }
}
