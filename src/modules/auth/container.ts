import { FirebaseAuthRepository } from "./infrastructure/firebase/firebase-auth.repository";
import { RegisterUserUseCase } from "./application/use-cases/register-user-use-case";
import { LoginUserUseCase } from "./application/use-cases/login-user-usecase";
import { LogoutUserUseCase } from "./application/use-cases/logout-user-usecase";

export function makeRegisterUserUseCase() {
  const repository = new FirebaseAuthRepository();

  return new RegisterUserUseCase(repository);
}

export function makeLoginUserUseCase() {
  const repository = new FirebaseAuthRepository();

  return new LoginUserUseCase(repository);
}

export function makeLogoutUserUseCase() {
  const repository = new FirebaseAuthRepository();

  return new LogoutUserUseCase(repository);
}
