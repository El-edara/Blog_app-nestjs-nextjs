import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
<<<<<<< HEAD
import { PrismaModule } from '../prisma/prisma.module';
=======
import { PrismaModule } from 'src/prisma/prisma.module';
>>>>>>> 8006af993e19f2f99d00d8f719249b05777cdf47

@Module({
  imports: [PrismaModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
