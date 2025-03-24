// Import Firebase SDK modules
console.log(" Firebase Debug Info:");
console.log("Project ID:", firebaseConfig.projectId);
console.log("Auth Domain:", firebaseConfig.authDomain);
console.log("Current Host:", window.location.host);
console.log("Firestore Instance:", db);
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBn7xE-jaEuixzyDROnbHrQo6-YtOR5LaU",
  authDomain: "amusement-park-4039d.firebaseapp.com",
  projectId: "amusement-park-4039d",
  storageBucket: "amusement-park-4039d.appspot.com",
  messagingSenderId: "625618396056",
  appId: "1:625618396056:web:ff2907be3a1958ed9041ed",
  measurementId: "G-6QHBHT0PPE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Debugging to ensure Firebase initialized correctly
console.log("✅ Firebase initialized successfully");



const submit = document.getElementById("submit");
submit.addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent form submission

    // Get email and password values
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Input validation
    if (!email || !password) {
        alert("Email and password cannot be empty");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Invalid email format");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
    }

    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("✅ User created successfully:", user.uid);

        alert("Account created successfully. Redirecting...");

        // Redirect after signup (using a delay for reliability)
        setTimeout(() => {
            window.location.assign("home.html"); // Adjust to your target page
        }, 2000);
        
    } catch (error) {
        console.error("❌ Error creating user:", error.code, error.message);
        alert("Error: " + error.message);
    }
});

