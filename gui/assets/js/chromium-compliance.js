// Chromium Only Compliance Widget
async function checkChromiumCompliance() {
    const statusEl = document.getElementById('chromium-status');
    statusEl.innerHTML = '<i class="bi bi-hourglass-split"></i> Scan en cours...';
    
    try {
        const response = await fetch('/api/chromium/scan');
        const result = await response.json();
        
        if (result.violations === 0) {
            statusEl.innerHTML = '<i class="bi bi-check-circle text-success"></i> Conforme (0 violation)';
            statusEl.parentElement.parentElement.className = 'card bg-success text-white mb-3';
        } else {
            statusEl.innerHTML = `<i class="bi bi-exclamation-triangle text-warning"></i> ${result.violations} violations`;
            statusEl.parentElement.parentElement.className = 'card bg-warning text-dark mb-3';
            
            if (confirm(`${result.violations} violations détectées. Corriger automatiquement?`)) {
                await autoFixViolations();
            }
        }
    } catch (error) {
        statusEl.innerHTML = '<i class="bi bi-x-circle text-danger"></i> Erreur scan';
        statusEl.parentElement.parentElement.className = 'card bg-danger text-white mb-3';
    }
}

async function autoFixViolations() {
    try {
        const response = await fetch('/api/chromium/fix', { method: 'POST' });
        const result = await response.json();
        
        if (result.success) {
            alert(`✅ ${result.fixed} violations corrigées automatiquement`);
            checkChromiumCompliance();
        }
    } catch (error) {
        alert('❌ Erreur lors de la correction automatique');
    }
}

// Auto-check on page load
document.addEventListener('DOMContentLoaded', checkChromiumCompliance);