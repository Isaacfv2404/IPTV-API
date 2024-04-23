import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [SeedService],
  controllers: [SeedController],
  imports: [UserModule, PrismaModule],
})
export class SeedModule {}
