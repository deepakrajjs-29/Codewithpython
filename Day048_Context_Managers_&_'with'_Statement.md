# Day 048: Context Managers & 'with' Statement

> **Difficulty:** Intermediate | **Topic:** Advanced Topics | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Master the mechanics of Python's `with` statement and resource management lifecycle.
- Implement custom class-based context managers using `__enter__` and `__exit__` magic methods.
- Understand how `__exit__` handles, propagates, and suppresses exceptions.
- Write concise, generator-based context managers using the standard library's `contextlib.contextmanager`.
- Manage multiple resources concurrently within single and nested `with` statements.

---

## 📚 Theory & Concepts

In software engineering, systems frequently interact with external resources: files on disk, network sockets, database connections, hardware locks, or graphics contexts. These resources are finite. When you open a resource, you must explicitly release it when you are finished.

Failing to release resources leads to:
1. **Resource Leaks**: Exhausting system file descriptors or available database connection pools.
2. **Data Corruption**: Leaving buffered file writes un-flushed.
3. **Deadlocks**: Leaving a mutex or lock acquired after an unexpected crash.

### The Historical Approach: `try...finally`

Before the introduction of context managers in Python 2.5 (PEP 343), developers relied heavily on `try...finally` blocks:

```python
file = open("data.txt", "w")
try:
    file.write("Processing data...")
finally:
    file.close()
```

While effective, this pattern becomes verbose, repetitive, and error-prone when managing multiple resources or handling complex exception propagation.

### The Pythonic Solution: The Context Management Protocol

A **Context Manager** is an object that defines the runtime context to be established when executing a `with` statement. The context manager handles the entry into and exit from the desired runtime context.

The protocol consists of two core magic methods:

1. `__enter__()`:
   - Executes before the code block inside `with` runs.
   - Prepares the resource (e.g., opens a file, acquires a lock).
   - The return value is bound to the target variable specified after the `as` keyword.

2. `__exit__(exc_type, exc_val, exc_tb)`:
   - Executes automatically when the code block finishes, **even if an unhandled exception occurred**.
   - Receives three arguments detailing any exception raised: exception type, exception instance, and traceback object. If no exception occurred, all three are `None`.
   - Returning `True` suppresses the exception; returning `False` (or `None`) allows the exception to propagate upward.

```
       +------------------------------------+
       |          with Resource() as r:     |
       +------------------------------------+
                         |
                         v
              [ Calls __enter__() ]
                         |
              [ Returns target value to 'r' ]
                         |
                         v
             +-----------------------+
             |   Execute Block Body  |
             +-----------------------+
                    /         \
        (No Exception)       (Exception Raised)
                  /             \
                 v               v
    [ Calls __exit__(None, None, None) ]    [ Calls __exit__(exc_type, exc_val, tb) ]
                 |               |
                 |      +--------+--------+
                 |      | Does __exit__   |
                 |      | return True?    |
                 |      +--------+--------+
                 |       /               \
                 |   (Yes)               (No)
                 |     |                   |
                 v     v                   v
      [ Normal Execution Continues ]   [ Re-raise Exception ]
```

---

## 💻 Syntax & Structure

### 1. Class-Based Context Manager

```python
class ManagedResource:
    def __enter__(self):
        # Setup: Acquire resource
        print("Acquiring resource...")
        return self  # Bound to the 'as' variable

    def __exit__(self, exc_type, exc_val, exc_tb):
        # Teardown: Release resource
        print("Releasing resource...")
        if exc_type is not None:
            print(f"Handled error: {exc_val}")
            return True  # Suppress exception (if desired)
        return False  # Propagate exception
```

### 2. Generator-Based Context Manager (`contextlib`)

For simpler workflows, `contextlib.contextmanager` turns a generator function into a context manager using a single `yield` statement.

```python
from contextlib import contextmanager

@contextmanager
def managed_resource():
    # Setup (equivalent to __enter__)
    print("Acquiring resource...")
    resource = "Active Resource"
    try:
        yield resource  # Value received by 'as' target
    finally:
        # Teardown (equivalent to __exit__)
        print("Releasing resource...")
```

### 3. Managing Multiple Resources

You can manage multiple resources in a single `with` statement using commas:

```python
with open("source.txt", "r") as src, open("dest.txt", "w") as dst:
    dst.write(src.read())
```

---

## 🧪 Code Examples

Let's explore a complete, runnable script demonstrating:
1. A class-based execution timer.
2. A custom database transaction simulator that commits on success and rolls back on error.
3. A generator-based context manager using `@contextlib.contextmanager`.
4. Multiple context managers working in unison.

```python
"""Day 48: Context Managers in Python."""

import time
from contextlib import contextmanager

# ==========================================================
# 1. Class-Based Context Manager: Performance Timer
# ==========================================================
class ExecutionTimer:
    """Measures execution time of an enclosed block of code."""

    def __init__(self, label: str = "Block"):
        self.label = label
        self.start_time: float = 0.0
        self.elapsed: float = 0.0

    def __enter__(self) -> "ExecutionTimer":
        self.start_time = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> bool:
        self.elapsed = time.perf_counter() - self.start_time
        print(f"[{self.label}] Elapsed time: {self.elapsed:.4f} seconds")
        # Returning False ensures any exception is not swallowed
        return False

# ==========================================================
# 2. Class-Based Context Manager with Exception Handling
# ==========================================================
class DatabaseTransaction:
    """Simulates a database transaction lifecycle."""

    def __init__(self, db_name: str):
        self.db_name = db_name
        self.in_transaction = False

    def __enter__(self):
        self.in_transaction = True
        print(f"\n[DB: {self.db_name}] BEGIN TRANSACTION")
        return self

    def query(self, sql: str):
        if not self.in_transaction:
            raise RuntimeError("Cannot execute query outside an active transaction.")
        print(f"[DB: {self.db_name}] Executing: {sql}")

    def __exit__(self, exc_type, exc_val, exc_tb) -> bool:
        self.in_transaction = False
        if exc_type is not None:
            print(f"[DB: {self.db_name}] ERROR ENCOUNTERED: {exc_val}")
            print(f"[DB: {self.db_name}] ROLLBACK TRANSACTION")
            # Return True to suppress specific handled business exceptions
            if issubclass(exc_type, ValueError):
                print(f"[DB: {self.db_name}] Handled ValueError successfully.")
                return True
            return False

        print(f"[DB: {self.db_name}] COMMIT TRANSACTION")
        return False

# ==========================================================
# 3. Generator-Based Context Manager: Temporary State Modifier
# ==========================================================
@contextmanager
def temporary_setting(config_dict: dict, key: str, temp_value: any):
    """Temporarily changes a dictionary key and restores it upon exit."""
    old_value = config_dict.get(key)
    config_dict[key] = temp_value
    print(f"\n[Config] Override '{key}' -> '{temp_value}'")
    try:
        yield config_dict
    finally:
        if old_value is not None:
            config_dict[key] = old_value
            print(f"[Config] Restored '{key}' -> '{old_value}'")
        else:
            config_dict.pop(key, None)
            print(f"[Config] Removed temporary key '{key}'")

# ==========================================================
# Demonstration Pipeline
# ==========================================================
def main():
    # Example 1: Execution Timer
    print("--- 1. Testing Execution Timer ---")
    with ExecutionTimer("Data Processing"):
        total = sum(i * i for i in range(1_000_000))

    # Example 2: Successful Database Transaction
    print("\n--- 2. Testing Successful Transaction ---")
    with DatabaseTransaction("Production_DB") as db:
        db.query("INSERT INTO users (name) VALUES ('Alice')")
        db.query("UPDATE accounts SET balance = 500 WHERE id = 1")

    # Example 3: Failed Database Transaction with Handled Exception
    print("\n--- 3. Testing Failed Transaction (Handled Rollback) ---")
    with DatabaseTransaction("Production_DB") as db:
        db.query("INSERT INTO orders (id, amount) VALUES (101, 250)")
        raise ValueError("Invalid order status: Payment rejected")

    print("[App] System continued running normally after handled transaction error.")

    # Example 4: Generator-Based Context Manager
    print("\n--- 4. Testing Generator Context Manager ---")
    app_settings = {"mode": "production", "debug": False}
    print(f"Initial settings: {app_settings}")

    with temporary_setting(app_settings, "debug", True) as settings:
        print(f"Inside 'with' block settings: {settings}")

    print(f"Outside 'with' block settings: {app_settings}")

    # Example 5: Multiple Context Managers
    print("\n--- 5. Testing Multiple Context Managers ---")
    with (
        ExecutionTimer("Multi-Manager Task"),
        temporary_setting(app_settings, "mode", "maintenance"),
    ):
        time.sleep(0.05)
        print(f"Operating under temporary mode: {app_settings['mode']}")

if __name__ == "__main__":
    main()
```

---

## 📊 Expected Output

```text
--- 1. Testing Execution Timer ---
[Data Processing] Elapsed time: 0.0412 seconds

--- 2. Testing Successful Transaction ---

[DB: Production_DB] BEGIN TRANSACTION
[DB: Production_DB] Executing: INSERT INTO users (name) VALUES ('Alice')
[DB: Production_DB] Executing: UPDATE accounts SET balance = 500 WHERE id = 1
[DB: Production_DB] COMMIT TRANSACTION

--- 3. Testing Failed Transaction (Handled Rollback) ---

[DB: Production_DB] BEGIN TRANSACTION
[DB: Production_DB] Executing: INSERT INTO orders (id, amount) VALUES (101, 250)
[DB: Production_DB] ERROR ENCOUNTERED: Invalid order status: Payment rejected
[DB: Production_DB] ROLLBACK TRANSACTION
[DB: Production_DB] Handled ValueError successfully.
[App] System continued running normally after handled transaction error.

--- 4. Testing Generator Context Manager ---
Initial settings: {'mode': 'production', 'debug': False}

[Config] Override 'debug' -> 'True'
Inside 'with' block settings: {'mode': 'production', 'debug': True}
[Config] Restored 'debug' -> 'False'
Outside 'with' block settings: {'mode': 'production', 'debug': False}

--- 5. Testing Multiple Context Managers ---

[Config] Override 'mode' -> 'maintenance'
Operating under temporary mode: maintenance
[Config] Restored 'mode' -> 'production'
[Multi-Manager Task] Elapsed time: 0.0503 seconds
```

---

## 🌍 Real-World Applications

1. **Database Connections & Transactions**:
   Automating commits on success and immediate rollbacks on exceptions, preventing uncommitted data locks in PostgreSQL, MySQL, or SQLite.
2. **Concurrency & Thread Safety**:
   Using `threading.Lock` or `asyncio.Lock` with `with lock:` ensures locks are released immediately, even when exceptions are raised, avoiding deadlocks.
3. **File & Stream Operations**:
   Ensuring operating system file handles are flushed and closed automatically, avoiding "too many open files" OS errors.
4. **Mocking & Unit Testing**:
   The `unittest.mock.patch` context manager replaces target functions or objects during tests and restores them immediately upon exit.
5. **Contextual State Switching**:
   Switching decimal precision using `decimal.localcontext()`, redirecting standard output using `contextlib.redirect_stdout`, or changing working directories temporarily.

---

## 💡 Best Practices

- **Wrap the `yield` in `try...finally`**: When writing generator-based context managers with `@contextlib.contextmanager`, always wrap the `yield` in a `try...finally` block. If an exception occurs in the caller's `with` block, it is re-raised at the `yield` statement.
- **Be careful with exception suppression**: Only return `True` from `__exit__` if you explicitly intend to silence the exception. Indiscriminately returning `True` hides critical bugs and makes debugging difficult.
- **Keep `__enter__` and `__exit__` focused**: Context managers should only manage setup and teardown logic. Do not place business logic inside `__enter__` or `__exit__`.
- **Prefer `@contextlib.contextmanager` for simple state**: Use the decorator approach for stateless or simple setup/teardown tasks. Use class-based context managers when maintaining complex state across multiple method calls.
- **Parentheses for multiple managers**: Use Python 3.10+ parenthesized context managers (`with (ContextA(), ContextB()):`) for clean multi-line resource grouping.

---

## 📝 Summary & Key Takeaways

- The `with` statement encapsulates `try...finally` logic to guarantee deterministic cleanup of finite system resources.
- The **Context Management Protocol** relies on `__enter__()` for allocation/setup and `__exit__()` for release/teardown.
- `__exit__` receives `(exc_type, exc_val, exc_tb)`. Returning `True` suppresses exceptions; returning `False` or `None` propagates them.
- `contextlib.contextmanager` provides a decorator to create context managers out of Python generators using a single `yield`.

**Next Up (Day 49):** We will dive into **Generators, Iterators, and the Iteration Protocol**, exploring how Python handles streaming data and custom sequence traversal using `__iter__`, `__next__`, and generator pipelines.
