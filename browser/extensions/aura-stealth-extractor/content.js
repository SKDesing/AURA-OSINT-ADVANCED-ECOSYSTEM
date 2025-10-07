// 🥷 AURA Content - Interface furtive utilisateur
console.log('🔥 AURA Stealth Content injecté');

let captureActive = false;

// Écoute messages du background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.action) {
        case 'live_detected':
            handleLiveDetected(message.url);
            break;
        case 'show_capture_prompt':
            showCapturePrompt();
            break;
        case 'auth_ready':
            handleAuthReady(message.token);
            break;
    }
});

// Gestion live détecté
function handleLiveDetected(url) {
    console.log('🎯 Live TikTok détecté:', url);
    
    // Notification discrète
    showDiscreteNotification('🔴 Live détecté - Cliquez pour capturer');
}

// Prompt capture avec SweetAlert2
function showCapturePrompt() {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: '🔴 LIVE TIKTOK DÉTECTÉ',
            html: `
                <div style="text-align: left;">
                    <p>🎯 <strong>Live TikTok disponible</strong></p>
                    <p>📹 Capture vidéo + logs</p>
                    <p>🕵️ Extraction furtive activée</p>
                </div>
            `,
            icon: 'question',
            background: '#1a1a2e',
            color: '#ffffff',
            showCancelButton: true,
            confirmButtonColor: '#fe2c55',
            cancelButtonColor: '#25f4ee',
            confirmButtonText: '🚀 Démarrer Capture Forensique',
            cancelButtonText: '⏭️ Ignorer ce Live',
            customClass: {
                popup: 'aura-popup'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                startStealthCapture();
            }
        });
    }
}

// Démarrage capture furtive
function startStealthCapture() {
    captureActive = true;
    
    // Notification backend
    fetch('http://localhost:3000/api/stealth/start-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-AURA-Session': generateSessionId()
        },
        body: JSON.stringify({
            url: window.location.href,
            title: document.title,
            timestamp: Date.now(),
            user_agent: navigator.userAgent,
            capture_type: 'stealth_extraction'
        })
    }).then(() => {
        showSuccessNotification();
        startVideoCapture();
    }).catch(() => {
        showErrorNotification();
    });
}

// Capture vidéo de l'écran
function startVideoCapture() {
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia({
            video: {
                mediaSource: 'screen',
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            },
            audio: true
        }).then(stream => {
            console.log('📹 Capture vidéo démarrée');
            
            // Envoi stream vers backend pour enregistrement
            sendStreamToBackend(stream);
            
        }).catch(error => {
            console.log('⚠️ Capture vidéo échouée:', error);
        });
    }
}

// Envoi stream vers backend
function sendStreamToBackend(stream) {
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];
    
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            chunks.push(event.data);
        }
    };
    
    mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        
        // Upload vers AURA Backend
        const formData = new FormData();
        formData.append('video', blob, `live-${Date.now()}.webm`);
        formData.append('session_id', generateSessionId());
        
        fetch('http://localhost:3000/api/stealth/upload-video', {
            method: 'POST',
            body: formData
        }).catch(() => {});
    };
    
    mediaRecorder.start();
    
    // Arrêt automatique après 30 minutes
    setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
    }, 30 * 60 * 1000);
}

// Notifications discrètes
function showDiscreteNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #fe2c55, #25f4ee);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 14px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    notification.onclick = showCapturePrompt;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function showSuccessNotification() {
    Swal.fire({
        title: '✅ Capture Démarrée',
        text: 'Extraction forensique furtive en cours...',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
        background: '#1a1a2e',
        color: '#ffffff'
    });
}

function showErrorNotification() {
    Swal.fire({
        title: '❌ Erreur',
        text: 'Impossible de démarrer la capture',
        icon: 'error',
        timer: 3000,
        background: '#1a1a2e',
        color: '#ffffff'
    });
}

function generateSessionId() {
    return 'aura-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function handleAuthReady(token) {
    console.log('🔐 Authentification Google prête');
    // Token disponible pour requêtes authentifiées
}
