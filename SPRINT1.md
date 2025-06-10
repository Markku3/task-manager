# Sprint 1: Planning & Version Control

## 1. Purpose of the Service

The purpose of this project is to create a simple web-based Task Manager. The application allows users to create, view, edit, and delete tasks. Each user will have their own account and can manage their own list of tasks.

## 2. Target Group

The target group for this service is students who want to organize their study tasks, homework, and personal to-dos in one convenient place.

## 3. User Stories

- As a new user, I want to register an account so I can have my own tasks.
- As a returning user, I want to log in so I can see and manage my tasks.
- As a user, I want to add new tasks with a title and description.
- As a user, I want to view my list of tasks.
- As a user, I want to edit the details of a task.
- As a user, I want to delete a task that I no longer need.
- As a user, I want to mark a task as completed.
- As a user, I want to log out when I am done.

## 4. Use Case Description

- **Register:** User creates an account with username and password.
- **Login:** User logs in with their credentials.
- **Add Task:** User adds a new task to their list.
- **View Tasks:** User can see all their tasks.
- **Edit Task:** User can change the details of a task.
- **Delete Task:** User can remove a task from their list.
- **Mark Task Completed:** User can mark a task as done.
- **Logout:** User logs out from the service.

## 5. Use Case Diagram

Below is a simple text-based use case diagram. You can draw this with draw.io, diagrams.net, or attach a hand-drawn scan/photo if preferred.

```
          +---------+
          |  User   |
          +----+----+
               |
    +----------+-----------+-----------------------+--------------+
    |          |           |                       |              |
Register   Login     Add/Edit/Delete Task     Mark Completed   Logout
```

(Or, draw as an actual diagram for your report.)

## 6. Version Control

- The project is managed with Git and hosted on GitHub.
- All major changes are committed with meaningful messages.
- Branches are used for each feature (e.g., `feature/auth`, `feature/task-crud`).
- All code is pushed regularly to GitHub for backup and version history.

---

**End of Sprint 1 documentation.**