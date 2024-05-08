import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpException, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';


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

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePlaylistDto: CreatePlaylistDto) {
    return this.playlistService.update(id, updatePlaylistDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.playlistService.remove(id);
  }

  @Get('import')
  importPlayList() {
    const playlist = this.playlistService.importPlaylist();
    return playlist;
  }


}
