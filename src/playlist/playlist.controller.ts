import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, Res } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Response } from 'express';


@Controller('playlist')
export class PlaylistController {

  constructor(private readonly playlistService: PlaylistService) { }


  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.playlistService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.playlistService.findOne(term);
  }

  @Get('user/:userId')
  findUserPlaylists(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.playlistService.findOneByUserId(userId);
  }

  @Post()
  create(@Body() createPlaylistDto: CreatePlaylistDto) {
    return this.playlistService.create(createPlaylistDto);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePlaylistDto: CreatePlaylistDto) {
    return this.playlistService.update(id, updatePlaylistDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.playlistService.remove(id);
  }

  @Get('export/:id')
  async exportPlayList(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const playlist = await this.playlistService.generateM3u8Content(id);
    console.log(playlist);
    res.setHeader('Content-Disposition', 'attachment; filename=playlist.m3u');
    res.setHeader('Content-Type', 'application/x-mpegURL');
    res.send(playlist);

    return playlist;
  }
  
  @Get('import')
  importPlayList() {
    const playlist = this.playlistService.importPlaylist();
    return playlist;
  }


}
