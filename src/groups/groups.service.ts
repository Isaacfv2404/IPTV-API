import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { Playlist } from 'src/playlist/entities/playlist.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { Channel } from 'src/channel/entities/channel.entity';

@Injectable()
export class GroupsService {

  private readonly logger = new Logger('GroupService');

  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>
  ) { }

  async create(createGroupDto: CreateGroupDto) {

    let playlist: Playlist;
    try {
      playlist = await this.playlistRepository.findOneBy({ id: createGroupDto.playlistId });

      if (!playlist) throw new BadRequestException('Playlist no encontrada');

      const existingGroup = await this.groupRepository.findOne({
        where: {
          name: createGroupDto.name,
          playlist: playlist
        },
      });

      if (existingGroup) {
        throw new BadRequestException('Ya existe un grupo con ese nombre en la playlist seleccionada');
      }
      const group = this.groupRepository.create({
        ...createGroupDto,
        playlist: playlist
      });
      await this.groupRepository.save(group);
      return group;
    }
    catch (error) {
      this.handleDBExceptions(error);
    }

  }

  findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    return this.groupRepository.find({
      take: limit,
      skip: offset,
      relations: ['playlist', 'channels']
    });

  }

  async findOne(term: string): Promise<Group> {
    let group: Group;

    if (isUUID(term)) {
      group = await this.groupRepository.findOne({ where: { id: term }, relations: ['playlist', 'channels'] });
    } else {
      group = await this.groupRepository
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.playlist', 'playlist')
        .leftJoinAndSelect('group.channels', 'channels')
        .where('group.name = :name', { name: term })
        .getOne();
    }

    if (!group) throw new BadRequestException('No se encontró el grupo');

    return group;
  }

  async findByPlaylistID(playlistID: string): Promise<Group[]> {
    const groups = await this.groupRepository.find({
      where: { playlist: { id: playlistID } },
      relations: ['playlist', 'channels'],
    });

    if (!groups || groups.length === 0) {
      throw new BadRequestException('No se encontraron grupos para esta playlist');
    }

    return groups;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.groupRepository.preload({
      id: id,
      ...updateGroupDto
    });

    if (!group) throw new BadRequestException(`Grupo con id ${id} no encontrado`);

    try {
      await this.groupRepository.save(group);
      return group;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string): Promise<void> {
    const group = await this.groupRepository.findOne({ where: { id: id }, relations: ['channels', 'playlist'] });

    if (!group) {
      throw new BadRequestException(`Grupo con id ${id} no encontrado`);
    }

    // Verificar si el grupo es el grupo general
    if (group.name === 'General') {
      throw new BadRequestException('No se permite eliminar el grupo general');
    }

    // Obtener el grupo general que pertenece a la misma playlist que el grupo a eliminar
    const generalGroup = await this.groupRepository.findOne({
      where: { name: 'General', playlist: group.playlist },
    });

    if (!generalGroup) {
      throw new BadRequestException('No se encontró el grupo general para la misma playlist');
    }

    // Cambiar el grupo de los canales relacionados al grupo al grupo general
    for (const channel of group.channels) {
      channel.group = generalGroup;
      await this.channelRepository.save(channel);
    }

    // Eliminar el grupo
    await this.groupRepository.remove(group);
  }
  private handleDBExceptions(error: any): never {

    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException("Error inesperado, Revisa los logs del servidor");

  }
}
