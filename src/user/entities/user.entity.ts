import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('text',{unique: true})
    email: string;

    @Column('text')
    password: string;

    @Column('text',{name: 'first_name'})
    firstName: string;

    @Column('text',{name: 'last_name'})
    lastName: string;

    @Column('boolean',{name: 'is_active',default: 'true'})
    isActive?: boolean;

    @Column('date',{name: 'created_at',default: new Date()})
    createdAt?: Date;

    @Column('date',{name: 'updated_at',default: new Date()})
    updatedAt?: Date;
}

