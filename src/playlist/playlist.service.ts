import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Playlist as PlayParser, parse } from 'iptv-playlist-parser';
import { createReadStream } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Playlist } from './entities/playlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { isUUID } from 'class-validator';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { User } from 'src/auth/entities/user.entity';

const pipelineAsync = promisify(pipeline);

@Injectable()
export class PlaylistService {

  private readonly logger = new Logger('PlaylistService');
  constructor(
    @InjectRepository(Playlist)
    private readonly playRepository: Repository<Playlist>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>

  ) { }


  async create(createPlaylistDto: CreatePlaylistDto) {

    let user: User;
    try {
      user = await this.userRepository.findOneBy({ id: createPlaylistDto.userId });

      if (!user) throw new BadRequestException('Usuario no encontrado');

      const playlist = this.playRepository.create({
        ...createPlaylistDto,
        user: user
      });
      await this.playRepository.save(playlist);
      return playlist;
    }
    catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    return this.playRepository.find({
      take: limit,
      skip: offset,
      relations: ['user']
    });

  }

  async findOne(term: string) {
    let playlist: Playlist;

    if (isUUID(term)) {
      playlist = await this.playRepository.findOne({ where: { id: term }, relations: ['user', 'channels'] });
    } else {
      playlist = await this.playRepository
        .createQueryBuilder('playlist')
        .leftJoinAndSelect('playlist.user', 'user')
        .where('playlist.name = :name', { name: term })
        .getOne();
    }

    if (!playlist) throw new BadRequestException('No se encontró la playlist');

    return playlist;
  }

  async findOneByUserId(userId: string): Promise<Playlist[]> {
    const playlists = await this.playRepository
      .createQueryBuilder('playlist')
      .leftJoinAndSelect('playlist.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();

    return playlists;
  }

  async update(id: string, updatePlaylistDto: UpdatePlaylistDto) {

    const playList = await this.playRepository.preload({
      id: id,
      ...updatePlaylistDto
    });

    if (!playList) throw new BadRequestException(`Playlist con id ${id} no encontrada`);

    try {
      await this.playRepository.save(playList);
      return playList;
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async remove(id: string) {
    const playlist = await this.findOne(id);
    await this.playRepository.remove(playlist);
  }

  async importPlaylist(): Promise<PlayParser> {
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

  async generateM3u8Content(playlistId: string) {

    const playlist = await this.findOne(playlistId);
    let content = '#EXTM3U\n';
    playlist.channels.forEach(channel => {
      content += `#EXTINF: -1 tvg-id="${channel.tvgId}" tvg-chno="${channel.tvgNumber}" tvg-logo="${channel.tvgLogo}" group-title="${channel.tvgGroup}", ${channel.tvgDetail}\n`;
      content += `${channel.tvgUrl}\n`;
    });

    if (!content) throw new BadRequestException('No se encontraron canales en la playlist');

    return content;
  }

  private handleDBExceptions(error: any): never {

    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException("Error inesperado, Revisa los logs del servidor");

  }
}
