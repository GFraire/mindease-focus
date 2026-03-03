import type { User } from "../entities/user";

export interface AuthRepository {
  register(data: {
    fullName: string;
    email: string;
    password: string;
  }): Promise<void>;

  login(data: { email: string; password: string }): Promise<User>;

  logout(): Promise<void>;
}
