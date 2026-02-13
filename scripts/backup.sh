#!/bin/bash

# Configuration
DB_HOST=${DB_HOST:-127.0.0.1}
DB_PORT=${DB_PORT:-3306}
DB_USER=${DB_USER:-root}
DB_PASS=${DB_PASSWORD:-KKiabkob}
DB_NAME=${DB_NAME:-thai_mooc}
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "Starting backup process..."

# 1. Backup Database
echo "Backing up database: $DB_NAME..."
mysqldump --host="$DB_HOST" --port="$DB_PORT" --user="$DB_USER" --password="$DB_PASS" --column-statistics=0 "$DB_NAME" > "$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql"

if [ $? -eq 0 ]; then
  echo "Database backup successful: $BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql"
else
  echo "Database backup failed!"
  exit 1
fi

# 2. Backup Project Files
echo "Backing up project files..."
tar --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    --exclude='backups' \
    --exclude='.DS_Store' \
    --exclude='.gemini' \
    -czf "$BACKUP_DIR/project_files_${TIMESTAMP}.tar.gz" .

if [ $? -eq 0 ]; then
  echo "Project files backup successful: $BACKUP_DIR/project_files_${TIMESTAMP}.tar.gz"
else
  echo "Project files backup failed!"
  exit 1
fi

echo "Backup completed successfully!"
ls -lh "$BACKUP_DIR"
