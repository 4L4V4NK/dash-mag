#!/bin/bash

###############################################################################
# Backup Script - Automated Backup Creation and Management
# 
# Creates versioned backups of the application and data
# Supports local backups and optionally S3/cloud storage
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
BACKUP_BASE_DIR="${BACKUP_DIR:-.}/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup-${TIMESTAMP}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

print_header() {
  echo -e "\n${BLUE}╔════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║ $1${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"
}

print_info() {
  echo -e "${GREEN}✓${NC} $1"
}

print_warn() {
  echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

print_header "Dash Mag - Backup Script"

# Create backup directory
mkdir -p "$BACKUP_BASE_DIR/$BACKUP_NAME"

# Function to backup directory
backup_directory() {
  local source=$1
  local dest=$2
  local name=$3
  
  if [ ! -d "$source" ]; then
    print_warn "Skipping $name: directory not found"
    return
  fi

  print_info "Backing up $name..."
  cp -r "$source" "$dest/$name" 2>/dev/null || print_warn "Failed to backup $name"
}

# Function to backup file
backup_file() {
  local source=$1
  local dest=$2
  local name=$3
  
  if [ ! -f "$source" ]; then
    print_warn "Skipping $name: file not found"
    return
  fi

  print_info "Backing up $name..."
  cp "$source" "$dest/$name" || print_warn "Failed to backup $name"
}

# Backup application
print_header "Backing Up Application"

# Backup source code
backup_directory "EXPORT_REACT_DASHBOARDS" "$BACKUP_BASE_DIR/$BACKUP_NAME" "source"

# Backup configuration
backup_file ".env.local" "$BACKUP_BASE_DIR/$BACKUP_NAME" ".env.local"
backup_file ".env.production" "$BACKUP_BASE_DIR/$BACKUP_NAME" ".env.production"

# Backup build artifacts
backup_directory ".next" "$BACKUP_BASE_DIR/$BACKUP_NAME" ".next-build"

# Backup logs
backup_directory "logs" "$BACKUP_BASE_DIR/$BACKUP_NAME" "logs"

# Backup database exports (if available)
print_header "Exporting Data"

# Export ClickHouse data if available
if command -v clickhouse-client &> /dev/null; then
  print_info "Exporting ClickHouse databases..."
  mkdir -p "$BACKUP_BASE_DIR/$BACKUP_NAME/clickhouse"
  
  # Get list of databases
  clickhouse-client -q "SHOW DATABASES" | while read -r db; do
    if [ "$db" != "system" ]; then
      print_info "  - Exporting database: $db"
      clickhouse-client -d "$db" -q "SHOW TABLES" | while read -r table; do
        clickhouse-client -d "$db" -q "SELECT * FROM $table FORMAT Native" > \
          "$BACKUP_BASE_DIR/$BACKUP_NAME/clickhouse/${db}.${table}.native" 2>/dev/null || true
      done
    fi
  done
else
  print_warn "ClickHouse client not found, skipping database export"
fi

# Export MongoDB if available
if command -v mongodump &> /dev/null && [ -n "$MONGODB_URI" ]; then
  print_info "Exporting MongoDB..."
  mongodump --uri "$MONGODB_URI" --out "$BACKUP_BASE_DIR/$BACKUP_NAME/mongodb" || \
    print_warn "MongoDB export failed"
else
  print_warn "MongoDB not available, skipping"
fi

# Create backup metadata
print_header "Creating Backup Metadata"

cat > "$BACKUP_BASE_DIR/$BACKUP_NAME/backup-info.txt" << EOF
Backup Information
==================

Timestamp: $TIMESTAMP
Backup Name: $BACKUP_NAME

System Information:
  Node.js: $(node -v)
  npm: $(npm -v)
  OS: $(uname -s)
  Hostname: $(hostname)

Application:
  Git Branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "N/A")
  Git Commit: $(git rev-parse --short HEAD 2>/dev/null || echo "N/A")
  Git Status: $(git status --porcelain 2>/dev/null | wc -l) files changed

Backup Contents:
  - Source code (EXPORT_REACT_DASHBOARDS)
  - Environment files (.env.local, .env.production)
  - Build artifacts (.next)
  - Application logs
  - Database exports (if applicable)

Restore Instructions:
  1. Extract backup: tar -xzf $BACKUP_NAME.tar.gz
  2. Restore files: cp -r $BACKUP_NAME/* /path/to/app/
  3. Import databases: clickhouse-client < backup.sql
  4. Restart application: npm start

Created at: $(date)
EOF

print_info "Metadata file created"

# Create tar archive
print_header "Creating Archive"
print_info "Compressing backup..."

cd "$BACKUP_BASE_DIR"
tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME/" 2>/dev/null || {
  print_error "Failed to create archive"
  exit 1
}

# Get archive size
ARCHIVE_SIZE=$(du -h "${BACKUP_NAME}.tar.gz" | cut -f1)
print_info "Archive created: ${BACKUP_NAME}.tar.gz ($ARCHIVE_SIZE)"

# Clean up uncompressed backup
rm -rf "$BACKUP_NAME"

cd - > /dev/null

# Upload to cloud storage (optional)
print_header "Cloud Storage"

if [ -n "$S3_BUCKET" ] && command -v aws &> /dev/null; then
  print_info "Uploading to S3: $S3_BUCKET"
  aws s3 cp "$BACKUP_BASE_DIR/${BACKUP_NAME}.tar.gz" "s3://$S3_BUCKET/backups/" || \
    print_warn "S3 upload failed"
else
  print_warn "S3 not configured, backup stored locally only"
fi

# Cleanup old backups
print_header "Cleanup Old Backups"
print_info "Removing backups older than $RETENTION_DAYS days..."

find "$BACKUP_BASE_DIR" -maxdepth 1 -name "backup-*.tar.gz" -mtime +${RETENTION_DAYS} -delete

# List current backups
print_info "Current backups:"
ls -lh "$BACKUP_BASE_DIR"/backup-*.tar.gz 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}'

# Save backup info
print_header "✓ Backup Complete!"
echo -e "Backup saved to: ${GREEN}$BACKUP_BASE_DIR/${BACKUP_NAME}.tar.gz${NC}"
echo -e "Size: ${GREEN}$ARCHIVE_SIZE${NC}"
echo -e "Retention: ${GREEN}$RETENTION_DAYS days${NC}"
echo ""
echo "To restore this backup:"
echo "  tar -xzf $BACKUP_BASE_DIR/${BACKUP_NAME}.tar.gz"
echo "  cat ${BACKUP_NAME}/backup-info.txt"
echo ""
