import { PrismaClient, User } from "@prisma/client";
import { Container } from "inversify";
import { TYPES } from "./Types";
import { UserController } from "../controllers/UserController";
import { UserRepository } from "../db/Imp/UserRepository";
import { IUserRepository } from "../db/IUserRepository";
import { UserServices } from "../services/impl/UserServices";
import { IUserServices } from "../services/IUserServices";
import { DatabaseConfig } from "./DatabaseConfig";

const container= new Container();

container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(new PrismaClient());

//controllers
container.bind<UserController>(TYPES.UserController).to(UserController);

//services
container.bind<IUserServices>(TYPES.UserServices).to(UserServices);

//Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<DatabaseConfig>(DatabaseConfig).to(DatabaseConfig).inSingletonScope();

export { container };