# Sprint 4: User Authentication Database

## 1. Database Design for User Authentication

The user authentication database will store user accounts securely.

### Table: `users`

| Column Name | Type         | Description                  |
|-------------|--------------|------------------------------|
| id          | INTEGER      | Primary Key, Auto-Increment  |
| username    | VARCHAR(50)  | Unique, Required             |
| password    | VARCHAR(255) | Password hash, Required      |
| email       | VARCHAR(100) | Optional                     |
| created_at  | DATETIME     | Account creation timestamp   |

## 2. Actions Supported

- Register new users (insert row)
- User login (validate credentials)
- Update user information (update row)
- Delete user account (delete row)

## 3. ER Diagram (Textual)

```
+----------+
|  users   |
+----------+
| id       |
| username |
| password |
| email    |
| created_at |
+----------+
```

## 4. Implementation Notes

- Passwords are securely hashed before storing in the database.
- Usernames are unique.
- Basic input validation is performed before registration or login.

---

**End of Sprint 4 documentation.**