# Axia-Africa-Project E-Commerce Application

This is an **E-Commerce API project** built with **Node.js, Express, TypeScript, and MongoDB**.  
The application allows users to browse and order books, with products categorized into **Fiction** and **Non-Fiction**.  

It supports **user authentication, product management, and order management** while distinguishing between **users** and **admins** for access control.

## 🚀 Features

### 👥 User Features
- Register and login to the platform.
- Browse all books by category (Fiction / Non-Fiction).
- Place new book orders.
- View all their orders.
- Update their own orders (status).
- **Note:** Users cannot delete orders.

### 🛠️ Admin Features
- Manage all products (create, update, delete).
- View all orders.
- Update order status for any order.
- Delete orders when necessary.

## 🗂️ Schemas

### Product Schema
- `name`: string  
- `price`: number  
- `category`: "Fiction" | "Non-Fiction"

### Order Schema
- `user`: User reference  
- `items`: Array of products with quantity  
- `totalAmount`: number  
- `status`: "pending" | "successful" | "cancelled" 

### User Schema
- `name`: string  
- `email`: string  
- `password`: string (hashed)  
- `role`: "user" | "admin"

---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/PleasantH/Axia-Africa-Project.git
   cd Axia-africa-Project

