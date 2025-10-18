#!/bin/bash

echo "🐳 Alva Docker Development Environment"
echo "======================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is running"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ .env file created from .env.example"
        echo "📝 Please update .env with your configuration before continuing."
    else
        echo "❌ .env.example not found. Please create a .env file with required variables."
        exit 1
    fi
fi

echo "🔍 Checking required environment variables..."
source .env

required_vars=("JWT_PUBLIC_KEY" "JWT_PRIVATE_KEY" "COOKIE_SECRET" "OPENAI_API_KEY")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "⚠️  Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "🔧 Run 'pnpm run generate:keys' to generate JWT keys"
    echo "📝 Add your OpenAI API key to .env"
    echo "🔐 Set a COOKIE_SECRET in .env"
    exit 1
fi

echo "✅ All required environment variables are set"

# Function to show menu
show_menu() {
    echo ""
    echo "🚀 Docker Development Options:"
    echo "1. Start all services (Web + API + Auth + DB + Redis)"
    echo "2. Start only infrastructure (PostgreSQL + Redis)"
    echo "3. Start all services with rebuild"
    echo "4. View logs"
    echo "5. Stop all services"
    echo "6. Clean up (remove containers and volumes)"
    echo "7. Exit"
    echo ""
    read -p "Choose an option (1-7): " choice
}

# Function to start all services
start_all() {
    echo "🚀 Starting all services..."
    docker compose up -d
    echo ""
    echo "✅ Services started!"
    echo "🌐 Web: http://localhost:3000"
    echo "🔌 API: http://localhost:3001"
    echo "🔐 Auth: http://localhost:3002"
    echo "📊 API Docs: http://localhost:3001/docs"
    echo "🗄️  PostgreSQL: localhost:5433"
    echo "🔄 Redis: localhost:6380"
}

# Function to start infrastructure only
start_infrastructure() {
    echo "🏗️  Starting infrastructure services..."
    docker compose up postgres redis -d
    echo "✅ PostgreSQL and Redis started"
    echo "🗄️  PostgreSQL: localhost:5433"
    echo "🔄 Redis: localhost:6380"
}

# Function to start with rebuild
start_rebuild() {
    echo "🔨 Building and starting all services..."
    docker compose up --build -d
    echo "✅ Services built and started!"
}

# Function to view logs
view_logs() {
    echo "📋 Viewing logs..."
    docker compose logs -f
}

# Function to stop services
stop_services() {
    echo "🛑 Stopping all services..."
    docker compose down
    echo "✅ All services stopped"
}

# Function to clean up
cleanup() {
    echo "🧹 Cleaning up Docker resources..."
    read -p "This will remove all containers and volumes. Are you sure? (y/N): " confirm
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        docker compose down -v --remove-orphans
        docker system prune -f
        echo "✅ Cleanup complete"
    else
        echo "❌ Cleanup cancelled"
    fi
}

# Main menu loop
while true; do
    show_menu
    case $choice in
        1)
            start_all
            ;;
        2)
            start_infrastructure
            ;;
        3)
            start_rebuild
            ;;
        4)
            view_logs
            ;;
        5)
            stop_services
            ;;
        6)
            cleanup
            ;;
        7)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option. Please choose 1-7."
            ;;
    esac
done
