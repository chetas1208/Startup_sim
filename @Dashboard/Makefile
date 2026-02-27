.PHONY: install dev test lint format clean

install:
	@echo "Installing backend dependencies..."
	cd apps/api && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd apps/web && npm install
	@echo "Installing infra dependencies..."
	cd infra/aws && npm install

dev:
	@echo "Starting development environment..."
	docker-compose up -d
	@echo "Services starting..."
	@echo "Frontend: http://localhost:5173"
	@echo "API: http://localhost:8000"
	@echo "Neo4j: http://localhost:7474"

test:
	@echo "Running backend tests..."
	cd apps/api && pytest tests/ -v
	@echo "Running frontend tests..."
	cd apps/web && npm test

lint:
	@echo "Linting backend..."
	cd apps/api && ruff check .
	cd apps/api && mypy .
	@echo "Linting frontend..."
	cd apps/web && npm run lint

format:
	@echo "Formatting backend..."
	cd apps/api && ruff format .
	@echo "Formatting frontend..."
	cd apps/web && npm run format

clean:
	@echo "Cleaning artifacts..."
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name "node_modules" -exec rm -rf {} +
	find . -type d -name "dist" -exec rm -rf {} +
	docker-compose down -v
