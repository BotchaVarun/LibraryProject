function tog()
{
    const menu_bar=document.querySelector('.menu');
    menu_bar.classList.toggle('increase');
}
function toggled() {
    const account = document.querySelector('.account-profile');
    const overlay = document.querySelector('.overlay');
    account.style.display = 'block';
    overlay.style.display = 'block';
}

function closed() {
    const account = document.querySelector('.account-profile');
    const overlay = document.querySelector('.overlay');
    account.style.display = 'none';
    overlay.style.display = 'none';
}

function books() {
    const booksDiv = document.querySelector('.available');
    const bookdomain = document.querySelector('.book-domain');

    // Function to fetch books based on selected domain
    const fetchBooks = (domain) => {
        fetch(`http://localhost:3002/book?domain=${domain}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                booksDiv.innerHTML = '';
                data.forEach(book => {
                    const bookElement = createBookElement(book);
                    booksDiv.appendChild(bookElement);
                });
                addBorrowButtonEvents(); // Add event listeners after elements are added to DOM
            })
            .catch(error => {
                console.error('Error fetching books:', error);
                booksDiv.innerHTML = '<p>Error fetching books. Please try again later.</p>';
            });
    };

    // Helper function to create book HTML element
    const createBookElement = (book) => {
        const bookElement = document.createElement('div');
        const imageUrl = book.image && book.image.data && book.image.contentType ? 
            `data:${book.image.contentType};base64,${book.image.data}` : 
            'placeholder.jpg';

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
                    <li>Status: ${book.status}</li>
                    <li style="color:#000; cursor:pointer; font-family: Montserrat, sans-serif; font-weight: 500;" class="borrow-button" data-id="${book._id}">
                      <button class="borrow-btn">${book.status === 'taken' ? 'Return' : 'Borrow'}</button>
                    </li>
                </ul>
            </div>
        `;
        return bookElement;
    };

    // Function to add event listeners to borrow buttons
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

    // Event listener for book domain selection change
    bookdomain.addEventListener('change', () => {
        const selectedDomain = bookdomain.value;
        console.log("Selected domain:", selectedDomain);
        fetchBooks(selectedDomain);
    });

    // Initial fetch of books based on initial domain selection
    const initialDomain = bookdomain.value;
    fetchBooks(initialDomain);
}



document.addEventListener('DOMContentLoaded', books);
