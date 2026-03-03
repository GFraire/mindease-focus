import { FirebaseAuthRepository } from "./infrastructure/firebase/firebase-auth.repository";
import { RegisterUserUseCase } from "./application/use-cases/register-user.use-case";

export function makeRegisterUserUseCase() {
  const repository = new FirebaseAuthRepository();

  return new RegisterUserUseCase(repository);
}
