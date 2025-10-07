const BaseJSONDB = require('./BaseJSONDB');
const path = require('path');

class AnalyticsDB extends BaseJSONDB {
    constructor() {
        super(path.join(__dirname, '../../databases/analytics/profiles.json'));
    }

    async createProfile(platform, username, profileData, riskScore = 0.0) {
        const profile = {
            platform,
            username,
            profile_data: profileData,
            risk_score: riskScore
        };
        return await this.addRecord('profiles', profile);
    }

    async getProfiles(limit = 100) {
        return await this.getRecords('profiles', null, limit);
    }

    async getProfilesByPlatform(platform) {
        return await this.getRecords('profiles', p => p.platform === platform);
    }

    async createCrossPlatformSearch(query, platforms, results, correlationScore = 0.0) {
        const search = {
            query,
            platforms,
            results,
            correlation_score: correlationScore
        };
        return await this.addRecord('cross_platform_searches', search);
    }

    async getCrossPlatformSearches(limit = 50) {
        return await this.getRecords('cross_platform_searches', null, limit);
    }

    async createCoordinatedNetwork(networkName, accounts, coordinationScore, detectionMethod) {
        const network = {
            network_name: networkName,
            accounts,
            coordination_score: coordinationScore,
            detection_method: detectionMethod,
            detected_at: new Date().toISOString()
        };
        return await this.addRecord('coordinated_networks', network);
    }

    async getCoordinatedNetworks() {
        const networks = await this.getRecords('coordinated_networks');
        return networks.sort((a, b) => b.coordination_score - a.coordination_score);
    }

    async createIdentityCorrelation(profileAId, profileBId, confidenceScore, correlationFactors) {
        const correlation = {
            profile_a_id: profileAId,
            profile_b_id: profileBId,
            confidence_score: confidenceScore,
            correlation_factors: correlationFactors
        };
        return await this.addRecord('identity_correlations', correlation);
    }
}

module.exports = AnalyticsDB;
