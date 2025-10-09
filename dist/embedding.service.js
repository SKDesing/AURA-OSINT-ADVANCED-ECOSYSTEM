import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { pipeline, env } from '@xenova/transformers';
// Disable remote models for security
env.allowRemoteModels = false;
env.allowLocalModels = true;
export class EmbeddingService {
    constructor() {
        this.modelName = process.env.EMB_MODEL || 'Xenova/multilingual-e5-small';
        this.provider = process.env.EMB_PROVIDER || 'local';
        this.cacheDir = process.env.EMB_CACHE_DIR || '.cache/embeddings';
        this.model = null;
        this.isLoading = false;
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir, { recursive: true });
        }
    }
    static get() {
        if (!EmbeddingService.instance) {
            EmbeddingService.instance = new EmbeddingService();
        }
        return EmbeddingService.instance;
    }
    promptHash(text) {
        return crypto.createHash('sha256').update(text).digest('hex');
    }
    cachePath(key) {
        return path.join(this.cacheDir, `${key}.json`);
    }
    async loadLocalModel() {
        if (this.model)
            return this.model;
        if (this.isLoading) {
            // Wait for loading to complete
            while (this.isLoading) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return this.model;
        }
        this.isLoading = true;
        try {
            console.log(`[Embeddings] Loading model: ${this.modelName}`);
            this.model = await pipeline('feature-extraction', this.modelName, {
                quantized: true,
                device: 'cpu'
            });
            console.log(`[Embeddings] Model loaded successfully`);
        }
        catch (error) {
            console.error(`[Embeddings] Failed to load model:`, error);
            throw error;
        }
        finally {
            this.isLoading = false;
        }
        return this.model;
    }
    async embedText(text) {
        const key = this.promptHash(`${this.modelName}:${text}`);
        const cpath = this.cachePath(key);
        // Check cache first
        if (fs.existsSync(cpath)) {
            try {
                const cached = JSON.parse(fs.readFileSync(cpath, 'utf8'));
                if (Array.isArray(cached?.vector)) {
                    return cached.vector;
                }
            }
            catch (error) {
                // Cache corrupted, continue to regenerate
                console.warn(`[Embeddings] Cache corrupted for key ${key}`);
            }
        }
        let vector;
        if (this.provider === 'local') {
            const model = await this.loadLocalModel();
            // Preprocess text for better embeddings
            const processedText = this.preprocessText(text);
            // Generate embedding
            const output = await model(processedText, { pooling: 'mean', normalize: true });
            // Convert to regular array
            vector = Array.from(output.data);
        }
        else {
            throw new Error('OpenAI/Azure provider not configured. Set EMB_PROVIDER=local or implement remote.');
        }
        // Cache the result
        try {
            fs.writeFileSync(cpath, JSON.stringify({
                model: this.modelName,
                vector,
                timestamp: new Date().toISOString()
            }));
        }
        catch (error) {
            console.warn(`[Embeddings] Failed to cache result:`, error);
        }
        return vector;
    }
    async batchEmbed(texts) {
        const results = [];
        // Process in batches to avoid memory issues
        const batchSize = 5;
        for (let i = 0; i < texts.length; i += batchSize) {
            const batch = texts.slice(i, i + batchSize);
            const batchResults = await Promise.all(batch.map(text => this.embedText(text)));
            results.push(...batchResults);
        }
        return results;
    }
    async healthCheck() {
        try {
            const testVector = await this.embedText('ping health check');
            return {
                ok: true,
                provider: this.provider,
                model: this.modelName,
                dimensions: testVector.length
            };
        }
        catch (error) {
            return {
                ok: false,
                provider: this.provider,
                model: this.modelName
            };
        }
    }
    preprocessText(text) {
        // Clean and normalize text for better embeddings
        return text
            .trim()
            .replace(/\s+/g, ' ') // Normalize whitespace
            .substring(0, 512); // Limit length to avoid model limits
    }
    getCacheStats() {
        try {
            const files = fs.readdirSync(this.cacheDir);
            const jsonFiles = files.filter(f => f.endsWith('.json'));
            let totalSize = 0;
            jsonFiles.forEach(file => {
                try {
                    const stats = fs.statSync(path.join(this.cacheDir, file));
                    totalSize += stats.size;
                }
                catch (error) {
                    // Ignore errors for individual files
                }
            });
            return {
                size: totalSize,
                totalFiles: jsonFiles.length
            };
        }
        catch (error) {
            return { size: 0, totalFiles: 0 };
        }
    }
    clearCache() {
        try {
            const files = fs.readdirSync(this.cacheDir);
            files.forEach(file => {
                if (file.endsWith('.json')) {
                    fs.unlinkSync(path.join(this.cacheDir, file));
                }
            });
            console.log(`[Embeddings] Cache cleared`);
        }
        catch (error) {
            console.error(`[Embeddings] Failed to clear cache:`, error);
        }
    }
}
