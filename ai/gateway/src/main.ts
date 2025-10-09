import { NestFactory } from '@nestjs/core';
import { AiModule } from './ai.module';

async function bootstrap() {
  const app = await NestFactory.create(AiModule, { 
    logger: ['log', 'error', 'warn'] 
  });
  
  app.enableCors({ 
    origin: [/localhost/, /127\.0\.0\.1/], 
    credentials: false 
  });
  
  const port = process.env.AI_GATEWAY_PORT || 4010;
  await app.listen(port);
  
  console.log(`🤖 AURA AI Gateway démarré sur port ${port}`);
  console.log(`📡 Endpoints disponibles:`);
  console.log(`   POST /ai/local/qwen/generate`);
  console.log(`   POST /ai/harassment/analyze`);
}

bootstrap();