#!/bin/bash

echo "🚀 Starting Kong with SSL/TLS support..."

# Check if certificates exist
if [ ! -f "certs/cert.pem" ] || [ ! -f "certs/key.pem" ]; then
    echo "❌ SSL certificates not found!"
    echo "Please generate certificates first:"
    echo "cd certs && openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj '/CN=localhost'"
    exit 1
fi

echo "✅ SSL certificates found"
echo "📋 Certificate details:"
openssl x509 -in certs/cert.pem -text -noout | grep -E "(Subject:|Not Before|Not After)"

# Stop existing containers
echo "🛑 Stopping existing Kong containers..."
docker-compose down

# Start Kong with SSL
echo "🚀 Starting Kong with SSL..."
docker-compose up -d

echo ""
echo "✅ Kong started successfully!"
echo ""
echo "🌐 Access URLs:"
echo "   HTTP:  http://localhost:8000"
echo "   HTTPS: https://localhost:8443"
echo "   Admin: http://localhost:8001"
echo ""
echo "🔒 SSL Certificate:"
echo "   Certificate: certs/cert.pem"
echo "   Private Key: certs/key.pem"
echo ""
echo "⚠️  Note: This is a self-signed certificate for development."
echo "   Your browser will show a security warning - this is normal."
echo "   Click 'Advanced' and 'Proceed to localhost' to continue." 