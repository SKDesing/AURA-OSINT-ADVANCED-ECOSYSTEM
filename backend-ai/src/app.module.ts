import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AIOrchestratorModule } from './modules/ai-orchestrator/ai-orchestrator.module';
import { ToolRegistryModule } from './modules/tool-registry/tool-registry.module';
import { QwenModule } from './modules/qwen/qwen.module';
import { InvestigationModule } from './modules/investigation/investigation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5433,
      username: process.env.POSTGRES_USER || 'aura',
      password: process.env.POSTGRES_PASSWORD || 'aura',
      database: process.env.POSTGRES_DB || 'aura_osint',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
    }),
    EventEmitterModule.forRoot(),
    AIOrchestratorModule,
    ToolRegistryModule,
    QwenModule,
    InvestigationModule,
  ],
})
export class AppModule {}