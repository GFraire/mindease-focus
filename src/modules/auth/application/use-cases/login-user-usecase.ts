import { type AuthRepository } from "../../domain/repositories/auth-repository";

interface LoginUserRequest {
  email: string;
  password: string;
}

export class LoginUserUseCase {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(data: LoginUserRequest) {
    return this.authRepository.login(data);
  }
}
