// --- 1. MOCK (FAKE) BACKEND DATA ---
// This is the data that would be fetched to populate the form.
const mockEditProfileData = {
    "userName": "Gabriela Barbara",
    "profilePictureUrl": "https://placehold.co/100x100/EAB308/78350F?text=GAB&font=sans-serif",
    "gender": "Female",
    "birthday": "1995-10-20", // YYYY-MM-DD format for <input type="date">
    "email": "gabriela.b@example.com"
};

// --- 2. API "FETCH" FUNCTIONS ---

/**
 * Simulates fetching the user's current editable data.
 */
async function fetchEditProfileData() {
    console.log("Fetching editable profile data...");
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("Data received:", mockEditProfileData);
    return mockEditProfileData;
}

/**
 * Simulates saving the new data to the backend.
 */
async function saveProfileData(newData) {
    console.log("Saving new profile data...", newData);
    // Simulate a network delay (e.g., 1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Data saved successfully!");
    // In a real app, the server would confirm success.
    return { success: true, user: newData };
}

// --- 3. PAGE LOGIC ---

// Get references to all the DOM elements
const editForm = document.getElementById('edit-form');
const profilePicPreview = document.getElementById('profile-pic-preview');
const changePicBtn = document.getElementById('change-pic-btn');
const fileInput = document.getElementById('file-input');

const fullNameInput = document.getElementById('full-name');
const genderInput = document.getElementById('gender');
const birthdayInput = document.getElementById('birthday');
const emailInput = document.getElementById('email');

const saveBtn = document.getElementById('save-btn');

/**
 * Main function to load and populate data when the page starts.
 */
async function loadPageData() {
    try {
        const data = await fetchEditProfileData();
        
        // Populate the form fields
        profilePicPreview.src = data.profilePictureUrl;
        fullNameInput.value = data.userName;
        genderInput.value = data.gender;
        birthdayInput.value = data.birthday;
        emailInput.value = data.email;
        
    } catch (error) {
        console.error("Failed to load profile data:", error);
        alert("Could not load profile data. Please try again.");
    }
}

/**
 * Handles the "Change Photo" button click.
 */
function handleChangePictureClick() {
    // Triggers the hidden file input
    fileInput.click();
}

/**
 * Handles the file selection from the hidden input.
 */
function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (file) {
        console.log("New file selected:", file.name);
        // Use FileReader to read the file and show a preview
        const reader = new FileReader();
        
        reader.onload = (e) => {
            // e.target.result contains the image as a data URL
            profilePicPreview.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    }
}

/**
 * Handles the form submission (Save button click).
 */
async function handleSave(event) {
    event.preventDefault(); // Stop the form from reloading the page
    
    // 1. Show loading state on the button
    saveBtn.disabled = true;
    saveBtn.innerText = "Saving...";
    saveBtn.classList.add('opacity-70', 'cursor-not-allowed');

    // 2. Collect all the data from the form
    // In a real app, you'd upload the 'fileInput.files[0]' directly
    // instead of the 'profilePicPreview.src' data URL if it's a new file.
    const updatedData = {
        userName: fullNameInput.value,
        gender: genderInput.value,
        birthday: birthdayInput.value,
        // This is a simplified way to "save" the new pic for the mock API
        profilePictureUrl: profilePicPreview.src 
    };
    
    try {
        // 3. Send data to the (mock) backend
        await saveProfileData(updatedData);
        
        // 4. On success, show confirmation and redirect
        alert("Profile saved successfully!");
        window.location.href = 'profile.html'; // Go back to the profile page
        
    } catch (error) {
        console.error("Failed to save profile:", error);
        alert("An error occurred. Please try again.");
        
        // 5. On failure, re-enable the button
        saveBtn.disabled = false;
        saveBtn.innerText = "Save Changes";
        saveBtn.classList.remove('opacity-70', 'cursor-not-allowed');
    }
}


// --- 4. EVENT LISTENERS ---

// When the page content is loaded, run the main function
window.addEventListener('DOMContentLoaded', loadPageData);

// Add click listener for the "Change Photo" button
changePicBtn.addEventListener('click', handleChangePictureClick);

// Add change listener for the hidden file input
fileInput.addEventListener('change', handleFileSelect);

// Add submit listener for the main form
editForm.addEventListener('submit', handleSave);