import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text')
    password: string;

    @Column('text')
    firstName: string;

    @Column('text')
    lastName: string;

    @Column('boolean', {default: true})
    isActive?: boolean;

    @Column('date',{default: new Date()})
    createdAt?: Date;

    @Column('date',{default: new Date()})
    updatedAt?: Date;
}

