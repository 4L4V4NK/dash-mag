#!/bin/bash

###############################################################################
# Setup Script - Initial Environment Configuration
# 
# This script sets up the development environment for Dash Mag
# Installs dependencies, configures environment, and initializes the project
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
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

print_header "Dash Mag - Environment Setup"

# Check Node.js
print_header "Checking Node.js"
if ! command -v node &> /dev/null; then
  print_error "Node.js is not installed"
  echo "Please install Node.js 18+ from https://nodejs.org/"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  print_error "Node.js 18+ is required (current: $(node -v))"
  exit 1
fi

print_info "Node.js $(node -v) found"
print_info "npm $(npm -v) found"

# Check Git
print_header "Checking Git"
if ! command -v git &> /dev/null; then
  print_error "Git is not installed"
  exit 1
fi
print_info "Git $(git --version | awk '{print $3}') found"

# Check Docker (optional)
print_header "Checking Docker (optional)"
if command -v docker &> /dev/null; then
  print_info "Docker $(docker --version | awk '{print $3}') found"
else
  print_warn "Docker not found (optional for development)"
fi

# Install dependencies
print_header "Installing Dependencies"
if [ -f "package-lock.json" ]; then
  print_info "Using package-lock.json for reproducible installs"
  npm ci
else
  print_info "Installing dependencies..."
  npm install
fi

print_info "Dependencies installed successfully"

# Setup environment file
print_header "Setting Up Environment Variables"
if [ ! -f ".env.local" ]; then
  if [ -f "EXPORT_REACT_DASHBOARDS/.env.example" ]; then
    cp EXPORT_REACT_DASHBOARDS/.env.example .env.local
    print_info "Created .env.local from template"
    print_warn "Please edit .env.local with your configuration"
  else
    print_warn "No .env.example found, creating basic .env.local"
    cat > .env.local << EOF
# Dash Mag Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_AI_ENDPOINT=http://localhost:8000
NEXT_PUBLIC_ENVIRONMENT=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-key-change-in-production
CLICKHOUSE_URL=http://localhost:8123
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=
LOG_LEVEL=debug
EOF
    print_info "Basic .env.local created"
  fi
else
  print_info ".env.local already exists"
fi

# Verify project structure
print_header "Verifying Project Structure"
REQUIRED_DIRS=(
  "EXPORT_REACT_DASHBOARDS/pages"
  "EXPORT_REACT_DASHBOARDS/components"
  "EXPORT_REACT_DASHBOARDS/services"
  "EXPORT_REACT_DASHBOARDS/hooks"
  "docs"
  "__tests__"
)

for dir in "${REQUIRED_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    print_info "Found: $dir"
  else
    print_error "Missing: $dir"
  fi
done

# Check key files
print_header "Verifying Key Files"
REQUIRED_FILES=(
  "package.json"
  "tsconfig.json"
  "next.config.js"
  ".eslintrc.json"
  ".prettierrc"
  "jest.config.js"
  "Dockerfile"
  "docker-compose.yml"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    print_info "Found: $file"
  else
    print_error "Missing: $file"
  fi
done

# Create directories if missing
print_header "Creating Missing Directories"
mkdir -p logs public/images public/fonts utils constants config

# Run build check
print_header "Verifying Build Configuration"
print_info "Running TypeScript check..."
npx tsc --noEmit --skipLibCheck 2>/dev/null || print_warn "TypeScript check found issues (may be expected)"

# Summary
print_header "Setup Complete! 🎉"
echo -e "${GREEN}Next steps:${NC}"
echo "1. Edit .env.local with your configuration"
echo "2. Start development server: npm run dev"
echo "3. Open browser: http://localhost:3000"
echo ""
echo -e "${GREEN}Useful commands:${NC}"
echo "  npm run dev      - Start development server"
echo "  npm run build    - Build for production"
echo "  npm start        - Start production server"
echo "  npm test         - Run tests"
echo "  npm run lint     - Run linter"
echo "  npm run format   - Format code"
echo ""
echo -e "${GREEN}Documentation:${NC}"
echo "  docs/ARCHITECTURE.md - System architecture"
echo "  docs/COMPONENTS.md   - Component catalog"
echo "  docs/API.md          - API reference"
echo "  CONTRIBUTING.md      - Contribution guide"
echo ""
echo -e "Happy coding! 🚀\n"
