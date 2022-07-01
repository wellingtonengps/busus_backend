import "reflect-metadata";
import { DataSource } from "typeorm";
import { Place, Schedule, User } from "./entity";


export const AppDataSource = new DataSource({
  type: "postgres",
  host: "postgres",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "Busus",
  entities: [User, Place, Schedule],
  synchronize: true,
  logging: false,
});
