import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';


@Controller('playlist')
export class PlaylistController {

  constructor(private readonly playlistService: PlaylistService) { }

  @Get()
  findAll() {
    const playlist = this.playlistService.getPlaylist();
    return playlist;
  }

}
