import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './App.css';

interface Comment {
  id: number;
  username: string;
  content: string;
  is_moderator: boolean;
  is_owner: boolean;
  is_vip: boolean;
  avatar_url?: string;
  timestamp: number;
}

interface Session {
  id: number;
  url: string;
  title: string;
  created_at: string;
}

const API_BASE = 'http://localhost:3002';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalComments: 0,
    activeSessions: 0
  });

  useEffect(() => {
    // Socket.IO connection
    const socket = io(API_BASE);
    
    socket.on('new-comment', (comment: Comment) => {
      setComments(prev => [comment, ...prev.slice(0, 49)]);
      setStats(prev => ({ ...prev, totalComments: prev.totalComments + 1 }));
    });

    return () => socket.disconnect();
  }, []);

  const analyzeUrl = async () => {
    if (!url.includes('tiktok.com') || !url.includes('/live')) {
      alert('URL TikTok Live invalide');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/api/sessions`, {
        url,
        title: `Live ${new Date().toLocaleString()}`
      });

      const newSession = response.data;
      setSessions(prev => [newSession, ...prev]);
      setStats(prev => ({ 
        ...prev, 
        totalSessions: prev.totalSessions + 1,
        activeSessions: prev.activeSessions + 1
      }));
      setUrl('');
      
      console.log('🎬 Capture lancée pour:', newSession.url);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du lancement de l\'analyse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              AURA
            </h1>
            <span className="ml-2 text-sm text-gray-400">TikTok Live Analyser</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@username/live"
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 w-80"
            />
            <button
              onClick={analyzeUrl}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? '⏳ Analyse...' : '🚀 Analyser'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Lives Analysés</p>
                <p className="text-3xl font-bold">{stats.totalSessions}</p>
              </div>
              <div className="text-blue-400 text-3xl">📹</div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Commentaires</p>
                <p className="text-3xl font-bold">{stats.totalComments}</p>
              </div>
              <div className="text-green-400 text-3xl">💬</div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Sessions Actives</p>
                <p className="text-3xl font-bold">{stats.activeSessions}</p>
              </div>
              <div className="text-red-400 text-3xl">🔴</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sessions */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Lives Analysés</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {sessions.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <div className="text-4xl mb-4">🔍</div>
                  <p>Entrez une URL TikTok Live pour commencer</p>
                </div>
              ) : (
                sessions.map((session) => (
                  <div key={session.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{session.title}</p>
                        <p className="text-sm text-gray-400">{new Date(session.created_at).toLocaleString()}</p>
                        <p className="text-xs text-blue-400 truncate">{session.url}</p>
                      </div>
                      <div className="text-green-400">🟢</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Comments Feed */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Commentaires Temps Réel</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {comments.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <div className="text-4xl mb-4">💬</div>
                  <p>Les commentaires apparaîtront ici</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <img
                        src={comment.avatar_url || `https://picsum.photos/seed/${comment.username}/32/32.jpg`}
                        alt={comment.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm">{comment.username}</span>
                          {comment.is_owner && <span className="bg-red-500 text-xs px-1 rounded">OWNER</span>}
                          {comment.is_moderator && <span className="bg-green-500 text-xs px-1 rounded">MOD</span>}
                          {comment.is_vip && <span className="bg-yellow-500 text-xs px-1 rounded">VIP</span>}
                        </div>
                        <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;