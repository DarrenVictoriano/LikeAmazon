require('dotenv').config();
var mysql = require('mysql');
var inquirer = require('inquirer');
var choicesArr = [];
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();
    //test();
});

function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement

        for (var i = 0; i < res.length; i++) {
            choicesArr.push(res[i].item_id + ") " + res[i].product_name + ": $" + res[i].price + ", Stock: " + res[i].stock_quantity);
        }

        inquirer
            .prompt({
                name: "buyThis",
                type: "list",
                message: "Select the item you wish to buy: ",
                choices: choicesArr
            })
            .then(function (answer) {
                // based on their answer, either call the bid or the post functions
                for (i in choicesArr) {
                    if (answer.buyThis == choicesArr[i]) {
                        buyThis(answer.buyThis);
                        break;
                    }
                }
            });
    });
}

function buyThis(item) {
    connection.query("SELECT * FROM products WHERE item_id = " + item.charAt(0), function (err, res) {
        if (err) throw err;

        inquirer
            .prompt({
                name: "quantity",
                type: "input",
                message: "How many " + res[0].product_name + " you wish to purchase?",
                filter: function (val) {
                    return Number(val);
                }
            })
            .then(function (answer) {
                // based on their answer, either call the bid or the post functions
                if (answer.quantity > res[0].stock_quantity) {
                    buyFailed(item);
                } else {
                    var newQ = res[0].stock_quantity - answer.quantity;
                    var cost = answer.quantity * res[0].price;
                    buySuccess(item, newQ, cost);
                }
            });
    });
}

function buyFailed(item) {

    inquirer
        .prompt({
            name: "quantity",
            type: "list",
            message: "Apologies, we do not have sufficient stock",
            choices: ["Perhaps, buy a lower quantity?", "Or buy a different item?"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.quantity == "Perhaps, buy a lower quantity?") {
                buyThis(item)
            } else {
                start();
            }
        });
}

function buySuccess(item, quantity, cost) {
    connection.query("UPDATE products SET stock_quantity = " + quantity + " WHERE item_id = " + item.charAt(0), function (err, res) {
        if (err) throw err;

        inquirer
            .prompt({
                name: "another",
                type: "input",
                message: "Success! total cost of this purchase is $" + cost
            })
            .then(function (answer) {
                // based on their answer, either call the bid or the post functions
                connection.end();
            });
    });
}