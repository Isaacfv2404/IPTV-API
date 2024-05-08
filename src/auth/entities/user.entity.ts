import { Playlist } from "src/playlist/entities/playlist.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('text',{unique: true})
    email: string;

    @Column('text',{
        select:false
    })
    password: string;

    @Column('text',{name: 'first_name'})
    firstName: string;

    @Column('text',{name: 'last_name'})
    lastName: string;

    @Column('bool',{name: 'is_active',default: 'true'})
    isActive: boolean;

    @Column('date',{name: 'created_at',default: new Date()})
    createdAt: Date;

    @Column('date',{name: 'updated_at',default: new Date()})
    updatedAt: Date;

    @Column('text',{array: true, default:['user']})
    roles: string[];

    @OneToMany(()=>Playlist, playlist => playlist.user)
    playlists: Playlist[];

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();//Se convierte el email a minúsculas y se eliminan los espacios en blanco
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
}

