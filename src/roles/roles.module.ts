import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../roles/roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  exports: [RolesService],
  providers: [
    RolesService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class RolesModule {}