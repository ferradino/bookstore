// Get list of books available for purchase
function getBookList() {
    const bookList = [
        {ISBN: 1368098168, title: "The Lightning Theif", price: 8.99, imageFile: "978-1368098168.png"},
        {ISBN: 1423146780, title: "Blood of Olympus", price: 10.99, imageFile: "978-1423146780.png"},
        {ISBN: 1423163374, title: "The Sword of Summer", price: 9.99, imageFile: "978-1423163374.png"},
    ];
    return bookList;
}

// Search the given ISBN and see if it matches one of the books
// If the book was found in the list of available books return true
// If not, return false indicating the books is not available
function getBookByISBN(ISBN) {
    var bookList = getBookList();
    for (let book of bookList) {
        if (book.ISBN === ISBN) {
            return book;
        }
    }
    return null;
}

// Create order object from the order request
// Take in a ISBN and quantity
// Return order object
function createOrder(ISBN, quantity) {
    var order = {};
    order.quantity = parseInt(quantity.trim());
    order.book = getBookByISBN(parseInt(ISBN));
    return order;
}

// Validate the order
// The checks if all the input data from the html form is valid
// Will generate and return errors if any of the order elements is invalid
function validateOrder(order) {
    var errors = {};
    if (order.book === null) {
        errors.missingISBN = true;
    }
    if (isNaN(order.quantity) || order.quantity < 1) {
        errors.illegalQuantity = true;
    }
    return errors;
}

// Compute the bill of the order
// Tax: 1.75%
// Total Price is price of book * quantity * tax and set the bill to two decimal points
function computeBill(order) {
    const tax = 1.0175
    var bill = (order.book.price * order.quantity * tax).toFixed(2);
    return bill;
}

// export all the module function so that they can be used throughout application
module.exports = {getBookList, getBookByISBN, createOrder, validateOrder, computeBill};
