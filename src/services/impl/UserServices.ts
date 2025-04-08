import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import { TYPES } from "../../config/Types";
import { IUserServices } from "../IUserServices";
import { IUserRepository } from "../../db/IUserRepository";

@injectable()
class UserServices implements IUserServices {
    constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.PrismaClient) private prisma: PrismaClient) {
        
    }

    // Implement IUserServices methods here
}
export { UserServices };