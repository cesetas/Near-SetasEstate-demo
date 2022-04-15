#!/usr/bin/env bash

#
set -e

echo
echo
echo ---------------------------------------------------------
echo "Step 0: Call the function on the contract to Add a Book"
echo
echo "(run this script again to see changes made by this file)"
echo ---------------------------------------------------------
echo

near call $CONTRACT create '{"title":"Kinderland", "address":"Eryaman3", "type":"social", "price":"3000", "size":300, "status":"Done"}' --account-id $CONTRACT

echo
echo
echo --------------------------------------------------------------------
echo "Step 1: Call the functions on the contract"
echo --------------------------------------------------------------------
echo

near view $CONTRACT getAllProjects '{"offset":0, "end":20}' --accountId $CONTRACT   

echo
exit 0
