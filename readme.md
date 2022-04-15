# SETAS ESTATE

---
## About Project:
Setas Estate is a token-based wep page where anyone can demonstrate his/her estate project whether it is under construction or real built project. Project owners can demand tokens from web-site admin or share their tokens to anyone. Last but not least anyone can fund the any project on the site.

##### Video Link: https://www.loom.com/s
---
## How to Build the Project:

* Clone the repository.
* After, to install all necessary packages run;
````
yarn````

* Smart contract is located in the /assembly folders. To build the contract, to get the .wasm file , and deploy the contract simultenously run;
```
yarn dev```

* Then, export the contract;
``` 
export CONTRACT=<Your-dev-account>```

* Explore the contract with its functions.
---
## Project Functions:

### initTokens
---
* This is is a call function for initializing "1.000.000" tokens.
* This function takes only one parameter and at the beginning it will be owner of all tokens.
* It is called like;
```
near call $CONTRACT initTokens '{"owner":"<Your-Account>"}' --accountId <Your-Account>
```
### create
---
* This is is a call function for creating a new project to demonstrate.
* This function takes seven parameters (title, address, type, price, size, status, photo).
* Six of the parameters (title, address, type, price, size, status) should be specified, that means you can't leave it blank.
* Function returns project details
* It is called like;
```
near call $CONTRACT create '{"title":"Patika", "address":"Eryaman5", "type":"Residential", "price":"3000000", "size":500, "status":"Under Construction", "photo":"http://.."}' --accountId <Your-Account>
```
### update
---
* This is is a call function for updating the project.
* Only owner of the project can update his/her project.
* This function takes two parameters (projectId, update). But "update" is a class based parameter and it takes seven variables (title, address, type, price, size, status, photo).
* It is called like;
```
near call $CONTRACT update '{"projectId":<Project id>, "update":{"title":"Patika2", "address":"Eryaman3", "type":"Residential", "price":"3000000", "size":500, "status":"InUse", "photo":"photo":"http://.."}}' --accountId <Your-Account>
```

### sendToken
---
* This is is a call function for sending tokens to any project owner.
* This function takes two parameters; Account id of receiver and amount of token to send.
* After transaction project details will be updated.
* It is called like;
```
near call $CONTRACT sendToken '{"to":"<Receiver-Account>", "tokens":"<Amount to send>"}' --accountId <Your-Account>
```
### showTokens
---
* This is a view function to get token balance of an account.
* This function takes one parameters; Account id to be viewed.
* It is called like;
```
near view $CONTRACT showTokens '{"owner":<AccountId>}' --accountId <Your-Account>
```

### fundProject
---
* This is is a call function for funding any project owner.
* This function takes one parameters; Project id of project to be funded.
* After transaction project details will be updated.
* It is called like;
```
near call $CONTRACT fundProject '{"projectId":<Project id>}' --accountId <Your-Account> --amount <any amount>
```
### getById
---
* This is a view function to get any project.
* This function takes one parameters; Project id of project to be viewed.
* It is called like;
```
near view $CONTRACT getById '{"projectId":<Project id>}' --accountId <Your-Account>
```
### getAllProjects
---
* This is a view function to get any number of projects within a range.
* This function takes the parameters (offset, end).
* Offset is the start of the range.
* For instance write 0 to offset and 2 to the end parameters, to see first and second projects.
* It is called like;
```
near view $CONTRACT getAllProjects '{"offset":<any num>, "end":<any num>}' --accountId <Your-Account>
```

### del
---
* This is a call function to delete the project.
* Only owner of the project can delete his/her project.
* This function takes one parameters; Project id of project to be deleted.
* It is called like;
```
near call $CONTRACT del '{"projectId":<Project id>}' --accountId <Your-Account>
```

