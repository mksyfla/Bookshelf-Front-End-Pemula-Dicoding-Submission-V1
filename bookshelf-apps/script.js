const book = [];
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    });

    const searchForm = document.getElementById("searchBook");
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        searchBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBook() {
    const judul = document.getElementById('inputBookTitle').value;
    const penulis = document.getElementById('inputBookAuthor').value;
    const tahun = document.getElementById('inputBookYear').value;
    const checkCompletedButton = document.getElementById('inputBookIsComplete');
    const generatedID = generateId();

    if (checkCompletedButton.checked) {
        const bookObject = generateBookObject(generatedID, judul, penulis, tahun, true);
        book.push(bookObject);
    } else {
        const bookObject = generateBookObject(generatedID, judul, penulis, tahun, false);
        book.push(bookObject);
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;
    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;
    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;

    const buttonList = document.createElement('div');
    buttonList.classList.add('action');

    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText = 'Belum selesai dibaca';
        undoButton.addEventListener('click', function () {
            undoBook(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus buku';
        trashButton.addEventListener('click', function () {
            removeBook(bookObject.id);
        });

        buttonList.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerText = 'Selesai dibaca';
        checkButton.addEventListener('click', function () {
            checkBook(bookObject.id);
        });
     
        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus buku';
        trashButton.addEventListener('click', function () {
            removeBook(bookObject.id);
        });

        buttonList.append(checkButton, trashButton);
    }

    const bookItem = document.createElement('article');
    bookItem.classList.add('book_item');
    bookItem.append(textTitle, textAuthor, textYear, buttonList);

    return bookItem;
}

function removeBook(bookId) {
    const confirmation = confirm('Apakah kamu yakin untuk menghapus buku ini?');
    if(!confirmation) return;

    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
   
    book.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function checkBook(bookId) {
    const confirmation = confirm('Apakah kamu sudah selesai membaca buku ini?');
    if(!confirmation) return;

    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
   
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBook(bookId) {
    const confirmation = confirm('Apakah kamu belum selesai membaca buku ini?');
    if(!confirmation) return;

    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
   
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of book) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }

    return null;
}

function findBookIndex(bookId) {
    for (const index in book) {
        if (book[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function searchBook() {
    const searchBookTitle = document.getElementById("searchBookTitle");
    const filter = searchBookTitle.value.toUpperCase();
    const item = document.querySelectorAll(".book_item");
    console.log(item);

    for (let i = 0; i < item.length; i++) {
        const bookTitle = item[i].getElementsByTagName("h3")[0];
        const textTitle = bookTitle.innerText;

        if (textTitle.toUpperCase().indexOf(filter) > -1) {
            item[i].style.display = "";
        } else {
            item[i].style.display = "none"
        }
    }
}

document.addEventListener(RENDER_EVENT, function() {
    const completedBookList = document.getElementById('completeBookshelfList');
    completedBookList.innerHTML = '';

    const uncompletedBookList = document.getElementById('incompleteBookshelfList');
    uncompletedBookList.innerHTML = '';

    for (const bookItem of book) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isCompleted) {
            completedBookList.append(bookElement); 
        } else {
            uncompletedBookList.append(bookElement); 
        }
    }
});