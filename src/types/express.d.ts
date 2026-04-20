import { IUser } from "../features/users/user";

export { };

declare global {
    namespace Express {
        interface Request {
            user: IUser;
            isLogged: boolean;
        }
    }
}
