import { User } from "src/user/entities/user.entity";
import { v4 as uuid } from 'uuid';

export const USER_SEED: User[] = [
    {
        id: uuid(),
        email: 'john@example.com',
        password: 'john1234',
        firstName: 'John',
        lastName: 'Doe',
    },
    {
        id: uuid(),
        email: 'miguel@example.com',
        password: 'miguel1234',
        firstName: 'Miguel',
        lastName: 'Doberman',
    },
    {
        id: uuid(),
        email: 'Juan@example.com',
        password: 'juan1234',
        firstName: 'Juan',
        lastName: 'Perez',
    },
]