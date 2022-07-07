const listBook          = [];
const RENDER_BOOK       = 'render-listBook';
document.getElementById('insert-book').style.display        = 'none';
document.getElementById('list-read-book').style.display     = 'flex';
document.getElementById('list-unread-book').style.display   = 'none';
document.getElementById('edit-book').style.display          = 'none';
function readBook() {
    document.getElementById('insert-book').style.display        = 'none';
    document.getElementById('list-read-book').style.display     = 'flex';
    document.getElementById('list-unread-book').style.display   = 'none';
    document.getElementById('edit-book').style.display          = 'none';
}
function unreadBook() {
    document.getElementById('insert-book').style.display        = 'none';
    document.getElementById('list-read-book').style.display     = 'none';
    document.getElementById('list-unread-book').style.display   = 'flex';
    document.getElementById('edit-book').style.display          = 'none';
}
function editBook() {
    document.getElementById('insert-book').style.display        = 'none';
    document.getElementById('edit-book').style.display          = 'flex';
}
function Batal() {
    document.getElementById('insert-book').style.display        = 'flex';
    document.getElementById('edit-book').style.display          = 'none';
}
function tambahBuku() {
    document.getElementById('insert-book').style.display        = 'flex';
    document.getElementById('edit-book').style.display          = 'none';
}

function getAll(){
    const daftarBuku    = localStorage.getItem('books');
    if (daftarBuku == '') return [];
    return daftarBuku   == null ? [] : JSON.parse(daftarBuku)
}

function renderBook(books = null) {
    books             = books == null ? getAll() : books;
    const unRead            = document.getElementById('unread');
    unRead.innerHTML        = '';

    const alreadyRead       = document.getElementById('alreadyRead');
    alreadyRead.innerHTML   = '';
    books.forEach(book => {
        const mkList    = makeList(book);
        if (book.isComplete == false) {
            unRead.append(mkList);
        }else{
            alreadyRead.append(mkList);
        }
    })
}
document.addEventListener(RENDER_BOOK, function(){
    renderBook();
});

document.addEventListener('DOMContentLoaded', function () {
    document.dispatchEvent(new Event(RENDER_BOOK));
    const submitForm    = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    });
});

function addBook() {
    const bookTitle     = document.getElementById('inputBookTitle').value;
    const author        = document.getElementById('inputBookAuthor').value;
    const year          = document.getElementById('inputBookYear').value;
    const id            = generatedId();
    var isComplete      = document.getElementById('inputBookIsComplete').checked;
    const ListBook      = generateListBook(id, bookTitle, author, year, isComplete);
    const daftarBuku    = getAll();
    daftarBuku.push(ListBook);

    localStorage.setItem('books', JSON.stringify(daftarBuku));

    document.getElementById('inputBookTitle').value         = '';
    document.getElementById('inputBookAuthor').value        = '';
    document.getElementById('inputBookYear').value          = '';
    document.getElementById('inputBookIsComplete').checked  = false;
    document.dispatchEvent(new Event(RENDER_BOOK));
};

function generatedId() {
    return +new Date();
}

function generateListBook(id, title, author, year, isComplete ){
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
};

function makeList(ListBook) {
    const bookTitle         = document.createElement('h3');
    bookTitle.innerText     = ListBook.title;

    const author            = document.createElement('p');
    author.innerText        = 'Penulis : '+ListBook.author;

    const year              = document.createElement('p');
    year.innerText          = 'Tahun Terbit : '+ListBook.year;

    const listContainer     = document.createElement('div')
    listContainer.classList.add('inner');
    listContainer.append(bookTitle, author, year);

    const container         = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(listContainer);
    container.setAttribute('id', `list-book-${ListBook.id}`);

    if (ListBook.isComplete == true) {
        const editButton    = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.setAttribute('onclick', `editBook(${ListBook.id})`);
        editButton.dataset.idBook = ListBook.id;

        const undoButton    = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.dataset.idBook = ListBook.id;
        
        const removeButton    = document.createElement('button');
        removeButton.classList.add('remove-button');
        removeButton.dataset.idBook = ListBook.id;
        
        container.append(undoButton, removeButton, editButton);
    }else{
        const editButton    = document.createElement('button');
        editButton.setAttribute('onclick', `editBook(${ListBook.id})`);
        editButton.classList.add('edit-button');
        editButton.dataset.idBook = ListBook.id;

        const checkButton    = document.createElement('button');
        checkButton.classList.add('check-button');
        checkButton.dataset.idBook = ListBook.id;
        
        const removeButton    = document.createElement('button');
        removeButton.classList.add('remove-button');
        removeButton.dataset.idBook = ListBook.id;

        container.append(checkButton, removeButton, editButton);
    }
    return container;
}

function moveUnreadToRead(ListBookId) {
    const daftarBuku    = getAll();
    const dataBuku      = daftarBuku.find(item  => item.id == ListBookId);
    if (dataBuku) {
        Object.assign(dataBuku, {
            'id'            : ListBookId,
            'title'         : dataBuku.title,
            'author'        : dataBuku.author,
            'year'          : dataBuku.year,
            'isComplete'    : true
        })
    }
    localStorage.setItem('books', JSON.stringify(daftarBuku));
    document.dispatchEvent(new Event(RENDER_BOOK));
}

function undoReadToUnread(ListBookId){
    const daftarBuku    = this.getAll();
    const dataBuku      = daftarBuku.find(item => item.id == ListBookId);
    if (dataBuku) {
        Object.assign(dataBuku, {
            'id'        : ListBookId,
            'title'     : dataBuku.title,
            'author'    : dataBuku.author,
            'year'      : dataBuku.year,
            'isComplete': false
        })
    }
    localStorage.setItem('books', JSON.stringify(daftarBuku));
    document.dispatchEvent(new Event(RENDER_BOOK));
}

function findListBook(ListBookId){
    const daftarBuku    = this.getAll();
    for (const ListBookItem of listBook){
        if (ListBookItem.id === ListBookId){
            return ListBookItem
        }
    }
    return null;
}

document.querySelector('main').addEventListener('click', function(e) {
    const idBook    = e.target.dataset.idBook;
    if(e.target.className == 'check-button'){
        let confirmation = confirm('Yakin ingin memindah data ke sudah dibaca?'); 
        if(confirmation){
            moveUnreadToRead(idBook); 
        }else{
            return '';
        }
    }else if(e.target.className == 'undo-button'){  
        let confirmation = confirm('Yakin ingin memindah data ke belum dibaca?'); 
        if(confirmation){
            undoReadToUnread(idBook); 
        }else {
            return '';
        }
    }else if(e.target.className == 'remove-button'){
        let confirmation = confirm('Yakin ingin menghapus data');
        if(confirmation) {
            RemoveBookFromList(idBook); 
        }else{
            return '';
        }
    }else if(e.target.className == 'edit-button'){
        EditBookFromList(idBook); 
    }
})

function RemoveBookFromList(ListBookId){
    const daftarBuku      = this.getAll(); 
    const newList         = daftarBuku.filter(item => item.id != ListBookId);
    localStorage.setItem('books', JSON.stringify(newList));
    document.dispatchEvent(new Event(RENDER_BOOK));
}

function EditBookFromList(ListBookId){
    const daftarBuku      = this.getAll(); 
    const dataBuku        = daftarBuku.find(item => item.id == ListBookId );
    console.log(dataBuku);
    document.getElementById('editIdBook').value             = dataBuku.id;
    document.getElementById('editBookTitle').value          = dataBuku.title;
    document.getElementById('editBookAuthor').value         = dataBuku.author;
    document.getElementById('editBookYear').value           = dataBuku.year;
    document.getElementById('editBookIsComplete').checked   = dataBuku.isComplete;
    const editBook  = document.getElementById('editBook')
    editBook.addEventListener('submit', function(event){
        event.preventDefault();
        getDataForm(editBook, ListBookId)
    })
}

function getDataForm(form, ListBookId) {
    const daftarBuku    = this.getAll(); 
    const dataBuku      = daftarBuku.find(item => item.id == ListBookId);
    const data          = {}
    const forms         = new FormData(form)
    for (var i of forms.entries()) {
        data[i[0]] = i[1]
    }
    if (dataBuku) {
        Object.assign(dataBuku, {
            'id'        : ListBookId,
            'title'     : data.title,
            'author'    : data.author,
            'year'      : data.year,
            'isComplete': data.isComplete == 'on'
        })
    }
    localStorage.setItem('books', JSON.stringify(daftarBuku));
    document.dispatchEvent(new Event(RENDER_BOOK));
}

function searchFunction(value) {
    const dataArray = getAll();
    const dataFilter = dataArray.filter(data => {
        return data.title.toLowerCase().includes(value.toLowerCase()) || data.year.toLowerCase().includes(value.toLowerCase())
    })
    return renderBook(dataFilter);
}