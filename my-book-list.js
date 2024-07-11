document.addEventListener('DOMContentLoaded', (event) => {
    const bookForm = document.getElementById('bookForm');
    const wantToReadList = document.getElementById('wantToRead');

    bookForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;

        addBookToList(title, author);
        saveBookToLocalStorage(title, author);

        bookForm.reset();
        const modal = new bootstrap.Modal(document.getElementById('addBookModal'));
        modal.hide();
    });

    function addBookToList(title, author) {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card', 'card', 'mb-3');
        bookCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">by ${author}</p>
            </div>`;
        wantToReadList.appendChild(bookCard);
    }

    function saveBookToLocalStorage(title, author) {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        books.push({ title, author });
        localStorage.setItem('books', JSON.stringify(books));
    }

    function loadBooksFromLocalStorage() {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        books.forEach(book => addBookToList(book.title, book.author));
    }

    loadBooksFromLocalStorage();
});
