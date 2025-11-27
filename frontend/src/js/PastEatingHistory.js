// --- 1. MOCK (FAKE) BACKEND DATA ---
// This simulates the data your backend would send for the history page.

const mockHistoryData = [
    {
        "historyId": "h123",
        "restaurantName": "Cafe Cafe at Texas Inn",
        "date": "November 05, 2025",
        "totalSpent": 45.50,
        "thumbnailUrl": "https://placehold.co/80x80/F59E0B/FFFFFF?text=C"
    },
    {
        "historyId": "h456",
        "restaurantName": "Restaurant Chef Alibaba",
        "date": "November 01, 2025",
        "totalSpent": 82.00,
        "thumbnailUrl": "https://placehold.co/80x80/10B981/FFFFFF?text=R"
    },
    {
        "historyId": "h789",
        "restaurantName": "Singapore Town",
        "date": "October 28, 2025",
        "totalSpent": 25.00,
        "thumbnailUrl": "https://placehold.co/80x80/3B82F6/FFFFFF?text=S"
    },
    {
        "historyId": "h101",
        "restaurantName": "A&W",
        "date": "October 24, 2025",
        "totalSpent": 33.10,
        "thumbnailUrl": "https://placehold.co/80x80/EF4444/FFFFFF?text=A"
    }
];

const mockHistoryDetails = {
    "h123": {
        "restaurantName": "Cafe Cafe at Texas Inn",
        "date": "November 05, 2025",
        "totalSpent": 45.50,
        "itemsOrdered": [
            { "name": "Chicken Chop", "qty": 1, "price": 22.00 },
            { "name": "Spaghetti Carbonara", "qty": 1, "price": 18.00 },
            { "name": "Iced Lemon Tea", "qty": 2, "price": 5.50 }
        ]
    },
    "h456": {
        "restaurantName": "Restaurant Chef Alibaba",
        "date": "November 01, 2025",
        "totalSpent": 82.00,
        "itemsOrdered": [
            { "name": "Nasi Briyani (Lamb)", "qty": 2, "price": 40.00 },
            { "name": "Cheese Naan", "qty": 1, "price": 12.00 },
            { "name": "Tandoori Chicken", "qty": 1, "price": 18.00 },
            { "name": "Mango Lassi", "qty": 2, "price": 12.00 }
        ]
    },
    "h789": {
        "restaurantName": "Singapore Town",
        "date": "October 28, 2025",
        "totalSpent": 25.00,
        "itemsOrdered": [
            { "name": "Hainanese Chicken Rice", "qty": 1, "price": 15.00 },
            { "name": "Kopi O", "qty": 1, "price": 5.00 },
            { "name": "Kaya Toast", "qty": 1, "price": 5.00 }
        ]
    },
    "h101": {
        "restaurantName": "A&W",
        "date": "October 24, 2025",
        "totalSpent": 33.10,
        "itemsOrdered": [
            { "name": "Coney Dog", "qty": 2, "price": 18.00 },
            { "name": "Curly Fries (L)", "qty": 1, "price": 7.00 },
            { "name": "Root Beer Float", "qty": 1, "price": 8.10 }
        ]
    }
};


// --- 2. API "FETCH" FUNCTIONS ---
// These functions simulate fetching data from your backend.

/**
 * Simulates fetching the main history data.
 */
async function fetchHistoryData() {
    console.log("Fetching history data...");
    // Simulate a network delay (e.g., 500ms)
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("Data received:", mockHistoryData);
    return mockHistoryData;
}

/**
 * Simulates fetching details for a single history item.
 */
async function fetchHistoryDetails(historyId) {
    console.log(`Fetching details for history: ${historyId}`);
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const details = mockHistoryDetails[historyId];
    console.log("Details received:", details);
    return details;
}

// --- 3. PAGE LOGIC ---

// Get references to all the DOM elements
const historyListContainer = document.getElementById('history-list');
const modal = document.getElementById('review-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalTitle = document.getElementById('modal-title');
const modalRating = document.getElementById('modal-rating'); // Re-used for date
const modalText = document.getElementById('modal-text');     // Re-used for total
const modalDetailsList = document.getElementById('modal-details-list'); // For itemized list

/**
 * Creates the HTML for a single history card and adds it to the page.
 */
function createHistoryCard(item) {
    // 1. Create the outer div
    const card = document.createElement('div');
    card.className = "history-card bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4 cursor-pointer hover:shadow-md transition-shadow";
    // Set the historyId on the card itself for later
    card.setAttribute('data-id', item.historyId);
    
    // 2. Create the inner HTML
    card.innerHTML = `
        <img src="${item.thumbnailUrl}" alt="${item.restaurantName}" class="w-16 h-16 rounded-lg flex-shrink-0">
        <div class="flex-1 min-w-0">
            <h3 class="font-bold text-brand-text text-lg truncate">${item.restaurantName}</h3>
            <p class="text-stone-500 text-sm">${item.date}</p>
            <p class="text-brand-text font-semibold text-sm mt-1">RM ${item.totalSpent.toFixed(2)}</p>
        </div>
        <span class="text-stone-400 text-xs font-medium">Receipt</span>
    `;
    
    // 3. Add the click listener to this new card
    card.addEventListener('click', openModal);
    
    // 4. Append the new card to the list
    historyListContainer.appendChild(card);
}

/**
 * Main function to load all history data when the page starts.
 */
async function loadHistoryData() {
    try {
        // 1. Fetch data (from our mock function)
        const data = await fetchHistoryData();
        
        // 2. Clear any "Loading..." text from the list
        historyListContainer.innerHTML = '';
        
        // 3. Loop through items and create a card for each
        if (data.length > 0) {
            data.forEach(item => {
                createHistoryCard(item);
            });
        } else {
            historyListContainer.innerHTML = '<p class="text-stone-500 col-span-full">You have no eating history yet.</p>';
        }
        
    } catch (error) {
        console.error("Failed to load history:", error);
        historyListContainer.innerText = "Error loading history. Please try again.";
    }
}

/**
 * Opens the modal and populates it with data.
 */
async function openModal(event) {
    // Get the card that was clicked
    const card = event.currentTarget;
    const historyId = card.getAttribute('data-id');
    
    // 1. Show modal with "Loading..." text
    modalTitle.innerText = "Loading...";
    modalRating.innerText = ""; // Clear date
    modalText.innerText = "Loading details..."; // Clear total
    modalDetailsList.innerHTML = ''; // Clear item list
    modal.classList.remove('hidden');
    
    try {
        // 2. Fetch the specific history details
        const details = await fetchHistoryDetails(historyId);
        
        // 3. Populate the modal with the new data
        modalTitle.innerText = details.restaurantName;
        modalRating.innerText = details.date; // Use rating element for date
        modalText.innerText = `Total: RM ${details.totalSpent.toFixed(2)}`;
        
        // 4. Populate the itemized list
        modalDetailsList.innerHTML = ''; // Clear again just in case
        if (details.itemsOrdered && details.itemsOrdered.length > 0) {
            details.itemsOrdered.forEach(item => {
                const li = document.createElement('li');
                li.className = "flex justify-between border-b border-gray-100 py-1";
                li.innerHTML = `
                    <span>${item.qty}x ${item.name}</span>
                    <span class="font-medium text-stone-700">RM ${item.price.toFixed(2)}</span>
                `;
                modalDetailsList.appendChild(li);
            });
        } else {
            modalDetailsList.innerHTML = '<li>No item details available.</li>';
        }
        
    } catch (error) {
        console.error("Failed to load history details:", error);
        modalText.innerText = "Could not load details. Please try again.";
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
window.addEventListener('DOMContentLoaded', loadHistoryData);

// Add click listener for the modal close button
closeModalBtn.addEventListener('click', closeModal);

// Add click listener for the modal overlay (to close by clicking outside)
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});