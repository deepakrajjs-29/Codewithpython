# Day 002: Variables and Assignment

> **Difficulty:** Beginner | **Topic:** Fundamentals | **Reading Time:** 12 mins

---

## 🎯 Learning Objectives
- Understand Python's reference-based memory model and how variables reference objects rather than store raw values.
- Master Python variable naming rules, reserved keywords, and PEP 8 naming conventions (`snake_case`).
- Execute single, chained, and multiple variable assignments accurately.
- Perform Pythonic variable swapping without relying on temporary third variables.
- Inspect variable types and memory identities using built-in functions (`type()` and `id()`).

---

## 📚 Theory & Concepts

### What is a Variable in Python?

In many traditional compiled programming languages (like C or C++), a variable is envisioned as a "box" or labeled memory location where data is stored directly. 

In Python, **variables are dynamic references or name tags bound to objects in memory**.

When you write `user_age = 25`, Python performs three distinct steps under the hood:
1. Creates an integer object representing `25` in heap memory.
2. Creates the variable name `user_age` in the current namespace.
3. Binds (points) the name `user_age` to the object `25`.

```text
Traditional Model (e.g., C/C++):
+---------------------+
| user_age: [ 25 ]    |  <-- Memory box holding the value
+---------------------+

Python Reference Model:
[ Variable Name ]           [ Object in Heap Memory ]
  user_age  -------------->   ( Integer: 25 )
                              Memory Address: 0x7f9a8b12c010
```

### Dynamic Typing and Object Re-assignment

Python is a **dynamically typed** language. This means you do not declare the data type of a variable when you create it. Type checking occurs at runtime based on the object the variable currently references.

If you reassign a variable to a value of a different data type, Python simply updates the reference to point to a new object. The old object—if no longer referenced by any variable—is automatically cleaned up by Python's Garbage Collector.

```text
Step 1: x = 100
[ x ] ---------------> ( Integer: 100 )

Step 2: x = "Hello"
                       ( Integer: 100 )  <-- Unreferenced (Garbage Collected)
[ x ] ---------------> ( String: "Hello" )
```

### Reference Sharing

When you assign one variable to another (e.g., `y = x`), Python does **not** copy the underlying object. Instead, both variable names point to the exact same object in memory.

```text
x = 42
y = x

[ x ] ───────┐
             ├───> ( Integer: 42 )
[ y ] ───────┘
```

You can verify whether two variables point to the exact same object using Python's built-in `id()` function, which returns the object's unique memory identifier.

---

## 💻 Syntax & Structure

### 1. Basic Variable Assignment
Variable assignment uses the single equal sign operator (`=`). The left side must be a valid identifier name, and the right side must be an expression that evaluates to an object.

```python
# Syntax: identifier = expression
user_name = "Alice"
account_balance = 1500.75
is_active = True
```

### 2. PEP 8 Variable Naming Rules & Conventions
To write standard Python code, your variable names must comply with syntactic rules and follow community standards (PEP 8):

#### Mandatory Syntax Rules:
- Must begin with a letter (`a-z`, `A-Z`) or an underscore (`_`).
- Cannot start with a digit (`0-9`).
- Can only contain alphanumeric characters and underscores (`a-z`, `A-Z`, `0-9`, `_`).
- Case-sensitive (`total_score`, `Total_Score`, and `TOTAL_SCORE` are three distinct variables).
- Cannot use Python reserved keywords (e.g., `class`, `def`, `if`, `import`, `for`).

#### PEP 8 Naming Conventions:
- **Variables**: Use `snake_case` (lowercase letters separated by underscores).
- **Constants**: Use `UPPER_SNAKE_CASE` for values intended to remain unchanged throughout program execution.

| Variable Type | Bad Practice | Good Practice (PEP 8) |
| :--- | :--- | :--- |
| Standard Variable | `userAge`, `u_age`, `Userage` | `user_age` |
| Multi-word Name | `totalaccountbalance` | `total_account_balance` |
| Constant | `pi = 3.14`, `piValue = 3.14` | `PI = 3.14159` |

### 3. Advanced Assignment Patterns

#### Chained Assignment
Assigns a single object reference to multiple variables simultaneously.

```python
# Assigns 0 to x, y, and z simultaneously
x = y = z = 0
```

#### Multiple Assignment (Tuple Unpacking)
Assigns multiple values to multiple variables in a single line.

```python
# Assigns 1 to a, 2 to b, and 3 to c
a, b, c = 1, 2, 3
```

#### Pythonic Variable Swapping
Swaps the values of two variables cleanly without an intermediate temporary variable.

```python
# Swaps values of first_name and last_name
first_name, last_name = last_name, first_name
```

---

## 🧪 Code Examples

The following script demonstrates basic assignment, dynamic typing, identity tracking, multiple assignment, and variable swapping.

```python
# day_002_variables.py

def main():
    print("=== 1. Basic Assignment & Identity Inspection ===")
    user_id = 1001
    user_name = "Alex"
    
    # Printing variables and their data types
    print(f"user_id: {user_id} | Type: {type(user_id).__name__} | Memory ID: {id(user_id)}")
    print(f"user_name: {user_name} | Type: {type(user_name).__name__} | Memory ID: {id(user_name)}")

    print("\n=== 2. Dynamic Typing & Reference Re-assignment ===")
    # Reassigning user_id from integer to string
    user_id = "USER-1001"
    print(f"Updated user_id: {user_id} | New Type: {type(user_id).__name__} | New Memory ID: {id(user_id)}")

    print("\n=== 3. Reference Sharing ===")
    score_a = 500
    score_b = score_a  # Both variables point to the same integer object
    
    print(f"score_a ID: {id(score_a)}")
    print(f"score_b ID: {id(score_b)}")
    print(f"Do score_a and score_b point to the exact same object? {score_a is score_b}")

    print("\n=== 4. Multiple Assignment & Variable Swapping ===")
    # Multiple assignment
    player_x, player_y, player_z = 10, 20, 30
    print(f"Initial positions -> X: {player_x}, Y: {player_y}, Z: {player_z}")

    # Pythonic Swapping (Swapping player_x and player_y)
    player_x, player_y = player_y, player_x
    print(f"Swapped positions -> X: {player_x}, Y: {player_y}, Z: {player_z}")

    print("\n=== 5. Constants Convention ===")
    MAX_LOGIN_ATTEMPTS = 5
    DATABASE_URL = "postgres://localhost:5432/production_db"
    print(f"Max Attempts Allowed: {MAX_LOGIN_ATTEMPTS}")
    print(f"DB Connection String: {DATABASE_URL}")

if __name__ == "__main__":
    main()
```

---

## 📊 Expected Output

```text
=== 1. Basic Assignment & Identity Inspection ===
user_id: 1001 | Type: int | Memory ID: 140708321045232
user_name: Alex | Type: str | Memory ID: 2197823812016

=== 2. Dynamic Typing & Reference Re-assignment ===
Updated user_id: USER-1001 | New Type: str | New Memory ID: 2197823894208

=== 3. Reference Sharing ===
score_a ID: 2197823898480
score_b ID: 2197823898480
Do score_a and score_b point to the exact same object? True

=== 4. Multiple Assignment & Variable Swapping ===
Initial positions -> X: 10, Y: 20, Z: 30
Swapped positions -> X: 20, Y: 10, Z: 30

=== 5. Constants Convention ===
Max Attempts Allowed: 5
DB Connection String: postgres://localhost:5432/production_db
```

*Note: Memory ID values (`id(...)`) are dynamic system addresses and will vary upon every runtime execution.*

---

## 🌍 Real-World Applications

### 1. Web Application Session Configuration
Variables in backend systems (such as Flask or FastAPI apps) manage dynamic request states, API configurations, and authentication tokens.

```python
# Session configuration variables in a backend service
session_timeout_seconds = 3600
is_authenticated = True
current_user_email = "dev@company.com"
```

### 2. Data Processing & Machine Learning Pipelines
When reading telemetry or processing tabular data, multiple assignment allows engineers to unpack feature matrix dimensions cleanly.

```python
# Unpacking data dimensions returned by a dataset matrix shape
num_rows, num_columns = (50000, 128)
print(f"Dataset contains {num_rows} samples across {num_columns} features.")
```

### 3. Hardware / IoT Sensor Monitoring
Hardware scripts dynamically track state updates as sensor measurements fluctuate over time.

```python
# Swapping previous and current readings to monitor sensor delta
previous_temp, current_temp = 22.4, 23.8

# Shift window: current becomes previous, new reading assigned
previous_temp, current_temp = current_temp, 24.1
```

---

## 💡 Best Practices

- **Use Intent-Revealing Names**: Name variables for human readability. Choose `bytes_transferred` over `bt` or `x`.
- **Adhere Strictly to `snake_case`**: Maintain lowercase words separated by underscores for standard variables and functions.
- **Capitalize Constants**: Treat variables written in `UPPER_SNAKE_CASE` as read-only constants by convention.
- **Avoid Shadowing Built-ins**: Do not name variables after Python keywords or built-in functions (e.g., avoid `type = "admin"`, `list = [1, 2]`, `str = "hello"`).

### Common Pitfalls to Avoid:

1. **Confusing `=` (Assignment) with `==` (Equality Comparison)**:
   ```python
   # INCORRECT (SyntaxError in conditional statements)
   # if age = 18:
   
   # CORRECT
   age = 18        # Assignment
   is_adult = (age == 18)  # Equality check
   ```

2. **Unbound Variable Access (`NameError`)**:
   Attempting to evaluate or print a variable before declaring it results in a `NameError`.
   ```python
   # Raises NameError: name 'total_cost' is not defined
   print(total_cost)
   total_cost = 100
   ```

3. **Mismatched Multiple Assignment**:
   When using multiple assignment, the number of identifiers on the left must strictly match the number of values on the right.
   ```python
   # Raises ValueError: too many values to unpack (expected 2, got 3)
   a, b = 1, 2, 3
   ```

---

## 📝 Summary & Key Takeaways

- Python variables are **name references** pointing to objects stored in memory, not memory containers holding raw values.
- Python is **dynamically typed**; variable types are resolved at runtime based on the object bound to the variable name.
- Variable names must strictly follow Python syntax rules and should follow **PEP 8** `snake_case` style conventions.
- Multiple assignment allows clean unpacking (`a, b = 1, 2`) and Pythonic variable swapping (`a, b = b, a`).
- You can inspect object data types with `type()` and exact memory identifiers with `id()`.

**Preview for Day 3:** Tomorrow, we will dive deep into **Python's Core Primitive Data Types and Explicit Type Conversion**, mastering integers, floats, strings, booleans, and how to safely convert between them.
