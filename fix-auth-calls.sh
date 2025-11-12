#!/bin/bash

# Fix all locals.getSession() calls to locals.auth()
echo "🔧 Fixing Auth.js API calls..."

# Find and replace in all TypeScript files
find src -name "*.ts" -type f -exec sed -i 's/locals\.getSession()/locals.auth()/g' {} \;

echo "✅ Fixed all locals.getSession() calls to locals.auth()"

# Rebuild the application
echo "🔨 Rebuilding application..."
npm run build

echo "✅ Build complete!"
