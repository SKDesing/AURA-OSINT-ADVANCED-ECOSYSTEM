import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OsintController } from './osint.controller';
import { OsintService } from './osint.service';
import { Investigation } from './entities/investigation.entity';
import { OsintExecution } from './entities/osint-execution.entity';
import { OsintGateway } from './osint.gateway';

@Module({
  imports: [
    HttpModule.register({
      timeout: 600000, // 10 min timeout
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([Investigation, OsintExecution]),
  ],
  controllers: [OsintController],
  providers: [OsintService, OsintGateway],
  exports: [OsintService],
})
export class OsintModule {}