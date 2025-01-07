#!/bin/bash

# Website registration endpoint URL (adjusted for your app)
REGISTER_URL="http://localhost:5000/auth/register"

# Registration details (matching form fields in your React app)
FIRSTNAME="test"
LASTNAME="user"
USERNAME="testuser"
PASSWORD="testuser"

# Expected success message (based on the backend's expected response)
EXPECTED_RESPONSE="User registered successfully."

# JSON payload for registration
JSON_PAYLOAD=$(cat <<EOF
{
  "firstName": "$FIRSTNAME",
  "lastName": "$LASTNAME",
  "username": "$USERNAME",
  "password": "$PASSWORD"
}
EOF
)

# Send HTTP POST request with JSON payload
RESPONSE=$(curl -s -X POST -d "$JSON_PAYLOAD" -H "Content-Type: application/json" "$REGISTER_URL")

# Unit test assertion
if [[ "$RESPONSE" == *"$EXPECTED_RESPONSE"* ]]; then
  echo "✅ Registration unit test passed!"
  exit 0
else
  echo "❌ Registration unit test failed!"
  echo "Response: $RESPONSE"
  exit 1
fi
