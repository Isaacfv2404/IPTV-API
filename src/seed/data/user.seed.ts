import { User } from "src/user/entities/user.entity";

export const USER_SEED: User[] = [
    {
        email: 'john@example.com',
        password: 'john1234',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
    },
    {
        email: 'miguel@example.com',
        password: 'miguel1234',
        firstName: 'Miguel',
        lastName: 'Doberman',
        isActive: true,
    },
    {
        email: 'Juan@example.com',
        password: 'juan1234',
        firstName: 'Juan',
        lastName: 'Perez',
        isActive: true,
    },
]