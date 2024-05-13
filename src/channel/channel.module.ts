import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Playlist } from 'src/playlist/entities/playlist.entity';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService],
  imports: [TypeOrmModule.forFeature([Channel, Playlist])],
})

export class ChannelModule {}
