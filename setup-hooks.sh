#!/bin/bash
# Hook setup script - installs frontend pre-push checks.

set -euo pipefail

echo "Setting up git hooks for frontend..."

if ! command -v npm >/dev/null 2>&1; then
    echo "npm is not installed. Install Node.js and npm first."
    exit 1
fi

HOOK_PATH=".git/hooks/pre-push"

cat > "$HOOK_PATH" <<'EOF'
#!/bin/bash
set -euo pipefail

echo "Running frontend pre-push checks..."
npm run prepush
EOF

chmod +x "$HOOK_PATH"

echo "Frontend pre-push hook installed."
echo "Checks run on push: lint, tests, and build."
