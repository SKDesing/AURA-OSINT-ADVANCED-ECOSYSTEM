import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

const AuraNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simuler des notifications en temps réel
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        addNotification();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addNotification = () => {
    const types = ['success', 'warning', 'info', 'error'];
    const messages = {
      success: [
        'Investigation terminée avec succès',
        'Nouveau compte social détecté',
        'Analyse Sherlock complétée',
        'Données de fuite trouvées'
      ],
      warning: [
        'Taux d\'utilisation élevé détecté',
        'Limite API approchée',
        'Service temporairement lent',
        'Maintenance programmée'
      ],
      info: [
        'Nouvelle mise à jour disponible',
        'Rapport mensuel généré',
        'Nouveau domaine ajouté',
        'Cache optimisé'
      ],
      error: [
        'Échec de connexion API',
        'Timeout sur requête',
        'Service temporairement indisponible',
        'Erreur de validation'
      ]
    };

    const type = types[Math.floor(Math.random() * types.length)];
    const message = messages[type][Math.floor(Math.random() * messages[type].length)];

    const notification = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [notification, ...prev.slice(0, 9)]);

    // Toast notification
    switch (type) {
      case 'success':
        toast.success(message, {
          duration: 4000,
          style: {
            background: 'rgba(16, 185, 129, 0.9)',
            color: 'white',
          },
        });
        break;
      case 'warning':
        toast(message, {
          duration: 4000,
          icon: '⚠️',
          style: {
            background: 'rgba(245, 158, 11, 0.9)',
            color: 'white',
          },
        });
        break;
      case 'info':
        toast(message, {
          duration: 4000,
          icon: 'ℹ️',
          style: {
            background: 'rgba(59, 130, 246, 0.9)',
            color: 'white',
          },
        });
        break;
      case 'error':
        toast.error(message, {
          duration: 4000,
          style: {
            background: 'rgba(239, 68, 68, 0.9)',
            color: 'white',
          },
        });
        break;
    }
  };

  const showNotificationCenter = async () => {
    const notificationsList = notifications.map(notif => `
      <div style="
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        margin: 5px 0;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        border-left: 4px solid ${getNotificationColor(notif.type)};
      ">
        <span style="font-size: 1.2em;">${getNotificationIcon(notif.type)}</span>
        <div style="flex: 1; text-align: left;">
          <div style="font-weight: 600;">${notif.message}</div>
          <div style="font-size: 0.8em; opacity: 0.7;">
            ${new Date(notif.timestamp).toLocaleString('fr-FR')}
          </div>
        </div>
      </div>
    `).join('');

    await Swal.fire({
      title: '🔔 Centre de Notifications AURA',
      html: `
        <div style="max-height: 400px; overflow-y: auto; text-align: left;">
          ${notificationsList || '<p style="text-align: center; opacity: 0.7;">Aucune notification</p>'}
        </div>
      `,
      width: 600,
      confirmButtonText: 'Fermer',
      confirmButtonColor: '#FFD700',
      background: '#1a1f3a',
      color: '#ffffff',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'error': return '❌';
      default: return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'info': return '#3B82F6';
      case 'error': return '#EF4444';
      default: return '#FFD700';
    }
  };

  const clearAllNotifications = async () => {
    const result = await Swal.fire({
      title: '🗑️ Effacer les Notifications',
      text: 'Voulez-vous supprimer toutes les notifications?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, effacer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      background: '#1a1f3a',
      color: '#ffffff'
    });

    if (result.isConfirmed) {
      setNotifications([]);
      toast.success('Toutes les notifications ont été supprimées');
    }
  };

  const testNotifications = async () => {
    const { value: type } = await Swal.fire({
      title: '🧪 Test de Notification',
      input: 'select',
      inputOptions: {
        'success': '✅ Succès',
        'warning': '⚠️ Avertissement',
        'info': 'ℹ️ Information',
        'error': '❌ Erreur'
      },
      inputPlaceholder: 'Choisir le type',
      showCancelButton: true,
      confirmButtonText: 'Envoyer Test',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#FFD700',
      background: '#1a1f3a',
      color: '#ffffff'
    });

    if (type) {
      const testMessages = {
        success: 'Test de notification de succès AURA OSINT',
        warning: 'Test d\'avertissement système AURA',
        info: 'Test d\'information générale AURA',
        error: 'Test d\'erreur simulée AURA'
      };

      const notification = {
        id: Date.now(),
        type,
        message: testMessages[type],
        timestamp: new Date().toISOString(),
        read: false
      };

      setNotifications(prev => [notification, ...prev]);

      // Afficher le toast correspondant
      switch (type) {
        case 'success':
          toast.success(testMessages[type]);
          break;
        case 'warning':
          toast(testMessages[type], { icon: '⚠️' });
          break;
        case 'info':
          toast(testMessages[type], { icon: 'ℹ️' });
          break;
        case 'error':
          toast.error(testMessages[type]);
          break;
      }
    }
  };

  return (
    <div className="aura-notifications">
      <div className="notifications-header">
        <h3>🔔 Notifications Système</h3>
        <div className="notifications-actions">
          <button onClick={testNotifications} className="notif-btn test">
            🧪 Test
          </button>
          <button onClick={showNotificationCenter} className="notif-btn">
            📋 Centre ({notifications.length})
          </button>
          <button onClick={clearAllNotifications} className="notif-btn clear">
            🗑️ Effacer
          </button>
        </div>
      </div>

      <div className="notifications-preview">
        {notifications.slice(0, 3).map(notif => (
          <div key={notif.id} className={`notification-item ${notif.type}`}>
            <span className="notif-icon">{getNotificationIcon(notif.type)}</span>
            <div className="notif-content">
              <div className="notif-message">{notif.message}</div>
              <div className="notif-time">
                {new Date(notif.timestamp).toLocaleTimeString('fr-FR')}
              </div>
            </div>
          </div>
        ))}
        
        {notifications.length === 0 && (
          <div className="no-notifications">
            <span>🔕</span>
            <p>Aucune notification récente</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .aura-notifications {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 1rem;
          padding: 1.5rem;
          margin: 1rem 0;
        }

        .notifications-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 215, 0, 0.2);
        }

        .notifications-header h3 {
          color: #FFD700;
          margin: 0;
        }

        .notifications-actions {
          display: flex;
          gap: 0.5rem;
        }

        .notif-btn {
          background: linear-gradient(45deg, #FFD700, #FF8C00);
          color: #0a0e27;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 0.4rem;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .notif-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
        }

        .notif-btn.test {
          background: linear-gradient(45deg, #3B82F6, #1D4ED8);
          color: white;
        }

        .notif-btn.clear {
          background: linear-gradient(45deg, #EF4444, #DC2626);
          color: white;
        }

        .notifications-preview {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .notification-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border-left: 4px solid;
          transition: all 0.2s;
          cursor: pointer;
        }

        .notification-item:hover {
          transform: translateX(5px);
          background: rgba(255, 255, 255, 0.1);
        }

        .notification-item.success {
          background: rgba(16, 185, 129, 0.1);
          border-color: #10B981;
        }

        .notification-item.warning {
          background: rgba(245, 158, 11, 0.1);
          border-color: #F59E0B;
        }

        .notification-item.info {
          background: rgba(59, 130, 246, 0.1);
          border-color: #3B82F6;
        }

        .notification-item.error {
          background: rgba(239, 68, 68, 0.1);
          border-color: #EF4444;
        }

        .notif-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .notif-content {
          flex: 1;
        }

        .notif-message {
          color: #ffffff;
          font-weight: 500;
          margin-bottom: 0.2rem;
        }

        .notif-time {
          color: #8892B0;
          font-size: 0.8rem;
        }

        .no-notifications {
          text-align: center;
          padding: 2rem;
          color: #8892B0;
        }

        .no-notifications span {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .notifications-header {
            flex-direction: column;
            gap: 0.5rem;
          }

          .notifications-actions {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AuraNotifications;