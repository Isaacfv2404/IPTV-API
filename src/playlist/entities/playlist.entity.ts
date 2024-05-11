
import { User } from 'src/auth/entities/user.entity';
import { Channel } from 'src/channel/entities/channel.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('playlist')
export class Playlist {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @OneToMany(() => Channel, channel => channel.playlist)
  channels: Channel[];

  @ManyToOne(() => User, user => user.playlists)
  user: User;

}
