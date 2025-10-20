#!/bin/bash

echo "🔧 Setting up Alva environment variables..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp env.development .env
fi

# Generate JWT keys if they don't exist
if ! grep -q "BEGIN PRIVATE KEY" .env; then
    echo "Generating JWT keys..."
    pnpm generate:keys > jwt_keys.txt
    
    # Extract the keys from the output
    JWT_PRIVATE_KEY=$(grep -A 100 "JWT_PRIVATE_KEY=" jwt_keys.txt | head -n 1 | cut -d'=' -f2-)
    JWT_PUBLIC_KEY=$(grep -A 100 "JWT_PUBLIC_KEY=" jwt_keys.txt | head -n 1 | cut -d'=' -f2-)
    
    # Update .env file with the keys
    sed -i.bak "s/JWT_PRIVATE_KEY=.*/JWT_PRIVATE_KEY=$JWT_PRIVATE_KEY/" .env
    sed -i.bak "s/JWT_PUBLIC_KEY=.*/JWT_PUBLIC_KEY=$JWT_PUBLIC_KEY/" .env
    
    # Clean up
    rm jwt_keys.txt .env.bak
    
    echo "✅ JWT keys generated and added to .env"
else
    echo "✅ JWT keys already exist in .env"
fi

# Update database URLs for Docker
echo "Updating database URLs for Docker..."
sed -i.bak 's|postgresql://postgres:password@localhost:5432/alva_dev|postgresql://postgres:postgres@postgres:5432/alva|g' .env
sed -i.bak 's|redis://localhost:6379|redis://redis:6379|g' .env
rm .env.bak

echo "✅ Environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Review .env file and update any API keys you need"
echo "2. Run: docker-compose up"
echo ""
echo "🔑 Required API Keys:"
echo "- OPENAI_API_KEY: Already set"
echo "- RESEND_API_KEY: Update with your Resend API key"
echo "- COOKIE_SECRET: Update with a secure random string"
