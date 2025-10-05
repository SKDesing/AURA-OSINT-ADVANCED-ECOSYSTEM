import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

interface ServiceLog {
  type: 'info' | 'error';
  message: string;
  timestamp: number;
}

interface ServiceStatus {
  status: 'running' | 'stopped' | 'crashed' | 'starting';
  port: number;
  logs: ServiceLog[];
}

interface ServicesState {
  [key: string]: ServiceStatus;
}

const SystemDashboard: React.FC = () => {
  const [services, setServices] = useState<ServicesState>({});
  const [socket, setSocket] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<string>('backend');

  useEffect(() => {
    const newSocket = io('http://localhost:9999');
    setSocket(newSocket);

    newSocket.on('services-status', (status: ServicesState) => {
      setServices(status);
    });

    newSocket.on('service-status', ({ service, status }: { service: string; status: string }) => {
      setServices(prev => ({
        ...prev,
        [service]: { ...prev[service], status }
      }));
    });

    newSocket.on('service-log', ({ service, log }: { service: string; log: ServiceLog }) => {
      setServices(prev => ({
        ...prev,
        [service]: {
          ...prev[service],
          logs: [...(prev[service]?.logs || []), log].slice(-100)
        }
      }));
    });

    return () => newSocket.close();
  }, []);

  const handleServiceAction = (service: string, action: 'start' | 'stop' | 'restart') => {
    if (socket) {
      socket.emit(`${action}-service`, service);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return '#25F4EE';
      case 'stopped': return '#666';
      case 'crashed': return '#FF0050';
      case 'starting': return '#FFA500';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return '🟢';
      case 'stopped': return '⚫';
      case 'crashed': return '🔴';
      case 'starting': return '🟡';
      default: return '⚫';
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0F0F0F', 
      color: 'white',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '2.5rem',
            background: 'linear-gradient(90deg, #FF0050, #25F4EE)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: '10px'
          }}>
            🎮 System Dashboard
          </h1>
          <p style={{ color: '#B0B0B0' }}>Centre de contrôle des microservices</p>
        </div>

        {/* Services Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          {Object.entries(services).map(([name, service]) => (
            <div key={name} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${getStatusColor(service.status)}`,
              borderRadius: '15px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: selectedService === name ? 'scale(1.02)' : 'scale(1)'
            }}
            onClick={() => setSelectedService(name)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ color: '#25F4EE', margin: 0 }}>
                  {getStatusIcon(service.status)} {name.toUpperCase()}
                </h3>
                <span style={{ 
                  background: getStatusColor(service.status),
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '10px',
                  fontSize: '0.8rem'
                }}>
                  :{service.port}
                </span>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <span style={{ color: getStatusColor(service.status), fontWeight: 'bold' }}>
                  {service.status.toUpperCase()}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={(e) => { e.stopPropagation(); handleServiceAction(name, 'start'); }}
                  disabled={service.status === 'running'}
                  style={{
                    background: service.status === 'running' ? '#333' : 'linear-gradient(90deg, #25F4EE, #00D4AA)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: service.status === 'running' ? 'not-allowed' : 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  ▶️ Start
                </button>
                
                <button
                  onClick={(e) => { e.stopPropagation(); handleServiceAction(name, 'stop'); }}
                  disabled={service.status === 'stopped'}
                  style={{
                    background: service.status === 'stopped' ? '#333' : '#FF0050',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: service.status === 'stopped' ? 'not-allowed' : 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  ⏹️ Stop
                </button>
                
                <button
                  onClick={(e) => { e.stopPropagation(); handleServiceAction(name, 'restart'); }}
                  style={{
                    background: 'linear-gradient(90deg, #FF0050, #FF2D55)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  🔄 Restart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Logs Console */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          padding: '20px'
        }}>
          <h3 style={{ color: '#25F4EE', marginBottom: '15px' }}>
            📋 Console Logs - {selectedService.toUpperCase()}
          </h3>
          
          <div style={{
            background: '#000',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '15px',
            height: '400px',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.9rem'
          }}>
            {services[selectedService]?.logs?.map((log, index) => (
              <div key={index} style={{
                color: log.type === 'error' ? '#FF0050' : '#25F4EE',
                marginBottom: '5px',
                wordBreak: 'break-word'
              }}>
                <span style={{ color: '#666' }}>
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>
                {' '}
                <span style={{ color: log.type === 'error' ? '#FF0050' : '#fff' }}>
                  {log.message}
                </span>
              </div>
            )) || <div style={{ color: '#666' }}>Aucun log disponible</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemDashboard;