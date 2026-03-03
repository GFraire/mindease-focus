import { type AuthRepository } from "../../domain/repositories/auth-repository";

interface RegisterUserRequest {
  fullName: string;
  email: string;
  password: string;
}

export class RegisterUserUseCase {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(data: RegisterUserRequest): Promise<void> {
    await this.authRepository.register(data);
  }
}
