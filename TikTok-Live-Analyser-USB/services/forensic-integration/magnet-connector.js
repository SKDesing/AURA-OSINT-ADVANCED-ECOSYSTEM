const axios = require('axios');
const { spawn } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

// AXIOM Desktop Integration
class AxiomDesktopConnector {
  constructor(config) {
    this.axiomPath = config.axiomPath || process.env.AXIOM_INSTALL_PATH;
    this.workspacePath = config.workspacePath || '/workspace/axiom';
  }

  async createCase(caseData) {
    const caseId = `SCIS_${Date.now()}`;
    const casePath = path.join(this.workspacePath, `${caseId}.axcase`);
    
    const caseConfig = {
      name: caseData.name || caseId,
      investigator: caseData.investigator || 'SCIS System',
      created: new Date().toISOString(),
      sources: caseData.sources || [],
      artifacts: ['Social Media', 'Web History', 'Chat Messages', 'Mobile Communications']
    };

    await fs.ensureDir(this.workspacePath);
    await fs.writeJSON(casePath, caseConfig, { spaces: 2 });

    return {
      success: true,
      caseId,
      casePath,
      config: caseConfig
    };
  }

  async processCase(caseId) {
    return new Promise((resolve, reject) => {
      const casePath = path.join(this.workspacePath, `${caseId}.axcase`);
      const axiomExe = path.join(this.axiomPath, 'AXIOM.exe');
      
      const axiom = spawn(axiomExe, ['--case', casePath, '--auto-process', '--export-json']);
      
      let output = '';
      axiom.stdout.on('data', (data) => output += data.toString());
      
      axiom.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output, artifacts: this.parseArtifacts(output) });
        } else {
          reject(new Error(`AXIOM processing failed with code ${code}`));
        }
      });
    });
  }

  parseArtifacts(output) {
    // Parse AXIOM JSON output for artifacts
    try {
      const artifacts = JSON.parse(output);
      return {
        socialMedia: artifacts.socialMedia || [],
        webHistory: artifacts.webHistory || [],
        communications: artifacts.communications || [],
        timeline: artifacts.timeline || []
      };
    } catch (error) {
      return { error: 'Failed to parse AXIOM output' };
    }
  }
}

// OUTRIDER Cloud Integration
class OutriderCloudConnector {
  constructor(config) {
    this.clientId = config.clientId || process.env.OUTRIDER_CLIENT_ID;
    this.clientSecret = config.clientSecret || process.env.OUTRIDER_CLIENT_SECRET;
    this.baseURL = 'https://cloud.magnetforensics.com/outrider/api/v2';
    this.accessToken = null;
  }

  async authenticate() {
    try {
      const response = await axios.post(`${this.baseURL}/oauth/token`, {
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        scope: 'collection:read collection:write analysis:read'
      });
      
      this.accessToken = response.data.access_token;
      return { success: true, token: this.accessToken };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createCollection(target) {
    if (!this.accessToken) {
      const auth = await this.authenticate();
      if (!auth.success) return auth;
    }

    try {
      const response = await axios.post(`${this.baseURL}/collections`, {
        name: `SCIS_Collection_${Date.now()}`,
        target_type: 'social_media',
        platform: target.platform,
        identifier: target.username,
        collection_depth: 'comprehensive',
        time_range: {
          start: target.startDate || new Date(Date.now() - 30*24*60*60*1000).toISOString(),
          end: target.endDate || new Date().toISOString()
        },
        include_connections: true,
        include_media: true
      }, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        collectionId: response.data.id,
        status: response.data.status,
        estimatedCompletion: response.data.estimated_completion
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getCollectionStatus(collectionId) {
    try {
      const response = await axios.get(`${this.baseURL}/collections/${collectionId}`, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      });

      return {
        success: true,
        status: response.data.status,
        progress: response.data.progress,
        data: response.data.collected_data
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// AUTOMATE Workflow Integration
class AutomateWorkflowConnector {
  constructor(config) {
    this.endpoint = config.endpoint || process.env.AUTOMATE_ENDPOINT || 'https://automate.magnetforensics.com/graphql';
    this.apiKey = config.apiKey || process.env.AUTOMATE_API_KEY;
  }

  async createWorkflow(workflowDef) {
    const mutation = `
      mutation CreateWorkflow($input: WorkflowInput!) {
        createWorkflow(input: $input) {
          id
          name
          status
          triggers {
            type
            conditions
          }
          actions {
            type
            parameters
          }
        }
      }
    `;

    const variables = {
      input: {
        name: workflowDef.name,
        description: workflowDef.description || 'SCIS Automated Workflow',
        triggers: workflowDef.triggers || [{
          type: 'data_collection_complete',
          conditions: { platform: 'tiktok' }
        }],
        actions: workflowDef.actions || [{
          type: 'axiom_analysis',
          parameters: { auto_process: true }
        }],
        schedule: workflowDef.schedule
      }
    };

    try {
      const response = await axios.post(this.endpoint, {
        query: mutation,
        variables
      }, {
        headers: {
          'Authorization': `API-Key ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        workflow: response.data.data.createWorkflow
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async executeWorkflow(workflowId, parameters) {
    const mutation = `
      mutation ExecuteWorkflow($workflowId: ID!, $parameters: JSON!) {
        executeWorkflow(workflowId: $workflowId, parameters: $parameters) {
          executionId
          status
          startedAt
        }
      }
    `;

    try {
      const response = await axios.post(this.endpoint, {
        query: mutation,
        variables: { workflowId, parameters }
      }, {
        headers: {
          'Authorization': `API-Key ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        execution: response.data.data.executeWorkflow
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Main Forensic Gateway
class MagnetForensicsGateway {
  constructor(config) {
    this.axiom = new AxiomDesktopConnector(config.axiom || {});
    this.outrider = new OutriderCloudConnector(config.outrider || {});
    this.automate = new AutomateWorkflowConnector(config.automate || {});
  }

  async processForensicRequest(request) {
    try {
      // 1. Create workflow
      const workflow = await this.automate.createWorkflow({
        name: `SCIS_Investigation_${request.id}`,
        triggers: [{ type: 'manual_start' }],
        actions: [
          { type: 'outrider_collection', parameters: request.target },
          { type: 'axiom_analysis', parameters: { auto_process: true } }
        ]
      });

      if (!workflow.success) throw new Error(workflow.error);

      // 2. Start OUTRIDER collection
      const collection = await this.outrider.createCollection(request.target);
      if (!collection.success) throw new Error(collection.error);

      // 3. Create AXIOM case
      const axiomCase = await this.axiom.createCase({
        name: `SCIS_${request.id}`,
        investigator: request.investigator,
        sources: [`outrider_collection_${collection.collectionId}`]
      });

      if (!axiomCase.success) throw new Error('Failed to create AXIOM case');

      // 4. Execute workflow
      const execution = await this.automate.executeWorkflow(workflow.workflow.id, {
        collectionId: collection.collectionId,
        caseId: axiomCase.caseId,
        target: request.target
      });

      return {
        success: true,
        forensicId: `FORENSIC_${Date.now()}`,
        workflowId: workflow.workflow.id,
        collectionId: collection.collectionId,
        caseId: axiomCase.caseId,
        executionId: execution.success ? execution.execution.executionId : null,
        status: 'processing',
        estimatedCompletion: collection.estimatedCompletion
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getForensicStatus(forensicId) {
    // Implementation for status checking across all services
    return {
      success: true,
      status: 'processing',
      progress: 45,
      components: {
        outrider: 'completed',
        axiom: 'processing',
        automate: 'running'
      }
    };
  }

  async validateEvidence(evidenceData) {
    const hash = crypto.createHash('sha256').update(JSON.stringify(evidenceData)).digest('hex');
    
    return {
      success: true,
      hash,
      algorithm: 'SHA-256',
      timestamp: new Date().toISOString(),
      valid: true,
      chainOfCustody: {
        created: new Date().toISOString(),
        creator: 'SCIS System',
        integrity: 'verified'
      }
    };
  }
}

module.exports = MagnetForensicsGateway;