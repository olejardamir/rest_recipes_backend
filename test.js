const axios = require("axios");


if (require.main === module) {
    main();
}




async function main() {

    await badURL()
        .then(()=>nullTest())
        .then(()=>badData())
        .then(()=>addRecipes())
        .then(()=>removeRecipe())
        .then(()=>updateRecipe())
        .then(()=>manageRecipes())
        .then(()=>finalConfirmation());
}


async function badData() {
    try {
        await axios.post('http://127.0.0.1:3000/addRecipe', '{"bad":"data"}');
    } catch (e) {
        var strE = '' + e;
        console.log("Bad-data test 1 pass: " + (strE == "Error: Request failed with status code 400"));
    }
    try {
        await axios.delete('http://127.0.0.1:3000/removeRecipe', { data: { "bad":"data"  }});
    } catch (e) {
        var strE = '' + e;
        console.log("Bad-data test 2 pass: " + (strE == "Error: Request failed with status code 400"));
    }
    try {
        await axios.post('http://127.0.0.1:3000/updateRecipe', '{"bad":"data"}');
    } catch (e) {
        var strE = '' + e;
        console.log("Bad-data test 3 pass: " + (strE == "Error: Request failed with status code 400"));
    }
    try {
        await axios.post('http://127.0.0.1:3000/manageIngredients', '{"bad":"data"}');
    } catch (e) {
        var strE = '' + e;
        console.log("Bad-data test 4 pass: " + (strE == "Error: Request failed with status code 400"));
    }
    try {
        await axios.post('http://127.0.0.1:3000/addRecipe', ' {\n' +
            ' "id": 0,\n' +
            ' "name": "Pizza",\n' +
            ' "instructions": "Bake it in the oven",\n' +
            ' "ingredients": "NOT ARRAY!"\n' +
            ' }');
    } catch (e) {
        var strE = '' + e;
        console.log("Bad-data test 5 pass: " + (strE == "Error: Request failed with status code 400"));
    }

    try {
        await axios.delete('http://127.0.0.1:3000/removeRecipe', { data: { "bad":"data"  }});
    } catch (e) {
        var strE = '' + e;
        console.log("Bad-data test 5 pass: " + (strE == "Error: Request failed with status code 400"));
    }

}

async function badURL() {
    try {
        await axios.post('http://127.0.0.1:3000/badURL', '');
    } catch (e) {
        var strE = '' + e;
        console.log("Bad URL test 1 pass: " + (strE == "Error: Request failed with status code 404"));
    }

    try {
        await axios.get('http://127.0.0.1:3000/badURL');
    } catch (e) {
        var strE = '' + e;
        console.log("Bad URL test 2 pass: " + (strE == "Error: Request failed with status code 404"));
    }
}

async function nullTest() {
    //null tests

    //--------LIST
    await axios.get("http://127.0.0.1:3000/listRecipes")
        .then((x) => console.log("List-null test 1 pass: " + (JSON.stringify(x.data) == '[]')));

    //--------ADD
    try {
        await axios.post('http://127.0.0.1:3000/addRecipe', '{}');
    } catch (e) {
        var strE = '' + e;
        console.log("Add-null test 1 pass: " + (strE == "Error: Request failed with status code 400"));
    }

    try {
        await axios.post('http://127.0.0.1:3000/addRecipe', '');
    } catch (e) {
        var strE = '' + e;
        console.log("Add-null test 2 pass: " + (strE == "Error: Request failed with status code 400"));
    }

    try {
        await axios.post('http://127.0.0.1:3000/addRecipe', null);
    } catch (e) {
        var strE = '' + e;
        console.log("Add-null test 3 pass: " + (strE == "Error: Request failed with status code 400"));
    }

    //--------REMOVE

    try {
        await axios.delete('http://127.0.0.1:3000/removeRecipe', { data: {  }});
    } catch (e) {
        var strE = '' + e;
        console.log("Remove-null test 1 pass: " + (strE == "Error: Request failed with status code 400"));
    }

    try {
        await axios.delete('http://127.0.0.1:3000/removeRecipe', { data: {'':''}});
    } catch (e) {
        var strE = '' + e;
        console.log("Remove-null test 2 pass: " + (strE == "Error: Request failed with status code 400"));
    }

    try {
        await axios.delete('http://127.0.0.1:3000/removeRecipe', { data: { null:null  }});
    } catch (e) {
        var strE = '' + e;
        console.log("Remove-null test 3 pass: " + (strE == "Error: Request failed with status code 400"));
    }

    //--------UPDATE
    try {
        await axios.post('http://127.0.0.1:3000/updateRecipe', '{}');
    } catch (e) {
        var strE = '' + e;
        console.log("Update-null test 1 pass: " + (strE == "Error: Request failed with status code 400"));
    }

    try {
        await axios.post('http://127.0.0.1:3000/updateRecipe', '');
    } catch (e) {
        var strE = '' + e;
        console.log("Update-null test 2 pass: " + (strE == "Error: Request failed with status code 400"));
    }

    try {
        await axios.post('http://127.0.0.1:3000/updateRecipe', null);
    } catch (e) {
        var strE = '' + e;
        console.log("Update-null test 3 pass: " + (strE == "Error: Request failed with status code 400"));
    }

    //--------MANAGE
    try {
        await axios.post('http://127.0.0.1:3000/manageIngredients', '{}');
    } catch (e) {
        var strE = '' + e;
        console.log("Manage-null test 1 pass: " + (strE == "Error: Request failed with status code 400"));
    }

    try {
        await axios.post('http://127.0.0.1:3000/manageIngredients', '');
    } catch (e) {
        var strE = '' + e;
        console.log("Manage-null test 2 pass: " + (strE == "Error: Request failed with status code 400"));
    }

    try {
        await axios.post('http://127.0.0.1:3000/manageIngredients', null);
    } catch (e) {
        var strE = '' + e;
        console.log("Manage-null test 3 pass: " + (strE == "Error: Request failed with status code 400"));
    }
}

async function addRecipes() {
    const recipe1 = " {\n" +
        " \"name\": \"Peperoni Pizza\",\n" +
        " \"instructions\": \"Bake it in the oven\",\n" +
        " \"ingredients\": [\"1kg of something\",\"2kg of something else\",null,\"\"]\n" +
        " }";
    const recipe2 = " {\n" +
        " \"name\": \"Meat-Lover Pizza\",\n" +
        " \"instructions\": \"Don't boil\",\n" +
        " \"ingredients\": [\"1g of something\",\"5l of something else\",null,null]\n" +
        " }";
    const recipe3 = " {\n" +
        " \"name\": \"Supreme Pizza\",\n" +
        " \"instructions\": \"Don't eat raw\",\n" +
        " \"ingredients\": [\"5kg of something\",\"1kg of something else\"]\n" +
        " }";

    await axios.post('http://127.0.0.1:3000/addRecipe', recipe1)
        .then((x) => console.log("Add Recipe test 1 pass: "
            + (JSON.stringify(x.data).includes("Added new recipe at id: 0"))))
        .then(() => axios.post('http://127.0.0.1:3000/addRecipe', recipe2)
            .then((x) => console.log("Add Recipe test 2 pass: "
                + (JSON.stringify(x.data).includes("Added new recipe at id: 1")))))
        .then(() => axios.post('http://127.0.0.1:3000/addRecipe', recipe3)
            .then((x) => console.log("Add Recipe test 3 pass: "
                + (JSON.stringify(x.data).includes("Added new recipe at id: 2")))));
}

async function removeRecipe() {
    await axios.delete('http://127.0.0.1:3000/removeRecipe', {data: {"id": 0}})
        .then((x) => {
            var strE = '' + JSON.stringify(x.data);
            console.log("Remove-recipe test 1 pass: " + (strE == "{\"Response\":\"Removed recipe at id: 0\"}"))
        });
}

async function updateRecipe() {
    const recipe2 = " {\n" +
        " \"id\": 1,\n" +
        " \"name\": \"Meat-Lover Pizza\",\n" +
        " \"instructions\": \"Bake it\",\n" +
        " \"ingredients\": [\"1g of meat\",\"5l of dough\"]\n" +
        " }";

    await axios.post('http://127.0.0.1:3000/updateRecipe', recipe2)
        .then((x) => console.log("Update Recipe test 1 pass: "
            + (JSON.stringify(x.data).includes("Updated recipe at id: 1"))))
}

async function manageRecipes() {
    const updateConst = "{\n" +
        "\"id\":2,\n" +
        "\"updateAll\":[\"Dough\",\"Cheese\"]\n" +
        "}";

    const addIngrConst = "{\n" +
        "\"id\":2,\n" +
        "\"addIngredient\":\"Potato\"\n" +
        "}";

    const searchReplConst = "    {\n" +
        "        \"id\":2,\n" +
        "        \"searchFor\":\"Potato\",\n" +
        "        \"replaceWith\":\"Tomato\"\n" +
        "    }";


    await axios.post('http://127.0.0.1:3000/manageIngredients', updateConst)
        .then((x) => console.log("Manage Recipe test 1 pass: "
            + (JSON.stringify(x.data).includes("Updated ingredients array"))));

    await axios.post('http://127.0.0.1:3000/manageIngredients', addIngrConst)
        .then((x) => console.log("Manage Recipe test 2 pass: "
            + (JSON.stringify(x.data).includes("Added a new ingredient: Potato"))));

    await axios.post('http://127.0.0.1:3000/manageIngredients', searchReplConst)
        .then((x) => console.log("Manage Recipe test 3 pass: "
            + (JSON.stringify(x.data).includes("replaced 'Potato' with 'Tomato'"))));
}

async function finalConfirmation() {
    const expected = '[null,{"id":1,"name":"Meat-Lover Pizza","instructions":"Bake it","ingredients":["1g of meat","5l of dough"]},{"name":"Supreme Pizza","instructions":"Don\'t eat raw","ingredients":["Dough","Cheese","Tomato"],"id":2}]';

    await axios.get("http://127.0.0.1:3000/listRecipes")
        .then((x) => console.log("Final test pass: " + (JSON.stringify(x.data) == expected)));
}