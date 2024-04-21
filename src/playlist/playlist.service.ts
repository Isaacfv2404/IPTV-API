import { Injectable, Res } from '@nestjs/common';
import { parse} from 'iptv-playlist-parser';
import { Playlist } from '../interfaces/playlist.interface';
import  {createReadStream} from 'fs';
import { join } from 'path';
import {pipeline} from 'stream';
import {promisify} from 'util';

const pipelineAsync = promisify(pipeline);

@Injectable()
export class PlaylistService {


  constructor() { }

 async getPlaylist(): Promise<Playlist> {
  const playlistPath = join(process.cwd(), 'src/files/listaCR.m3u');
  const playlist = createReadStream(playlistPath);
  let data = '';

  await pipelineAsync(
    playlist,
    async function (source) {
      for await (const chunk of source) {
        data += chunk;
      }
    }
  );
  
  const result = parse(data);

  return result;
}
}
