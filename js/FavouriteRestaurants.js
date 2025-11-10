/* File: ../js/Favourites.js
  JavaScript for the Favourite Restaurants page
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. MOCK DATA (can be removed later) ---
    // This is a simulation of the "real" data from your app's database.
    // Each restaurant has a unique 'id'.
    const favouriteRestaurantsData = [
        {
            id: 'rest1',
            name: 'The Savory Grill',
            imageUrl: 'https://placehold.co/600x400/D97706/FFFBF5?text=The+Savory+Grill',
            rating: 4.5,
            reviewCount: 120,
            tags: 'Steakhouse • Modern • $$$',
            description: 'A contemporary steakhouse known for its perfectly aged cuts, craft cocktails, and an elegant, modern ambiance. A user favourite for celebrations.'
        },
        {
            id: 'rest2',
            name: 'Pasta Bella',
            imageUrl: 'https://placehold.co/600x400/C48A45/FFFBF5?text=Pasta+Bella',
            rating: 5,
            reviewCount: 98,
            tags: 'Italian • Casual • $$',
            description: 'Authentic, house-made pasta and classic Italian dishes served in a warm, rustic setting. Voted "Best Italian" by BiteChoice users three years running.'
        },
        {
            id: 'rest3',
            name: 'Morning Dew Cafe',
            imageUrl: 'https://placehold.co/600x400/78350F/FFFBF5?text=Morning+Dew+Cafe',
            rating: 4,
            reviewCount: 210,
            tags: 'Cafe • Breakfast • $',
            description: 'Your neighborhood go-to for artisanal coffee, fresh pastries, and hearty breakfast options. The avocado toast is a must-try!'
        }
        // Add more favourited restaurants here
    ];

    // --- 2. GETTING ELEMENTS FROM THE HTML (KEEP ALL THESE LATER!) ---
    const listElement = document.getElementById('favourites-list');
    const emptyStateElement = document.getElementById('empty-state');
    const modalElement = document.getElementById('restaurant-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    // Modal's content fields
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalRating = document.getElementById('modal-rating');
    const modalTags = document.getElementById('modal-tags');
    const modalDescription = document.getElementById('modal-description');
    const modalUnlikeBtn = document.getElementById('modal-unlike-btn');


    // --- 3. HELPER FUNCTIONS ---

    /**
     * Generates the star rating HTML based on a number.
     * @param {number} rating - The rating number (e.g., 4.5)
     */
    function getRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        return `
            <span class="text-brand-caramel">${'★'.repeat(fullStars)}</span>
            ${halfStar ? '<span class="text-brand-caramel">★</span>' : ''}
            <span class="text-stone-300">${'★'.repeat(emptyStars)}</span>
        `;
    }

    /**
     * Renders all the restaurant cards onto the page from the data array. (MODIFY THIS JAK for real one)
     */
    function renderRestaurantCards() {
        // Clear the list first
        listElement.innerHTML = '';

        // Generate HTML for each restaurant
        favouriteRestaurantsData.forEach(restaurant => {
            const cardHTML = `
            <div class="restaurant-card bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg cursor-pointer" data-id="${restaurant.id}">
                <img src="${restaurant.imageUrl}" alt="${restaurant.name}" class="w-full h-40 object-cover pointer-events-none">
                
                <div class="p-4 pointer-events-none">
                    <div class="flex justify-between items-start">
                        <h3 class="text-lg font-bold text-brand-text mb-1">${restaurant.name}</h3>
                        
                        <button class="unlike-btn text-red-500 hover:text-red-700 transition-colors flex-shrink-0 ml-2 pointer-events-auto" data-id="${restaurant.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <div class="flex items-center mb-2">
                        ${getRatingStars(restaurant.rating)}
                        <span class="text-sm text-stone-500 ml-2">${restaurant.rating.toFixed(1)} (${restaurant.reviewCount})</span>
                    </div>
                    <p class="text-sm text-stone-600">${restaurant.tags}</p>
                </div>
            </div>
            `;
            listElement.innerHTML += cardHTML;
        });

        // After rendering, check if the list is empty
        checkEmptyState();
    }

    /**
     * Checks if any favourites are left and shows/hides the empty state message.
     */
    function checkEmptyState() {
        // We check the data array, which is the source of truth
        if (favouriteRestaurantsData.length === 0) {
            emptyStateElement.classList.remove('hidden');
            listElement.classList.add('hidden');
        } else {
            emptyStateElement.classList.add('hidden');
            listElement.classList.remove('hidden');
        }
    }

    /** (this also modify later)
     * Opens the modal and fills it with a specific restaurant's data.
     * @param {string} restaurantId - The ID of the restaurant to show.
     */
    function openModal(restaurantId) {
        // Find the restaurant in our data array
        const restaurant = favouriteRestaurantsData.find(r => r.id === restaurantId);
        if (!restaurant) return; // Safety check

        // Populate the modal fields
        modalImg.src = restaurant.imageUrl;
        modalImg.alt = restaurant.name;
        modalTitle.textContent = restaurant.name;
        modalRating.innerHTML = `
            ${getRatingStars(restaurant.rating)} 
            <span class="text-sm text-stone-500 ml-2">${restaurant.rating.toFixed(1)} (${restaurant.reviewCount} reviews)</span>
        `;
        modalTags.textContent = restaurant.tags;
        modalDescription.textContent = restaurant.description;

        // ***IMPORTANT***: Tag the modal's unlike button with the restaurant ID
        modalUnlikeBtn.dataset.id = restaurant.id;

        // Show the modal
        modalElement.classList.remove('hidden');
    }

    /**
     * Closes the modal.
     */
    function closeModal() {
        modalElement.classList.add('hidden');
    }

    /**
     * Handles the "unlike" action.
     * @param {string} restaurantId - The ID of the restaurant to remove.
     */
    function handleUnlike(restaurantId) {
        // 1. Remove from the data array (the "source of truth")
        const index = favouriteRestaurantsData.findIndex(r => r.id === restaurantId);
        if (index > -1) {
            favouriteRestaurantsData.splice(index, 1);
        } 
        // this one remove later and ganti with fetch() for the real one. eg:
        /* fetch(`/api/favourites/${restaurantId}`, { 
            method: 'DELETE' 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Could not unlike restaurant');
            }
            return response.json();
        })
        .then(data => {
            // 3. (KEEP THIS LOGIC)
            // Now that the server confirms it's unliked,
            // re-render the UI and close the modal.
            // You'll need to fetch the new list or remove it from your
            // local data, then re-render.
            console.log(data.message); // e.g., "Successfully removed"

            // Easiest way is to just fetch the new list
            loadFavouriteRestaurants(); 
            closeModal();
        })
        .catch(error => {
            console.error('Error:', error);
        }); */

        // 2. (In a real app) Send this update to the server
        console.log(`(Simulation) Unliking restaurant ${restaurantId}. Sending to server...`);

        // 3. Re-render the cards on the page
        renderRestaurantCards();

        // 4. Close the modal if it's open
        closeModal();
    }

    // --- 4. EVENT LISTENERS ---

    // Initial render on page load (this line later change to...)
    renderRestaurantCards();

    /* (CHANGE TO THIS)
    let currentFavourites = []; // A new place to store data
    function loadFavouriteRestaurants() {
        fetch('/api/my-favourites') // <-- Your new backend API endpoint
            .then(response => response.json())
            .then(data => {
                currentFavourites = data; // <-- Store the real data
                renderRestaurantCards(currentFavourites); // <-- Render with real data
            });
    } */

    // Listener for the whole list (Event Delegation)
    listElement.addEventListener('click', (e) => {
        // Check if the click came from an unlike button
        const unlikeButton = e.target.closest('.unlike-btn');
        if (unlikeButton) {
            handleUnlike(unlikeButton.dataset.id);
            return; // Stop processing
        }

        // Check if the click was on a card (but not the button)
        const card = e.target.closest('.restaurant-card');
        if (card) {
            openModal(card.dataset.id);
        }
    });

    // Listener for the "Unlike" button IN THE MODAL
    modalUnlikeBtn.addEventListener('click', (e) => {
        handleUnlike(e.target.dataset.id);
    });

    // Listeners to close the modal
    closeModalBtn.addEventListener('click', closeModal);
    modalElement.addEventListener('click', (e) => {
        // Close if the user clicks on the dark background overlay
        if (e.target === modalElement) {
            closeModal();
        }
    });
});