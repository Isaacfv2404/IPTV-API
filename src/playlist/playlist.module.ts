import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';


@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService],
  imports: [TypeOrmModule.forFeature([Playlist])],
})
export class PlaylistModule {}
