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
      headless: false,
      args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
    });
    
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();

    // Créer la session
    const sessionResponse = await axios.post('http://localhost:3000/api/sessions', {
      url: this.url,
      title: this.sessionTitle
    });
    this.sessionId = sessionResponse.data.id;

    // Démarrer l'enregistrement vidéo
    await page.video.start({ 
      path: `session-${this.sessionId}.webm`,
      size: { width: 1920, height: 1080 }
    });

    // Intercepter les WebSockets
    page.on('websocket', ws => {
      ws.on('framereceived', event => {
        try {
          const data = JSON.parse(event.payload);
          if (data.type === 'msg' && data.data?.content) {
            this.handleComment(data.data);
          }
        } catch (e) {
          // Ignorer les messages non-JSON
        }
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

  async handleComment(commentData) {
    const comment = {
      username: commentData.nickname || commentData.unique_id,
      unique_id: commentData.unique_id,
      content: commentData.content,
      timestamp: Date.now(),
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

    this.comments.push(comment);
    
    // Envoyer au backend
    try {
      await axios.post(`http://localhost:3000/api/sessions/${this.sessionId}/comments`, comment);
      console.log(`[${comment.username}]: ${comment.content}`);
    } catch (error) {
      console.error('Erreur envoi commentaire:', error.message);
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
        await axios.post(`http://localhost:3000/api/sessions/${this.sessionId}/video`, formData);
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