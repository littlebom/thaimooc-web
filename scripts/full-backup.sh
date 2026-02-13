#!/bin/bash
# scripts/full-backup.sh

# Configuration
DB_USER="root"
DB_PASS="KKiabkob"
DB_NAME="thai_mooc"
DB_HOST="localhost"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="backups"
BACKUP_NAME="thaimooc_full_backup_$DATE"

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "==========================================="
echo "Starting Full Backup: $BACKUP_NAME"
echo "==========================================="

# 1. Backup Database
echo "[1/2] Backing up MySQL Database ($DB_NAME)..."
mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_DIR/${BACKUP_NAME}.sql"

if [ $? -eq 0 ]; then
    echo "✔ Database backup successful: $BACKUP_DIR/${BACKUP_NAME}.sql"
else
    echo "✘ Database backup failed!"
    exit 1
fi

# 2. Backup Project Files
echo "[2/2] Zipping Project Files..."
# Exclude node_modules, .next, .git, and the backups folder itself
zip -qr "$BACKUP_DIR/${BACKUP_NAME}.zip" . \
    -x "node_modules/*" \
    -x ".next/*" \
    -x ".git/*" \
    -x "backups/*" \
    -x ".DS_Store"

if [ $? -eq 0 ]; then
    echo "✔ Project files backup successful: $BACKUP_DIR/${BACKUP_NAME}.zip"
else
    echo "✘ Project files backup failed!"
    exit 1
fi

echo "==========================================="
echo "Full Backup Complete!"
ls -lh "$BACKUP_DIR/${BACKUP_NAME}.sql"
ls -lh "$BACKUP_DIR/${BACKUP_NAME}.zip"
echo "==========================================="
