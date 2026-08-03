# Day 023: Dictionary Comprehensions

> **Difficulty:** Intermediate | **Topic:** Pythonic Code | **Reading Time:** 12 mins

---

## 🎯 Learning Objectives

- **Master Dict Comprehension Syntax:** Understand how to construct dictionaries declaratively using key-value pair expressions.
- **Apply Conditional Logic:** Integrate `if` filtering and `if-else` value assignment directly within dictionary comprehensions.
- **Transform & Invert Mappings:** Implement advanced transformations like dictionary inversion, data filtering, and pairing iterables with `zip()`.

---

## 📚 Theory & Concepts

In Python, dictionaries are primary data structures for mapping key-value pairs. Traditionally, building or transforming a dictionary requires initializing an empty dict and writing an explicit `for` loop.

While standard loops work, Python offers **Dictionary Comprehensions**—a concise, declarative, and idiomatic mechanism to construct dictionaries from iterables in a single line of code.

### Why Use Dictionary Comprehensions?

1. **Readability & Expressiveness:** Replaces multi-line loop initialization and `dict[key] = value` assignments with a clean, expressive expression.
2. **Performance:** Executes at C-speed in CPython, optimizing bytecode instructions by avoiding repeated lookup overhead associated with explicit loop execution.
3. **Functional Alignment:** Encourages a declarative style of programming where you specify *what* dictionary to create rather than *how* to step through elements to construct it.

### How It Works Under the Hood

When Python evaluates a dictionary comprehension, it creates a new dictionary object, loops over the source iterable, evaluates the key and value expressions for each item, and inserts them into the new mapping.

```text
Input Iterable: ['apple', 'banana', 'cherry']
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ Dictionary Comprehension Engine                        │
│                                                        │
│  For each item:                                        │
│  ├── Key Expression  : item.upper()                    │
│  └── Value Expression: len(item)                       │
└────────────────────────────────────────────────────────┘
       │
       ▼
Output Dictionary: {'APPLE': 5, 'BANANA': 6, 'CHERRY': 6}
```

---

## 💻 Syntax & Structure

### 1. Basic Syntax
The minimal dictionary comprehension takes an iterable and produces key-value pairs separated by a colon (`:`), wrapped in curly braces (`{}`):

```python
{key_expression: value_expression for item in iterable}
```

### 2. Syntax with Filtering (`if` Clause)
To include only items that satisfy a specific condition, add an `if` clause at the end:

```python
{key_expression: value_expression for item in iterable if condition}
```

### 3. Syntax with Conditional Values (`if-else` Expression)
To alter the generated key or value based on a condition, use a ternary operator *before* the `for` keyword:

```python
{key_expression: (val_if_true if condition else val_if_false) for item in iterable}
```

### 4. Pairing Two Iterables using `zip()`
You can combine two parallel sequences into a single dictionary mapping:

```python
{key: value for key, value in zip(keys_list, values_list)}
```

---

## 🧪 Code Examples

Below is a complete script demonstrating five core patterns of dictionary comprehensions.

```python
"""Day 23 - Dictionary Comprehensions Mastery Script."""

def main() -> None:
    # --- Pattern 1: Basic Dictionary Comprehension ---
    numbers: list[int] = [1, 2, 3, 4, 5]
    # Map each number to its square
    squares_map: dict[int, int] = {num: num**2 for num in numbers}
    print("1. Basic Transformation (Number -> Square):")
    print(f"   {squares_map}\n")

    # --- Pattern 2: Filtering elements using 'if' ---
    raw_prices: dict[str, float] = {
        "laptop": 1200.00,
        "mouse": 25.50,
        "monitor": 300.00,
        "cable": 8.99,
        "keyboard": 75.00,
    }
    # Keep only items priced over $50.00
    premium_products: dict[str, float] = {
        item: price for item, price in raw_prices.items() if price > 50.00
    }
    print("2. Filtered Items (Price > $50):")
    print(f"   {premium_products}\n")

    # --- Pattern 3: Pairing Two Lists with zip() ---
    student_ids: list[str] = ["S01", "S02", "S03", "S04"]
    student_names: list[str] = ["Alice", "Bob", "Charlie", "Diana"]
    # Pair IDs with student names
    student_directory: dict[str, str] = {
        sid: name for sid, name in zip(student_ids, student_names)
    }
    print("3. Paired Mapping with zip():")
    print(f"   {student_directory}\n")

    # --- Pattern 4: Conditional Value Assignment (if-else) ---
    scores: dict[str, int] = {"Alice": 88, "Bob": 62, "Charlie": 95, "Diana": 45}
    # Map student name to "Pass" or "Fail" based on score threshold (>= 70)
    results: dict[str, str] = {
        name: ("Pass" if score >= 70 else "Fail") for name, score in scores.items()
    }
    print("4. Conditional Value Transformation:")
    print(f"   {results}\n")

    # --- Pattern 5: Dictionary Inversion & Value Sanitization ---
    roles_by_user: dict[str, str] = {
        "admin_user": "ADMIN  ",
        "guest_user": "  GUEST",
        "editor_user": "EDITOR ",
    }
    # Invert mapping: map cleaned role (lowercased/stripped) to username
    users_by_role: dict[str, str] = {
        role.strip().lower(): user for user, role in roles_by_user.items()
    }
    print("5. Inverted and Sanitized Dictionary:")
    print(f"   {users_by_role}")

if __name__ == "__main__":
    main()
```

---

## 📊 Expected Output

```text
1. Basic Transformation (Number -> Square):
   {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

2. Filtered Items (Price > $50):
   {'laptop': 1200.0, 'monitor': 300.0, 'keyboard': 75.0}

3. Paired Mapping with zip():
   {'S01': 'Alice', 'S02': 'Bob', 'S03': 'Charlie', 'S04': 'Diana'}

4. Conditional Value Transformation:
   {'Alice': 'Pass', 'Bob': 'Fail', 'Charlie': 'Pass', 'Diana': 'Fail'}

5. Inverted and Sanitized Dictionary:
   {'admin': 'admin_user', 'guest': 'guest_user', 'editor': 'editor_user'}
```

---

## 🌍 Real-World Applications

### 1. Data Sanitization in Web APIs
When receiving external payload data (e.g., JSON response from a REST API), keys and values often need normalisation before storage.

```python
api_response = {"  First_Name ": "John  ", "LAST_NAME": "Doe", " EMAIL ": "john@example.com "}

# Sanitize keys (lowercase, stripped) and values (stripped)
clean_data = {
    key.strip().lower(): value.strip()
    for key, value in api_response.items()
}
# Output: {'first_name': 'John', 'last_name': 'Doe', 'email': 'john@example.com'}
```

### 2. Rapid Database Record Indexing
Converting a list of domain model instances or data dictionaries into an indexed lookup mapping by primary key allows $O(1)$ constant time access.

```python
users = [
    {"id": 101, "name": "Alice", "role": "admin"},
    {"id": 102, "name": "Bob", "role": "developer"},
]

# Create direct lookup table indexed by user ID
user_by_id = {user["id"]: user for user in users}
# Output: {101: {'id': 101, ...}, 102: {'id': 102, ...}}
```

### 3. Dropping Null or Invalid Fields
Before serializing data or saving to a database, strip missing or `None` values efficiently.

```python
form_input = {"username": "alex", "bio": "", "age": None, "location": "NYC"}

# Filter out None and empty string values
valid_input = {k: v for k, v in form_input.items() if v is not None and v != ""}
# Output: {'username': 'alex', 'location': 'NYC'}
```

---

## 💡 Best Practices

- **Do:** Use `.items()` when iterating over existing dictionaries inside comprehensions to access both keys and values cleanly.
- **Do:** Keep expressions clear and short. If the key or value logic requires multi-step evaluation, extract the logic into a separate helper function.
- **Don't:** Nest dictionary comprehensions too deeply. Deeply nested comprehensions severely impair readability and hinder debugging. Use explicit `for` loops instead for multi-level nested logic.
- **Watch Out for Duplicate Keys:** Dictionary keys must be unique. If a comprehension produces duplicate keys, later values will overwrite earlier ones without throwing an error:

```python
words = ["apple", "apricot", "avocado"]
# Duplicate key collision: 'a' is assigned repeatedly
first_char_map = {word[0]: word for word in words}
# Result: {'a': 'avocado'} (apple and apricot were overwritten!)
```

---

## 📝 Summary & Key Takeaways

1. **Syntax:** Dict comprehensions use `{key_expr: val_expr for item in iterable}`.
2. **Filtering vs Transformation:**
   - Filter elements using `if` at the end: `{k: v for ... if condition}`
   - Transform values using ternary logic before `for`: `{k: (val1 if cond else val2) for ...}`
3. **Use Cases:** Ideal for dataset re-indexing, field sanitization, dictionary inversion, and stripping out empty/invalid fields.
4. **Collision Handling:** Remember that duplicate keys in a comprehension overwrite earlier assignments quietly.

**Next Up:** Tomorrow on **Day 24**, we will explore **Generator Expressions and Memory Optimization**, learning how to stream massive datasets efficiently without depleting RAM!
