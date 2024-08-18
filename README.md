# ToDoList Project

This is a simple TodoList web application built using **Express**, **Node.js**, **EJS** as the templating engine, and **MySQL** as the database.

## Features

- Add, update, and delete tasks.
- Mark tasks as complete or incomplete.
- View a list of all tasks.
- Persistent storage with MySQL.

## Installation

### Steps

1. Clone the repository:

```bash
git clone https://github.com/satyajit98/todoList.git
cd todoList
```

2. Install dependencies:

```bash
npm install
```

3. Set up the MySQL database:

- Create a database in MySQL:

```sql
CREATE DATABASE todolist;
```

4. Create a **`.env`** file in the **`todoList`** directory with the following variables:

```plaintext
HOST=your_host_name
PORT=your_port_number
USER=your_user_name
PASSWORD=your_password
DATABASE=your_database_name
```

5. Start the application:

```bash
npm run dev
```
