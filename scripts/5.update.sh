#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Step 0: Check for required update variables"
echo ---------------------------------------------------------
echo

near call $CONTRACT update '{"projectId":, "update":{"title":"", "address":"", "type":"", "price":"", "size":"", "status":"", "photo":""}}' --account-id $CONTRACT

echo
echo
echo
echo

exit 0