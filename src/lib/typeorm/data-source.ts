import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@/entities/User";
import { PaymentMethod } from "@/entities/PaymentMethod";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },

  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV !== "production",
  entities: [User, PaymentMethod],
  migrations: [],
  subscribers: [],
});