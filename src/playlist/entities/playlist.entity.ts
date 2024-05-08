
import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('playlist')
export class Playlist {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true, name: 'tvg_id' })
  tvgId: string;

  @Column('int', { unique: true, name: 'tvg_number' })
  tvgNumber: number;

  @Column('text', { name: 'tvg_name' })
  tvgName: string;

  @Column('text', { name: 'tvg_logo' })
  tvgLogo: string;

  @Column('text', { name: 'tvg_group' })
  tvgGroup: string;

  @Column('text', { name: 'tvg_url' })
  tvgUrl: string;

  @ManyToOne(() => User, user => user.playlists)
  user: User;

}
