import { Playlist } from "src/playlist/entities/playlist.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('channel')
export class Channel {

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

    @ManyToOne(() => Playlist, playlist => playlist.channels)
    playlist: Playlist;
}
