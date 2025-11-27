/* JavaScript for Password Toggle AND Form Submission */
    document.addEventListener('DOMContentLoaded', function () {
        // --- Initialize Lucide Icons ---
        lucide.createIcons();

        // --- Password Toggle Logic ---
        const passwordInput = document.getElementById('password');
        const togglePasswordButton = document.getElementById('togglePassword');
        const eyeOpenIcon = document.getElementById('eyeOpenIcon');
        const eyeClosedIcon = document.getElementById('eyeClosedIcon');

        if (togglePasswordButton && passwordInput && eyeOpenIcon && eyeClosedIcon) {
            togglePasswordButton.addEventListener('click', function () {
                // Toggle the type
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);

                // Toggle the icon visibility
                eyeOpenIcon.classList.toggle('hidden');
                eyeClosedIcon.classList.toggle('hidden');
            });
        }

        // --- Real App Login Form Logic ---
        const loginForm = document.getElementById('login-form');
        const loginButton = document.getElementById('login-button');
        const loginButtonText = document.getElementById('login-button-text');
        const loginSpinner = document.getElementById('login-spinner');
        const loginMessage = document.getElementById('login-message');
        const emailInput = document.getElementById('email');

        if (loginForm) {
            loginForm.addEventListener('submit', function (event) {
                event.preventDefault(); // Prevent the form from reloading the page
                
                // Get data from form
                const email = emailInput.value;
                const password = passwordInput.value;

                // Clear previous messages
                loginMessage.textContent = '';
                loginMessage.classList.remove('text-red-600', 'text-green-600');

                // Show loading state
                loginButtonText.classList.add('hidden');
                loginSpinner.classList.remove('hidden');
                loginButton.disabled = true;

                // --- SIMULATE BACKEND FETCH ---
                // In a real app, this is where you'd use fetch()
                // fetch('/api/login', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ email: email, password: password })
                // })
                // .then(response => response.json())
                // .then(data => { ... handle success or error ... })
                
                console.log("Simulating backend call with:", { email, password });
                
                setTimeout(() => {
                    // Simulate a successful login
                    if (email === "test@example.com" && password === "password") {
                        loginMessage.textContent = 'Login Successful! Redirecting...';
                        loginMessage.classList.add('text-green-600');
                        
                        // You could redirect here
                        // window.location.href = "/dashboard";

                    } else {
                        // Simulate an error
                        loginMessage.textContent = 'Invalid email or password.';
                        loginMessage.classList.add('text-red-600');
                    }

                    // Hide loading state
                    loginButtonText.classList.remove('hidden');
                    loginSpinner.classList.add('hidden');
                    loginButton.disabled = false;
                    
                }, 1500); // Simulate 1.5 second network delay
            });
        }
    });