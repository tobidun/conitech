import { AppDataSource } from "@/lib/typeorm/data-source";

let isConnected = false;

export async function connectDatabase() {
  if (isConnected) return;

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    isConnected = true;
  }
}

export async function disconnectDatabase() {
  if (isConnected && AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    isConnected = false;
  }
}
