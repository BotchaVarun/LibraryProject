// Determine the base URL based on the environment
const apiBaseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3002' : 'https://library-project-tau.vercel.app/api';

async function myFunction() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    console.log(email, password);
    
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        }),
    };
  
    try {
        const res = await fetch(`${apiBaseUrl}/signin`, options);
        if (res.status === 200) {
            alert("Sign in successfully");
            if (email === "varunbotcha@gmail.com" && password === "1234") {
                window.location.href = "/templates/admin.html";
            } else {
                window.location.href = "/templates/student.html";
            }
        } else {
            alert("Invalid credentials");
            return;
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function submit() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        }),
    };
  
    try {
        const res = await fetch(`${apiBaseUrl}/signup`, options);
        if (res.ok) {
            console.log("Account created successfully");
            window.location.href = '/templates/sigin.html';
        } else {
            console.log("Failed to create account");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
