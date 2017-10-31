//Requirements/////////////////////////////////////////////////////////
var inquirer = require("inquirer");
var mysql = require("mysql");

//Global Variables/////////////////////////////////////////////////////////
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
        choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
    });

};