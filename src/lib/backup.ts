// Automated Backup Script
// Creates timestamped backups of all JSON data files

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BACKUP_DIR = path.join(process.cwd(), 'backups');

export function createBackup(): { success: boolean; message: string; backupPath?: string } {
  try {
    // Create backup directory if it doesn't exist
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    // Create timestamped backup folder
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);
    fs.mkdirSync(backupPath, { recursive: true });

    // Get all JSON files in data directory
    const files = fs.readdirSync(DATA_DIR).filter(file => file.endsWith('.json'));

    // Copy each file to backup
    files.forEach(file => {
      const sourcePath = path.join(DATA_DIR, file);
      const destPath = path.join(backupPath, file);
      fs.copyFileSync(sourcePath, destPath);
    });

    // Create backup manifest
    const manifest = {
      timestamp: new Date().toISOString(),
      files: files.map(file => ({
        name: file,
        size: fs.statSync(path.join(DATA_DIR, file)).size
      })),
      totalFiles: files.length
    };

    fs.writeFileSync(
      path.join(backupPath, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );

    return {
      success: true,
      message: `Backup created successfully at ${backupPath}`,
      backupPath
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to create backup: ${error}`
    };
  }
}

export function listBackups(): { name: string; date: string; files: number }[] {
  if (!fs.existsSync(BACKUP_DIR)) {
    return [];
  }

  const backups = fs.readdirSync(BACKUP_DIR)
    .filter(item => {
      const itemPath = path.join(BACKUP_DIR, item);
      return fs.statSync(itemPath).isDirectory() && item.startsWith('backup-');
    })
    .map(name => {
      const manifestPath = path.join(BACKUP_DIR, name, 'manifest.json');
      let files = 0;
      let date = name.replace('backup-', '').replace(/-/g, ':').slice(0, -3);
      
      if (fs.existsSync(manifestPath)) {
        try {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
          files = manifest.totalFiles;
          date = manifest.timestamp;
        } catch {
          // Ignore errors
        }
      }

      return { name, date, files };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return backups;
}

export function restoreBackup(backupName: string): { success: boolean; message: string } {
  try {
    const backupPath = path.join(BACKUP_DIR, backupName);
    
    if (!fs.existsSync(backupPath)) {
      return { success: false, message: 'Backup not found' };
    }

    const files = fs.readdirSync(backupPath).filter(file => file.endsWith('.json') && file !== 'manifest.json');

    files.forEach(file => {
      const sourcePath = path.join(backupPath, file);
      const destPath = path.join(DATA_DIR, file);
      fs.copyFileSync(sourcePath, destPath);
    });

    return {
      success: true,
      message: `Restored ${files.length} files from backup ${backupName}`
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to restore backup: ${error}`
    };
  }
}

export function deleteBackup(backupName: string): { success: boolean; message: string } {
  try {
    const backupPath = path.join(BACKUP_DIR, backupName);
    
    if (!fs.existsSync(backupPath)) {
      return { success: false, message: 'Backup not found' };
    }

    fs.rmSync(backupPath, { recursive: true });

    return {
      success: true,
      message: `Backup ${backupName} deleted successfully`
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to delete backup: ${error}`
    };
  }
}
