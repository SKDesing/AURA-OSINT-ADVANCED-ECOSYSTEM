import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation
  app.useGlobalPipes(new ValidationPipe());
  
  // CORS
  app.enableCors({
    origin: ['http://localhost:3002', 'http://localhost:3000'],
    credentials: true,
  });
  
  // Global prefix
  app.setGlobalPrefix('api/v2');
  
  await app.listen(4010);
  console.log('🚀 AURA AI Orchestrator running on http://localhost:4010');
  console.log(`🗄️ Base de données: ${process.env.POSTGRES_DB || 'aura_osint'}`);
  console.log('📊 API Endpoints:');
  console.log('  POST /api/v2/investigation/start - Démarrer une investigation');
  console.log('  GET  /api/v2/investigations - Lister les investigations');
  console.log('  GET  /api/v2/investigations/:id - Détails d\'une investigation');
}

bootstrap();