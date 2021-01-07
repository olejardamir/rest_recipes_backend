const url = require('url');

/*
 Recipe example:
 {
 "id": 0,
 "name": "Pizza",
 "instructions": "Bake it in the oven",
 "ingredients": ["1kg of something","2kg of something else"]
 }

 */



var cookbook = []; //this is where we store recipes
var pivot = 0;

function verifyRecipe(postBody){
    var id = postBody.id;
    if ( verifyRecipeNoId(postBody) && typeof id !== 'undefined' && id<=pivot){
        return true;
    }
    return false;
}

function verifyRecipeNoId(postBody){
    var name = postBody.name;
    var instructions = postBody.instructions;
    var ingredients = postBody.ingredients;
    if (typeof name !== 'undefined' &&
        typeof instructions !== 'undefined' &&
        typeof ingredients !== 'undefined'
    ){
        return true;
    }
        return false;
}

//--------------------LIST RECIPES-------------------------------------
//GET
exports.listRecipes = function (req, res){
    const reqUrl = url.parse(req.url, true);
    OKResponse(res, cookbook);
}

//--------------------ADD RECIPE-------------------------------------
//PUT
exports.addRecipe = function(req,res){
    body = '';

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        if(body==''){
            var response = {
                "Response": "Data not found"
            };
            badRequest(res,response);
        }
        else {
            postBody = JSON.parse(body);
            if (!verifyRecipeNoId(postBody)) {
                var response = {
                    "Response": "Incomplete recipe " + postBody.name
                };
                badRequest(res, response);
            }
            else if(!Array.isArray(postBody.ingredients)){
                var response = {
                    "Response": "Ingredients are not an array"
                };
                badRequest(res, response);
            }
            else {
                postBody.id = pivot;
                cookbook[pivot] = postBody;
                pivot = pivot + 1;

                var response = {
                    "Response": "Added new recipe at id: " + (pivot - 1)
                };
                OKResponse(res, response);
            }
        }
    });
}

//--------------------DELETE RECIPE-------------------------------------
//DELETE
exports.removeRecipe = function (req,res){
    body = '';

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        if(body==''){
            var response = {
                "Response": "Data not found"
            };
            badRequest(res,response);
        }
        else{
        postBody = JSON.parse(body);
        if( typeof cookbook[postBody.id] == 'undefined'){
            var response = {
                "Response": "Invalid recipe id:" + postBody.id
            };
            badRequest(res,response);
        }
        else {
            var id = postBody.id;
            cookbook[id] = undefined;
            var response = {
                "Response": "Removed recipe at id: "+id
            };
            OKResponse(res, response);
        }
        }
    });


}

//--------------------UPDATE RECIPE-------------------------------------
//POST
exports.updateRecipe = function (req,res){
    body = '';

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        if(body==''){
            var response = {
                "Response": "Data not found"
            };
            badRequest(res,response);
        }
        else {
            postBody = JSON.parse(body);

            if (!verifyRecipe(postBody)) {
                var response = {
                    "Response": "Incomplete recipe " + postBody.name
                };
                badRequest(res, response);
            } else if (typeof cookbook[postBody.id] == 'undefined') {
                var response = {
                    "Response": "Invalid recipe id:" + postBody.id
                };
                badRequest(res, response);
            } else {
                var id = postBody.id;
                cookbook[id] = postBody;
                var response = {
                    "Response": "Updated recipe at id: " + id
                };
                OKResponse(res, response);
            }
        }
    });


}

//--------------------MANAGE INGREDIENTS-------------------------------------
//POST
exports.manageIngredients = function (req,res){
    body = '';

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        if(body==''){
            var response = {
                "Response": "Data not found"
            };
            badRequest(res,response);
        }
        else {
            postBody = JSON.parse(body);

            var id = postBody.id;

            if (typeof id !== undefined && id <= pivot) {
                var recipeBody = cookbook[id];
                    updateAll(recipeBody, id, res);

            } else {
                var response = {
                    "Response": "Bad ingredients management"
                };
                badRequest(res, response);
            }
        }
    });
}

//PUT
exports.manageIngredientsPut = function (req,res){
    body = '';

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        if(body==''){
            var response = {
                "Response": "Data not found"
            };
            badRequest(res,response);
        }
        else {
            postBody = JSON.parse(body);

            var id = postBody.id;

            if (typeof id !== undefined && id <= pivot) {
                var recipeBody = cookbook[id];
                    addIngredient(recipeBody, res);
            } else {
                var response = {
                    "Response": "Bad ingredients management"
                };
                badRequest(res, response);
            }
        }
    });
}

//PATCH
exports.manageIngredientsPatch = function (req,res){
    body = '';

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        if(body==''){
            var response = {
                "Response": "Data not found"
            };
            badRequest(res,response);
        }
        else {
            postBody = JSON.parse(body);

            var id = postBody.id;

            if (typeof id !== undefined && id <= pivot) {
                var recipeBody = cookbook[id];
                    searchAndReplace(recipeBody, res);
            } else {
                var response = {
                    "Response": "Bad ingredients management"
                };
                badRequest(res, response);
            }
        }
    });
}



//--------------------MANAGE INGREDIENTS-------------------------------------



function updateAll(recipeBody, id, res) {
    try {
        //updateAll
        recipeBody.ingredients = postBody.updateAll;
        cookbook[id] = recipeBody;
        var response = {
            "Response": "Updated ingredients array"
        };
        OKResponse(res, response);
    } catch (e) {
        var response = {
            "Response": "Caught an error " + e
        };
        badRequest(res, response);
    }
}

function searchAndReplace(recipeBody, res) {
    try {
        var replaceArr = recipeBody.ingredients;
        for (i = 0; i < replaceArr.length; i++) {
            if (replaceArr[i] == postBody.searchFor) {
                replaceArr[i] = postBody.replaceWith;
                break;
            }
        }
        recipeBody.ingredients = replaceArr;
        var response = {
            "Response": "If existing, replaced '" + postBody.searchFor + "' with '" + postBody.replaceWith + "' "
        };
        OKResponse(res, response);
    } catch (e) {
        var response = {
            "Response": "Caught an error " + e
        };
        badRequest(res, response);
    }
}

function addIngredient(recipeBody, res) {
    try {
        //addIngredient
        recipeBody.ingredients[recipeBody.ingredients.length] = postBody.addIngredient;
        var response = {
            "Response": "Added a new ingredient: "+postBody.addIngredient
        };
        OKResponse(res, response);
    } catch (e) {
        var response = {
            "Response": "Caught an error " + e
        };
        badRequest(res, response);
    }
}

/*
0 - bad request
1 - update all
2 - search/replace
3 - add new
*/
function verifyManageIngredients(postBody){
    var updateAll = postBody.updateAll;
    var searchFor = postBody.searchFor;
    var replaceWith = postBody.replaceWith;
    var addIngredient = postBody.addIngredient;

    if(typeof updateAll !== 'undefined' &&
        typeof searchFor == 'undefined' &&
        typeof replaceWith == 'undefined' &&
        typeof addIngredient == 'undefined'
    ){
        return 1;
    }

    if(typeof updateAll == 'undefined' &&
        typeof searchFor !== 'undefined' &&
        typeof replaceWith !== 'undefined' &&
        typeof addIngredient == 'undefined'
    ){
        return 2;
    }

    if(typeof updateAll == 'undefined' &&
        typeof searchFor == 'undefined' &&
        typeof replaceWith == 'undefined' &&
        typeof addIngredient !== 'undefined'
    ){
        return 3;
    }

    return 0;
}


//----------------------------------------------------------------------------

function OKResponse(res, response) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
}

function badRequest(res, response) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
}

exports.invalidRequest = function (req, res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Invalid Request');
};
