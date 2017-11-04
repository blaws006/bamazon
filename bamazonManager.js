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

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as ID: " + connection.threadId);
    managerView();
});


function managerView() {
    inquirer.prompt({
        type: "list",
        name: "select",
        message: "What would you like to see, Mr. Manager?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }).then(function (choice) {
        switch (choice.select) {
            case "View Products for Sale":
                totalInventoryManager();
                break;
            case "View Low Inventory":
                lowInventory();
                console.log("Inventory");
                break;
            case "Add to Inventory":
                addInventory();
                console.log("Add");
                break;
            case "Add New Product":
                // newProduct();
                console.log("New Product");
        }
    })

};

function totalInventoryManager() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);
        connection.end();
    })
};

function lowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity <= 5) {
                console.log(res[i]);
            }

        }
        connection.end();
    });
};

function addInventory() {
    inquirer.prompt({
        type: "list",
        name: "refill",
        message: "What would you like to order today?",
        choices: ["Towels", "Horizon Zero Dawn", "Moana Doll", "NBA 2K18", "4eva is a Mighty Long Time", "Shampoo", "Lego Set", "Beach House 3", "Destiny 2", "2008"]
         
    }).then(function (choice) {
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
}