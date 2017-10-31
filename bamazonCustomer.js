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
connection.connect(function(err){
if (err) throw err;
    console.log("Connected as ID: " + connection.threadId);
    totalInventory();
});
//Displays entire database///////////////////////////////////////////////////////////
function totalInventory() {
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        console.log(res);
        connection.end()
    });
}