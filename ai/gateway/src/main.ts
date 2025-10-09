import { NestFactory } from '@nestjs/core';
import { AiModule } from './ai.module';
import { registry } from './metrics/metrics.registry';

async function bootstrap() {
  const app = await NestFactory.create(AiModule, { 
    logger: ['log', 'error', 'warn'] 
  });
  
  app.enableCors({ 
    origin: [/localhost/, /127\.0\.0\.1/], 
    credentials: false 
  });
  
  // Add metrics endpoint
  app.use('/metrics', (req, res) => {
    res.set('Content-Type', registry.contentType);
    registry.metrics().then(metrics => res.end(metrics));
  });
  
  const port = process.env.AI_GATEWAY_PORT || 4010;
  await app.listen(port);
  
  console.log(`🤖 AURA AI Gateway démarré sur port ${port}`);
  console.log(`📡 Endpoints disponibles:`);
  console.log(`   POST /ai/local/aura-osint-ai/generate`);
  console.log(`   POST /ai/harassment/analyze`);
  console.log(`   GET  /metrics (Prometheus)`);
}

bootstrap();