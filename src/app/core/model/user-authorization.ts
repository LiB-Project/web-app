import { Role } from './role.enum';

export class UserAuthorization {
    constructor(
        public nome?: string,
        public login?: string,
        public token?: string,
        public roles?: Role[]
    ) {}
}
