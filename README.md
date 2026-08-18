# FarmLink Frontend

FarmLink is a web app that lets farmers sell their products directly to consumers. It connects farmers with buyers, making it easy to buy fresh produce without middlemen.

## How to Run It

1. Make sure you have Node.js installed
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```
4. Open your browser and go to http://localhost:5173

The backend needs to be running on http://localhost:8000 for the app to work properly.

## What Can You Do?

**For Consumers:**
- Browse the landing page to learn about FarmLink
- View product details with images, descriptions, and reviews
- Browse all available products from different farmers
- Add products to your cart
- Place orders with delivery address and notes
- View your order history and track order status
- See which farmer is selling each product
- Submit reviews and ratings for products you've purchased
- Edit or delete your own reviews

**For Farmers:**
- View your dashboard with sales statistics
- Add new products with name, description, price, and quantity
- Edit or delete your existing products
- View orders that contain your products
- Update order status (pending, confirmed, shipped, delivered)
- See only your products in shared orders (not other farmers' items)
- View all reviews for your products with average ratings
- Track customer feedback on your products

## How It Works

**Landing Page:** The app starts with a landing page at the root route that introduces FarmLink, explains the benefits for both farmers and consumers, and shows how the platform works. Users can navigate to Home, About, Products, Login, or Sign Up from the navbar.

**Login:** Users can sign up as either consumers or farmers. The login system uses JWT tokens to keep you logged in and remembers your role.

**Buying Products:** Consumers browse products, click on product cards to view detailed information including reviews and ratings, add items to cart, and checkout. They enter delivery address and any special notes. The order is saved and farmers can see it.

**Product Reviews:** After purchasing products, consumers can submit reviews with star ratings (1-5 stars) and written feedback. They can edit or delete their own reviews. Farmers can view all reviews for their products on a dedicated reviews page, grouped by product with average ratings.

**Managing Products:** Farmers can add products with details like name, price, and quantity. They can edit or delete products anytime. Each product is linked to the farmer who created it.

**Orders:** When a consumer places an order, it shows up in the farmer's orders page if it contains their products. Farmers can update the order status so consumers know when their order is confirmed, shipped, or delivered. Each farmer only sees their own products in an order, even if the order has items from multiple farmers.

## Folder Structure

- **src/pages/** - All the main pages (LandingPage, ProductsPage, ProductDetailsPage, CartPage, OrdersPage, FarmerDashboard, FarmerProducts, FarmerOrders, FarmerReviewsPage, etc.)
- **src/components/** - Reusable components (Navbar, ProductCard, ProtectedRoute, FarmerProtectedRoute, etc.)
- **src/services/** - API calls to the backend (orderService, farmerService, productService, reviewService)
- **src/context/** - Authentication context (AuthContext) and Language context (LanguageContext) to manage user login state and language preferences
- **src/utils/** - Helper functions like date formatting

## Test Accounts

The app supports two types of users: consumers and farmers.

To test the app, create new accounts:

1. Go to http://localhost:5173/register
2. For **Consumer Account**: 
   - Fill in your details
   - Select role: "Buy Products (Consumer)"
3. For **Farmer Account**:
   - Fill in your details  
   - Select role: "Sell Products (Farmer)"
4. Login with your new accounts and explore!

**Testing Flow:**
- Farmer: Add some products
- Consumer: Browse products, view product details, and place an order
- Farmer: View order and update status
- Consumer: See order status changes
- Consumer: Submit a review for purchased products
- Farmer: View reviews on the farmer reviews page

## Technology Used

- React (for building the UI)
- Vite (for fast development)
- Tailwind CSS (for styling)
- React Router (for navigation between pages)
- Axios (for making API calls to backend)

## Notes/Future Improvements

The app works well for an MVP (Minimum Viable Product) that demonstrates the core marketplace functionality with landing page, product details, and reviews system.

Things that could be added in future versions to enhance the consumer experience:
- Payment integration (online payments)
- Order cancellation feature (let consumers cancel before farmer confirms)
- Change delivery address (allow updating address before shipment)
- Mark as received (consumers confirm when order arrives)
- Request refunds (handle return requests)
- Farmer profiles with ratings
- Search and filter for products
- Email notifications for order updates
- Product image upload improvements
- Review moderation system
