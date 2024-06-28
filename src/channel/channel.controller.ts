import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(createChannelDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.channelService.findAll(paginationDto);
  }

  @Get('ping')
  async ping(@Query('url') url: string){
   const isOnline = await this.channelService.pingUrl(url);
   return { status: isOnline ? 'online' : 'offline' };
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.channelService.findOne(term);
  }

  @Get('by_playlist/:playlistId')
  findAllByPlaylistId(@Param('playlistId', ParseUUIDPipe) playlistId: string) {
    return this.channelService.findAllByPlaylistId(playlistId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelService.remove(id);
  }

  @Post('import/:id')
  import(@Param('id', ParseUUIDPipe) id: string, @Body() createChannelDto: CreateChannelDto[]){
    return this.channelService.importChannels(id, createChannelDto);
  }


}
