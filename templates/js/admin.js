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
    const bar1 = document.querySelector('.bar1');
    const bar2 = document.querySelector('.bar2');
    const bar3 = document.querySelector('.bar3');
    const bar4 = document.querySelector('.bar4');
    const book = document.querySelector('#bar1');
    const magazine = document.querySelector('#bar2');
    const news = document.querySelector('#bar3');
    const users = document.querySelector('#bar4');
    const notesContainer = document.querySelector('.notes');
    const magazineContainer = document.querySelector('.magazine');
    const comicsContainer = document.querySelector('.comics');
    const usersContainer=document.querySelector('.user-panel');
    const booksDiv = document.querySelector('.available');
    const bookdomain = document.querySelector('.book-domain');
    const magdomain = document.querySelector('.magdomain');
    const comicdomain = document.querySelector('.comicdomain');
    const userdomain=document.querySelector('.user-panel');
    // Adjusting UI elements for book view
    bookdomain.style.display = 'block';
    magdomain.style.display = 'none';
    comicdomain.style.display = 'none';
    userdomain.style.display='none';
    notesContainer.style.display = 'block';
    magazineContainer.style.display = 'none';
    comicsContainer.style.display = 'none';
    usersContainer.style.display='none';
    // Adjusting active classes for navigation bars
    bar1.classList.add('bars1');
    bar2.classList.remove('bars2');
    bar3.classList.remove('bars3');
    bar4.classList.remove('bars4');
    book.classList.add('color');
    magazine.classList.remove('color');
    news.classList.remove('color');
    users.classList.remove('color');

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

                // Add event listener for delete buttons
                booksDiv.querySelectorAll('.delete-button').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const bookId = event.target.getAttribute('data-id');
                        deleteBook(bookId, event);
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching books:', error);
            });
    };

    // Helper function to create book HTML element
    const createBookElement = (book) => {
        const bookElement = document.createElement('div');

        let imageUrl = 'placeholder.jpg'; // Fallback image
        if (book.image && book.image.data && book.image.contentType) {
            imageUrl = `data:${book.image.contentType};base64,${book.image.data}`;
        }

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
                    <li style="color:#000;cursor:pointer; font-family: Montserrat, sans-serif;font-optical-sizing: auto;font-weight: 500;font-style: normal;color:#fff;" class="delete-button"  data-id="${book._id}">
                        <i class="fa-solid fa-trash fa-bounce delete-button" style="color:rgb(121, 121, 121);width:20px; height:20px;color:#fff;"></i>Delete
                    </li>
                </ul>
            </div>
        `;

        return bookElement;
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

    // Event listener for delete buttons using event delegation
    booksDiv.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-button')) {
            const bookId = event.target.getAttribute('data-id');
            deleteBook(bookId, event);
        }
    });
}


function magazines() {
    const bar1 = document.querySelector('.bar1');
    const bar2 = document.querySelector('.bar2');
    const bar3 = document.querySelector('.bar3');
    const bar4 = document.querySelector('.bar4');
    const book = document.querySelector('#bar1');
    const magazine = document.querySelector('#bar2');
    const news = document.querySelector('#bar3');
    const users = document.querySelector('#bar4');
    const notesContainer = document.querySelector('.notes');
    const magazineContainer = document.querySelector('.magazine');
    const comicsContainer = document.querySelector('.comics');
    const usersContainer=document.querySelector('.users');
    const booksDiv = document.querySelector('.available');
    const bookdomain = document.querySelector('.book-domain');
    const magdomain = document.querySelector('.magdomain');
    const comicdomain = document.querySelector('.comicdomain');
    const userdomain=document.querySelector('.user-panel');

    // Adjusting UI elements for magazine view
    bookdomain.style.display = 'none';
    magdomain.style.display = 'block';
    comicdomain.style.display = 'none';
    userdomain.style.display='none';
    notesContainer.style.display = 'none';
    magazineContainer.style.display = 'block';
    comicsContainer.style.display = 'none';
    usersContainer.style.display='none';
    // Adjusting active classes for navigation bars
    bar1.classList.remove('bars1');
    bar2.classList.add('bars2');
    bar3.classList.remove('bars3');
    bar4.classList.remove('bars4');
    book.classList.remove('color');
    magazine.classList.add('color');
    news.classList.remove('color');
    users.classList.remove('color');

    // Function to fetch magazines based on selected domain
    const fetchMagazines = (domain) => {
        fetch(`http://localhost:3002/magazine?domain=${domain}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                booksDiv.innerHTML = '';

                data.forEach(magazine => {
                    const magazineElement = createMagazineElement(magazine);
                    booksDiv.appendChild(magazineElement);
                });

                // Add event listeners for delete buttons after adding magazines
                addDeleteButtonListeners();
            })
            .catch(error => {
                console.error('Error fetching magazines:', error);
            });
    };

    // Helper function to create magazine HTML element
    const createMagazineElement = (magazine) => {
        const magazineElement = document.createElement('div');

        let imageUrl = 'placeholder.jpg'; // Fallback image
        if (magazine.image && magazine.image.data && magazine.image.contentType) {
            imageUrl = `data:${magazine.image.contentType};base64,${magazine.image.data}`;
        }

        magazineElement.innerHTML = `
            <div class="data">
                <img src="${imageUrl}" alt="${magazine.name}" style="width: 100px; height: auto; ">
                <ul class="ul-one">
                    <li><h3>${magazine.name}</h3></li>
                    <hr>
                    <li>Author: ${magazine.author}</li>
                    <hr>
                    <li>Price: ${magazine.price}</li>
                </ul>
                <ul class="ul-two">
                    <li style="font-size:10px;">Description: ${magazine.desc}</li>
                    <hr>
                    <li>Status: ${magazine.status}</li>
                    <li style="color:#000;cursor:pointer; font-family: Montserrat, sans-serif;font-optical-sizing: auto;font-weight: 500;font-style: normal;color:#fff;" class="delete-button" data-id="${magazine._id}">
                        <i class="fa-solid fa-trash fa-bounce delete-button" style="color:rgb(121, 121, 121);width:20px; height:20px;color:#fff"></i>Delete
                    </li>
                </ul>
            </div>
        `;

        return magazineElement;
    };

    // Function to add event listeners for delete buttons
    const addDeleteButtonListeners = () => {
        booksDiv.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const magazineId = event.target.getAttribute('data-id');
                deleteMagazine(magazineId, event);
            });
        });
    };

    // Event listener for magazine domain selection change
    magdomain.addEventListener('change', () => {
        const selectedDomain = magdomain.value;
        console.log("Selected domain:", selectedDomain);
        fetchMagazines(selectedDomain);
    });

    // Initial fetch of magazines based on initial domain selection
    const initialDomain = magdomain.value;
    fetchMagazines(initialDomain);
}

function deleteBook(bookId, event) {
    console.log(bookId);
    fetch(`http://localhost:3002/deletebook/${bookId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        // Remove the deleted book element from DOM
        event.target.closest('.data').remove();
    })
    .catch(error => {
        console.error('Error deleting book:', error);
    });
}

function deleteMagazine(magazineId, event) {
    console.log('Magazine ID:', magazineId); // Check the value of magazineId
    fetch(`http://localhost:3002/deletemag/${magazineId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        // Remove the deleted magazine element from DOM
        event.target.closest('.data').remove();
    })
    .catch(error => {
        console.error('Error deleting magazine:', error);
    });
}
function comic() {
    const bar1 = document.querySelector('.bar1');
    const bar2 = document.querySelector('.bar2');
    const bar3 = document.querySelector('.bar3');
    const bar4 = document.querySelector('.bar4');
    const book = document.querySelector('#bar1');
    const magazine = document.querySelector('#bar2');
    const news = document.querySelector('#bar3');
    const users = document.querySelector('#bar4');
    const notesContainer = document.querySelector('.notes');
    const magazineContainer = document.querySelector('.magazine');
    const comicsContainer = document.querySelector('.comics');
    const usersContainer=document.querySelector('.users');
    const booksDiv = document.querySelector('.available');
    const bookdomain = document.querySelector('.book-domain');
    const magdomain = document.querySelector('.magdomain');
    const comicdomain = document.querySelector('.comicdomain');
    const userdomain=document.querySelector('.user-panel');
    bookdomain.style.display = 'none';
    magdomain.style.display = 'none';
    comicdomain.style.display = 'block';
    userdomain.style.display = 'none';
    
    notesContainer.style.display = 'none';
    magazineContainer.style.display = 'none';
    comicsContainer.style.display = 'block';
    usersContainer.style.display='none';
    bar1.classList.remove('bars1');
    bar2.classList.remove('bars2');
    bar3.classList.add('bars3');
    bar4.classList.remove('bars4');
    book.classList.remove('color');
    magazine.classList.remove('color');
    news.classList.add('color');
    users.classList.remove('color');

    // Function to fetch comics based on selected domain
    const fetchComics = (domain) => {
        fetch(`http://localhost:3002/comic?domain=${domain}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                booksDiv.innerHTML = '';

                data.forEach(book => {
                    const bookElement = document.createElement('div');

                    let imageUrl = 'placeholder.jpg'; // Fallback image
                    if (book.image && book.image.data && book.image.contentType) {
                        imageUrl = `data:${book.image.contentType};base64,${book.image.data}`;
                    }

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
                                <li style="font-size:11px;">Description: ${book.desc}</li>
                                <hr>
                                <li>Status: ${book.status}</li>   
                                <li style="color:#000;cursor:pointer; font-family: Montserrat, sans-serif;font-optical-sizing: auto;font-weight: 500;font-style: normal;" class="delete-button" data-id="${book._id}">
                                    <i class="fa-solid fa-trash fa-bounce delete-button" style="color:rgb(121, 121, 121);width:20px; height:20px;color:#fff"></i>Delete
                                </li>
                            </ul>
                        </div>
                    `;

                    bookElement.querySelector('.delete-button').addEventListener('click', (event) => {
                        const comicId = event.target.getAttribute('data-id');
                        deleteComic(comicId, event);
                    });

                    booksDiv.appendChild(bookElement);
                });
            })
            .catch(error => {
                console.error('Error fetching comics:', error);
            });
    };

    // Event listener for comic domain selection change
    comicdomain.addEventListener('change', () => {
        const selectedDomain = comicdomain.value;
        console.log("Selected domain:", selectedDomain);
        fetchComics(selectedDomain);
    });

    // Initial fetch based on initial domain selection
    const initialDomain = comicdomain.value;
    fetchComics(initialDomain);
}

document.addEventListener('DOMContentLoaded', () => {
    const comicdomain = document.querySelector('.comicdomain');
    comicdomain.addEventListener('change', comic);
    comic(); // Initial load
});

function deleteComic(comicId, event) {
    console.log('Comic ID:', comicId); // Check the value of magazineId
    fetch(`http://localhost:3002/deletecom/${comicId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        // Remove the deleted magazine element from DOM
        event.target.closest('.data').remove();
    })
    .catch(error => {
        console.error('Error deleting comic:', error);
    });
}
async function users() {
    const bar1 = document.querySelector('.bar1');
    const bar2 = document.querySelector('.bar2');
    const bar3 = document.querySelector('.bar3');
    const bar4 = document.querySelector('.bar4');
    const book = document.querySelector('#bar1');
    const magazine = document.querySelector('#bar2');
    const news = document.querySelector('#bar3');
    const users = document.querySelector('#bar4');
    const notesContainer = document.querySelector('.notes');
    const magazineContainer = document.querySelector('.magazine');
    const comicsContainer = document.querySelector('.comics');
    const usersContainer = document.querySelector('.users');
    const bookdomain = document.querySelector('.book-domain');
    const magdomain = document.querySelector('.magdomain');
    const comicdomain = document.querySelector('.comicdomain');
    const userdomain = document.querySelector('.user-panel');
    const itemsContainer = document.querySelector('.available'); // Container for books, magazines, comics

    // Hide unnecessary elements and show user-related elements
    bookdomain.style.display = 'none';
    magdomain.style.display = 'none';
    comicdomain.style.display = 'none';
    userdomain.style.display = 'block';

    notesContainer.style.display = 'none';
    magazineContainer.style.display = 'none';
    comicsContainer.style.display = 'none';
    usersContainer.style.display = 'block';

    // Adjust classes for styling (assuming this is for navigation or UI state)
    bar1.classList.remove('bars1');
    bar2.classList.remove('bars2');
    bar3.classList.remove('bars3');
    bar4.classList.add('bars4');
    book.classList.remove('color');
    magazine.classList.remove('color');
    news.classList.remove('color');
    users.classList.add('color');
    itemsContainer.innerHTML = ''; // Clear previous items

    try {
        // Fetch user data from backend
        const response = await fetch('http://localhost:3002/users');
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();

        // Clear previous user options in dropdown
        userdomain.innerHTML = '<option value="">Select a user</option>';

        // Populate the dropdown with user options
        userData.forEach(user => {
            const userOption = document.createElement('option');
            userOption.value = user.id;
            userOption.textContent = user.name;
            userdomain.appendChild(userOption);
        });

        // Event listener for user selection
        userdomain.addEventListener('change', async (event) => {
            const userId = event.target.value;
            if (userId) {
                try {
                    // Fetch items (books, magazines, comics) borrowed by the selected user
                    const itemsResponse = await fetch(`http://localhost:3002/users/${userId}/items`);
                    if (!itemsResponse.ok) {
                        throw new Error('Failed to fetch items data');
                    }
                    const contentType = itemsResponse.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                        throw new Error('Invalid content type. Expected application/json');
                    }
                    const itemsData = await itemsResponse.json();
                    console.log(itemsData)
                    // Determine if itemsData has userEmail and items array
                    let itemsArray = [];
            // Check if itemsData is an object with userEmail and items/books array
            if (itemsData.userEmail && Array.isArray(itemsData.books || itemsData.items)) {
                itemsArray = itemsData.books || itemsData.items;
                console.log(itemsArray)
            } else if (Array.isArray(itemsData)) {
                itemsArray = itemsData; // Directly use itemsData as array
            } else {
                throw new Error('Invalid items data received');
            }

                    // Clear previous item elements
                    itemsContainer.innerHTML = '';

                    // Display each item in the items container
                    itemsArray.forEach(item => {
                        // Create elements for item data
                        const itemElement = document.createElement('div');
                        itemElement.classList.add('item');

                        // Set up image URL (fallback to a placeholder if no image)
                        let imageUrl = 'placeholder.jpg';
                        if (item.image && item.image.data && item.image.contentType) {
                            imageUrl = `data:${item.image.contentType};base64,${item.image.data}`;
                        }
                        const dueDate = new Date(item.date);
                        dueDate.setDate(dueDate.getDate() + 5);
                        const formattedDueDate = dueDate.toDateString();
                        // Populate itemElement with item data
                        itemElement.innerHTML = `
                            <div class="data">
                                <img src="${imageUrl}" alt="${item.name}" style="width: 100px; height: auto;">
                                <ul class="ul-one">
                                    <li><h3>${item.name}</h3></li>
                                    <hr>
                                    <li>Author: ${item.author}</li>
                                    <hr>
                                    <li>Type: ${item.type}</li>
                                </ul>
                                <ul class="ul-two">
                                    <li style="font-size:11px;">Description: ${item.desc}</li>
                                    <hr>
                                    <li style="color:red;">Due Date: ${formattedDueDate}</li>    
                                    <li style="color:#000;cursor:pointer; font-family: Montserrat, sans-serif;font-optical-sizing: auto;font-weight: 500;font-style: normal;color:#fff;" data-id="${item._id}">
                                        <a href="mailto:${itemsData.userEmail}?subject=Request%20for%20Returning Item&body=Dear%20[${itemsData.userName}],%0A%0AI%20hope%20this%20message%20finds%20you%20well.%20I%20am%20writing%20to%20request%20the%20Returning%20Book%20of%20the%20following%20item%20from%20our%20system:%0A%0A-Item%20Name:%20${item.name}%0A%0ACould%20you%20please%20assist%20in%20promptly%20removing%20this%20item%20entry%20from%20our%20records?%0A%0AThank%20you%20for%20your%20attention%20to%20this%20request.%20Please%20let%20me%20know%20if%20you%20require%20any%20further%20information.%0A%0ABest%20regards,%0A[Your%20Name]" style="text-decoration:none; color:black;">Send Email</a>
                                    </li>
                                </ul>
                            </div>
                        `;

                        // Append itemElement to items container
                        itemsContainer.appendChild(itemElement);
                    });
                } catch (error) {
                    console.error('Error fetching items data:', error);
                    // Handle error, e.g., display an error message to the user
                }
            }
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error, e.g., display an error message to the user
    }
}





function nope()
{
    const container=document.querySelector('.add');
    const book=document.querySelector('.notes');
    container.style.display='none';
}
function fun()
{
    const container=document.querySelector('.add');
    const book=document.querySelector('.notes');
    container.style.display='block';
}

function insertBook() {
    const fileInput = document.getElementById('file');
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('name', document.getElementById('book-name').value);
    formData.append('author', document.getElementById('author-name').value);
    formData.append('desc', document.getElementById('desc').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('domain', document.getElementById('domain').value);
     
    fetch('http://localhost:3002/addbook', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .then(nope())
    .catch(error => console.error('Error:', error));
}
function insertComic() {
    const fileInput = document.getElementById('comic-file');
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('name', document.getElementById('comic-name').value);
    formData.append('author', document.getElementById('comic-author-name').value);
    formData.append('desc', document.getElementById('comic-desc').value);
    formData.append('price', document.getElementById('comic-price').value);
    formData.append('domain', document.getElementById('comic-domain').value);
     
    fetch('http://localhost:3002/addcomic', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .then(nope())
    .catch(error => console.error('Error:', error));
}

function insertMagazine() {
    // Ensure DOM is fully loaded before accessing elements
        const fileInput = document.getElementById('mag-file');
        // Check if these are correctly fetched
        const bookName = document.getElementById('mag-name').value;
        const authorName = document.getElementById('mag-author-name').value;
        const desc = document.getElementById('mag-desc').value;
        const price = document.getElementById('mag-price').value;
        const domain = document.getElementById('mag-domain').value;
        console.log(authorName);
        // Construct FormData
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        formData.append('name', bookName);
        formData.append('author', authorName);
        formData.append('desc', desc);
        formData.append('price', price);
        formData.append('domain', domain);
        
        console.log(formData); // Check if FormData is constructed correctly
        
            fetch('http://localhost:3002/addmagazine', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .then(nope())
            .catch(error => console.error('Error:', error));
 
}
async function insertUser() {
        

    const name = document.getElementById("username").value;
    const phoneno = document.getElementById("phoneno").value;
    const email = document.getElementById("useremail").value;
    const password = document.getElementById("password").value;
    console.log(email,phoneno,name,password)
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, phoneno, email, password })
    };

    try {
      const res = await fetch("http://localhost:3002/signup", options);

      if (res.status === 201) {
        alert("User created successfully");
        nope();
      } else if (res.status === 409) {
        alert("User with this email already exists");
      } else {
        alert("An error occurred while signing up");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while signing up");
    }
  }
// Function to fetch user details and update the profile
const fetchUserProfile = () => {
    fetch('http://localhost:3002/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
            // You might need to include additional headers for authentication if required
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Update DOM with fetched user details
        document.getElementById('name').textContent = data.name || 'N/A';
        document.getElementById('phone').textContent = data.phone || 'N/A';
        document.getElementById('email').textContent = data.email || 'N/A';
        document.getElementById('role').textContent = data.name==="Admin"? "Admin":"Student" || 'N/A';
    })
    .catch(error => {
        console.error('Error fetching user details:', error);
        // Handle error condition (e.g., display an error message)
    });
};

// Function to logout (you can implement this according to your logout logic)

function logout() {
    fetch('http://localhost:3002/logout', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: "false" })
    }).then(response => {
        if (response.ok) {
            console.log("Logged out successfully");
            window.location.href="/templates/index.html";
        } else {
            console.error("Logout failed");
        }
    }).catch(error => {
        console.error("Error during logout:", error);
    });
}

// Call fetchUserProfile when the page loads or when you need to update user details
document.addEventListener('DOMContentLoaded', fetchUserProfile);
document.addEventListener('DOMContentLoaded', books);