import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { Playlist } from 'src/playlist/entities/playlist.entity';
import { GroupsService } from 'src/groups/groups.service';
import { Group } from 'src/groups/entities/group.entity';
import { CreateGroupDto } from 'src/groups/dto/create-group.dto';
import axios from 'axios';

@Injectable()
export class ChannelService {

  private readonly logger = new Logger('ChannelService');

  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,

    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    private groupsService: GroupsService
  ) { }

  async create(createChannelDto: CreateChannelDto) {

    let playlist: Playlist;
    let group: Group

    try {
      playlist = await this.playlistRepository.findOneBy({ id: createChannelDto.playlistId });
      group = await this.groupsService.findOne(createChannelDto.groupId);
      if (!playlist) throw new BadRequestException('Lista de reproducción no encontrada');
      if (!group) throw new BadRequestException('Grupo no encontrado');
      const channel = this.channelRepository.create({
        ...createChannelDto,
        playlist: playlist,
        group: group
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
      relations: ['playlist', 'group']
    });
  }

  findAllByPlaylistId(playlistId: string) {
    return this.channelRepository.find({
      where: { playlist: { id: playlistId } },
      relations: ['playlist', 'group']
    });
  }

  async findOne(term: string) {

    let channel: Channel;

    if (isUUID(term)) {
      channel = await this.channelRepository.findOne({ where: { id: term }, relations: ['playlist', 'group'] });
    } else {
      const queryBuilder = this.channelRepository.createQueryBuilder('channel')
        .leftJoinAndSelect('channel.playlist', 'playlist')
        .where('channel.tvg_id = :tvgId', { tvgId: term });
      channel = await queryBuilder.getOne();
    }

    if (!channel) throw new BadRequestException('No se encontró el canal');

    return channel;
  }

  async update(id: string, updateChannelDto: UpdateChannelDto) {

    const { groupId, ...updateData } = updateChannelDto;

    const channel = await this.channelRepository.preload({

      id: id,
      ...updateData

    });

    if (!channel) throw new BadRequestException(`Canal con id ${id} no encontrado`);

    if (updateChannelDto.groupId !== null){
      const group = await this.groupsService.findOne(groupId);

      if (!group) throw new BadRequestException(`Grupo con id ${groupId} no encontrado`);
      
      channel.group = group;
    }
    

    try {
      await this.channelRepository.save(channel);
      return channel;

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async remove(id: string) {
    const channel = await this.channelRepository.findOne({ where: { id: id }, relations: ['playlist'] });
    await this.channelRepository.remove(channel);
  }

  async importChannels(playlistId: string, channels: CreateChannelDto[]): Promise<Channel[]> {
    let playlist: Playlist;

    try {
      playlist = await this.playlistRepository.findOne({ where: { id: playlistId }, relations: ['groups'] });
      if (!playlist) throw new BadRequestException('Lista de reproducción no encontrada');

      // Crea un mapa para almacenar los grupos creados
      const groupMap = new Map<string, Group>();

      for (const group of playlist.groups) {
        groupMap.set(group.name, group);
      }

      // Crea los grupos necesarios
      for (const channel of channels) {
        const groupName = channel.tvgGroup || 'General'; //Establece General por defecto
        if (!groupMap.has(groupName)) {
          const createGroupDto: CreateGroupDto = {
            name: groupName,
            playlistId: playlistId,
          };
          const group = await this.groupsService.create(createGroupDto);
          groupMap.set(groupName, group);
        }
      }

      // Crear y guardar los canales
      const channelsToSave = channels.map(channel => {
        if (!channel.tvgNumber) {
          channel.tvgNumber = 0;
        }
        return this.channelRepository.create({
          ...channel,
          playlist: playlist,
          group: groupMap.get(channel.tvgGroup || 'General'),
        });
      });

      await this.channelRepository.save(channelsToSave);
      return channelsToSave;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async pingUrl(url: string) {
    try {
      const response = await axios.get(url, { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  
  private handleDBExceptions(error: any): never {

    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException("Error inesperado, Revisa los logs del servidor");
  }
}
