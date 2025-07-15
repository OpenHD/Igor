#!/bin/bash

echo "Starting OpenHD Backend in Development Mode..."
echo ""

echo "DevTools Features:"
echo "- Automatic restart on code changes"
echo "- LiveReload enabled"
echo "- Fast startup optimizations"
echo "- Debug logging enabled"
echo ""

echo "Starting application..."
./gradlew bootRun --args="--spring.profiles.active=dev" --continuous