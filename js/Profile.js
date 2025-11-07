// --- 1. MOCK (FAKE) BACKEND DATA ---
// A backend would send this. We'll use it to simulate the API calls.

const mockProfileData = {
    "userName": "Gabriela Barbara",
    "profilePictureUrl": "https://placehold.co/100x100/EAB308/78350F?text=GAB&font=sans-serif",
    "reviews": [
    {
        "reviewId": "r123",
        "restaurantName": "Cafe Cafe at Texas Inn",
        "rating": 5,
        "summary": "Big portion for one person. Definitely need t...",
        "thumbnailUrl": "https://placehold.co/80x80/F59E0B/FFFFFF?text=C"
    },
    {
        "reviewId": "r456",
        "restaurantName": "Restaurant Chef Alibaba",
        "rating": 4,
        "summary": "One of the best places to lepas at night with your...",
        "thumbnailUrl": "https://placehold.co/80x80/10B981/FFFFFF?text=R"
    },
    {
        "reviewId": "r789",
        "restaurantName": "Singapore Town",
        "rating": 2,
        "summary": "Waited for my food for almost an hour and my food...",
        "thumbnailUrl": "https://placehold.co/80x80/3B82F6/FFFFFF?text=S"
    }
    ]
};

const mockReviewDetails = {
    "r123": {
        "restaurantName": "Cafe Cafe at Texas Inn",
        "rating": 4,
        "fullReviewText": "Big portion for one person. Definitely need to share with your friends. Worth the price honestly!!!"
    },
    "r456": {
        "restaurantName": "Restaurant Chef Alibaba",
        "rating": 3,
        "fullReviewText": "One of the best places to lepak at night with your friends. The decorations and lightings are so cool, definitely lighten the mood! The food is a little bit overpriced tho"
    },
    "r789": {
        "restaurantName": "Singapore Town",
        "rating": 2,
        "fullReviewText": "Waited for my food for almost an hour and my food was cold when it arrived. I would rather go Little Penang instead"
    }
};

// --- 2. API "FETCH" FUNCTIONS ---
// These functions simulate fetching data from your backend.

/**
 * Simulates fetching the main profile data.
 * A real function would be: fetch('/api/user/profile')
 */
async function fetchProfileData() {
    console.log("Fetching profile data...");
    // Simulate a network delay (e.g., 500ms)
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("Data received:", mockProfileData);
    return mockProfileData;
}

/**
 * Simulates fetching details for a single review.
 * A real function would be: fetch(`/api/reviews/${reviewId}`)
 */
async function fetchReviewDetails(reviewId) {
    console.log(`Fetching details for review: ${reviewId}`);
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const details = mockReviewDetails[reviewId];
    console.log("Details received:", details);
    return details;
}

// --- 3. PAGE LOGIC ---

// Get references to all the DOM elements we need to interact with
const reviewListContainer = document.getElementById('review-list');
const modal = document.getElementById('review-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalTitle = document.getElementById('modal-title');
const modalRating = document.getElementById('modal-rating');
const modalText = document.getElementById('modal-text');
const profilePicEl = document.getElementById('profile-pic');
const userNameEl = document.getElementById('user-name');
const editProfileBtn = document.getElementById('edit-profile-btn');

/**
 * Creates the HTML for a single review card and adds it to the page.
 */
function createReviewCard(review) {
    // 1. Create the outer div
    const card = document.createElement('div');
    card.className = "review-card bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4 cursor-pointer hover:shadow-md transition-shadow";
    // Set the reviewId on the card itself for later
    card.setAttribute('data-id', review.reviewId);
    
    // 2. Create the inner HTML
    card.innerHTML = `
        <img src="${review.thumbnailUrl}" alt="${review.restaurantName}" class="w-16 h-16 rounded-lg flex-shrink-0">
        <div class="flex-1 min-w-0">
            <h3 class="font-bold text-brand-text text-lg">${review.restaurantName}</h3>
            <div class="text-amber-500 text-sm">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
            <p class="text-stone-600 text-sm truncate">${review.summary}</p>
        </div>
        <span class="text-stone-400 text-xs font-medium">View</span>
    `;
    
    // 3. Add the click listener to this new card
    card.addEventListener('click', openModal);
    
    // 4. Append the new card to the list
    reviewListContainer.appendChild(card);
}

/**
 * Main function to load all profile data when the page starts.
 */
async function loadProfileData() {
    try {
        // 1. Fetch data (from our mock function)
        const data = await fetchProfileData();
        
        // 2. Populate profile header
        profilePicEl.src = data.profilePictureUrl;
        userNameEl.innerText = data.userName;
        
        // 3. Clear any "Loading..." text from the review list
        reviewListContainer.innerHTML = '';
        
        // 4. Loop through reviews and create a card for each
        data.reviews.forEach(review => {
            createReviewCard(review);
        });
        
    } catch (error) {
        console.error("Failed to load profile:", error);
        reviewListContainer.innerText = "Error loading reviews. Please try again.";
    }
}

/**
 * Opens the modal and populates it with data.
 */
async function openModal(event) {
    // Get the card that was clicked
    const card = event.currentTarget;
    const reviewId = card.getAttribute('data-id');
    
    // 1. Show modal with "Loading..." text
    modalTitle.innerText = "Loading...";
    modalRating.innerText = "";
    modalText.innerText = "Loading review details...";
    modal.classList.remove('hidden');
    
    try {
        // 2. Fetch the specific review details
        const details = await fetchReviewDetails(reviewId);
        
        // 3. Populate the modal with the new data
        modalTitle.innerText = details.restaurantName;
        modalRating.innerText = `${'★'.repeat(details.rating)}${'☆'.repeat(5 - details.rating)}`;
        modalText.innerText = details.fullReviewText;
        
    } catch (error) {
        console.error("Failed to load review details:", error);
        modalText.innerText = "Could not load review. Please try again.";
    }
}

/**
 * Closes the modal.
 */
function closeModal() {
    modal.classList.add('hidden');
}

// --- 4. EVENT LISTENERS ---

// When the page content is fully loaded, run the main function
window.addEventListener('DOMContentLoaded', loadProfileData);

// Add click listener for the modal close button
closeModalBtn.addEventListener('click', closeModal);

// Add click listener for the edit profile button
editProfileBtn.addEventListener('click', () => {
// Go to the new edit profile page
window.location.href = 'EditProfile.html';
});

// Add click listener for the modal overlay (to close by clicking outside)
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});
        