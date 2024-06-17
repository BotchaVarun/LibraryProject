function change(){
   const val=document.querySelector('.book-domain').value;
   console.log(val);
   if(val==="Books")
    {
        fetchtaken();
    }
    else if(val=="Magazine")
    {
        fetchmagazine()
    }
    else if(val==="Comics")
        {
            fetchcomic()
        }
}

function fetchtaken() {
    const note = document.querySelector('.note');
    const mag = document.querySelector('.mag');
    const com = document.querySelector('.com');
    note.style.display = "block";
    mag.style.display = "none";
    com.style.display = "none";
    fetch('http://localhost:3002/takenbooks')
    .then(response => response.json())
    .then(data => {
        const booksDiv = document.querySelector('.note');
        booksDiv.innerHTML = '';
        data.forEach(book => {
            const bookElement = createBookElement(book);
            booksDiv.appendChild(bookElement);
        });
        addBorrowButtonEvents();
    })
    .catch(error => {
        console.error('Error fetching books:', error);
    });
}

const createBookElement = (book) => {
    const bookElement = document.createElement('div');
    const imageUrl = book.image && book.image.data && book.image.contentType ? 
        `data:${book.image.contentType};base64,${book.image.data}` : 
        'placeholder.jpg';
    const dueDate = new Date(book.date);
    dueDate.setDate(dueDate.getDate() + 5);
    const formattedDueDate = dueDate.toDateString();
    bookElement.innerHTML = `
        <div class="data">
            <img src="${imageUrl}" alt="${book.name}" style="width: 100px; height: auto;">
            <ul class="ul-one">
                <li><h3>${book.name}</h3></li>
                <hr>
                <li>Author: ${book.author}</li>
                <hr>
                <li>Price: ${book.price}</li>
            </ul>
            <ul class="ul-two">
                <li style="font-size:12px;">Description: ${book.desc}</li>
                <hr>
                <li style="color:red;">Due Date: ${formattedDueDate}</li>
                <li style="color:#000; cursor:pointer; font-family: Montserrat, sans-serif; font-weight: 500;" class="borrow-button" data-id="${book._id}">
                  <button class="borrow-btn">${book.status === 'taken' ? 'Return' : 'Borrow'}</button>
                </li>
            </ul>
        </div>
    `;
    return bookElement;
};
const addBorrowButtonEvents = () => {
    const borrowButtons = document.querySelectorAll('.borrow-btn');
    borrowButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const buttonElement = event.target;
            const bookElement = buttonElement.closest('.borrow-button');
            const bookId = bookElement.getAttribute('data-id');
            const currentStatus = buttonElement.innerText.toLowerCase() === 'borrow' ? 'available' : 'taken';
            const newStatus = currentStatus === 'available' ? 'taken' : 'available';

            fetch(`http://localhost:3002/books/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    if (newStatus === 'taken') {
                        buttonElement.innerText = 'Return';
                        buttonElement.style.backgroundColor = 'red';
                    } else {
                        buttonElement.innerText = 'Borrow';
                        buttonElement.style.backgroundColor = '';
                    }
                    bookElement.previousElementSibling.querySelector('li:nth-child(5)').innerText = `Status: ${newStatus}`;
                }
            })
            .catch(error => {
                console.error('Error updating book status:', error);
            });
        });
    });
};
function fetchmagazine() {
    console.log("called")
    const note=document.querySelector('.note');
    const mag=document.querySelector('.mag');
    const com=document.querySelector('.com');
    note.style.display="none";
    mag.style.display="block";
    com.style.display="none";
    fetch('http://localhost:3002/takenmagazine')
    .then(response => response.json())
    .then(data => {
        const booksDiv = document.querySelector('.mag');
        booksDiv.innerHTML = '';
        data.forEach(book => {
            const bookElement = createmagElement(book);
            booksDiv.appendChild(bookElement);
        });
        addBorrowMagazineEvents();
    })
    .catch(error => {
        console.error('Error fetching books:', error);
    });
}

const createmagElement = (book) => {
    const bookElement = document.createElement('div');
    const imageUrl = book.image && book.image.data && book.image.contentType ? 
        `data:${book.image.contentType};base64,${book.image.data}` : 
        'placeholder.jpg';
    const dueDate = new Date(book.date);
    dueDate.setDate(dueDate.getDate() + 5);
    const formattedDueDate = dueDate.toDateString();
    bookElement.innerHTML = `
        <div class="data">
            <img src="${imageUrl}" alt="${book.name}" style="width: 100px; height: auto;">
            <ul class="ul-one">
                <li><h3>${book.name}</h3></li>
                <hr>
                <li>Author: ${book.author}</li>
                <hr>
                <li>Price: ${book.price}</li>
            </ul>
            <ul class="ul-two">
                <li style="font-size:12px;">Description: ${book.desc}</li>
                <hr>
                 <li style="color:red;">Due Date: ${formattedDueDate}</li>
                <li style="color:#000; cursor:pointer; font-family: Montserrat, sans-serif; font-weight: 500;" class="borrow-button" data-id="${book._id}">
                  <button class="borrow-btn">${book.status === 'taken' ? 'Return' : 'Borrow'}</button>
                </li>
            </ul>
        </div>
    `;
    return bookElement;
};
const addBorrowMagazineEvents = () => {
    const borrowButtons = document.querySelectorAll('.borrow-btn');
    borrowButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const buttonElement = event.target;
            const bookElement = buttonElement.closest('.borrow-button');
            const bookId = bookElement.getAttribute('data-id');
            const currentStatus = buttonElement.innerText.toLowerCase() === 'borrow' ? 'available' : 'taken';
            const newStatus = currentStatus === 'available' ? 'taken' : 'available';

            fetch(`http://localhost:3002/magazine/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    if (newStatus === 'taken') {
                        buttonElement.innerText = 'Return';
                        buttonElement.style.backgroundColor = 'red';
                    } else {
                        buttonElement.innerText = 'Borrow';
                        buttonElement.style.backgroundColor = '';
                    }
                    bookElement.previousElementSibling.querySelector('li:nth-child(5)').innerText = `Status: ${newStatus}`;
                }
            })
            .catch(error => {
                console.error('Error updating book status:', error);
            });
        });
    });
};

function fetchcomic() {
    const note=document.querySelector('.note');
    const mag=document.querySelector('.mag');
    const com=document.querySelector('.com');
    note.style.display="none";
    mag.style.display="none";
    com.style.display="block";
    fetch('http://localhost:3002/takencomic')
    .then(response => response.json())
    .then(data => {
        const booksDiv = document.querySelector('.com');
        booksDiv.innerHTML = '';
        data.forEach(book => {
            const bookElement = createcomicElement(book);
            booksDiv.appendChild(bookElement);
        });
        addBorrowComicEvents();
    })
    .catch(error => {
        console.error('Error fetching books:', error);
    });
}

const createcomicElement = (book) => {
    const bookElement = document.createElement('div');
    const imageUrl = book.image && book.image.data && book.image.contentType ? 
        `data:${book.image.contentType};base64,${book.image.data}` : 
        'placeholder.jpg';
    const dueDate = new Date(book.date);
    dueDate.setDate(dueDate.getDate() + 5);
    const formattedDueDate = dueDate.toDateString();
    bookElement.innerHTML = `
        <div class="data">
            <img src="${imageUrl}" alt="${book.name}" style="width: 100px; height: auto;">
            <ul class="ul-one">
                <li><h3>${book.name}</h3></li>
                <hr>
                <li>Author: ${book.author}</li>
                <hr>
                <li>Price: ${book.price}</li>
            </ul>
            <ul class="ul-two">
                <li style="font-size:12px;">Description: ${book.desc}</li>
                <hr>
                 <li style="color:red;">Due Date: ${formattedDueDate}</li>    
                <li style="color:#000; cursor:pointer; font-family: Montserrat, sans-serif; font-weight: 500;" class="borrow-button" data-id="${book._id}">
                  <button class="borrow-btn">${book.status === 'taken' ? 'Return' : 'Borrow'}</button>
                </li>
            </ul>
        </div>
    `;
    return bookElement;
};
const addBorrowComicEvents = () => {
    const borrowButtons = document.querySelectorAll('.borrow-btn');
    borrowButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const buttonElement = event.target;
            const bookElement = buttonElement.closest('.borrow-button');
            const bookId = bookElement.getAttribute('data-id');
            const currentStatus = buttonElement.innerText.toLowerCase() === 'borrow' ? 'available' : 'taken';
            const newStatus = currentStatus === 'available' ? 'taken' : 'available';

            fetch(`http://localhost:3002/comic/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    if (newStatus === 'taken') {
                        buttonElement.innerText = 'Return';
                        buttonElement.style.backgroundColor = 'red';
                    } else {
                        buttonElement.innerText = 'Borrow';
                        buttonElement.style.backgroundColor = '';
                    }
                    bookElement.previousElementSibling.querySelector('li:nth-child(5)').innerText = `Status: ${newStatus}`;
                }
            })
            .catch(error => {
                console.error('Error updating book status:', error);
            });
        });
    });
};

    document.addEventListener('DOMContentLoaded', fetchtaken);
