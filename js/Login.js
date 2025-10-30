// Initialize Lucide icons
const messageText = document.getElementById('message-text');

// --- Custom Message Function ---
// Replaces alert() with a non-blocking message
function showMessage(message, type = 'error') {
    messageText.textContent = message; 
        
    // Apply styles based on type (green for success, red for error)
    if (type === 'success') {
        messageBox.className = messageBox.className.replace(/bg-\w+-\d+/, 'bg-green-500');
    } else { // error
        messageBox.className = messageBox.className.replace(/bg-\w+-\d+/, 'bg-red-500');
    }
        
    // Animate the message box in (make it slide down and fade in)
    messageBox.classList.remove('opacity-0', '-translate-y-10');
    messageBox.classList.add('opacity-100', 'translate-y-0');

    // Animate out after 3 seconds
    setTimeout(() => {
        messageBox.classList.remove('opacity-100', 'translate-y-0');
        messageBox.classList.add('opacity-0', '-translate-y-10');
    }, 3000);
}

// --- REAL API Login Function ---
// This function now makes a real network request
async function apiLogin(email, password) {
    // !!! REPLACE THIS with your actual backend login URL
    const API_URL = 'https://your-backend-api.com/login'; 

    // Show loading state
    loginButton.disabled = true;
    loginButtonText.innerHTML = '<div class="spinner"></div>';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        // Restore button
        loginButton.disabled = false;
        loginButtonText.innerHTML = 'Log in';

        if (!response.ok) {
            // Try to get error message from server body, or use default
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Invalid email or password.');
        }

        // --- Success ---
        // Your server will probably send back a 'token'
        const data = await response.json(); 
        // You would save this token, e.g., in localStorage
        // localStorage.setItem('authToken', data.token); 

        return { success: true, message: 'Login successful! Redirecting...' };

    } catch (error) {
        // Restore button even if there's an error
        loginButton.disabled = false;
        loginButtonText.innerHTML = 'Log in';
            
        // This will catch network errors or the error we threw above
        throw new Error(error.message);
    }
}