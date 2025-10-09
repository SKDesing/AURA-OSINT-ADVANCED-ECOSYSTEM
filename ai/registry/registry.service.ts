import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

export interface RegistryComponent {
  name: string;
  version: string;
  status: 'active' | 'deprecated' | 'planned';
  path?: string;
  hash?: string;
}

export interface Registry {
  version: string;
  updated_at: string;
  models: any[];
  algorithms: any[];
  policies: any[];
  embeddings: any[];
  routers: any[];
  metrics: {
    registry_integrity: string;
    last_validation: string;
    total_components: number;
    active_components: number;
    deprecated_components: number;
  };
}

@Injectable()
export class RegistryService {
  private registryPath = join(process.cwd(), 'ai/registry/registry.json');
  private registry: Registry;

  constructor() {
    this.loadRegistry();
  }

  private loadRegistry(): void {
    try {
      const content = readFileSync(this.registryPath, 'utf8');
      this.registry = JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to load registry: ${error.message}`);
    }
  }

  getRegistry(): Registry {
    return this.registry;
  }

  getModel(alias: string) {
    return this.registry.models.find(m => m.alias === alias);
  }

  getAlgorithm(name: string) {
    return this.registry.algorithms.find(a => a.name === name);
  }

  getPolicy(id: string) {
    return this.registry.policies.find(p => p.id === id);
  }

  getActiveComponents(): RegistryComponent[] {
    const components: RegistryComponent[] = [];
    
    this.registry.models.forEach(m => {
      if (m.status === 'active') {
        components.push({ name: m.alias, version: m.base, status: m.status, path: m.path });
      }
    });
    
    this.registry.algorithms.forEach(a => {
      if (a.status === 'active') {
        components.push({ name: a.name, version: a.version, status: a.status, path: a.path });
      }
    });
    
    return components;
  }

  validateIntegrity(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check model hashes
    this.registry.models.forEach(model => {
      if (model.status === 'active' && model.hash === 'sha256:placeholder_model_hash') {
        errors.push(`Model ${model.alias} has placeholder hash`);
      }
    });
    
    // Check algorithm paths
    this.registry.algorithms.forEach(algorithm => {
      if (algorithm.status === 'active' && !algorithm.path) {
        errors.push(`Algorithm ${algorithm.name} missing path`);
      }
    });
    
    // Check policy hashes
    this.registry.policies.forEach(policy => {
      if (policy.status === 'active' && !policy.hash) {
        errors.push(`Policy ${policy.id} missing hash`);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  updateMetrics(): void {
    const total = this.registry.models.length + this.registry.algorithms.length + 
                  this.registry.policies.length + this.registry.embeddings.length + 
                  this.registry.routers.length;
    
    const active = [...this.registry.models, ...this.registry.algorithms, 
                    ...this.registry.policies, ...this.registry.embeddings, 
                    ...this.registry.routers].filter(c => c.status === 'active').length;
    
    const deprecated = [...this.registry.models, ...this.registry.algorithms, 
                        ...this.registry.policies, ...this.registry.embeddings, 
                        ...this.registry.routers].filter(c => c.status === 'deprecated').length;
    
    this.registry.metrics = {
      registry_integrity: this.validateIntegrity().valid ? 'verified' : 'invalid',
      last_validation: new Date().toISOString(),
      total_components: total,
      active_components: active,
      deprecated_components: deprecated
    };
    
    this.saveRegistry();
  }

  private saveRegistry(): void {
    this.registry.updated_at = new Date().toISOString();
    writeFileSync(this.registryPath, JSON.stringify(this.registry, null, 2));
  }

  generateRegistryHash(): string {
    const content = JSON.stringify(this.registry, null, 0);
    return createHash('sha256').update(content).digest('hex');
  }
}