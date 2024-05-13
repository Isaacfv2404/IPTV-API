import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { Playlist } from 'src/playlist/entities/playlist.entity';

@Injectable()
export class ChannelService {

  private readonly logger = new Logger('ChannelService');

  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,

    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>
  ) { }

  async create(createChannelDto: CreateChannelDto) {

    let playlist: Playlist;

    try {
      playlist = await this.playlistRepository.findOneBy({ id: createChannelDto.playlistId });
      if (!playlist) throw new BadRequestException('Lista de reproducción no encontrada');
      const channel = this.channelRepository.create({
        ...createChannelDto,
        playlist: playlist
      });
      await this.channelRepository.save(channel);
      return channel;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    return this.channelRepository.find({
      take: limit,
      skip: offset,
      relations: ['playlist']
    });
  }

  async findOne(term: string) {

    let channel: Channel;

    if (isUUID(term)) {
      channel = await this.channelRepository.findOne({ where: { id: term }, relations: ['playlists'] });
    } else {
      const queryBuilder = this.channelRepository.createQueryBuilder('channel')
      .leftJoinAndSelect('channel.playlists', 'playlists')
      .where('channel.tvg_name = :tvgName', { tvgName: term });
      channel = await queryBuilder.getOne();
    }

    if (!channel) throw new BadRequestException('No se encontró el canal');

    return channel;
  }

  async update(id: string, updateChannelDto: UpdateChannelDto) {

    const channel = await this.channelRepository.preload({

      id: id,
      ...updateChannelDto

    });

    if (!channel) throw new BadRequestException(`Canal con id ${id} no encontrado`);

    try {
      await this.channelRepository.save(channel);
      return channel;

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async remove(id: string) {
    const channel = await this.findOne(id);
    await this.channelRepository.remove(channel);
  }

  private handleDBExceptions(error: any): never {

    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException("Error inesperado, Revisa los logs del servidor");
  }
}
