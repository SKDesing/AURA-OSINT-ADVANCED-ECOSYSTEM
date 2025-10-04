import { chromium } from 'playwright';
import axios from 'axios';
import fs from 'fs';

class TikTokLiveCapture {
  constructor(url, sessionTitle) {
    this.url = url;
    this.sessionTitle = sessionTitle;
    this.comments = [];
    this.sessionId = null;
  }

  async startCapture() {
    const browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const context = await browser.newContext({
      storageState: 'tiktok-session.json',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      locale: 'fr-FR'
    });
    
    const page = await context.newPage();

    // Utiliser l'ID de session passé en paramètre
    this.sessionId = process.argv[4] || 1;

    // Démarrer l'enregistrement vidéo
    await page.video.start({ 
      path: `session-${this.sessionId}.webm`,
      size: { width: 1920, height: 1080 }
    });

    // Intercepter les WebSockets avec retry
    page.on('websocket', ws => {
      console.log('WebSocket connecté:', ws.url());
      
      ws.on('framereceived', event => {
        try {
          const data = JSON.parse(event.payload);
          this.handleEvent(data);
        } catch (e) {
          // Ignore non-JSON messages
        }
      });
      
      ws.on('close', () => {
        console.log('WebSocket fermé, tentative de reconnexion...');
        setTimeout(() => page.reload(), 5000);
      });
    });

    await page.goto(this.url);
    
    // Attendre que le live soit chargé
    await page.waitForSelector('[data-e2e="live-chat-list"]', { timeout: 30000 });
    
    console.log(`Capture démarrée pour: ${this.url}`);
    console.log('Appuyez sur Ctrl+C pour arrêter');

    // Garder la capture active
    process.on('SIGINT', async () => {
      await this.stopCapture(page, browser);
    });

    // Maintenir la session active
    setInterval(() => {
      console.log(`Commentaires capturés: ${this.comments.length}`);
    }, 10000);
  }

  async handleEvent(eventData) {
    const timestamp = Date.now();
    
    switch(eventData.type) {
      case 'msg':
        if (eventData.data?.content) {
          await this.handleComment(eventData.data, timestamp);
        }
        break;
      case 'gift':
        await this.handleGift(eventData.data, timestamp);
        break;
      case 'member':
      case 'room_user_seq':
        await this.handleViewerCount(eventData.data, timestamp);
        break;
      case 'like':
        await this.handleLike(eventData.data, timestamp);
        break;
      case 'share':
        await this.handleShare(eventData.data, timestamp);
        break;
    }
  }

  async handleComment(commentData, timestamp) {
    const comment = {
      username: commentData.nickname || commentData.unique_id,
      unique_id: commentData.unique_id,
      content: commentData.content,
      timestamp: timestamp,
      user_id: commentData.user_id,
      avatar_url: commentData.avatar_thumb?.url_list?.[0] || null,
      is_moderator: commentData.user_badge_list?.some(badge => badge.type === 'moderator') || false,
      is_owner: commentData.user_badge_list?.some(badge => badge.type === 'owner') || false,
      is_vip: commentData.user_badge_list?.some(badge => badge.type === 'vip') || false,
      follower_count: commentData.follower_count || 0,
      following_count: commentData.following_count || 0,
      badges: commentData.user_badge_list || [],
      gift_id: commentData.gift_id || null
    };

    await this.sendToBackend('comment', comment);
    console.log(`💬 [${comment.username}]: ${comment.content}`);
  }

  async handleGift(giftData, timestamp) {
    const gift = {
      sender: giftData.user?.nickname,
      gift_name: giftData.gift?.name,
      gift_id: giftData.gift?.id,
      repeat_count: giftData.repeat_count || 1,
      coin_count: giftData.gift?.diamond_count || 0,
      timestamp: timestamp
    };
    await this.sendToBackend('gift', gift);
    console.log(`🎁 ${gift.sender} → ${gift.gift_name} x${gift.repeat_count}`);
  }

  async handleViewerCount(data, timestamp) {
    const viewers = {
      total_viewers: data.total_user || data.total || 0,
      timestamp: timestamp
    };
    await this.sendToBackend('viewers', viewers);
    console.log(`👥 Spectateurs: ${viewers.total_viewers}`);
  }

  async handleLike(data, timestamp) {
    const like = {
      user: data.user?.nickname,
      count: data.count || 1,
      timestamp: timestamp
    };
    await this.sendToBackend('like', like);
  }

  async handleShare(data, timestamp) {
    const share = {
      user: data.user?.nickname,
      timestamp: timestamp
    };
    await this.sendToBackend('share', share);
  }

  async sendToBackend(eventType, data) {
    try {
      await axios.post(`http://localhost:3002/api/sessions/${this.sessionId}/events`, {
        event_type: eventType,
        data: data
      });
    } catch (error) {
      console.error(`Erreur envoi ${eventType}:`, error.message);
    }
  }

  async stopCapture(page, browser) {
    console.log('\nArrêt de la capture...');
    
    // Arrêter l'enregistrement vidéo
    const videoPath = await page.video.path();
    await page.video.stop();
    
    // Uploader la vidéo
    if (fs.existsSync(videoPath)) {
      const videoBuffer = fs.readFileSync(videoPath);
      const formData = new FormData();
      formData.append('video', new Blob([videoBuffer]), 'video.webm');
      
      try {
        await axios.post(`http://localhost:3002/api/sessions/${this.sessionId}/video`, formData);
        console.log('Vidéo uploadée avec succès');
      } catch (error) {
        console.error('Erreur upload vidéo:', error.message);
      }
    }

    await browser.close();
    console.log(`Capture terminée. ${this.comments.length} commentaires capturés.`);
    process.exit(0);
  }
}

// Usage
const url = process.argv[2];
const title = process.argv[3] || 'Investigation TikTok Live';

if (!url) {
  console.log('Usage: node capture.js <URL_TIKTOK_LIVE> [TITRE]');
  process.exit(1);
}

const capture = new TikTokLiveCapture(url, title);
capture.startCapture().catch(console.error);