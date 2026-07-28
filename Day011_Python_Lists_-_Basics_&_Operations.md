# Day 011: Python Lists - Basics & Operations

> **Difficulty:** Beginner | **Topic:** Data Structures | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives

By the end of this lesson, you will be able to:
- Define and construct Python **lists** using literal syntax and the `list()` constructor.
- Access and modify list elements using **zero-based indexing** and **negative indexing**.
- Extract sublists precisely using **slicing syntax** (`start:stop:step`).
- Differentiate between **mutable** list operations and immutable data behaviors.
- Manipulate lists using built-in methods: `append()`, `extend()`, `insert()`, `remove()`, `pop()`, and `sort()`.
- Apply essential built-in functions such as `len()`, `min()`, `max()`, `sum()`, and standard membership tests (`in`).

---

## 📚 Theory & Concepts

### What is a List?

In Python, a **list** is a sequence data structure that is:
1. **Ordered**: Elements maintain the specific sequence in which they were inserted.
2. **Mutable**: Elements can be added, updated, or removed in place without creating a new list object in memory.
3. **Heterogeneous**: Elements do not need to share the same data type. A single list can simultaneously contain integers, strings, floats, booleans, and even other lists.

### How Python Lists Work in Memory

Under the hood, Python lists are dynamic array references. Rather than storing raw bytes directly inside contiguous memory, a list stores **pointers (references)** to memory locations where actual Python objects reside.

```
List Memory Structure:
  
  Index:       0         1         2         3
           +---------+---------+---------+---------+
  List     | PTR  ---| PTR  ---| PTR  ---| PTR  ---|
           +----+----+----+----+----+----+----+----+
                |         |         |         |
                v         v         v         v
             +-----+   +-----+   +-----+   +-----+
  Objects    | 100 |   |"Py" |   | 3.14|   | True|
             +-----+   +-----+   +-----+   +-----+
```

Because memory slots inside the list array hold constant-sized references (pointers), accessing any element by its index takes **$O(1)$ constant time**, regardless of how large the list grows.

---

### Indexing Schemes

Python lists support dual indexing: **Positive Indexing** (left-to-right starting at `0`) and **Negative Indexing** (right-to-left starting at `-1`).

```
Element Values:    ["Python", "Data", "Science", "AI"]
Positive Index:        0         1         2        3
Negative Index:       -4        -3        -2       -1
```

---

### Slicing Mechanics

Slicing extracts a segment of a list without mutating the original list.

```python
sequence[start:stop:step]
```

- **`start`**: Index where the slice begins (inclusive). Default is `0`.
- **`stop`**: Index where the slice ends (**exclusive**). Default is `len(sequence)`.
- **`step`**: Number of indices to jump. Default is `1`. A negative step traverses backwards.

---

## 💻 Syntax & Structure

### List Creation

```python
# Empty lists
empty_list_1 = []
empty_list_2 = list()

# Homogeneous list
integers = [10, 20, 30, 40]

# Heterogeneous list
mixed_data = [42, "Data Science", 3.14159, True, None]

# Creating a list from another sequence (String to List of characters)
char_list = list("Python")  # ['P', 'y', 't', 'h', 'o', 'n']
```

### Core Operations & Methods Summary

| Operation / Method | Description | Example | Time Complexity |
| :--- | :--- | :--- | :--- |
| `list[i]` | Access element at index `i` | `fruits[0]` | $O(1)$ |
| `list[i] = val` | Assign value at index `i` | `fruits[1] = "pear"` | $O(1)$ |
| `.append(val)` | Add `val` to end of list | `fruits.append("apple")` | $O(1)$ amortized |
| `.insert(i, val)` | Insert `val` at index `i` | `fruits.insert(0, "fig")` | $O(n)$ |
| `.extend(iterable)`| Append all items from iterable | `fruits.extend(["kiwi", "plum"])` | $O(k)$ ($k$=length) |
| `.remove(val)` | Remove first occurrence of `val` | `fruits.remove("apple")` | $O(n)$ |
| `.pop(i)` | Remove & return item at index `i` | `item = fruits.pop(2)` | $O(n)$ ($O(1)$ if last index) |
| `.clear()` | Remove all items | `fruits.clear()` | $O(n)$ |
| `val in list` | Check element existence | `"apple" in fruits` | $O(n)$ |

---

## 🧪 Code Examples

Below is a complete script demonstrating list creation, element modification, indexing, slicing, and common array manipulations.

```python
# =====================================================================
# 1. LIST CREATION AND INDEXING
# =====================================================================
print("--- 1. List Creation & Indexing ---")
servers = ["web-01", "db-01", "cache-01", "app-01"]

print(f"First server (index 0): {servers[0]}")
print(f"Last server (index -1): {servers[-1]}")
print(f"Second to last server (index -2): {servers[-2]}")

# =====================================================================
# 2. SLICING PATTERNS
# =====================================================================
print("\n--- 2. Slicing Patterns ---")
numbers = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]

print(f"Full List:          {numbers}")
print(f"First 3 items [0:3]: {numbers[:3]}")
print(f"From index 5 to end: {numbers[5:]}")
print(f"Middle range [3:7]:  {numbers[3:7]}")
print(f"Every 2nd item [::2]:{numbers[::2]}")
print(f"Reversed list [::-1]:{numbers[::-1]}")

# =====================================================================
# 3. MUTABILITY & MODIFICATION
# =====================================================================
print("\n--- 3. Mutability & Updates ---")
languages = ["Python", "Java", "C++", "Ruby"]
print(f"Original: {languages}")

# Update single element
languages[3] = "Rust"
print(f"After replacing Ruby with Rust: {languages}")

# Update range via slicing
languages[1:3] = ["TypeScript", "Go"]
print(f"After replacing range [1:3]: {languages}")

# =====================================================================
# 4. ADDING AND REMOVING ELEMENTS
# =====================================================================
print("\n--- 4. Adding & Removing Elements ---")
inventory = ["Laptop", "Mouse"]

# Adding items
inventory.append("Keyboard")
print(f"After append('Keyboard'): {inventory}")

inventory.insert(1, "Monitor")
print(f"After insert(1, 'Monitor'): {inventory}")

inventory.extend(["Headphones", "Webcam"])
print(f"After extend(['Headphones', 'Webcam']): {inventory}")

# Removing items
removed_item = inventory.pop(2)
print(f"Popped item at index 2: {removed_item}")
print(f"List after pop: {inventory}")

inventory.remove("Headphones")
print(f"After remove('Headphones'): {inventory}")

# =====================================================================
# 5. LIST UTILITY FUNCTIONS & SORTING
# =====================================================================
print("\n--- 5. Utility Functions & Sorting ---")
scores = [88, 42, 95, 73, 100, 61]

print(f"Score Count: {len(scores)}")
print(f"Minimum Score: {min(scores)}")
print(f"Maximum Score: {max(scores)}")
print(f"Total Score Sum: {sum(scores)}")

# In-place sorting
scores.sort()
print(f"Sorted ascending: {scores}")

scores.sort(reverse=True)
print(f"Sorted descending: {scores}")

# Searching
is_hundred_present = 100 in scores
print(f"Is 100 in scores? {is_hundred_present}")
```

---

## 📊 Expected Output

```text
--- 1. List Creation & Indexing ---
First server (index 0): web-01
Last server (index -1): app-01
Second to last server (index -2): cache-01

--- 2. Slicing Patterns ---
Full List:          [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
First 3 items [0:3]: [0, 10, 20]
From index 5 to end: [50, 60, 70, 80, 90]
Middle range [3:7]:  [30, 40, 50, 60]
Every 2nd item [::2]:[0, 20, 40, 60, 80]
Reversed list [::-1]:[90, 80, 70, 60, 50, 40, 30, 20, 10, 0]

--- 3. Mutability & Updates ---
Original: ['Python', 'Java', 'C++', 'Ruby']
After replacing Ruby with Rust: ['Python', 'Java', 'C++', 'Rust']
After replacing range [1:3]: ['Python', 'TypeScript', 'Go', 'Rust']

--- 4. Adding & Removing Elements ---
After append('Keyboard'): ['Laptop', 'Mouse', 'Keyboard']
After insert(1, 'Monitor'): ['Laptop', 'Monitor', 'Mouse', 'Keyboard']
After extend(['Headphones', 'Webcam']): ['Laptop', 'Monitor', 'Mouse', 'Keyboard', 'Headphones', 'Webcam']
Popped item at index 2: Mouse
List after pop: ['Laptop', 'Monitor', 'Keyboard', 'Headphones', 'Webcam']
After remove('Headphones'): ['Laptop', 'Monitor', 'Keyboard', 'Webcam']

--- 5. Utility Functions & Sorting ---
Score Count: 6
Minimum Score: 42
Maximum Score: 100
Total Score Sum: 459
Sorted ascending: [42, 61, 73, 88, 95, 100]
Sorted descending: [100, 95, 88, 73, 61, 42]
Is 100 in scores? True
```

---

## 🌍 Real-World Applications

1. **User Queue & Event Stream Handling**
   Backend applications process asynchronous jobs, incoming web requests, or task queues using lists as standard buffer systems.

2. **Data Pipeline Processing**
   Data engineers read unstructured raw API logs or CSV rows into lists before executing filtering, transformations, and schema mapping.

3. **Batch Database Records Parsing**
   When pulling database results via ORMs or drivers like `psycopg2` or `sqlite3`, rows are returned as collections of nested lists or lists of tuples representing table records.

---

## 💡 Best Practices

- **Avoid modifying a list while iterating over it directly**: Iterating and removing items simultaneously alters list indices during runtime, leading to skipped elements or runtime bugs. Create a copy (`list.copy()`) or use filtering techniques instead.

  ```python
  # BAD PRACTICE
  numbers = [1, 2, 3, 4, 5]
  for num in numbers:
      if num % 2 == 0:
          numbers.remove(num)  # Causes index displacement bugs!

  # GOOD PRACTICE
  numbers = [1, 2, 3, 4, 5]
  filtered_numbers = [num for num in numbers if num % 2 != 0]
  ```

- **Use `.extend()` instead of multiple `.append()` calls or `+` in loops**: 
  Using `list = list + [item]` creates a completely new list object in memory during every iteration ($O(n^2)$ time), whereas `.extend()` or `.append()` modifies the list in-place ($O(n)$ overall).

- **Be careful with reference copies**:
  Assigning `b = a` creates an alias to the **same list memory pointer**. To create a true distinct copy, use `.copy()` or full slicing `[:]`.

  ```python
  original = [1, 2, 3]
  alias = original         # Modifying 'alias' WILL change 'original'
  true_copy = original.copy() # Modifying 'true_copy' WILL NOT affect 'original'
  ```

- **Guard against `IndexError`**:
  Always verify sequence lengths or handle out-of-bounds risks before attempting explicit index operations like `items[5]`.

---

## 📝 Summary & Key Takeaways

In this lesson, you learned that:
- Lists are ordered, mutable, versatile sequences designed for dynamic collections.
- Python uses zero-based indexing for forward access and negative numbers for backward access.
- Slicing (`start:stop:step`) creates sublists efficiently without altering original objects.
- Mutation methods (`append`, `extend`, `insert`, `pop`, `remove`) enable real-time list transformation.
- Care must be taken when copying lists (`.copy()`) to avoid shared object mutation bugs.

**Next Up for Day 12:** **Advanced List Techniques & List Comprehensions** — Learn how to write concise, performant, single-line data filtering and transformation pipelines in Python!
