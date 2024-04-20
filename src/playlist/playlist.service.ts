import { Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import parser from 'iptv-playlist-parser';
import {AxiosResponse} from 'axios';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PlaylistService {



  constructor(private httpService: HttpService) {}


  create(createPlaylistDto: CreatePlaylistDto) {
    return 'This action adds a new playlist';
  }

  findAll() {
    return `This action returns all playlist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} playlist`;
  }

  update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    return `This action updates a #${id} playlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }

  getPlaylist(url: string): Observable<any> {
    return this.httpService.get(url).pipe(
      map((response: AxiosResponse) => {
        const playlist = response.data;
        const result = parser.parse(playlist);
        return result;
      }),
      catchError(error => {
        throw new Error(`Error during the request: ${error.message}`);
      })
    );
  }
  
}
