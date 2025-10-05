const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class ExifToolWrapper {
    constructor() {
        this.toolPath = path.join(__dirname, 'exiftool');
        this.exifToolBin = process.platform === 'win32' 
            ? path.join(this.toolPath, 'exiftool.exe')
            : path.join(this.toolPath, 'exiftool');
    }

    async extractMetadata(filePath, options = {}) {
        return new Promise((resolve, reject) => {
            const args = ['-json', '-all'];
            
            if (options.gps) args.push('-gps:all');
            if (options.verbose) args.push('-v');
            
            args.push(filePath);

            const process = spawn(this.exifToolBin, args, {
                cwd: this.toolPath
            });

            let output = '';
            let error = '';

            process.stdout.on('data', (data) => {
                output += data.toString();
            });

            process.stderr.on('data', (data) => {
                error += data.toString();
            });

            process.on('close', (code) => {
                if (code === 0) {
                    try {
                        const metadata = JSON.parse(output);
                        resolve({ 
                            success: true, 
                            metadata: metadata[0] || {},
                            sensitiveData: this.extractSensitiveData(metadata[0] || {})
                        });
                    } catch (e) {
                        resolve({ success: true, metadata: { raw: output }, sensitiveData: {} });
                    }
                } else {
                    reject({ success: false, error, output });
                }
            });
        });
    }

    extractSensitiveData(metadata) {
        const sensitive = {};
        
        // Données GPS
        if (metadata.GPSLatitude && metadata.GPSLongitude) {
            sensitive.location = {
                latitude: metadata.GPSLatitude,
                longitude: metadata.GPSLongitude,
                altitude: metadata.GPSAltitude
            };
        }
        
        // Informations de l'appareil
        if (metadata.Make || metadata.Model) {
            sensitive.device = {
                make: metadata.Make,
                model: metadata.Model,
                software: metadata.Software
            };
        }
        
        // Dates de création
        if (metadata.CreateDate || metadata.DateTimeOriginal) {
            sensitive.timestamps = {
                created: metadata.CreateDate,
                original: metadata.DateTimeOriginal,
                modified: metadata.ModifyDate
            };
        }
        
        // Informations utilisateur
        if (metadata.Artist || metadata.Copyright || metadata.XPAuthor) {
            sensitive.userInfo = {
                artist: metadata.Artist,
                copyright: metadata.Copyright,
                author: metadata.XPAuthor
            };
        }
        
        return sensitive;
    }

    async removeMetadata(inputPath, outputPath) {
        return new Promise((resolve, reject) => {
            const args = ['-all=', '-overwrite_original', inputPath];
            
            if (outputPath) {
                args.splice(-1, 0, '-o', outputPath);
            }

            const process = spawn(this.exifToolBin, args, {
                cwd: this.toolPath
            });

            let output = '';
            let error = '';

            process.stdout.on('data', (data) => {
                output += data.toString();
            });

            process.stderr.on('data', (data) => {
                error += data.toString();
            });

            process.on('close', (code) => {
                if (code === 0) {
                    resolve({ success: true, output });
                } else {
                    reject({ success: false, error, output });
                }
            });
        });
    }
}

module.exports = ExifToolWrapper;