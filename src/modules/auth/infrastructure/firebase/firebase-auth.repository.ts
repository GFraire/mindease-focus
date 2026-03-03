import { type AuthRepository } from "../../domain/repositories/auth-repository";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/shared/lib/firebase/auth";

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export class FirebaseAuthRepository implements AuthRepository {
  async register({ fullName, email, password }: RegisterData): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await updateProfile(userCredential.user, {
      displayName: fullName,
    });
  }
}
