const { Pool } = require('pg');
const EventEmitter = require('eventemitter3');

class FortressIngestionService extends EventEmitter {
  constructor(config) {
    super();
    this.pool = new Pool(config.database);
    this.batchSize = config.capture?.batchSize || 1000;
    this.flushInterval = config.capture?.flushIntervalMs || 5000;
    this.messageBuffer = [];
    this.startFlushTimer();
  }

  async ingestLiveStream(streamData) {
    const query = `
      INSERT INTO fortress_live_streams (room_id, streamer_username, title, status, started_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (room_id) DO UPDATE SET
        current_viewers = EXCLUDED.current_viewers,
        updated_at = NOW()
      RETURNING stream_id
    `;
    
    const result = await this.pool.query(query, [
      streamData.roomId,
      streamData.streamerUsername,
      streamData.title,
      'live'
    ]);
    
    this.emit('stream:created', { roomId: streamData.roomId });
    return result.rows[0].stream_id;
  }

  async ingestChatMessage(messageData) {
    this.messageBuffer.push(messageData);
    
    if (this.messageBuffer.length >= this.batchSize) {
      await this.flushMessages();
    }
  }

  async flushMessages() {
    if (this.messageBuffer.length === 0) return;

    const values = this.messageBuffer.map((msg, i) => 
      `($${i*4+1}, $${i*4+2}, $${i*4+3}, $${i*4+4})`
    ).join(',');

    const params = this.messageBuffer.flatMap(msg => [
      msg.streamId,
      msg.userId,
      msg.content,
      msg.timestamp
    ]);

    await this.pool.query(`
      INSERT INTO fortress_chat_messages (stream_id, user_id, message_content, sent_at)
      VALUES ${values}
    `, params);

    this.emit('messages:flushed', { count: this.messageBuffer.length });
    this.messageBuffer = [];
  }

  startFlushTimer() {
    setInterval(() => this.flushMessages(), this.flushInterval);
  }
}

async function main() {
  const service = new FortressIngestionService({
    database: {
      host: process.env.DB_HOST || 'postgres',
      port: 5432,
      database: 'aura_fortress',
      user: 'aura_admin',
      password: process.env.DB_PASSWORD
    }
  });

  console.log('🚀 AURA Fortress Ingestion Service started!');
}

main().catch(console.error);