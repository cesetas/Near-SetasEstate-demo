#!/usr/bin/env bash

#
set -e

echo
echo
echo ---------------------------------------------------------
echo "Step 0: Call the function on the contract to fund a Project"
echo
echo "(run this script again to see changes made by this file)"
echo ---------------------------------------------------------
echo

near call $CONTRACT fundProject '{"projectId":2618339583}' --account-id $CONTRACT --amount 1 

echo
echo
echo --------------------------------------------------------------------
echo "Step 1: Call the functions on the contract"
echo --------------------------------------------------------------------
echo

near view $CONTRACT getAllProjects '{"offset":0, "end":20}' --accountId $CONTRACT   

echo
exit 0            