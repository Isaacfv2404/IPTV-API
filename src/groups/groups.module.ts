import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Playlist } from 'src/playlist/entities/playlist.entity';
import { Channel } from 'src/channel/entities/channel.entity';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  imports: [TypeOrmModule.forFeature([Group,Playlist,Channel])]
})
export class GroupsModule {}
