<<<<<<< HEAD:frontend/src/js/PersonalInfo.js
// Make the function 'async' so we can wait for the backend
btnVerify.addEventListener('click', async () => {
    const newEmail = emailInput.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1. Basic Client-side Validation
    if (!emailRegex.test(newEmail)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (newEmail === originalEmail) {
        resetEmailUI();
        return;
    }

    // 2. Show "Loading" state immediately
    const originalBtnText = btnVerify.innerHTML;
    btnVerify.innerText = 'Sending...';
    btnVerify.disabled = true; // Prevent double clicking

    try {
        // --- THIS IS THE BACKEND PART ---
        // Replace '/api/send-verification' with your actual endpoint
        const response = await fetch('/api/send-verification', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                // Add Authorization headers here if needed (e.g., Bearer token)
            },
            body: JSON.stringify({ 
                email: newEmail,
                userId: 'CURRENT_USER_ID' // If your backend needs ID explicitly
            })
        });

        const data = await response.json();

        if (response.ok) {
            // --- SUCCESS: Update UI to "Pending" state ---
            
            // Lock input
            emailInput.setAttribute('readonly', true);
            emailInput.classList.add('bg-stone-100', 'cursor-not-allowed', 'text-stone-600');
            emailInput.classList.remove('bg-white', 'text-stone-800');
            
            // Remove focus ring
            emailWrapper.classList.remove('bg-gradient-to-r', 'from-orange-500', 'to-amber-600', 'ring-2', 'ring-orange-500/20');
            emailWrapper.classList.add('bg-stone-100');

            // Swap buttons
            btnVerify.innerHTML = originalBtnText; // Restore icon
            btnVerify.classList.add('hidden');
            btnChange.classList.remove('hidden');
            
            // Change "Change" button to "Resend"
            btnChange.innerText = 'Resend Link'; 

            // Update Badge
            emailBadge.innerText = 'Pending';
            emailBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 uppercase tracking-wide';

            // Show Message
            newEmailDisplay.innerText = newEmail;
            emailMessage.classList.remove('hidden');

            alert("Verification link sent!");

        } else {
            // --- SERVER ERROR (e.g., Email already taken) ---
            alert(data.message || "Failed to send verification email.");
            btnVerify.innerHTML = originalBtnText;
            btnVerify.disabled = false;
        }

    } catch (error) {
        // --- NETWORK ERROR ---
        console.error('Error:', error);
        alert("Network error. Please try again.");
        btnVerify.innerHTML = originalBtnText;
        btnVerify.disabled = false;
    }
=======
// Make the function 'async' so we can wait for the backend
btnVerify.addEventListener('click', async () => {
    const newEmail = emailInput.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1. Basic Client-side Validation
    if (!emailRegex.test(newEmail)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (newEmail === originalEmail) {
        resetEmailUI();
        return;
    }

    // 2. Show "Loading" state immediately
    const originalBtnText = btnVerify.innerHTML;
    btnVerify.innerText = 'Sending...';
    btnVerify.disabled = true; // Prevent double clicking

    try {
        // --- THIS IS THE BACKEND PART ---
        // Replace '/api/send-verification' with your actual endpoint
        const response = await fetch('/api/send-verification', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                // Add Authorization headers here if needed (e.g., Bearer token)
            },
            body: JSON.stringify({ 
                email: newEmail,
                userId: 'CURRENT_USER_ID' // If your backend needs ID explicitly
            })
        });

        const data = await response.json();

        if (response.ok) {
            // --- SUCCESS: Update UI to "Pending" state ---
            
            // Lock input
            emailInput.setAttribute('readonly', true);
            emailInput.classList.add('bg-stone-100', 'cursor-not-allowed', 'text-stone-600');
            emailInput.classList.remove('bg-white', 'text-stone-800');
            
            // Remove focus ring
            emailWrapper.classList.remove('bg-gradient-to-r', 'from-orange-500', 'to-amber-600', 'ring-2', 'ring-orange-500/20');
            emailWrapper.classList.add('bg-stone-100');

            // Swap buttons
            btnVerify.innerHTML = originalBtnText; // Restore icon
            btnVerify.classList.add('hidden');
            btnChange.classList.remove('hidden');
            
            // Change "Change" button to "Resend"
            btnChange.innerText = 'Resend Link'; 

            // Update Badge
            emailBadge.innerText = 'Pending';
            emailBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 uppercase tracking-wide';

            // Show Message
            newEmailDisplay.innerText = newEmail;
            emailMessage.classList.remove('hidden');

            alert("Verification link sent!");

        } else {
            // --- SERVER ERROR (e.g., Email already taken) ---
            alert(data.message || "Failed to send verification email.");
            btnVerify.innerHTML = originalBtnText;
            btnVerify.disabled = false;
        }

    } catch (error) {
        // --- NETWORK ERROR ---
        console.error('Error:', error);
        alert("Network error. Please try again.");
        btnVerify.innerHTML = originalBtnText;
        btnVerify.disabled = false;
    }
>>>>>>> a3f64e425ad1588c57b7478dbab2a7f9bea6c5db:js/PersonalInfo.js
});