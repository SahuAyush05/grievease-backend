import { inject, injectable } from "inversify";
import { IUserRepository } from "../IUserRepository";
import { PrismaClient } from "@prisma/client";
import { TYPES } from "../../config/Types";


@injectable()
class UserRepository implements IUserRepository{
    constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient){}
    // Implement IUserRepository methods here
}

export { UserRepository };
