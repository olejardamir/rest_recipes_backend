const url = require('url');

/*
 Recipe example:

 {
 "id": 0,
 "name": "Pizza",
 "instructions": "Blah, blah, blah",
 "ingredients": "1kg of something"
 }

 */


/*
GET: List all recipes
POST: Add a new recipe
DELETE: Remove a recipe
POST: Update a recipe
POST: Manage individual ingredients
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

//--------------------LIST RECIPES-------------------------------------
//GET
exports.listRecipes = function (req, res){
    const reqUrl = url.parse(req.url, true);
    OKResponse(res, cleanCookBook());
}

//--------------------ADD RECIPE-------------------------------------
//POST
exports.addRecipe = function(req,res){
    body = '';

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        postBody = JSON.parse(body);
        if(!verifyRecipeNoId(postBody)){
            var response = {
                "Response": "Incomplete recipe " + postBody.name
            };
            badRequest(res,response);
        }
        else {
            postBody.id = pivot;
            cookbook[pivot] = postBody;
            pivot = pivot+1;

            var response = {
                "Response": "Added new recipe at id: "+(pivot-1)
            };
            OKResponse(res, response);
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
        postBody = JSON.parse(body);

        if(!verifyRecipe(postBody)){
            var response = {
                "Response": "Incomplete recipe " + postBody.name
            };
            badRequest(res,response);
        }
        else if( typeof cookbook[postBody.id] == 'undefined'){
            var response = {
                "Response": "Invalid recipe id:" + postBody.id
            };
            badRequest(res,response);
        }
        else {
            var id = postBody.id;
            cookbook[id] = postBody;
            var response = {
                "Response": "Updated recipe at id: "+id
            };
            OKResponse(res, response);
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
        postBody = JSON.parse(body);
        var recipeId = postBody.id;
        var callType = verifyManageIngredients(postBody);

        if(typeof recipeId!==undefined && recipeId<=pivot) {
            var id = postBody.id;
            var recipe = cookbook[id];
            var recipeBody = JSON.parse(recipe);

            if (callType == 1) {
                //updateAll
                recipeBody.ingredients = postBody.updateAll;
                cookbook[id] = JSON.stringify(recipeBody);
                var response = {
                    "Response": "Updated ingredients array"
                };
                OKResponse(res, response);
            } else if (callType == 2) {
                var replaceArr = recipeBody.ingredients;
                for(i=0;i<replaceArr.length;i++){
                    if(replaceArr[i]==postBody.searchFor){
                        replaceArr[i] = postBody.replaceWith;
                        break;
                    }
                }
                recipeBody.ingredients = replaceArr;
                cookbook[id] = JSON.stringify(recipeBody);
                var response = {
                    "Response": "If existing, replaced '"+postBody.searchFor+"' with '"+postBody.replaceWith+"' "
                };
                OKResponse(res, response);
            } else if (callType == 3) {
                //addIngredient
                recipeBody.ingredients[recipeBody.ingredients.length] = postBody.addIngredient;
                cookbook[id] = JSON.stringify(recipeBody);
                var response = {
                    "Response": "Added new ingredient: "
                };
                OKResponse(res, response);
            }
        }
        else {
            var response = {
                "Response": "Bad ingredients management"
            };
            badRequest(res, response);
        }
    });

}

//----------------------------------------------------------------------------

function cleanCookBook(){
    var ret = [];
    var c = 0;
    for(i=0;i<pivot;i++){
        if(cookbook[i]!=null){
            ret[c] = cookbook[i];
            ret[c].ingredients = cleanIngredients(ret[c]);
            c++;
        }
    }
    return ret;
}

function cleanIngredients(ingredients){
    var ret=[];
    var c=0;
    for(i=0;i<ingredients.length;i++){
        if(ingredients[i]!=null){
            ret[c] = ingredients[i];
            c++;
        }
    }
    return ret;
}

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