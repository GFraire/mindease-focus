export class User {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;

  constructor(id: string, email: string, fullName: string) {
    this.id = id;
    this.email = email;
    this.fullName = fullName;
  }

  updateName(newName: string) {
    if (!newName.trim()) {
      throw new Error("Nome não pode ser vazio.");
    }

    return new User(this.id, this.email, newName);
  }
}
