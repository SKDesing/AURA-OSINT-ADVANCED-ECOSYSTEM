const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:XXXX';

class ForensicService {
  async getProfiles() {
    const response = await fetch(`${API_BASE}/api/forensic/profiles`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des profils');
    return response.json();
  }

  async downloadReport(sessionId) {
    const response = await fetch(
      `${API_BASE}/api/forensic/report/${sessionId}?download=true`
    );
    
    if (!response.ok) throw new Error('Erreur lors de la génération du rapport');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forensic-report-${sessionId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  async getReport(sessionId) {
    const response = await fetch(`${API_BASE}/api/forensic/report/${sessionId}`);
    if (!response.ok) throw new Error('Rapport introuvable');
    return response.json();
  }

  async archiveProfile(sessionId) {
    const response = await fetch(
      `${API_BASE}/api/forensic/archive/${sessionId}`,
      { method: 'POST' }
    );
    
    if (!response.ok) throw new Error("Erreur lors de l'archivage");
    return response.json();
  }

  async cleanupExpired(retentionDays = 90) {
    const response = await fetch(
      `${API_BASE}/api/forensic/cleanup?retentionDays=${retentionDays}`,
      { method: 'DELETE' }
    );
    
    if (!response.ok) throw new Error('Erreur lors du nettoyage');
    return response.json();
  }
}

export default new ForensicService();