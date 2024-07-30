
# Mall Management System

## Overview

The Mall Management System is a comprehensive application designed to streamline the management of shops, sales, and purchases within a mall. The application supports both administrative and retail functionalities, allowing for efficient management of users and operations. Built using Node.js and MongoDB, this system offers a range of features for user authentication, shop management, sales tracking, and purchase management.

## Features

### Authentication

- **Register User**: Allows new users to register by providing their username, password, email, and phone number.
- **Login User**: Authenticates existing users with their email and password, providing a token for access to protected routes.
- **Logout**: Logs out the current user by invalidating their session or token.

### User Management

- **Get All Users**: Retrieves a list of all users in the system, typically for administrative purposes.
- **Show Me**: Fetches details of the currently authenticated user.
- **Update User**: Updates the information of a specific user, including fields such as username and email.
- **Update User Password**: Allows users to change their password, requiring the old and new passwords.
- **Get Single User**: Retrieves detailed information about a specific user by their ID.

### Shop Management

- **Create Shop**: Adds a new shop to the system with details like name, type, floor, and number.
- **Get All Shops**: Retrieves a list of all shops within the mall.
- **Get Current User Shops**: Fetches all shops owned or managed by the currently logged-in user.
- **Get Single Shop**: Retrieves detailed information about a specific shop by its ID.
- **Update Shop**: Updates the information of a specific shop.

### Sales Management

- **Create a Sale**: Records a new sale transaction, including shop ID, items sold, quantity, and price.
- **Get All Sales**: Retrieves a list of all sales transactions.
- **Get Single Sale**: Fetches details of a specific sale by its ID.
- **Update Sale**: Updates the details of a specific sale.
- **Delete Sale**: Deletes a specific sale transaction from the system.

### Purchase Management

- **Create Purchase**: Records a new purchase transaction, including shop ID, items purchased, quantity, and price.
- **Get All Purchases**: Retrieves a list of all purchase transactions.
- **Get Single Purchase**: Fetches details of a specific purchase by its ID.
- **Update Purchase**: Updates the details of a specific purchase.
- **Delete Purchase**: Deletes a specific purchase transaction from the system.

## Installation

To get started with the Mall Management System, clone the repository and install the necessary dependencies:

git clone <repository-url>
cd mall-management-system
npm install


## Configuration

Set up your environment variables by creating a `.env` file in the root directory:


PORT=5000
MONGO_URL=<your-mongodb-connection-string>
JWT_SEC= yoursecretkey
JWT_LIFETIME = (no of days)


## Usage

Start the server using:


npm start


The application will run on `http://localhost:5000` by default.

## API Documentation

For detailed API documentation, visit [this link](./public/index.html)
## Contributing

Contributions are welcome! 

## Contact

For any questions or support, please reach out to [ehtashamahmed16133@gmail.com]
---
