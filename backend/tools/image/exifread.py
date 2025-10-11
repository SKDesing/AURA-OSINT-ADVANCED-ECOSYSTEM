"""
ExifRead Tool - Extraction métadonnées images
"""

import asyncio
import os
from typing import Dict, List, Any
from PIL import Image
from PIL.ExifTags import TAGS
import exifread
from ..base import BaseTool

class ExifReadTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="exifread",
            description="Extraction métadonnées EXIF des images",
            category="image",
            version="3.0.0"
        )
    
    async def execute(self, image_path: str, **kwargs) -> Dict[str, Any]:
        """
        Extrait les métadonnées EXIF d'une image
        
        Args:
            image_path: Chemin vers l'image
            **kwargs: Options supplémentaires
                - detailed: Extraction détaillée (défaut: True)
                - gps: Extraire coordonnées GPS (défaut: True)
        
        Returns:
            Dict contenant les métadonnées EXIF
        """
        try:
            # Vérifier que le fichier existe
            if not os.path.exists(image_path):
                return {
                    'success': False,
                    'error': f'Fichier non trouvé: {image_path}',
                    'image_path': image_path
                }
            
            # Paramètres
            detailed = kwargs.get('detailed', True)
            extract_gps = kwargs.get('gps', True)
            
            # Extraction avec exifread
            exif_data = await self._extract_exif_data(image_path, detailed)
            
            # Extraction GPS si demandé
            gps_data = {}
            if extract_gps:
                gps_data = await self._extract_gps_data(image_path)
            
            # Informations de base du fichier
            file_info = await self._get_file_info(image_path)
            
            return {
                'success': True,
                'image_path': image_path,
                'file_info': file_info,
                'exif_data': exif_data,
                'gps_data': gps_data,
                'tool': 'exifread'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'image_path': image_path
            }
    
    async def _extract_exif_data(self, image_path: str, detailed: bool) -> Dict[str, Any]:
        """Extrait les données EXIF"""
        exif_data = {}
        
        try:
            # Méthode 1: exifread
            with open(image_path, 'rb') as f:
                tags = exifread.process_file(f, details=detailed)
                
                for tag in tags.keys():
                    if tag not in ['JPEGThumbnail', 'TIFFThumbnail', 'Filename', 'EXIF MakerNote']:
                        try:
                            exif_data[tag] = str(tags[tag])
                        except:
                            pass
            
            # Méthode 2: PIL (backup)
            if not exif_data:
                image = Image.open(image_path)
                exif_dict = image._getexif()
                
                if exif_dict:
                    for tag_id, value in exif_dict.items():
                        tag = TAGS.get(tag_id, tag_id)
                        exif_data[tag] = str(value)
            
            return exif_data
            
        except Exception as e:
            return {'error': str(e)}
    
    async def _extract_gps_data(self, image_path: str) -> Dict[str, Any]:
        """Extrait les coordonnées GPS"""
        gps_data = {}
        
        try:
            with open(image_path, 'rb') as f:
                tags = exifread.process_file(f)
                
                # Recherche des tags GPS
                gps_tags = {
                    'GPS GPSLatitude': None,
                    'GPS GPSLatitudeRef': None,
                    'GPS GPSLongitude': None,
                    'GPS GPSLongitudeRef': None,
                    'GPS GPSAltitude': None,
                    'GPS GPSTimeStamp': None,
                    'GPS GPSDateStamp': None
                }
                
                for tag in tags.keys():
                    if tag.startswith('GPS'):
                        gps_tags[tag] = str(tags[tag])
                
                # Conversion en coordonnées décimales
                if gps_tags['GPS GPSLatitude'] and gps_tags['GPS GPSLongitude']:
                    lat = self._convert_to_degrees(gps_tags['GPS GPSLatitude'])
                    lon = self._convert_to_degrees(gps_tags['GPS GPSLongitude'])
                    
                    if gps_tags['GPS GPSLatitudeRef'] == 'S':
                        lat = -lat
                    if gps_tags['GPS GPSLongitudeRef'] == 'W':
                        lon = -lon
                    
                    gps_data['latitude'] = lat
                    gps_data['longitude'] = lon
                    gps_data['coordinates'] = f"{lat}, {lon}"
                
                # Autres données GPS
                if gps_tags['GPS GPSAltitude']:
                    gps_data['altitude'] = gps_tags['GPS GPSAltitude']
                
                if gps_tags['GPS GPSTimeStamp']:
                    gps_data['timestamp'] = gps_tags['GPS GPSTimeStamp']
                
                if gps_tags['GPS GPSDateStamp']:
                    gps_data['datestamp'] = gps_tags['GPS GPSDateStamp']
            
            return gps_data
            
        except Exception as e:
            return {'error': str(e)}
    
    def _convert_to_degrees(self, value):
        """Convertit les coordonnées GPS en degrés décimaux"""
        try:
            # Format: [deg, min, sec]
            parts = str(value).replace('[', '').replace(']', '').split(', ')
            
            deg = float(parts[0])
            min_val = float(parts[1])
            sec = float(parts[2])
            
            return deg + (min_val / 60.0) + (sec / 3600.0)
        except:
            return 0.0
    
    async def _get_file_info(self, image_path: str) -> Dict[str, Any]:
        """Récupère les informations de base du fichier"""
        try:
            stat = os.stat(image_path)
            
            # Informations PIL
            image = Image.open(image_path)
            
            return {
                'filename': os.path.basename(image_path),
                'size_bytes': stat.st_size,
                'format': image.format,
                'mode': image.mode,
                'width': image.width,
                'height': image.height,
                'created': stat.st_ctime,
                'modified': stat.st_mtime
            }
        except Exception as e:
            return {'error': str(e)}
    
    def get_required_params(self) -> List[str]:
        """Paramètres requis"""
        return ['image_path']
    
    def get_optional_params(self) -> Dict[str, Any]:
        """Paramètres optionnels"""
        return {
            'detailed': True,
            'gps': True
        }
    
    async def validate_params(self, params: Dict[str, Any]) -> bool:
        """Valide les paramètres"""
        if 'image_path' not in params:
            return False
        
        image_path = params['image_path']
        if not image_path or not os.path.exists(image_path):
            return False
        
        # Vérifier que c'est une image
        valid_extensions = ['.jpg', '.jpeg', '.png', '.tiff', '.bmp', '.gif']
        if not any(image_path.lower().endswith(ext) for ext in valid_extensions):
            return False
        
        return True