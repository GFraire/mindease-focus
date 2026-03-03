import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/shared/lib/firebase/auth";
import { useAuthStore } from "@/shared/ui/store/auth-store";

export function initAuthListener() {
  const { setUser, setLoading } = useAuthStore.getState();

  setLoading(true);

  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      setUser({
        id: firebaseUser.uid,
        fullName: firebaseUser.displayName,
        email: firebaseUser.email,
      });
    } else {
      setUser(null);
    }
  });
}
