import { Injectable, Logger } from '@nestjs/common';
import { execSync } from 'child_process';
import axios from 'axios';

interface Tool {
  name: string;
  category: string;
  capabilities: string[];
  execute: (input: any) => Promise<any>;
}

@Injectable()
export class ToolRegistryService {
  private readonly logger = new Logger(ToolRegistryService.name);
  private tools: Map<string, Tool> = new Map();

  constructor() {
    this.registerAllTools();
  }

  private registerAllTools() {
    // TikTok Profile Analyzer
    this.registerTool({
      name: 'tiktok-profile-analyzer',
      category: 'social',
      capabilities: ['profile', 'videos', 'followers'],
      execute: async (input) => {
        this.logger.log(`Analyzing TikTok profile: ${input.username}`);
        
        // Simulate TikTok API call or scraping
        return {
          username: input.username,
          followers: Math.floor(Math.random() * 1000000),
          following: Math.floor(Math.random() * 1000),
          videos: Math.floor(Math.random() * 500),
          likes: Math.floor(Math.random() * 10000000),
          verified: Math.random() > 0.8,
          bio: `Bio for ${input.username}`,
          profilePicture: `https://example.com/avatar/${input.username}.jpg`,
        };
      },
    });

    // Sherlock - Username Search
    this.registerTool({
      name: 'sherlock',
      category: 'username',
      capabilities: ['social-accounts', 'profiles'],
      execute: async (input) => {
        this.logger.log(`Running Sherlock for: ${input.username}`);
        
        try {
          // Execute sherlock command
          const output = execSync(`sherlock ${input.username} --timeout 10 --json`, {
            encoding: 'utf8',
            timeout: 30000,
          });
          
          return JSON.parse(output);
        } catch (error) {
          this.logger.error('Sherlock execution failed:', error);
          return { error: 'Sherlock execution failed', accounts: [] };
        }
      },
    });

    // Sublist3r - Subdomain Enumeration
    this.registerTool({
      name: 'sublist3r',
      category: 'domain',
      capabilities: ['subdomains', 'dns'],
      execute: async (input) => {
        this.logger.log(`Running Sublist3r for: ${input.domain}`);
        
        try {
          const output = execSync(`sublist3r -d ${input.domain} -t 10`, {
            encoding: 'utf8',
            timeout: 60000,
          });
          
          const subdomains = output.split('\n').filter(line => 
            line.includes(input.domain) && !line.includes('Enumerating')
          );
          
          return { domain: input.domain, subdomains };
        } catch (error) {
          this.logger.error('Sublist3r execution failed:', error);
          return { domain: input.domain, subdomains: [], error: 'Execution failed' };
        }
      },
    });

    // TheHarvester - Email & Domain Intel
    this.registerTool({
      name: 'theharvester',
      category: 'email',
      capabilities: ['emails', 'domains', 'subdomains'],
      execute: async (input) => {
        this.logger.log(`Running TheHarvester for: ${input.domain}`);
        
        try {
          const output = execSync(`theHarvester -d ${input.domain} -b google -l 100`, {
            encoding: 'utf8',
            timeout: 60000,
          });
          
          return { domain: input.domain, data: output };
        } catch (error) {
          this.logger.error('TheHarvester execution failed:', error);
          return { domain: input.domain, data: '', error: 'Execution failed' };
        }
      },
    });

    // Instagram Profile Analyzer
    this.registerTool({
      name: 'instagram-profile-analyzer',
      category: 'social',
      capabilities: ['profile', 'posts', 'followers'],
      execute: async (input) => {
        this.logger.log(`Analyzing Instagram profile: ${input.username}`);
        
        // Simulate Instagram analysis
        return {
          username: input.username,
          followers: Math.floor(Math.random() * 500000),
          following: Math.floor(Math.random() * 2000),
          posts: Math.floor(Math.random() * 1000),
          verified: Math.random() > 0.9,
          private: Math.random() > 0.7,
          bio: `Instagram bio for ${input.username}`,
          profilePicture: `https://example.com/ig/${input.username}.jpg`,
        };
      },
    });

    // Holehe - Email OSINT
    this.registerTool({
      name: 'holehe',
      category: 'email',
      capabilities: ['email-osint', 'account-check'],
      execute: async (input) => {
        this.logger.log(`Running Holehe for: ${input.email}`);
        
        try {
          const output = execSync(`holehe ${input.email}`, {
            encoding: 'utf8',
            timeout: 30000,
          });
          
          return { email: input.email, data: output };
        } catch (error) {
          this.logger.error('Holehe execution failed:', error);
          return { email: input.email, data: '', error: 'Execution failed' };
        }
      },
    });

    this.logger.log(`Registered ${this.tools.size} tools`);
  }

  registerTool(tool: Tool) {
    this.tools.set(tool.name, tool);
  }

  async getTool(name: string): Promise<Tool> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool ${name} not found`);
    }
    return tool;
  }

  async getToolsForIntent(intent: any): Promise<Tool[]> {
    const tools: Tool[] = [];

    if (intent.type === 'profile') {
      if (intent.platforms?.includes('tiktok')) {
        tools.push(await this.getTool('tiktok-profile-analyzer'));
      }
      if (intent.platforms?.includes('instagram')) {
        tools.push(await this.getTool('instagram-profile-analyzer'));
      }
      tools.push(await this.getTool('sherlock'));
    }

    if (intent.type === 'domain') {
      tools.push(await this.getTool('sublist3r'));
      tools.push(await this.getTool('theharvester'));
    }

    if (intent.type === 'person') {
      tools.push(await this.getTool('sherlock'));
      tools.push(await this.getTool('holehe'));
    }

    return tools;
  }

  getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }
}