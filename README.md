# Car-Management-API

## Introduction

This project is an api for car management and user authentication, there are 3 roles, such as member, admin, and superadmin. Create, update and delete cars can only be done by accounts that have admin and superadmin roles, members can only view car data. In the admin registration process, only superadmins can add accounts with the admin role.

## Endpoints

### Car Routes

- **AKUN SUPERADMIN**
  - Email : superadmin@gmail.com
  - pass  : 1234

- **GET /cars**
  - Description: Retrieve all cars.
  - Response Example:
    ```json
    [
      {
        "id": 1,
        "name": "Car 1",
        "rentPerDay": 100,
        "image": "image1.png",
        "url": "http://localhost:5000/uploads/image1.png",
        "createdBy": 1,
        "CreatedBy": {
          "uuid": "uuid1",
          "name": "Admin",
          "email": "admin@example.com",
          "role": "admin"
        },
        "updatedBy": 2,
        "UpdatedBy": {
          "uuid": "uuid2",
          "name": "Admin2",
          "email": "admin2@example.com",
          "role": "admin"
        },
        "deletedBy": null,
        "DeletedBy": null
      }
    ]
    ```

- **GET /cars/:id**
  - Description: Retrieve a car by its ID.
  - Response Example:
    ```json
    {
      "id": 1,
      "name": "Car 1",
      "rentPerDay": 100,
      "image": "image1.png",
      "url": "http://localhost:5000/uploads/image1.png",
      "createdBy": 1,
      "CreatedBy": {
        "uuid": "uuid1",
        "name": "Admin",
        "email": "admin@example.com",
        "role": "admin"
      },
      "updatedBy": 2,
      "UpdatedBy": {
        "uuid": "uuid2",
        "name": "Admin2",
        "email": "admin2@example.com",
        "role": "admin"
      },
      "deletedBy": null,
      "DeletedBy": null
    }
    ```

- **POST /cars**
  - Description: Add a new car.
  - Request Example:
    ```json
    {
      "name": "New Car",
      "rentPerDay": 150,
      "image": "file"
    }
    ```
  - Response Example:
    ```json
    {
      "message": "Car Created Successfully"
    }
    ```

- **PUT /cars/:id**
  - Description: Update an existing car.
  - Request Example:
    ```json
    {
      "name": "Updated Car",
      "rentPerDay": 200,
      "image": "file"
    }
    ```
  - Response Example:
    ```json
    {
      "message": "Car updated successfully"
    }
    ```

- **DELETE /cars/:id**
  - Description: Delete a car by its ID.
  - Response Example:
    ```json
    {
      "message": "Car deleted successfully"
    }
    ```

### User Routes

- **GET /users**
  - Description: Retrieve all users.
  - Response Example:
    ```json
    [
      {
        "id": 1,
        "uuid": "uuid1",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "admin"
      }
    ]
    ```

- **POST /users**
  - Description: Register a new admin user.
  - Request Example:
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "password123",
      "confPassword": "password123"
    }
    ```
  - Response Example:
    ```json
    {
      "msg": "Register successfully"
    }
    ```

- **POST /member**
  - Description: Register a new member user.
  - Request Example:
    ```json
    {
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "password": "password123",
      "confPassword": "password123"
    }
    ```
  - Response Example:
    ```json
    {
      "msg": "Register successfully"
    }
    ```

- **POST /login**
  - Description: Login user.
  - Request Example:
    ```json
    {
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```
  - Response Example:
    ```json
    {
      "accessToken": "jwt_token_here"
    }
    ```

- **DELETE /logout**
  - Description: Logout user.
  - Response Example:
    ```json
    {
      "msg": "You already log out"
    }
    ```

- **GET /me**
  - Description: Get authenticated user's info.
  - Response Example:
    ```json
    {
      "id": 1,
      "uuid": "uuid1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "admin"
    }
    ```

- **GET /token**
  - Description: Refresh access token.
  - Response Example:
    ```json
    {
      "accessToken": "new_jwt_token_here"
    }
    ```

- **DELETE /users/:id**
  - Description: Delete a user by its ID.
  - Response Example:
    ```json
    {
      "msg": "Users has been deleted"
    }
    ```

## Middleware

- **verifyToken**
  - Description: Middleware to verify JWT token.
  - Usage:
    ```javascript
    import { verifyToken } from "../middleware/verifyToken.js";
    router.get("/cars", verifyToken, getCars);
    ```

- **verifyUser**
  - Description: Middleware to verify user session.
  - Usage:
    ```javascript
    import { verifyUser } from "../middleware/AuthUser.js";
    router.post("/cars", verifyToken, verifyUser, adminSuperAdminOnly, addCar);
    ```

- **adminSuperAdminOnly**
  - Description: Middleware to allow only admin and superadmin.
  - Usage:
    ```javascript
    import { adminSuperAdminOnly } from "../middleware/AuthUser.js";
    router.delete("/cars/:id", verifyToken, verifyUser, adminSuperAdminOnly, deleteCar);
    ```

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/KevinZakky/CAR-MANAGEMENT-API.git
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    ```plaintext
    ACCESS_TOKEN_SECRET=your_access_token_secret
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    ```

4. Start the server:
    ```bash
    npm start
    ```

## Contributing

1. Fork the repository.
2. Create your feature branch: `git checkout -b my-new-feature`.
3. Commit your changes: `git commit -am 'Add some feature'`.
4. Push to the branch: `git push origin my-new-feature`.
5. Submit a pull request.

## License

This project is licensed under the MIT License.
