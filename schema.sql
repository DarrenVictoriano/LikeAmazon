DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NULL,
    price INT NOT NULL,
    stock_quantity INT,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("MacBook", "Electronics", 1999, 10),
        ("iPhone X", "Electronics", 999, 10),
        ("Them Jeans", "Clothes", 50, 10),
        ("Silver Dagger", "Weapons", 1999, 10),
        ("Firebolt Scroll", "Magic", 1999, 10),
        ("Lightning Scroll", "Magic", 1999, 10),
        ("Stealth Scroll", "Magic", 1999, 10);
        
SELECT * FROM products;