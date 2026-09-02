#!/bin/bash
# Swap Mint Green to White
find frontend/src -type f \( -name "*.jsx" -o -name "*.css" \) -exec sed -i '' 's/#00FFB2/#FFFFFF/g' {} +
find frontend/src -type f \( -name "*.jsx" -o -name "*.css" \) -exec sed -i '' 's/rgba(0,255,178/rgba(255,255,255/g' {} +

# Swap Dark Blue/Black to Pure Black
find frontend/src -type f \( -name "*.jsx" -o -name "*.css" \) -exec sed -i '' 's/#080B12/#000000/g' {} +

# Swap Accent Blue to Medium Grey
find frontend/src -type f \( -name "*.jsx" -o -name "*.css" \) -exec sed -i '' 's/#5B6CFF/#888888/g' {} +
find frontend/src -type f \( -name "*.jsx" -o -name "*.css" \) -exec sed -i '' 's/rgba(91,108,255/rgba(136,136,136/g' {} +

# Swap Red/Pink to Dark Grey (used in Impact bars)
find frontend/src -type f \( -name "*.jsx" -o -name "*.css" \) -exec sed -i '' 's/#FF3366/#555555/g' {} +

echo "Theme updated!"
