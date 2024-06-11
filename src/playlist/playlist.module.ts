import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { User } from 'src/auth/entities/user.entity';
import { Group } from 'src/groups/entities/group.entity';


@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService],
  imports: [TypeOrmModule.forFeature([Playlist, User, Group])],
})
export class PlaylistModule {}
