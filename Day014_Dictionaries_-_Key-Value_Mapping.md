# Day 014: Dictionaries - Key-Value Mapping

> **Difficulty:** Beginner | **Topic:** Data Structures | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives

- **Understand** the core concept of key-value mapping and hash tables in Python.
- **Create** dictionaries using literals (`{}`) and the `dict()` constructor.
- **Perform** CRUD operations (Create, Read, Update, Delete) on dictionary elements.
- **Master** essential dictionary methods (`get()`, `keys()`, `values()`, `items()`, `update()`, `pop()`).
- **Iterate** efficiently through key-value pairs using Pythonic loops.

---

## 📚 Theory & Concepts

### What is a Dictionary?

In Python, a **dictionary** (`dict`) is a built-in, mutable data structure designed to store data as **key-value pairs**. Unlike sequences such as lists or tuples—where elements are accessed by numeric zero-based indices—dictionary elements are accessed via unique **keys**.

Think of a physical dictionary: you look up a word (the **key**) to find its definition (the **value**).

```
               Python Dictionary Mapping
               
   Key (Immutable / Hashable)          Value (Any Type)
  ┌─────────────────────────┐        ┌──────────────────┐
  │      "user_id"          │ ──────>│       10042      │
  ├─────────────────────────┤        ├──────────────────┤
  │      "username"         │ ──────>│    "alex_dev"    │
  ├─────────────────────────┤        ├──────────────────┤
  │      "is_active"        │ ──────>│       True       │
  ├─────────────────────────┤        ├──────────────────┤
  │       "roles"           │ ──────>│ ["admin", "dev"] │
  └─────────────────────────┘        └──────────────────┘
```

### Core Characteristics of Dictionaries

1. **Key-Value Structure**: Every entry consists of a pair: `key: value`.
2. **Uniqueness of Keys**: Every key inside a dictionary must be unique. Duplicate keys are not allowed; defining a duplicate key overwrites the previous value.
3. **Key Hashability**: Keys **must** be of an immutable (hashable) type—such as `str`, `int`, `float`, or `tuple`. Mutable objects like `list` or `dict` **cannot** be used as keys.
4. **Value Flexibility**: Values can be of **any** data type (scalars, lists, tuples, or even other nested dictionaries) and can be duplicated.
5. **Ordered (Python 3.7+)**: Dictionaries preserve the **insertion order** of keys.
6. **Fast Lookups**: Dictionary lookups operate in $O(1)$ average time complexity because they are backed by hash tables.

---

## 💻 Syntax & Structure

### 1. Dictionary Creation

```python
# Empty dictionary
empty_dict_1 = {}
empty_dict_2 = dict()

# Literal syntax (Most common and Pythonic)
user = {
    "name": "Alice",
    "age": 30,
    "role": "Engineer"
}

# Constructor syntax
user_info = dict(name="Bob", age=25, role="Designer")
```

### 2. Accessing Values

```python
profile = {"username": "coder99", "score": 450}

# Direct indexing (Raises KeyError if key does not exist)
username = profile["username"]

# Safe access using .get() (Returns None or default if key missing)
score = profile.get("score")
rank = profile.get("rank", "Unranked")  # Returns default 'Unranked'
```

### 3. Modifying & Adding Elements

```python
inventory = {"apples": 10, "bananas": 5}

# Add a new key-value pair
inventory["oranges"] = 12

# Update an existing key's value
inventory["apples"] = 15

# Batch update using .update()
inventory.update({"bananas": 8, "grapes": 20})
```

### 4. Removing Elements

```python
data = {"a": 1, "b": 2, "c": 3, "d": 4}

# Remove key and return its value (Safe with default)
val = data.pop("b")          # Returns 2, data is now {'a': 1, 'c': 3, 'd': 4}
missing = data.pop("z", 0)   # Returns 0 (no KeyError)

# Remove key using 'del' statement
del data["a"]

# Remove and return the last inserted (key, value) tuple
last_pair = data.popitem()

# Clear all items
data.clear()                 # Yields {}
```

---

## 🧪 Code Examples

Below is a complete, executable Python script demonstrating practical dictionary operations, safe access patterns, and key-value iterations.

```python
# ==========================================
# Day 14: Dictionary Operations Demonstration
# ==========================================

def main() -> None:
    # 1. Initialize a Dictionary representing a User Profile
    user_profile: dict[str, object] = {
        "user_id": 8841,
        "username": "sarah_connor",
        "email": "sarah@cyberdyne.com",
        "is_verified": True,
        "login_count": 14,
    }

    print("--- 1. Initial State ---")
    print(f"User Profile: {user_profile}")
    print(f"Total keys: {len(user_profile)}")

    # 2. Reading Values Safely
    print("\n--- 2. Reading Values ---")
    print(f"Username: {user_profile['username']}")
    
    # Safe retrieval with fallback default values
    phone = user_profile.get("phone_number", "Not Provided")
    print(f"Phone Number: {phone}")

    # 3. Modifying and Adding Entries
    print("\n--- 3. Updating & Adding Data ---")
    # Increment login count
    user_profile["login_count"] += 1
    
    # Add new key-value pairs using .update()
    user_profile.update({
        "last_login": "2026-03-30 08:30:00",
        "roles": ["user", "administrator"]
    })
    print(f"Updated Profile: {user_profile}")

    # 4. Key Existence Checking
    print("\n--- 4. Membership Testing ---")
    key_to_check = "email"
    if key_to_check in user_profile:
        print(f"Key '{key_to_check}' exists with value: {user_profile[key_to_check]}")

    if "two_factor_auth" not in user_profile:
        print("Key 'two_factor_auth' is missing from profile.")

    # 5. Iteration Techniques
    print("\n--- 5. Iterating Through Dictionaries ---")
    
    print("Keys:")
    for key in user_profile.keys():
        print(f"  - {key}")

    print("\nValues:")
    for val in user_profile.values():
        print(f"  - {val}")

    print("\nKey-Value Pairs:")
    for key, value in user_profile.items():
        print(f"  - {key}: {value}")

    # 6. Deletion Methods
    print("\n--- 6. Deleting Keys ---")
    removed_email = user_profile.pop("email")
    print(f"Removed Email: {removed_email}")
    
    # Remove last inserted item
    last_item = user_profile.popitem()
    print(f"Removed Last Item: {last_item}")

    print(f"Final State: {user_profile}")

if __name__ == "__main__":
    main()
```

---

## 📊 Expected Output

```text
--- 1. Initial State ---
User Profile: {'user_id': 8841, 'username': 'sarah_connor', 'email': 'sarah@cyberdyne.com', 'is_verified': True, 'login_count': 14}
Total keys: 5

--- 2. Reading Values ---
Username: sarah_connor
Phone Number: Not Provided

--- 3. Updating & Adding Data ---
Updated Profile: {'user_id': 8841, 'username': 'sarah_connor', 'email': 'sarah@cyberdyne.com', 'is_verified': True, 'login_count': 15, 'last_login': '2026-03-30 08:30:00', 'roles': ['user', 'administrator']}

--- 4. Membership Testing ---
Key 'email' exists with value: sarah@cyberdyne.com
Key 'two_factor_auth' is missing from profile.

--- 5. Iterating Through Dictionaries ---
Keys:
  - user_id
  - username
  - email
  - is_verified
  - login_count
  - last_login
  - roles

Values:
  - 8841
  - sarah_connor
  - sarah@cyberdyne.com
  - True
  - 15
  - 2026-03-30 08:30:00
  - ['user', 'administrator']

Key-Value Pairs:
  - user_id: 8841
  - username: sarah_connor
  - email: sarah@cyberdyne.com
  - is_verified: True
  - login_count: 15
  - last_login: 2026-03-30 08:30:00
  - roles: ['user', 'administrator']

--- 6. Deleting Keys ---
Removed Email: sarah@cyberdyne.com
Removed Last Item: ('roles', ['user', 'administrator'])
Final State: {'user_id': 8841, 'username': 'sarah_connor', 'is_verified': True, 'login_count': 15, 'last_login': '2026-03-30 08:30:00'}
```

---

## 🌍 Real-World Applications

1. **REST API Payloads (JSON Conversion)**:
   Modern web APIs communicate via JSON (JavaScript Object Notation). Python dictionaries map directly 1:1 with JSON objects, making them the default structure for handling HTTP request bodies and responses.

2. **Configuration Management**:
   Application settings, database connection parameters, and feature toggles are routinely stored in dictionaries loaded from `.json`, `.yaml`, or environment variables.

3. **Caching & In-Memory Lookups**:
   Due to $O(1)$ constant-time lookup performance, dictionaries are used to cache expensive computation results (memoization) or index records by unique identifiers (e.g., mapping `user_id` to `User` objects).

4. **Data Aggregation and Counting**:
   When parsing logs, telemetry, or text corpora, dictionaries are ideal for aggregating metrics, such as counting occurrence frequencies of distinct items.

---

## 💡 Best Practices

### ✅ Recommended Patterns

- **Use `.get()` for Optional Keys**: Avoid raising unhandled `KeyError` exceptions when retrieving optional metadata.
  ```python
  # Good
  theme = user_preferences.get("theme", "light")
  ```

- **Unpack with `.items()`**: Iterate over key-value pairs simultaneously using tuple unpacking rather than looking up keys repeatedly.
  ```python
  # Good
  for key, val in settings.items():
      print(f"{key} -> {val}")

  # Avoid
  for key in settings:
      print(f"{key} -> {settings[key]}")
  ```

- **Use Meaningful, Immutable Keys**: Stick to strings or integers for dictionary keys to ensure readability and stability.

### ⚠️ Common Pitfalls

- **Using Mutable Objects as Keys**: Attempting to use a `list` or `dict` as a key raises a `TypeError: unhashable type`.
  ```python
  # Bad - TypeError!
  data = {[1, 2]: "values"}
  
  # Correct - Use a tuple instead
  data = {(1, 2): "values"}
  ```

- **Modifying Dictionary Size During Iteration**: Modifying keys (adding or deleting items) directly while iterating over a dictionary raises a `RuntimeError`.
  ```python
  # Bad - Danger of RuntimeError
  for key in my_dict:
      if key.startswith("temp_"):
          del my_dict[key]

  # Correct - Iterate over a copy of keys or list of keys
  for key in list(my_dict.keys()):
      if key.startswith("temp_"):
          del my_dict[key]
  ```

---

## 📝 Summary & Key Takeaways

Today you learned how to harness Python dictionaries for efficient data organization using key-value mapping.

### Quick Reference Cheat Sheet

| Operation | Syntax Example | Notes / Behavior |
| :--- | :--- | :--- |
| **Create** | `d = {"key": "val"}` | Literal key-value dictionary creation |
| **Access** | `d["key"]` vs `d.get("key", default)` | Direct indexing vs safe retrieval |
| **Insert/Update** | `d["key"] = new_val` | Updates existing key or appends new key |
| **Delete** | `val = d.pop("key", default)` | Safely removes key and returns value |
| **Check Key** | `"key" in d` | Fast $O(1)$ key membership test |
| **Unpack Items**| `for k, v in d.items():` | Iterates directly through pairs |

**Next Lesson (Day 15):** We will explore **Sets & Set Operations**, discovering how to handle unique element collections, mathematical set relations, and deduplication logic.
