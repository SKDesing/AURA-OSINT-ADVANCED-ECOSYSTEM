import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';
import { 
  Download, 
  Eye, 
  Heart, 
  Share2, 
  Play, 
  FileText, 
  Image as ImageIcon,
  Video,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../ui/Button.js';

interface CardItem {
  id: string;
  title: string;
  image: string;
  type: 'report' | 'analysis' | 'template' | 'video';
  tags: string[];
  author?: string;
  downloads?: number;
  views?: number;
  likes?: number;
  isPremium?: boolean;
  description?: string;
}

interface CardMasonryProps {
  items: CardItem[];
  onItemClick?: (item: CardItem) => void;
  onDownload?: (item: CardItem) => void;
}

export const CardMasonry: React.FC<CardMasonryProps> = ({
  items,
  onItemClick,
  onDownload
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  const getTypeIcon = (type: CardItem['type']) => {
    switch (type) {
      case 'report': return <FileText className="type-icon" />;
      case 'analysis': return <Play className="type-icon" />;
      case 'template': return <ImageIcon className="type-icon" />;
      case 'video': return <Video className="type-icon" />;
      default: return <FileText className="type-icon" />;
    }
  };

  const handleLike = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleDownload = (item: CardItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload(item);
    }
  };

  return (
    <div className="card-masonry-container">
      <Masonry
        breakpointCols={breakpointColumns}
        className="masonry-grid"
        columnClassName="masonry-column"
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className={`masonry-card ${hoveredCard === item.id ? 'hovered' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setHoveredCard(item.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onItemClick?.(item)}
          >
            {/* Image principale */}
            <div className="card-image-container">
              <img 
                src={item.image} 
                alt={item.title}
                className="card-image"
                loading="lazy"
              />
              
              {/* Overlay au hover */}
              <motion.div 
                className="card-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredCard === item.id ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="overlay-actions">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="overlay-button"
                    onClick={(e) => handleDownload(item, e)}
                  >
                    <Download className="button-icon" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="overlay-button"
                  >
                    <Eye className="button-icon" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="overlay-button"
                  >
                    <Share2 className="button-icon" />
                  </Button>
                </div>
              </motion.div>

              {/* Badge premium */}
              {item.isPremium && (
                <div className="premium-badge">
                  Premium
                </div>
              )}

              {/* Type indicator */}
              <div className="type-indicator">
                {getTypeIcon(item.type)}
              </div>
            </div>

            {/* Contenu de la carte */}
            <div className="card-content">
              <h3 className="card-title">{item.title}</h3>
              
              {item.description && (
                <p className="card-description">{item.description}</p>
              )}

              {/* Tags */}
              <div className="card-tags">
                {item.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="tag-more">+{item.tags.length - 3}</span>
                )}
              </div>

              {/* Métadonnées */}
              <div className="card-meta">
                {item.author && (
                  <span className="meta-author">Par {item.author}</span>
                )}
                <div className="meta-stats">
                  {item.downloads && (
                    <span className="stat">
                      <Download className="stat-icon" />
                      {item.downloads > 1000 ? `${(item.downloads / 1000).toFixed(1)}k` : item.downloads}
                    </span>
                  )}
                  {item.views && (
                    <span className="stat">
                      <Eye className="stat-icon" />
                      {item.views > 1000 ? `${(item.views / 1000).toFixed(1)}k` : item.views}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions de la carte */}
              <div className="card-actions">
                <Button
                  variant={likedItems.has(item.id) ? 'primary' : 'ghost'}
                  size="sm"
                  className="action-button"
                  onClick={(e) => handleLike(item.id, e)}
                >
                  <Heart className={`button-icon ${likedItems.has(item.id) ? 'filled' : ''}`} />
                  {item.likes ? item.likes + (likedItems.has(item.id) ? 1 : 0) : ''}
                </Button>
                
                <Button
                  variant="primary"
                  size="sm"
                  className="download-button"
                  onClick={(e) => handleDownload(item, e)}
                >
                  <Download className="button-icon" />
                  Télécharger
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="more-button"
                >
                  <MoreHorizontal className="button-icon" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </Masonry>
    </div>
  );
};