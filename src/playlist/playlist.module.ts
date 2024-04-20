import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { HttpModule} from '@nestjs/axios';

@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService],
  imports: [HttpModule]
})
export class PlaylistModule {}
