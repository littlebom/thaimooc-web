#!/bin/bash
set -e

DOMAIN="web2.thaimooc.ac.th"
EMAIL="admin@thaimooc.ac.th" # Using a generic email, user can change if needed

echo "Updating packages..."
sudo apt-get update

echo "Installing Nginx and Certbot..."
sudo apt-get install -y nginx certbot python3-certbot-nginx

echo "Copying Nginx configuration..."
# Assuming the config file is uploaded to ~/nginx_conf
if [ -f ~/nginx_conf ]; then
    sudo cp ~/nginx_conf /etc/nginx/sites-available/$DOMAIN
    # Setup alias
    if [ ! -f /etc/nginx/sites-enabled/$DOMAIN ]; then
        sudo ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
    fi
    # Remove default if exists
    if [ -f /etc/nginx/sites-enabled/default ]; then
        sudo unlink /etc/nginx/sites-enabled/default
    fi
    sudo nginx -t
    sudo systemctl reload nginx
else
    echo "Error: Configuration file ~/nginx_conf not found!"
    exit 1
fi

echo "Obtaining SSL Certificate..."
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m $EMAIL --redirect

echo "Setup completed successfully!"
