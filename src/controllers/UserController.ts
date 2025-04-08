import { controller } from "inversify-express-utils";
import { TYPES } from "../config/Types";
import { inject } from "inversify";
import { IUserServices } from "../services/IUserServices";

@controller("/user")
export class UserController {
    constructor(
        @inject(TYPES.UserServices) private userServices: IUserServices,
    ){}
}
