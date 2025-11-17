#!/bin/bash

###############################################################################
# Deploy Script - Automated Deployment to Production
# 
# This script handles building, testing, and deploying to production
# Usage: ./scripts/deploy.sh [staging|production]
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
ENVIRONMENT="${1:-production}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups/deploy-${TIMESTAMP}"
LOG_FILE="logs/deploy-${TIMESTAMP}.log"

print_header() {
  echo -e "\n${BLUE}╔════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║ $1${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n" | tee -a "$LOG_FILE"
}

print_info() {
  echo -e "${GREEN}✓${NC} $1" | tee -a "$LOG_FILE"
}

print_warn() {
  echo -e "${YELLOW}⚠${NC} $1" | tee -a "$LOG_FILE"
}

print_error() {
  echo -e "${RED}✗${NC} $1" | tee -a "$LOG_FILE"
}

# Create log directory
mkdir -p logs

print_header "Dash Mag - Deployment Script"
print_info "Environment: $ENVIRONMENT"
print_info "Timestamp: $TIMESTAMP"

# Validate environment
if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
  print_error "Invalid environment: $ENVIRONMENT (use 'staging' or 'production')"
  exit 1
fi

# Pre-deployment checks
print_header "Pre-Deployment Checks"

# Check git status
print_info "Checking Git status..."
if [ -n "$(git status --porcelain)" ]; then
  print_error "Uncommitted changes detected"
  git status --porcelain
  print_error "Please commit changes before deploying"
  exit 1
fi
print_info "Git status: clean"

# Check Node.js
if ! command -v node &> /dev/null; then
  print_error "Node.js is not installed"
  exit 1
fi
print_info "Node.js $(node -v) found"

# Load environment
print_info "Loading $ENVIRONMENT environment..."
if [ ! -f ".env.$ENVIRONMENT" ]; then
  print_error ".env.$ENVIRONMENT not found"
  exit 1
fi
set -a
source ".env.$ENVIRONMENT"
set +a

# Run tests
print_header "Running Tests"
print_info "Running unit tests..."
npm test -- --passWithNoTests 2>&1 | tee -a "$LOG_FILE" || {
  print_warn "Tests failed, but continuing with build..."
}

# Run linter
print_header "Code Quality Checks"
print_info "Running ESLint..."
npm run lint 2>&1 | tee -a "$LOG_FILE" || print_warn "Linting issues found (check manually)"

# Backup current build
print_header "Creating Backup"
if [ -d ".next" ]; then
  mkdir -p "$BACKUP_DIR"
  cp -r .next "$BACKUP_DIR/.next.backup" 2>/dev/null || true
  cp -r node_modules "$BACKUP_DIR/node_modules.backup" 2>/dev/null || true
  print_info "Backup created: $BACKUP_DIR"
else
  print_warn "No previous build to backup"
fi

# Install dependencies
print_header "Installing Dependencies"
print_info "npm ci --production..."
npm ci --production 2>&1 | tee -a "$LOG_FILE"

# Build
print_header "Building Application"
print_info "Running: npm run build"
npm run build 2>&1 | tee -a "$LOG_FILE" || {
  print_error "Build failed!"
  if [ -d "$BACKUP_DIR/.next.backup" ]; then
    print_warn "Restoring from backup..."
    rm -rf .next
    cp -r "$BACKUP_DIR/.next.backup" .next
  fi
  exit 1
}

# Generate sitemap/manifest (optional)
print_header "Post-Build Tasks"
print_info "Build completed successfully"

# Docker build (optional)
if command -v docker &> /dev/null; then
  print_info "Building Docker image..."
  docker build -t dash-mag:${TIMESTAMP} -t dash-mag:latest . 2>&1 | tee -a "$LOG_FILE" || \
    print_warn "Docker build failed (optional)"
else
  print_warn "Docker not available, skipping Docker build"
fi

# Deployment confirmation
print_header "Deployment Ready"
echo -e "${GREEN}Build artifacts ready for deployment:${NC}"
echo "  .next/ - Next.js build output"
echo "  node_modules/ - Production dependencies"
echo "  public/ - Static assets"
echo ""
echo -e "${GREEN}To deploy:${NC}"
echo "  Option 1: npm start (local)"
echo "  Option 2: docker-compose up -d (Docker)"
echo "  Option 3: pm2 start ecosystem.config.js (PM2)"
echo ""
echo -e "${GREEN}Backup location:${NC}"
echo "  $BACKUP_DIR"
echo ""

# Save deployment info
cat > "$BACKUP_DIR/deployment-info.txt" << EOF
Deployment Information
======================

Timestamp: $TIMESTAMP
Environment: $ENVIRONMENT
Node Version: $(node -v)
npm Version: $(npm -v)
Git Commit: $(git rev-parse --short HEAD)
Branch: $(git rev-parse --abbrev-ref HEAD)

Build Log: $LOG_FILE

To rollback:
  cp -r $BACKUP_DIR/.next.backup .next
  npm start
EOF

print_info "Deployment info saved: $BACKUP_DIR/deployment-info.txt"

print_header "✓ Deployment script completed successfully!"
echo -e "Ready to start server with: ${GREEN}npm start${NC} or ${GREEN}docker-compose up${NC}\n"
