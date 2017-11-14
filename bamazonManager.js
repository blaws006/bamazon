//Requirements/////////////////////////////////////////////////////////
var inquirer = require("inquirer");
var mysql = require("mysql");

//Global Variables/////////////////////////////////////////////////////////
var orderList = [];
//Connecting to the SQL database
var connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "R3dsk1ns1!",
    database: "bamazon"
});

//Functions/////////////////////////////////////////////////////////
//Connects to SQL DB
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as ID: " + connection.threadId);
    managerView();
});

//Manager functions
function managerView() {
    inquirer.prompt({
        type: "list",
        name: "select",
        message: "What would you like to see, Mr. Manager?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }).then(function (choice) {
        switch (choice.select) {
            case "View Products for Sale":
                totalInventoryManager(); //View all products
                break;
            case "View Low Inventory": //Checks if Inv is lower than 5
                lowInventory();
                console.log("Inventory"); 
                break;
            case "Add to Inventory":
                addInventory();//Let's you replinish Inv
                console.log("Add");
                break;
            case "Add New Product":
                newProduct(); // Let's you add new product
        }
    })

};

function totalInventoryManager() { //Query string for "view all" in SQL
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res); 
        connection.end();
    })
};

function lowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {//If Inv is below 5
            if (res[i].stock_quantity <= 5) {
                console.log(res[i]); //Show that product
            } else { //Else tell me we're good to go
                console.log("Stock is good. Nothing to see here, Mr. Manager.")
            }

        }
        connection.end();
    });
};

function addInventory() { //Adds Inv
    inquirer.prompt({
        type: "list",
        name: "refill",
        message: "What would you like to order today?",
        choices: ["Towels", "Horizon Zero Dawn", "Moana Doll", "NBA 2K18", "4eva is a Mighty Long Time", "Shampoo", "Lego Set", "Beach House 3", "Destiny 2", "2008"]

    }).then(function (choice) { //Choose product above and quantity below
        orderList.push(choice.refill);
        inquirer.prompt({
            type: "input",
            name: "quantity",
            message: "How many would you like to order?"
        }).then(function (replenish) {
            connection.query("SELECT * from products WHERE product_name = ?", [orderList[0]], function (err, res) {
                var newQuant = res[0].stock_quantity += parseInt(replenish.quantity);
                connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQuant, res[0].item_id], function (err, res) {
                    console.log(newQuant);
                    connection.end();
                });
            });
        });
    });
};

function newProduct() {// New product
    inquirer.prompt([{
            type: "input",
            name: "product_name",
            message: "What's the product?"
        },
        {
            type: "input",
            name: "department_name",
            message: "What department does this belong to?"
        },
        {
            type: "input",
            name: "price",
            message: "What is the cost of this product?"
        },
        {
            type: "input",
            name: "stock_quantity",
            message: "How many do you want to order initially?"
        }
    ]).then(function (add) { //Makes object once above questions answered
        var post = {
            product_name: add.product_name,
            department_name: add.department_name,
            price: add.price,
            stock_quantity: add.stock_quantity
        }//Query starts here
        connection.query("INSERT INTO products SET ?", post, function (err, res) {
            if (err) throw err;
            console.log(post);
            connection.end();
        });
    });
};