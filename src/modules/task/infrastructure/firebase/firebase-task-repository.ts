import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase/db";
import type { TaskRepository } from "../../domain/repositories/task-repository";
import type { Task } from "../../domain/entities/task";

export class FirebaseTaskRepository implements TaskRepository {
  async create(task: Omit<Task, "id">): Promise<void> {
    await addDoc(collection(db, "tasks"), task);
  }

  async listByDate({
    userId,
    date,
  }: {
    userId: string;
    date: string;
  }): Promise<Task[]> {
    const tasksRef = collection(db, "tasks");

    const q = query(
      tasksRef,
      where("userId", "==", userId),
      where("scheduledFor", "==", date),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];
  }

  async findPendingTasks(userId: string, beforeDate: string) {
    const q = query(
      collection(db, "tasks"),
      where("userId", "==", userId),
      where("completed", "==", false),
      where("scheduledFor", "<", beforeDate),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];
  }

  async update(id: string, data: Partial<Task>): Promise<void> {
    const taskRef = doc(db, "tasks", id);

    await updateDoc(taskRef, data);
  }

  async delete(taskId: string): Promise<void> {
    const taskRef = doc(db, "tasks", taskId);

    await deleteDoc(taskRef);
  }

  async findById(taskId: string): Promise<Task | null> {
    const taskRef = doc(db, "tasks", taskId);

    const snapshot = await getDoc(taskRef);

    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Task;
  }
}
