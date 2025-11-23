**BiteChoice – Smart Eating Planner (Backend)**



BiteChoice is a smart food recommendation and meal-planning system designed to help users make healthier, quicker, and more informed eating decisions.

This backend powers the BiteChoice app with:



* Personalized food suggestions



* Nearby restaurant detection



* Meal plan generation



* AI chatbot



* Search engine



* User authentication



This system is built with Node.js, Express, Sequelize ORM, and PostgreSQL.



--------------------------------------------------------------------------------------------------------



**Features (Fully Implemented in Prototype)**



**1. User Authentication**

* Register
* Login
* Secure JWT token
* Authorization middleware



**2. Restaurant Finder**

* Fetch nearby restaurants based on user location
* Distance calculation using Haversine formula



**3. Meal Plan Generator**

* Auto-generate a daily or weekly meal plan
* Pulls meals from database
* Saves each generated plan automatically



**4. Food Suggestion Engine**

* Suggest dishes based on price, cuisine, and randomness
* Pulls from restaurant \& dish seeds



**5. AI Chatbot**

* Friendly conversational food assistant
* Detects user intent
* Suggests meals or restaurants
* Works without OpenAI key (local AI logic)



**6. Search Engine**

* Search across dishes + restaurants
* Keyword-based, case-insensitive



**--------------------------------------------------------------------------------------------------------**



**Future Features (Included As Modules, but Not Active)**



These files are intentionally included for system scalability but are not required in the prototype:



* Dish management (admin CRUD)
* Recipe system
* Review and rating system
* Wheel/randomizer system
* User preferences (dietary, allergens)
* Subscription / Premium membership



&nbsp;	These modules show future planning and system expansion.

&nbsp;	They are marked clearly in each file header.



**--------------------------------------------------------------------------------------------------------**



**Tech Stack**



**| Layer             | Technology                                      |**

**| ----------------- | ----------------------------------------------- |**

**| Backend Framework | Node.js + Express                               |**

**| Database          | PostgreSQL                                      |**

**| ORM               | Sequelize                                       |**

**| Authentication    | JWT                                             |**

**| AI Logic          | Custom rule-based engine                        |**

**| Utilities         | Haversine distance, logger, structured response |**



**--------------------------------------------------------------------------------------------------------**



**Project Structure**

**src/**

 **├── chatbot/**

 **│     ├── aiEngine.js**

 **│     ├── foodEngine.js**

 **│     ├── intentDetector.js**

 **│     └── restaurantRecommender.js**

 **│**

 **├── controllers/**

 **│     ├── authController.js**

 **│     ├── chatbotController.js**

 **│     ├── mealPlanController.js**

 **│     ├── restaurantController.js**

 **│     ├── searchController.js**

 **│     └── suggestionController.js**

 **│**

 **├── middleware/**

 **│     ├── authMiddleware.js**

 **│     └── premiumMiddleware.js**

 **│**

 **├── models/**

 **│     ├── User.js**

 **│     ├── Dish.js**

 **│     ├── Restaurant.js**

 **│     ├── MealPlan.js**

 **│     ├── MealPlanItem.js**

 **│     └── MealHistory.js**

 **│**

 **├── routes/**

 **│     ├── authRoutes.js**

 **│     ├── chatbotRoutes.js**

 **│     ├── mealPlanRoutes.js**

 **│     ├── restaurantRoutes.js**

 **│     ├── searchRoutes.js**

 **│     └── suggestionRoutes.js**

 **│**

 **├── services/**

 **│     ├── aiService.js**

 **│     ├── chatbotService.js**

 **│     └── suggestionService.js**

 **│**

 **├── seeders/**

 **│     ├── restaurants.js**

 **│     └── dishes.js**

 **│**

 **├── utils/**

 **│     ├── distance.js**

 **│     ├── logger.js**

 **│     └── response.js**

 **│**

 **├── app.js**

 **├── index.js**

 **├── seed.js**



**--------------------------------------------------------------------------------------------------------**



**Installation \& Setup**



**1. Install Dependencies**

npm install



**2. Configure Environment**

Create a .env file:



DB\_HOST=localhost

DB\_USER=postgres

DB\_PASS=yourpassword

DB\_NAME=bitechoice

DB\_PORT=5432

JWT\_SECRET=yourSecretKey



**3. Seed the Database**

node seed.js



**4. Start the Server**

node index.js



Server will run on:



http://localhost:5000



--------------------------------------------------------------------------------------------------------



**API Overview (Prototype)**



**Auth**

| Method | Endpoint         | Description             |

| ------ | ---------------- | ----------------------- |

| POST   | `/auth/register` | Create account          |

| POST   | `/auth/login`    | Login and receive token |



**Restaurant**

| Method | Endpoint                        | Description            |

| ------ | ------------------------------- | ---------------------- |

| GET    | `/restaurants/nearby?lat=\&lng=` | Get nearby restaurants |



**Chatbot**

| Method | Endpoint           | Description        |

| ------ | ------------------ | ------------------ |

| POST   | `/chatbot/message` | Ask the AI chatbot |



**Meal Plans**

| Method | Endpoint               | Description             |

| ------ | ---------------------- | ----------------------- |

| GET    | `/meal-plans/generate` | Auto-generate meal plan |



**Suggestions**

| Method | Endpoint                | Description          |

| ------ | ----------------------- | -------------------- |

| GET    | `/suggestions?userId=1` | Get food suggestions |



**Search**

| Method | Endpoint                         | Description                        |

| ------ | -------------------------------- | ---------------------------------- |

| GET    | `/search?query=chicken\&type=all` | Search across restaurants \& dishes |



--------------------------------------------------------------------------------------------------------



**How to Use (Testing Guide)**

Use Thunder Client or Postman:



**1. Register**



**2. Login → Copy token**



**3. Add header to all protected routes:**

Authorization: Bearer <token>



**4. Test core features:**

* Nearby restaurants
* Suggestions
* Chatbot
* Meal plans
* Search



--------------------------------------------------------------------------------------------------------



**Notes**



* This backend is designed for rapid prototyping.
* Some future modules exist for system design demonstration.
* AI chatbot runs fully offline (no OpenAI account needed).





