# Day 059: Relational Databases with SQLite (sqlite3)

> **Difficulty:** Intermediate | **Topic:** Databases | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Understand the architecture of embedded relational databases and the role of SQLite.
- Master Python's standard library `sqlite3` module without external dependencies.
- Create, read, update, and delete (CRUD) database records using proper SQL syntax.
- Safeguard applications against SQL injection attacks using parameterized queries.
- Manage database transactions, rollbacks, and schema integrity using context managers.
- Utilize custom row factories (`sqlite3.Row`) to access query results by column name.

---

## 📚 Theory & Concepts

A **Relational Database Management System (RDBMS)** organizes data into structured tables composed of rows (records) and columns (attributes). Unlike client-server database systems like PostgreSQL or MySQL that run as independent background daemons, **SQLite** is a self-contained, serverless, zero-configuration, transactional SQL database engine.

```
+-------------------------------------------------------------+
|                     Python Application                      |
|                                                             |
|   +-----------------------------------------------------+   |
|   |                   sqlite3 Module                    |   |
|   +-----------------------------------------------------+   |
|                              |                              |
|                              v                              |
|   +-----------------------------------------------------+   |
|   |                SQLite Engine (C-Level)              |   |
|   +-----------------------------------------------------+   |
+------------------------------+------------------------------+
                               |
                               v
               +-------------------------------+
               |     Disk Storage (.db file)   |
               |             - OR -            |
               |     In-Memory (:memory:)      |
               +-------------------------------+
```

### Key Components in Python's `sqlite3` Architecture

1. **Connection (`sqlite3.Connection`)**: Represents the open database file or an in-memory database (`:memory:`). It manages transactions, commits, rollbacks, and database-level settings.
2. **Cursor (`sqlite3.Cursor`)**: A control structure used to traverse and execute SQL statements over the database records.
3. **Transactions & ACID Compliance**: SQLite ensures **A**tomicity, **C**onsistency, **I**solation, and **D**urability. Changes made inside a transaction are staged in temporary journal files until explicitly committed.
4. **Parameterized Queries**: A secure mechanism to pass runtime data into SQL statements. Instead of formatting strings, placeholders (`?` or `:name`) are supplied, separating executable SQL code from variable user data.

---

## 💻 Syntax & Structure

### Basic Connection and Table Definition

```python
import sqlite3

# 1. Establish connection (creates file if not present, or uses RAM via ':memory:')
connection = sqlite3.connect("app_database.db")

# 2. Acquire a cursor
cursor = connection.cursor()

# 3. Execute DDL (Data Definition Language) commands
cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
""")

# 4. Commit changes and close
connection.commit()
connection.close()
```

### Safe Execution with Parameterization

```python
# Positional Placeholders (?)
cursor.execute(
    "INSERT INTO users (username, email) VALUES (?, ?)",
    ("alice_dev", "alice@example.com")
)

# Named Placeholders (:name)
cursor.execute(
    "INSERT INTO users (username, email) VALUES (:user, :mail)",
    {"user": "bob_ops", "mail": "bob@example.com"}
)
```

### Context Manager Workflows

The `sqlite3.Connection` object acts as a transaction context manager. It automatically issues `COMMIT` when exiting the block cleanly, or issues `ROLLBACK` if an unhandled exception occurs.

```python
with connection:
    # Any query executed here is part of an active transaction
    connection.execute("UPDATE accounts SET balance = balance - 100 WHERE id = 1")
    connection.execute("UPDATE accounts SET balance = balance + 100 WHERE id = 2")
# Automatic COMMIT on exit, or ROLLBACK on error
```

---

## 🧪 Code Examples

The following script implements a standalone, fully featured inventory management subsystem using an in-memory database (`:memory:`). It demonstrates schema creation, batch inserts, dictionary-style row mapping, safe queries, update operations, and transactional rollbacks.

```python
"""
Day 59: SQLite Relational Database Management System Demonstration
Author: Python Mastery Course
"""

import sqlite3
from typing import List, Optional, Tuple

def initialize_database(conn: sqlite3.Connection) -> None:
    """Initializes the database schema with constraints and foreign keys."""
    with conn:
        # Enforce foreign key constraints (disabled by default in SQLite)
        conn.execute("PRAGMA foreign_keys = ON;")
        
        conn.execute("""
            CREATE TABLE IF NOT EXISTS categories (
                category_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            );
        """)
        
        conn.execute("""
            CREATE TABLE IF NOT EXISTS products (
                product_id INTEGER PRIMARY KEY AUTOINCREMENT,
                category_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                sku TEXT NOT NULL UNIQUE,
                price REAL NOT NULL CHECK(price >= 0.0),
                stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
                FOREIGN KEY (category_id) REFERENCES categories (category_id)
                    ON DELETE CASCADE
            );
        """)

def seed_data(conn: sqlite3.Connection) -> None:
    """Inserts initial datasets using batch executions."""
    categories: List[Tuple[str]] = [
        ("Electronics",),
        ("Office Supplies",),
        ("Peripherals",)
    ]
    
    products = [
        (1, "Pro Laptop 15-inch", "LAP-001", 1299.99, 15),
        (1, "Noise-Canceling Headphones", "AUD-002", 249.50, 40),
        (2, "Ergonomic Standing Desk", "DSK-003", 499.00, 8),
        (3, "Mechanical Keyboard", "KEY-004", 119.95, 25),
        (3, "Wireless Precision Mouse", "MOU-005", 59.99, 50),
    ]

    with conn:
        conn.executemany(
            "INSERT INTO categories (name) VALUES (?)",
            categories
        )
        conn.executemany(
            """
            INSERT INTO products (category_id, name, sku, price, stock)
            VALUES (?, ?, ?, ?, ?)
            """,
            products
        )

def query_products_by_category(
    conn: sqlite3.Connection, category_name: str
) -> List[sqlite3.Row]:
    """Retrieves products joined with category details using parameterization."""
    query = """
        SELECT 
            p.product_id,
            p.name AS product_name,
            p.sku,
            p.price,
            p.stock,
            c.name AS category_name
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        WHERE c.name = :cat_name
        ORDER BY p.price DESC;
    """
    cursor = conn.cursor()
    cursor.execute(query, {"cat_name": category_name})
    return cursor.fetchall()

def process_order(
    conn: sqlite3.Connection, sku: str, quantity_ordered: int
) -> bool:
    """Demonstrates atomic transactions and error rollback handling."""
    try:
        with conn:
            cursor = conn.cursor()
            
            # Fetch current stock
            cursor.execute("SELECT stock FROM products WHERE sku = ?", (sku,))
            row = cursor.fetchone()
            
            if not row:
                raise ValueError(f"SKU '{sku}' not found.")
            
            current_stock = row["stock"]
            if current_stock < quantity_ordered:
                raise ValueError(
                    f"Insufficient stock for {sku}: "
                    f"Requested {quantity_ordered}, available {current_stock}."
                )
            
            # Deduct inventory
            cursor.execute(
                "UPDATE products SET stock = stock - ? WHERE sku = ?",
                (quantity_ordered, sku)
            )
            return True
            
    except (sqlite3.Error, ValueError) as err:
        print(f"[-] Transaction Failed & Rolled Back: {err}")
        return False

def main() -> None:
    # Create an in-memory database for testing
    connection = sqlite3.connect(":memory:")
    
    # Configure row_factory to sqlite3.Row for dictionary-like column access
    connection.row_factory = sqlite3.Row
    
    try:
        print("[*] Initializing Database Schema...")
        initialize_database(connection)
        
        print("[*] Seeding Datasets...")
        seed_data(connection)
        
        print("\n=== Category Filter: Electronics ===")
        electronics = query_products_by_category(connection, "Electronics")
        for item in electronics:
            print(
                f"ID: {item['product_id']} | "
                f"SKU: {item['sku']:<8} | "
                f"Name: {item['product_name']:<28} | "
                f"Price: ${item['price']:>7.2f} | "
                f"Stock: {item['stock']}"
            )
            
        print("\n=== Processing Valid Order (Deduct 5 Keyboards) ===")
        success = process_order(connection, sku="KEY-004", quantity_ordered=5)
        if success:
            cursor = connection.execute(
                "SELECT name, stock FROM products WHERE sku = 'KEY-004'"
            )
            item = cursor.fetchone()
            print(f"[+] Order Confirmed. Remaining {item['name']} Stock: {item['stock']}")
            
        print("\n=== Processing Invalid Order (Deduct 100 Desks - Overdraft) ===")
        process_order(connection, sku="DSK-003", quantity_ordered=100)
        
        # Verify desk stock remained unchanged
        cursor = connection.execute(
            "SELECT name, stock FROM products WHERE sku = 'DSK-003'"
        )
        item = cursor.fetchone()
        print(f"[+] Verification: Current {item['name']} Stock: {item['stock']}")
        
    finally:
        connection.close()
        print("\n[*] Database Connection Closed.")

if __name__ == "__main__":
    main()
```

---

## 📊 Expected Output

```text
[*] Initializing Database Schema...
[*] Seeding Datasets...

=== Category Filter: Electronics ===
ID: 1 | SKU: LAP-001  | Name: Pro Laptop 15-inch           | Price: $1299.99 | Stock: 15
ID: 2 | SKU: AUD-002  | Name: Noise-Canceling Headphones   | Price: $ 249.50 | Stock: 40

=== Processing Valid Order (Deduct 5 Keyboards) ===
[+] Order Confirmed. Remaining Mechanical Keyboard Stock: 20

=== Processing Invalid Order (Deduct 100 Desks - Overdraft) ===
[-] Transaction Failed & Rolled Back: Insufficient stock for DSK-003: Requested 100, available 8.
[+] Verification: Current Ergonomic Standing Desk Stock: 8

[*] Database Connection Closed.
```

---

## 🌍 Real-World Applications

- **Desktop Software & Mobile Applications**: Applications like web browsers (Chrome, Firefox) use SQLite to store browsing history, cookies, bookmarks, and local state.
- **Embedded Systems & IoT Devices**: Drones, routers, medical instruments, and automotive units log telemetry data and state machines into local SQLite databases.
- **Local Application Caching**: High-throughput microservices store cached responses locally in SQLite to prevent repetitive downstream network calls.
- **Automated Testing Pipelines**: Developers use SQLite in-memory databases (`:memory:`) to run lightning-fast integration tests without spinning up heavy external database containers.

---

## 💡 Best Practices

- **Never Format Raw SQL Strings**: Always use placeholders (`?` or `:name`). Formatting user input into queries using f-strings or `.format()` opens your application to SQL Injection vulnerabilities.
  ```python
  # DANGEROUS:
  cursor.execute(f"SELECT * FROM users WHERE username = '{user_input}'")

  # SAFE:
  cursor.execute("SELECT * FROM users WHERE username = ?", (user_input,))
  ```
- **Enable Foreign Key Enforcement**: SQLite turns off foreign key constraints by default for backward compatibility. Always run `PRAGMA foreign_keys = ON;` immediately after connecting.
- **Leverage `sqlite3.Row`**: Setting `connection.row_factory = sqlite3.Row` allows accessing columns by name (e.g., `row["username"]`) in addition to index positions (`row[0]`), reducing index mismatch bugs.
- **Use Context Managers for Transactions**: Wrap state-modifying operations inside `with connection:` blocks to ensure unhandled errors automatically trigger rollbacks.
- **Close Cursors and Connections**: Always ensure database handles are closed using `try...finally` blocks or `contextlib.closing`.

---

## 📝 Summary & Key Takeaways

1. SQLite is a lightweight, zero-configuration relational database engine embedded directly into the Python Standard Library via `sqlite3`.
2. Python uses `Connection` objects to manage file handles/transactions and `Cursor` objects to execute queries and traverse results.
3. Parameterized queries (`?` or `:key`) decouple SQL logic from data payloads, neutralizing SQL injection vectors.
4. Transactional integrity is guaranteed using ACID principles and automated rollback workflows via context managers.

**Next Lesson Preview:** Tomorrow on **Day 60**, we will level up from raw SQL by exploring **Object-Relational Mapping (ORM) with SQLAlchemy Core & Models**, allowing us to map Python classes directly to relational schemas!
