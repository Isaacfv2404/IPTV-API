import { Channel } from "src/channel/entities/channel.entity";
import { Playlist } from "src/playlist/entities/playlist.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('group')
export class Group {
    
    @PrimaryGeneratedColumn('uuid')
    id : string;
    
    @Column('text', { name: 'name' })
    name : string;

    @ManyToOne(() => Playlist, playlist => playlist.groups)
    playlist: Playlist;
  
    @OneToMany(() => Channel, channel => channel.group)
    channels: Channel[];

}
