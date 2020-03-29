import { Role } from './role.enum';

export class User {
    constructor(
        public id?: string,
        public nome?: string,
        public login?: string,
        public senha?: string,
        public roles?: Role[]
    ) {}
}
