import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { UserModule } from 'src/user/user.module';


@Module({
  providers: [SeedService],
  controllers: [SeedController],
  imports: [UserModule],
})
export class SeedModule {}
