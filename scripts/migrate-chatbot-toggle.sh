#!/bin/bash

# Chatbot Toggle Feature - Database Migration Script
# This script will add chatbot settings to the database

echo "🚀 Starting Chatbot Toggle Feature Migration..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Database credentials
DB_NAME="thai_mooc"
DB_USER="root"

echo -e "${YELLOW}📋 This migration will add the following columns to web_app_settings:${NC}"
echo "  - chatbotEnabled (BOOLEAN)"
echo "  - lineQrCodeUrl (VARCHAR)"
echo "  - lineOfficialId (VARCHAR)"
echo ""

read -p "Continue? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo -e "${RED}❌ Migration cancelled${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}🔐 Enter MySQL password for user '$DB_USER':${NC}"

# Run migration
mysql -u "$DB_USER" -p "$DB_NAME" < migrations/add_chatbot_settings.sql

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Migration completed successfully!${NC}"
    echo ""
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo "  1. Restart your development server: npm run dev"
    echo "  2. Go to /admin/settings → API Integration"
    echo "  3. Configure Chatbot settings"
    echo ""
    echo -e "${GREEN}🎉 Done!${NC}"
else
    echo ""
    echo -e "${RED}❌ Migration failed!${NC}"
    echo "Please check the error message above and try again."
    exit 1
fi
