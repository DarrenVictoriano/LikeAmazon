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
            choicesArr.push(res[i].item_id + ") " + res[i].product_name + ": $" + res[i].price);
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
                    } else {
                        console.log("a " + answer.buyThis);
                        console.log("c " + choicesArr[i]);
                        break;
                    }
                }
            });
    });
}

function buyThis(item) {
    inquirer
        .prompt({
            name: "buyThis",
            type: "list",
            message: "You successfully purchased: " + item,
            choices: ["Buy More", "Quit"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.buyThis == "Buy More") {
                start();
            } else {
                connection.end();
            }
        });
}
