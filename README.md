# The recipes REST API assignment, Node.js, no frameworks
The purpose of this assignment is to create the RESTful API for managing the recipes, without using a third party addons.
To read the thought process behind this work, simply open the Thoughts.txt

The language of choice is Node.js

Furthermore, for testing purposes we are using the addon called Axios, since the restrictions apply to API and not testing. Also, it makes the code much cleaner and test-cases understandable.

## Pre-requisite

Ensure You have NodeJS installed in your system.
Refer to [https://nodejs.org](https://nodejs.org) to install NodeJS

## Cloning and Running the Code

This code can be cloned to your local using the command

```bash
https://github.com/olejardamir/rest_recipes_backend.git
```

## Running the code

`server.js` is the starting point of the code

The application can be started using the command

```bash
node server.js
```
## Testing the code
The best way to test is to use either curl or the postman and do it manually. However, the automated-test has been created too.

Add Axios by executing:

```bash
npm install axios --save
```

You will need two separate console/terminal windows. In one, start the server by:
```bash
node server.js
```

In other window, simply execute the test-script
```bash
node test.js
```

To re-run the test, you have to reload the server and run the test.js again.

## Design
The database is a simple array. Usually with databases such as SQL the ID is always an increment and whenever we remove the data, it is usually done by switching a flag. Instead, we are simply setting an array element to a null. However, the update does not work since it does not recognize the ID (that is, null has no ID). Therefore it works just like the auto-increment, when implemented in a real database.  All access is O(1), since we are using the bucket approach where each ID is an array number. Nevertheless, we do not filter a display and do display nulls. This is done simply to have a better performance. Usually, this is filtered with the SQL call, but since we don't have such an option, we are leaving it as-is.
