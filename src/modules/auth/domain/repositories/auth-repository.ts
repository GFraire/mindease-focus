export interface AuthRepository {
  register(data: {
    fullName: string
    email: string
    password: string
  }): Promise<void>
}