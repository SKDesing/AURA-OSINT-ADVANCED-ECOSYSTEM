const BaseJSONDB = require('./BaseJSONDB');
const path = require('path');

class ReportsDB extends BaseJSONDB {
    constructor() {
        super(path.join(__dirname, '../../databases/reports/reports.json'));
    }

    async createReport(reportId, reportType, title, content, generatedBy, aiAnalysis = null) {
        const report = {
            report_id: reportId,
            report_type: reportType,
            title,
            content,
            ai_analysis: aiAnalysis,
            validation_status: 'pending',
            generated_by: generatedBy
        };
        return await this.addRecord('generated_reports', report);
    }

    async getReports(reportType = null, validationStatus = null) {
        let filter = null;
        
        if (reportType && validationStatus) {
            filter = r => r.report_type === reportType && r.validation_status === validationStatus;
        } else if (reportType) {
            filter = r => r.report_type === reportType;
        } else if (validationStatus) {
            filter = r => r.validation_status === validationStatus;
        }
        
        return await this.getRecords('generated_reports', filter);
    }

    async updateReportStatus(reportId, validationStatus, filePath = null) {
        const db = await this.readDB();
        const report = db.generated_reports?.find(r => r.report_id === reportId);
        if (!report) return null;

        const updates = { validation_status };
        if (filePath) updates.file_path = filePath;

        return await this.updateRecord('generated_reports', report.id, updates);
    }

    async addAIValidation(reportId, validationType, aiModel, confidenceScore, validationResult) {
        const validation = {
            report_id: reportId,
            validation_type: validationType,
            ai_model: aiModel,
            confidence_score: confidenceScore,
            validation_result: validationResult,
            validated_at: new Date().toISOString()
        };
        return await this.addRecord('ai_validations', validation);
    }

    async recordMetric(serviceName, metricType, metricValue, metadata = null) {
        const metric = {
            service_name: serviceName,
            metric_type: metricType,
            metric_value: metricValue,
            metadata,
            recorded_at: new Date().toISOString()
        };
        return await this.addRecord('system_metrics', metric);
    }

    async getMetrics(serviceName = null, metricType = null, limit = 100) {
        let filter = null;
        
        if (serviceName && metricType) {
            filter = m => m.service_name === serviceName && m.metric_type === metricType;
        } else if (serviceName) {
            filter = m => m.service_name === serviceName;
        } else if (metricType) {
            filter = m => m.metric_type === metricType;
        }
        
        const metrics = await this.getRecords('system_metrics', filter, limit);
        return metrics.sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at));
    }

    async createAlert(alertType, severity, message, serviceName = null, metadata = null) {
        const alert = {
            alert_type: alertType,
            severity,
            message,
            service_name: serviceName,
            metadata,
            resolved: false
        };
        return await this.addRecord('system_alerts', alert);
    }

    async resolveAlert(alertId) {
        const db = await this.readDB();
        const alert = db.system_alerts?.find(a => a.id === alertId);
        if (!alert) return null;

        return await this.updateRecord('system_alerts', alertId, {
            resolved: true,
            resolved_at: new Date().toISOString()
        });
    }

    async getAlerts(severity = null, resolved = null) {
        let filter = null;
        
        if (severity && resolved !== null) {
            filter = a => a.severity === severity && a.resolved === resolved;
        } else if (severity) {
            filter = a => a.severity === severity;
        } else if (resolved !== null) {
            filter = a => a.resolved === resolved;
        }
        
        return await this.getRecords('system_alerts', filter);
    }
}

module.exports = ReportsDB;
