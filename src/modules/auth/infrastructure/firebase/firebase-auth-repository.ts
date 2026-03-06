import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "@/shared/lib/firebase/auth";
import { User } from "../../domain/entities/user";
import { type AuthRepository } from "../../domain/repositories/auth-repository";

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

  async login({ email, password }: any): Promise<User> {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    const firebaseUser = credential.user;

    return new User(
      firebaseUser.uid,
      firebaseUser.email!,
      firebaseUser.displayName ?? "",
    );
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }
}
