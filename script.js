function Author(name, email) {
    this.name = name;
    this.email = email;
}

function Book(title, price, author) {
    this.title = title;
    this.price = price;
    this.author = author;
}

var booksCollection = [];
var currentlyEditing = null;

function generateBookForms() {
    var bookCount = parseInt(document.getElementById('bookCount').value);
    var container = document.getElementById('dynamicForms');
    
    if (isNaN(bookCount) || bookCount < 1 || bookCount > 20) {
        document.getElementById('countError').style.display = 'block';
        return;
    }
    
    document.getElementById('countError').style.display = 'none';
    container.innerHTML = '';
    
    for (var i = 0; i < bookCount; i++) {
        container.innerHTML += '<div style="margin-top: 20px;">' +
            '<h3>Book ' + (i + 1) + ' Details</h3>' +
            '<div class="form-group">' +
                '<label for="title' + i + '">Book Title</label>' +
                '<input type="text" id="title' + i + '" required>' +
                '<div id="titleError' + i + '" class="error">Title is required</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="price' + i + '">Price ($)</label>' +
                '<input type="number" id="price' + i + '" min="0" step="0.01" required>' +
                '<div id="priceError' + i + '" class="error">Valid price required</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="authorName' + i + '">Author Name</label>' +
                '<input type="text" id="authorName' + i + '" required>' +
                '<div id="authorNameError' + i + '" class="error">Author name is required</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="authorEmail' + i + '">Author Email</label>' +
                '<input type="email" id="authorEmail' + i + '" required>' +
                '<div id="authorEmailError' + i + '" class="error">Valid email required</div>' +
            '</div>' +
        '</div>';
    }
    
    document.getElementById('initialForm').style.display = 'none';
    document.getElementById('bookFormsContainer').style.display = 'block';
}

function collectBooks() {
    var bookCount = parseInt(document.getElementById('bookCount').value);
    var isValid = true;
    
    booksCollection = [];
    
    for (var i = 0; i < bookCount; i++) {
        var title = document.getElementById('title' + i).value.trim();
        var price = parseFloat(document.getElementById('price' + i).value);
        var authorName = document.getElementById('authorName' + i).value.trim();
        var authorEmail = document.getElementById('authorEmail' + i).value.trim();
        
        // Validate inputs
        var bookValid = true;
        
        if (!title) {
            document.getElementById('titleError' + i).style.display = 'block';
            bookValid = false;
        } else {
            document.getElementById('titleError' + i).style.display = 'none';
        }
        
        if (isNaN(price) || price < 0) {
            document.getElementById('priceError' + i).style.display = 'block';
            bookValid = false;
        } else {
            document.getElementById('priceError' + i).style.display = 'none';
        }
        
        if (!authorName) {
            document.getElementById('authorNameError' + i).style.display = 'block';
            bookValid = false;
        } else {
            document.getElementById('authorNameError' + i).style.display = 'none';
        }
        
        if (!authorEmail || !validateEmail(authorEmail)) {
            document.getElementById('authorEmailError' + i).style.display = 'block';
            bookValid = false;
        } else {
            document.getElementById('authorEmailError' + i).style.display = 'none';
        }
        
        if (!bookValid) {
            isValid = false;
            continue;
        }
        
        var author = new Author(authorName, authorEmail);
        var book = new Book(title, price, author);
        booksCollection.push(book);
    }
    
    if (!isValid) {
        alert('Please correct the errors in the form');
        return;
    }
    
    document.getElementById('bookFormsContainer').style.display = 'none';
    displayBooksTable();
}

function displayBooksTable() {
    var tableBody = document.getElementById('booksTableBody');
    tableBody.innerHTML = '';
    
    if (booksCollection.length === 0) {
        document.getElementById('bookTableContainer').style.display = 'none';
        return;
    }
    
    for (var i = 0; i < booksCollection.length; i++) {
        var book = booksCollection[i];
        var row = document.createElement('tr');
        row.dataset.index = i;
        
        row.innerHTML = '<td>' + book.title + '</td>' +
            '<td>$' + book.price.toFixed(2) + '</td>' +
            '<td>' + book.author.name + '</td>' +
            '<td>' + book.author.email + '</td>' +
            '<td class="action-buttons">' +
                '<button class="edit-btn" onclick="editBook(' + i + ')">Edit</button>' +
                '<button class="delete-btn" onclick="deleteBook(' + i + ')">Delete</button>' +
            '</td>';
        
        tableBody.appendChild(row);
    }
    
    document.getElementById('bookTableContainer').style.display = 'block';
}

function editBook(index) {
    if (currentlyEditing !== null) {
        cancelEdit(currentlyEditing);
    }
    
    currentlyEditing = index;
    var book = booksCollection[index];
    var row = document.querySelector('#booksTableBody tr[data-index="' + index + '"]');
    
    row.innerHTML = '<td><input type="text" value="' + book.title + '" id="editTitle"></td>' +
        '<td><input type="number" value="' + book.price + '" step="0.01" min="0" id="editPrice"></td>' +
        '<td><input type="text" value="' + book.author.name + '" id="editAuthorName"></td>' +
        '<td><input type="email" value="' + book.author.email + '" id="editAuthorEmail"></td>' +
        '<td class="action-buttons">' +
            '<button class="save-btn" onclick="saveEdit(' + index + ')">Save</button>' +
            '<button class="cancel-btn" onclick="cancelEdit(' + index + ')">Cancel</button>' +
        '</td>';
}

function saveEdit(index) {
    var title = document.getElementById('editTitle').value.trim();
    var price = parseFloat(document.getElementById('editPrice').value);
    var authorName = document.getElementById('editAuthorName').value.trim();
    var authorEmail = document.getElementById('editAuthorEmail').value.trim();
    
    if (!title || isNaN(price) || price < 0 || !authorName || !authorEmail || !validateEmail(authorEmail)) {
        alert('Please fill all fields with valid data');
        return;
    }
    
    var book = booksCollection[index];
    book.title = title;
    book.price = price;
    book.author.name = authorName;
    book.author.email = authorEmail;
    
    currentlyEditing = null;
    displayBooksTable();
}

function cancelEdit(index) {
    currentlyEditing = null;
    displayBooksTable();
}

function deleteBook(index) {
    if (confirm('Are you sure you want to delete this book?')) {
        booksCollection.splice(index, 1);
        displayBooksTable();
    }
}

function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}