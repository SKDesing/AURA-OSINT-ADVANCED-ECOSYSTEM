const BaseJSONDB = require('./BaseJSONDB');
const path = require('path');
const crypto = require('crypto');

class ForensicDB extends BaseJSONDB {
    constructor() {
        super(path.join(__dirname, '../../databases/forensic/evidence.json'));
    }

    async createEvidence(evidenceId, caseNumber, evidenceType, sourceService, data, createdBy) {
        const dataHash = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
        const chainOfCustody = [{
            action: 'created',
            timestamp: new Date().toISOString(),
            performed_by: createdBy,
            details: { source: sourceService, type: evidenceType }
        }];

        const evidence = {
            evidence_id: evidenceId,
            case_number: caseNumber,
            evidence_type: evidenceType,
            source_service: sourceService,
            data_hash: dataHash,
            metadata: data,
            chain_of_custody: chainOfCustody,
            created_by: createdBy
        };

        return await this.addRecord('evidence', evidence);
    }

    async addCustodyEntry(evidenceId, action, performedBy, details = null, ipAddress = null, userAgent = null) {
        const custodyEntry = {
            evidence_id: evidenceId,
            action,
            performed_by: performedBy,
            timestamp: new Date().toISOString(),
            details,
            ip_address: ipAddress,
            user_agent: userAgent
        };

        // Also update the evidence chain_of_custody
        const db = await this.readDB();
        const evidence = db.evidence?.find(e => e.evidence_id === evidenceId);
        if (evidence) {
            evidence.chain_of_custody.push({
                action,
                timestamp: custodyEntry.timestamp,
                performed_by: performedBy,
                details
            });
            await this.writeDB(db);
        }

        return await this.addRecord('custody_chain', custodyEntry);
    }

    async getEvidence(caseNumber = null, evidenceType = null) {
        let filter = null;
        
        if (caseNumber && evidenceType) {
            filter = e => e.case_number === caseNumber && e.evidence_type === evidenceType;
        } else if (caseNumber) {
            filter = e => e.case_number === caseNumber;
        } else if (evidenceType) {
            filter = e => e.evidence_type === evidenceType;
        }
        
        return await this.getRecords('evidence', filter);
    }

    async getCustodyChain(evidenceId) {
        return await this.getRecords('custody_chain', c => c.evidence_id === evidenceId);
    }

    async createForensicExport(exportId, format, evidenceIds, filePath, exportedBy, digitalSignature = null) {
        const fileHash = crypto.createHash('sha256').update(filePath + Date.now()).digest('hex');
        
        const exportData = {
            export_id: exportId,
            format,
            evidence_ids: evidenceIds,
            file_path: filePath,
            file_hash: fileHash,
            digital_signature: digitalSignature,
            exported_at: new Date().toISOString(),
            exported_by: exportedBy
        };

        // Add custody entries for all evidence
        for (const evidenceId of evidenceIds) {
            await this.addCustodyEntry(evidenceId, 'exported', exportedBy, { 
                export_id: exportId, 
                format, 
                file_path: filePath 
            });
        }

        return await this.addRecord('forensic_exports', exportData);
    }

    async getForensicExports(exportedBy = null) {
        const filter = exportedBy ? e => e.exported_by === exportedBy : null;
        return await this.getRecords('forensic_exports', filter);
    }

    async validateIntegrity(targetId, targetType, validationMethod, isValid, validationDetails, validatedBy) {
        const validation = {
            target_id: targetId,
            target_type: targetType,
            validation_method: validationMethod,
            is_valid: isValid,
            validation_details: validationDetails,
            validated_at: new Date().toISOString(),
            validated_by: validatedBy
        };
        return await this.addRecord('integrity_validations', validation);
    }
}

module.exports = ForensicDB;
