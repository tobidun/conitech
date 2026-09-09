import { AppDataSource } from "@/lib/typeorm/data-source";

let initPromise: Promise<unknown> | null = null;

export async function connectDatabase() {
  if (AppDataSource.isInitialized) return;

  if (!initPromise) {
    initPromise = AppDataSource.initialize();
    try {
      await initPromise;
    } catch (err) {
      initPromise = null;
      throw err;
    }
    initPromise = null;
  }

  await initPromise;
}

export async function disconnectDatabase() {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    initPromise = null;
  }
}
