document.addEventListener('DOMContentLoaded', (event) => {
    const bookForm = document.getElementById('bookForm');
    const wantToReadList = document.getElementById('wantToRead');
    const currentlyReadingList = document.getElementById('currentlyReading'); //gets reference of html element
    const finishedReadingList = document.getElementById('finishedReading');
    const graveyardList = document.getElementById('graveyard');

    bookForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;

        const uniqueId = `${title}-${author}`.replace(/\s+/g, '-'); // Creates a unique ID for each book and replaces spaces with dashes

        addBookToList(title, author, uniqueId, 'wantToRead'); //added uniqueID to the function and the column that book belongs to. added uniqueID because it is needed to save the book to local
        saveBookToLocalStorage(title, author, uniqueId, 'wantToRead');

        bookForm.reset();
        const modal = new bootstrap.Modal(document.getElementById('addBookModal'));
        modal.hide();
    });

    function addBookToList(title, author, id, columnId) { //added uniqueID and columnId to the function
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card', 'card', 'mb-3');
        bookCard.setAttribute('draggable', true); //added draggable attribute to the book card
        bookCard.setAttribute('id', id); //added uniqueID to the book card
        bookCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">by ${author}</p>
            </div>`;
        document.getElementById(columnId).appendChild(bookCard); //appends the book to the column based on the columnId

        bookCard.addEventListener('dragstart', (event) => { //added dragstart event listener to the book card (when you click and start dragging)
            event.dataTransfer.setData('text/plain', event.target.id); //sets the uniqueID of the book to the dataTransfer object
        });

    }

    function saveBookToLocalStorage(title, author, id, columnId) {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        books.push({ title, author, id, columnId });
        localStorage.setItem('books', JSON.stringify(books));
    }

    function loadBooksFromLocalStorage() {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        books.forEach(book => addBookToList(book.title, book.author, book.id, book.columnId));
    }

    function handleDrop(event, columnId) { //drop function
        event.preventDefault();
        const id = event.dataTransfer.getData('text/plain'); //gets uniqueID of the book
        const bookCard = document.getElementById(id); //gets reference of the book card
        document.getElementById(columnId).appendChild(bookCard); //appends the book card to the column
    
        // Update localStorage to reflect new column
        const books = JSON.parse(localStorage.getItem('books')) || [];
    
        for (const book of books) { //loops through the books
            if (book.id === id) { //if the book id matches the uniqueID
                book.columnId = columnId; //update the columnId of the book to the new column it belongs to
                break; // Exit the loop early since we've found the book
            }
        }
        
        localStorage.setItem('books', JSON.stringify(books)); //update the local storage with the new boooks
    }
    

    function handleDragOver(event) { //drag function
        event.preventDefault(); //prevents default behavior of not allowing to drag
    }

    // Added event listeners for each element reference to allow for drag and drop functionality
    // dragover event calls the handleDragOver function
    // drop event calls the handleDrop function
    [wantToReadList, currentlyReadingList, finishedReadingList, graveyardList].forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('drop', (event) => handleDrop(event, column.id));
    });

    loadBooksFromLocalStorage();
});

