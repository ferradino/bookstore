// Get list of books available for purchase
function getBookList() {
    const bookList = [
        {ISBN: 1368098168, title: "The Lightning Theif", price: 8.99, imageFile: "./images/978-1368098168.png"},
        {ISBN: 1423146780, title: "Blood of Olympus", price: 10.99, imageFile: "./images/978-1423146780.png"},
        {ISBN: 1423163374, title: "The Sword of Summer", price: 9.99, imageFile: "./images/978-1423163374.png"},
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
}


// Validate the order
// The checks if all the input data from the html form is valid
// Will generate and return errors if any of the order elements is invalid
function validateOrder(ISBN, quantity) {
    var errors = [];
    if (ISBN === 0) {
        errors.push("Must select a book!"); 
    }
    if (isNaN(quantity) || quantity < 1) {
        errors.push("Must purchase at least one copy!");
    }
    return errors;
}


// Compute the bill of the order
// Tax: 1.75%
// Total Price is price of book * quantity * tax
function computeBill(price, numCopies) {
    const tax = 1.0175
    var bill = price * numCopies * tax;
    return bill;
}


// export all the module function so that they can be used throughout application
module.exports = {getBookList, getBookByISBN, validateOrder, computeBill};
