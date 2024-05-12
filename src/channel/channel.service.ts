import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ChannelService {

  private readonly logger = new Logger('ChannelService');

  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) { }

  async create(createChannelDto: CreateChannelDto) {

    try {
      const channel = this.channelRepository.create({
        ...createChannelDto
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
      skip: offset
    });
  }

  async findOne(term: string) {

    let channel: Channel;

    if (isUUID(term)) {
      channel = await this.channelRepository.findOneBy({ id: term });
    } else {
      const queryBulder = this.channelRepository.createQueryBuilder();
      channel = await queryBulder.where('tvgName = :tvg_name', { tvgName: term }).getOne();
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
