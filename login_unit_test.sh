#!/bin/bash

# Website login endpoint URL (replace with your actual URL)
LOGIN_URL="http://localhost:5000/auth/login"  # Make sure this matches the actual port you're using

# Login credentials
USERNAME="testuser"
PASSWORD="testuser"

# Expected success message
EXPECTED_RESPONSE="Login successful"

# JSON payload
JSON_PAYLOAD=$(cat <<EOF
{
  "username": "$USERNAME",
  "password": "$PASSWORD"
}
EOF
)

# Send HTTP POST request with JSON payload
RESPONSE=$(curl -s -X POST -d "$JSON_PAYLOAD" -H "Content-Type: application/json" "$LOGIN_URL")

# Unit test assertion
if [[ "$RESPONSE" == *"$EXPECTED_RESPONSE"* ]]; then
  echo "✅ Login unit test passed!"
  exit 0
else
  echo "❌ Login unit test failed!"
  echo "Response: $RESPONSE"
  exit 1
fi
