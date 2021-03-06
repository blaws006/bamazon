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
//Checks if the connetion between the Node app and SQL database was sucessful/////////////////////////////////////////////////////////
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as ID: " + connection.threadId);
    totalInventory();
});
//Displays entire database///////////////////////////////////////////////////////////
function totalInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);
        bamazonOrder();
    });
};
//Asks the user two quetions:///////////////////////////////////////////////////////// 
//1. What's the ID of the item that they'd like to buy /////////////////////////////////////////////////////////
//2. How many units would they like to buy/////////////////////////////////////////////////////////
function bamazonOrder() {
    inquirer.prompt({
        type: "list",
        name: "order",
        message: "What would you like to buy today?",
        choices: ["Towels", "Horizon Zero Dawn", "Moana Doll", "NBA 2K18", "4eva is a Mighty Long Time", "Shampoo", "Lego Set", "Beach House 3", "Destiny 2", "2008"]
    }).then(function (choice) {
        switch (choice.order) {
            case "Towels":
            case "Horizon Zero Dawn":
            case "Moana Doll":
            case "NBA 2K18":
            case "4eva is a Mighty Long Time":
            case "Shampoo":
            case "Lego Set":
            case "Beach House 3":
            case "Destiny 2":
            case "2008":
                orderList.push(choice.order);
                 howMany();
                break;
            default:
                console.log("Order number not recognized")
        };
    });

};
//Inquirer used to ask how many of the product that they will be ordering/////////////////////////////////////////////////////////
function howMany() {
    inquirer.prompt({
        type: "input",
        name: "quantity",
        message: "How many would you like to order?"
    }).then(function (quant) {
        connection.query("SELECT * FROM products WHERE product_name = ?", [orderList[0]], function (err, res) { //Rejects the transaction if quanity ordered is greater than quantity in stock/////////////////////////////////////////////////////////
            if (res[0].stock_quantity < quant.quantity) {
                console.log("Insufficent amount!")
                connection.end();
            } else { //Logs the transaction and updates the db if acceptable/////////////////////////////////////////////////////////
                console.log("Transaction successful!")
               var newQuant = res[0].stock_quantity -= quant.quantity;
               var price = res[0].price *= quant.quantity;
               console.log(newQuant)
                var query = connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQuant, res[0].item_id], function (err, res) {
                    if (err) throw err;
                    //Gives costomer the cost of their order/////////////////////////////////////////////////////////
                    console.log("Your total cost is $" + price);
                    connection.end();
                });

            }

        });
    });
}


   