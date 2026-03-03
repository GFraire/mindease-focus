import { type AuthRepository } from "../../domain/repositories/auth-repository";

export class LogoutUserUseCase {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(): Promise<void> {
    await this.authRepository.logout();
  }
}
