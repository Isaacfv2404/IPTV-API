import { Controller, Get, Post, Body, Patch, Param, Delete,Query,Res, HttpException, HttpStatus } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Controller('playlist')
export class PlaylistController {
  
  constructor(private readonly playlistService: PlaylistService) {}
  
  @Post()
  create(@Body() createPlaylistDto: CreatePlaylistDto) {
    return this.playlistService.create(createPlaylistDto);
  }

  @Get()
  findAll() {
    return this.playlistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playlistService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaylistDto: UpdatePlaylistDto) {
    return this.playlistService.update(+id, updatePlaylistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playlistService.remove(+id);
  }

  @Get('getPlaylist')
  getPlaylist(@Query('url') url: string, @Res() res: Response) {
    return this.playlistService.getPlaylist(url).subscribe({
      next: result => res.json,
     
    });
  }
}
