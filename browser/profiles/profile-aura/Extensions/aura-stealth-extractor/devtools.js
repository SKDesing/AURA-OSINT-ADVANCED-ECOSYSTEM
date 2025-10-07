// 🕵️ AURA DevTools - Extraction furtive logs réseau
console.log('🔥 AURA Stealth Extractor activé');

// Interception TOUTES les requêtes TikTok
chrome.devtools.network.onRequestFinished.addListener((request) => {
    const url = request.request.url;
    
    // Détection patterns TikTok Live
    const livePatterns = [
        'webcast', 'live_', 'room/', 'gift', 'comment', 
        'like', 'viewer', 'stream', 'chat', 'message'
    ];
    
    if (livePatterns.some(pattern => url.includes(pattern))) {
        console.log('🎯 TikTok Live Data interceptée:', url);
        
        // Extraction contenu réponse
        request.getContent((content) => {
            if (content) {
                extractAndSend(url, content, request.request.method);
            }
        });
    }
});

// Extraction et envoi furtif
function extractAndSend(url, content, method) {
    try {
        let parsedData;
        
        // Tentative parsing JSON
        try {
            parsedData = JSON.parse(content);
        } catch {
            // Données binaires/protobuf
            parsedData = {
                type: 'binary_data',
                size: content.length,
                preview: content.substring(0, 100)
            };
        }
        
        // Envoi furtif vers AURA Backend
        fetch('http://localhost:3000/api/stealth/capture', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-AURA-Stealth': 'devtools-extraction',
                'X-AURA-Timestamp': Date.now().toString()
            },
            body: JSON.stringify({
                source_url: url,
                method: method,
                data: parsedData,
                extracted_at: new Date().toISOString(),
                extraction_method: 'network_logs'
            })
        }).catch(() => {
            // Échec silencieux - aucune trace
        });
        
    } catch (error) {
        // Erreur silencieuse
    }
}
