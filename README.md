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
- Browse all available products from different farmers
- Add products to your cart
- Place orders with delivery address and notes
- View your order history and track order status
- See which farmer is selling each product

**For Farmers:**
- View your dashboard with sales statistics
- Add new products with name, description, price, and quantity
- Edit or delete your existing products
- View orders that contain your products
- Update order status (pending, confirmed, shipped, delivered)
- See only your products in shared orders (not other farmers' items)

## How It Works

**Login:** Users can sign up as either consumers or farmers. The login system uses JWT tokens to keep you logged in and remembers your role.

**Buying Products:** Consumers browse products, add them to cart, and checkout. They enter delivery address and any special notes. The order is saved and farmers can see it.

**Managing Products:** Farmers can add products with details like name, price, and quantity. They can edit or delete products anytime. Each product is linked to the farmer who created it.

**Orders:** When a consumer places an order, it shows up in the farmer's orders page if it contains their products. Farmers can update the order status so consumers know when their order is confirmed, shipped, or delivered. Each farmer only sees their own products in an order, even if the order has items from multiple farmers.

## Folder Structure

- **src/pages/** - All the main pages (ProductsPage, CartPage, OrdersPage, FarmerDashboard, FarmerProducts, FarmerOrders, etc.)
- **src/components/** - Reusable components (Navbar, ProductCard, ProtectedRoute, etc.)
- **src/services/** - API calls to the backend (orderService, farmerService, productService)
- **src/context/** - Authentication context (AuthContext) to manage user login state
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
- Consumer: Browse products and place an order
- Farmer: View order and update status
- Consumer: See order status changes

## Technology Used

- React (for building the UI)
- Vite (for fast development)
- Tailwind CSS (for styling)
- React Router (for navigation between pages)
- Axios (for making API calls to backend)

## Notes/Future Improvements

The app works well for an MVP (Minimum Viable Product) that demonstrates the core marketplace functionality.

Things that could be added in future versions to enhance the consumer experience:
- Payment integration (online payments)
- Order cancellation feature (let consumers cancel before farmer confirms)
- Change delivery address (allow updating address before shipment)
- Mark as received (consumers confirm when order arrives)
- Request refunds (handle return requests)
- Product reviews and ratings
- Farmer profiles with ratings
- Search and filter for products
- Email notifications for order updates
