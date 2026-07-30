# Day 015: Dictionary Operations & Methods

> **Difficulty:** Beginner | **Topic:** Data Structures | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Master key built-in dictionary methods including `.get()`, `.pop()`, `.update()`, and `.setdefault()`.
- Access, mutate, and delete key-value pairs safely without triggering `KeyError` exceptions.
- Work efficiently with dictionary view objects (`.keys()`, `.values()`, `.items()`).
- Merge dictionaries using modern Python operators (`|`, `|=`) and standard methods (`.update()`).

---

## 📚 Theory & Concepts

### What is a Python Dictionary?
A Python dictionary (`dict`) is an **unordered (insertion-ordered since Python 3.7)**, **mutable** collection of key-value pairs. Dictionaries map unique keys to values, making them ideal for modeling real-world entities, configuration settings, and database records.

Under the hood, Python dictionaries are implemented using a **Hash Table**. This implementation allows for average constant time complexity, **$O(1)$**, for lookup, insertion, and deletion operations.

```
+-------------------------------------------------------------+
|                      HASH TABLE LAYOUT                      |
+-------------------------------------------------------------+
   Key (Hashable)          Hash Function          Value Value
  ["user_id"]     ---> [ 0x7f8b92a1 ] ---> [ 10492 ]
  ["username"]    ---> [ 0x3d4e11c9 ] ---> [ "codemaster" ]
  ["is_active"]   ---> [ 0x8a1001b2 ] ---> [ True ]
```

### Key Requirements & Properties

1. **Keys Must Be Hashable (Immutable):**
   A key can be any object that has a fixed hash value that never changes during its lifetime.
   - **Allowed Keys:** `str`, `int`, `float`, `bool`, `tuple` (containing only immutable elements), `frozenset`.
   - **Disallowed Keys:** `list`, `dict`, `set` (will raise `TypeError: unhashable type`).

2. **Keys Are Unique:**
   A dictionary cannot contain duplicate keys. Assigning a value to an existing key overwrites the previous value.

3. **Values Can Be Anything:**
   Dictionary values have no restrictions—they can be duplicates, nested dictionaries, lists, functions, or `None`.

### Core Method Categories

| Category | Primary Methods | Description |
| :--- | :--- | :--- |
| **Lookup & Access** | `.get()`, `.setdefault()` | Retrieve values safely without risking runtime errors |
| **View Objects** | `.keys()`, `.values()`, `.items()` | Dynamic view objects reflecting dict contents |
| **Modification & Merging** | `.update()`, `\|`, `\|=`, `.copy()` | Modify existing keys or combine multiple dictionaries |
| **Deletion** | `.pop()`, `.popitem()`, `.clear()` | Remove specific key-value pairs or purge all entries |

---

## 💻 Syntax & Structure

### Safe Access & Mutation

```python
# Safe retrieval with a fallback default value
value = dictionary.get(key, default_value)

# Set key to default value ONLY if key is not already present
value = dictionary.setdefault(key, default_value)
```

### Dictionary Views

```python
# Dynamic view of keys
keys_view = dictionary.keys()

# Dynamic view of values
values_view = dictionary.values()

# Dynamic view of key-value tuples
items_view = dictionary.items()
```

### Merging & Updating

```python
# In-place update using .update()
dictionary.update(other_dictionary)

# Dictionary Union Operator (Python 3.9+) creates a new dictionary
merged_dict = dict_a | dict_b

# In-place Union Update (Python 3.9+)
dict_a |= dict_b
```

### Deletion Methods

```python
# Removes key and returns its value (raises KeyError if key missing, unless default is provided)
val = dictionary.pop(key, default_value)

# Removes and returns the last inserted (key, value) tuple (LIFO order)
key, val = dictionary.popitem()

# Removes all key-value pairs
dictionary.clear()
```

---

## 🧪 Code Examples

The script below demonstrates dictionary methods in a real-world user management scenario.

```python
# Day 15: Dictionary Operations and Methods Demonstration

# 1. Initialization
user_profile = {
    "username": "coder_dev",
    "email": "dev@example.com",
    "role": "developer",
    "login_count": 12,
}

print("=== 1. Safe Access with .get() and .setdefault() ===")
# Safe access with .get()
email = user_profile.get("email", "not_found@example.com")
theme = user_profile.get("theme", "dark")  # Key 'theme' doesn't exist yet

print(f"Email: {email}")
print(f"Theme (Default applied): {theme}")

# Ensure dynamic default initialization using .setdefault()
# Adds key with default if missing; returns current value if present.
user_avatar = user_profile.setdefault("avatar", "default_avatar.png")
existing_role = user_profile.setdefault("role", "guest")

print(f"Set Avatar: {user_avatar}")
print(f"Existing Role (unchanged): {existing_role}")

print("\n=== 2. Inspecting Dictionary Views ===")
# Dictionary views automatically reflect structural updates
print(f"All Keys   : {list(user_profile.keys())}")
print(f"All Values : {list(user_profile.values())}")

print("\nIterating key-value pairs using .items():")
for key, value in user_profile.items():
    print(f"  -> {key}: {value}")

print("\n=== 3. Merging and Updating Dictionaries ===")
new_preferences = {
    "theme": "light",
    "notifications": True,
    "login_count": 13,  # Will overwrite existing key
}

# Method A: Union operator '|' (Python 3.9+)
combined_profile = user_profile | new_preferences
print(f"Merged Profile (via '|'): {combined_profile}")

# Method B: In-place update using .update()
user_profile.update({"status": "active", "login_count": 14})
print(f"Updated Profile (via .update()): {user_profile}")

print("\n=== 4. Removing Items ===")
# Remove specific key with fallback
removed_role = user_profile.pop("role", "No Role Assigned")
print(f"Popped Role: {removed_role}")

# Pop last inserted item (LIFO order)
last_key, last_val = user_profile.popitem()
print(f"Popped Item LIFO: ({last_key}: {last_val})")

# Keyword removal with 'del'
if "email" in user_profile:
    del user_profile["email"]
    print("Successfully deleted 'email' key.")

print(f"Profile state before clear(): {user_profile}")

# Clear dictionary completely
user_profile.clear()
print(f"Profile state after clear(): {user_profile}")
```

---

## 📊 Expected Output

```text
=== 1. Safe Access with .get() and .setdefault() ===
Email: dev@example.com
Theme (Default applied): dark
Set Avatar: default_avatar.png
Existing Role (unchanged): developer

=== 2. Inspecting Dictionary Views ===
All Keys   : ['username', 'email', 'role', 'login_count', 'avatar']
All Values : ['coder_dev', 'dev@example.com', 'developer', 12, 'default_avatar.png']

Iterating key-value pairs using .items():
  -> username: coder_dev
  -> email: dev@example.com
  -> role: developer
  -> login_count: 12
  -> avatar: default_avatar.png

=== 3. Merging and Updating Dictionaries ===
Merged Profile (via '|'): {'username': 'coder_dev', 'email': 'dev@example.com', 'role': 'developer', 'login_count': 13, 'avatar': 'default_avatar.png', 'theme': 'light', 'notifications': True}
Updated Profile (via .update()): {'username': 'coder_dev', 'email': 'dev@example.com', 'role': 'developer', 'login_count': 14, 'avatar': 'default_avatar.png', 'status': 'active'}

=== 4. Removing Items ===
Popped Role: developer
Popped Item LIFO: (status: active)
Successfully deleted 'email' key.
Profile state before clear(): {'username': 'coder_dev', 'login_count': 14, 'avatar': 'default_avatar.png'}
Profile state after clear(): {}
```

---

## 🌍 Real-World Applications

### 1. Processing Web API Responses (JSON Parsing)
When fetching data from REST APIs, responses map directly to Python dictionaries. Using `.get()` helps safely parse nested or optional JSON fields without crashing the application.

```python
api_response = {
    "status": 200,
    "data": {"user": {"id": 101, "name": "Sarah"}},
}

# Safely nested retrieval
user_data = api_response.get("data", {}).get("user", {})
username = user_data.get("name", "Anonymous")
```

### 2. Frequency Aggregation
Dictionaries excel at tracking item counts dynamically across large datasets.

```python
words = ["python", "code", "python", "data", "code", "python"]
word_counts = {}

for word in words:
    # Set initial default count to 0, then increment
    word_counts[word] = word_counts.get(word, 0) + 1

# Output: {'python': 3, 'code': 2, 'data': 1}
```

### 3. Application Settings & Configuration Management
Modern web frameworks merge system environment variables with default values using dictionary updates or union operations.

---

## 💡 Best Practices

- **Prefer `.get()` over Direct Bracket Notation `[]` when Keys are Uncertain:**
  Direct access (`dict[key]`) raises a `KeyError` if the key does not exist. Use `.get(key, default)` when handling external or optional data.

- **Use Key Membership Checking Before Manual Removal:**
  Always verify `if key in my_dict:` before calling `del my_dict[key]`, or use `my_dict.pop(key, None)` to eliminate `KeyError` risk.

- **Avoid Direct Keys Mutating During Iteration:**
  Modifying keys in a dictionary while looping directly over it causes a runtime error (`RuntimeError: dictionary changed size during iteration`). Iterate over a list copy instead:
  ```python
  # SAFE: Iterate over a list of keys
  for key in list(my_dict.keys()):
      if my_dict[key] < 0:
          del my_dict[key]
  ```

- **Leverage Modern Dict Merging:**
  Prefer `dict_a | dict_b` (Python 3.9+) over legacy `copy()` + `update()` patterns when creating new merged dictionaries for cleaner, more readable code.

---

## 📝 Summary & Key Takeaways

### Key Takeaways
1. **Hash Table Performance:** Lookups, insertions, and deletions on dictionaries operate in constant $O(1)$ time complexity on average.
2. **Safe Retrieval:** Use `.get(key, default)` and `.setdefault(key, default)` to handle absent keys gracefully.
3. **Dynamic View Objects:** `.keys()`, `.values()`, and `.items()` return live views that update as the underlying dictionary changes.
4. **Dictionary Union:** Python 3.9+ introduced `|` (merge) and `|=` (update) operators for concise dictionary combination.

### What's Next?
Tomorrow on **Day 16**, we will dive into **Dictionary Comprehensions & Advanced Data Structures**, learning how to construct, filter, and transform complex dictionaries efficiently in a single line of code!
