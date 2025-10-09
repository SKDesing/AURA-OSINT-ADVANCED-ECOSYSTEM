// Artifact Viewer - HTML/CSS/JS + Meta
import React, { useState, useEffect } from 'react';
import { apiClient } from '../../core/api/client';

interface ArtifactMeta {
  id: string;
  title: string;
  build_ms: number;
  chunks_count: number;
  entities_count: number;
  content_hash: string;
  context_hash: string;
  created_at: string;
}

export const ArtifactViewer: React.FC = () => {
  const [artifacts, setArtifacts] = useState<ArtifactMeta[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtifacts = async () => {
      try {
        const data = await (apiClient as any).request<ArtifactMeta[]>('/artifacts?limit=20');
        setArtifacts(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load artifacts:', error);
        setLoading(false);
      }
    };

    loadArtifacts();
  }, []);

  if (loading) return <div className="animate-pulse">Loading artifacts...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Artifacts</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {artifacts.map((artifact) => (
          <ArtifactCard 
            key={artifact.id}
            artifact={artifact}
            onView={() => setSelectedId(artifact.id)}
          />
        ))}
      </div>

      {selectedId && (
        <ArtifactModal 
          artifactId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
};

const ArtifactCard: React.FC<{
  artifact: ArtifactMeta;
  onView: () => void;
}> = ({ artifact, onView }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
    <h3 className="font-medium truncate mb-2">{artifact.title}</h3>
    
    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
      <div>Build: {artifact.build_ms}ms</div>
      <div>Chunks: {artifact.chunks_count}</div>
      <div>Entities: {artifact.entities_count}</div>
      <div className="text-xs font-mono truncate">
        {artifact.content_hash.slice(0, 8)}...
      </div>
    </div>
    
    <button 
      onClick={onView}
      className="mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
    >
      View Artifact
    </button>
  </div>
);

const ArtifactModal: React.FC<{
  artifactId: string;
  onClose: () => void;
}> = ({ artifactId, onClose }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [meta, setMeta] = useState<ArtifactMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtifact = async () => {
      try {
        const [htmlResponse, metaResponse] = await Promise.all([
          fetch(`${(apiClient as any).baseURL}/artifacts/${artifactId}`),
          (apiClient as any).request<ArtifactMeta>(`/artifacts/${artifactId}/meta.json`)
        ]);
        
        const html = await htmlResponse.text();
        setHtmlContent(html);
        setMeta(metaResponse);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load artifact:', error);
        setLoading(false);
      }
    };

    loadArtifact();
  }, [artifactId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold">Artifact Viewer</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-pulse">Loading artifact...</div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-auto">
              <iframe
                srcDoc={htmlContent}
                className="w-full h-full border-0"
                title="Artifact Content"
                sandbox="allow-same-origin"
              />
            </div>
            
            {meta && (
              <div className="w-80 border-l p-4 overflow-y-auto">
                <h4 className="font-medium mb-3">Metadata</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Title:</strong> {meta.title}</div>
                  <div><strong>Build Time:</strong> {meta.build_ms}ms</div>
                  <div><strong>Chunks:</strong> {meta.chunks_count}</div>
                  <div><strong>Entities:</strong> {meta.entities_count}</div>
                  <div><strong>Created:</strong> {new Date(meta.created_at).toLocaleString()}</div>
                  <div>
                    <strong>Content Hash:</strong>
                    <code className="block text-xs bg-gray-100 dark:bg-gray-700 p-1 rounded mt-1">
                      {meta.content_hash}
                    </code>
                  </div>
                  <div>
                    <strong>Context Hash:</strong>
                    <code className="block text-xs bg-gray-100 dark:bg-gray-700 p-1 rounded mt-1">
                      {meta.context_hash}
                    </code>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};