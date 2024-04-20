import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [PlaylistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
