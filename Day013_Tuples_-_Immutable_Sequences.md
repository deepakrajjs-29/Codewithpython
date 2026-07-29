# Day 013: Tuples - Immutable Sequences

> **Difficulty:** Beginner | **Topic:** Data Structures | **Reading Time:** 12 mins

---

## 🎯 Learning Objectives
- Understand what tuples are and how they differ from lists in terms of mutability, memory allocation, and performance.
- Master tuple creation techniques, including literal syntax, single-element tuples, the `tuple()` constructor, and tuple packing/unpacking.
- Perform sequence operations on tuples: indexing, slicing, concatenation, repetition, and built-in methods (`count()` and `index()`).
- Grasp the concept of **shallow immutability** and understand how hashability enables tuples to serve as dictionary keys.

---

## 📚 Theory & Concepts

### What is a Tuple?
A **tuple** is a built-in Python data structure that represents an **ordered**, **immutable** sequence of elements. Like lists, tuples can store heterogeneous data types (integers, strings, floats, lists, or other tuples) and allow duplicate elements.

However, unlike lists, **tuples cannot be modified after creation**. You cannot append, insert, remove, or reassign elements in a tuple.

```
List vs. Tuple at a Glance:
┌───────────┬──────────────┬──────────────┬─────────────────────────┐
│ Feature   │ List         │ Tuple        │ Syntax Example          │
├───────────┼──────────────┼──────────────┼─────────────────────────┤
│ Mutability│ Mutable      │ Immutable    │ [1, 2] vs (1, 2)        │
│ Memory    │ Larger       │ Smaller      │ Oversized buffer allocation
│ Speed     │ Slower       │ Faster       │ Optimized element lookup│
│ Hashable  │ No           │ Yes*         │ Can be dictionary key   │
└───────────┴──────────────┴──────────────┴─────────────────────────┘
* A tuple is hashable only if all of its contained elements are also hashable.
```

### Why Immutability Matters
1. **Data Integrity & Safety**: Immutability guarantees that fixed data structures (e.g., database records, configuration settings, geographic coordinates) remain unchanged throughout program execution.
2. **Performance Optimization**: Python allocates exact memory footprints for tuples because their size is fixed. Lists allocate extra space to accommodate future `append()` calls.
3. **Hashability**: Because tuples are immutable, Python can compute a permanent hash value for them. This allows tuples to be used as keys in **dictionaries** and elements in **sets**—something lists cannot do.

### Tuple Memory Layout & Shallow Immutability
Tuples store references to objects, not the objects themselves. Immutability means the **references stored inside the tuple cannot be reassigned**.

If a tuple contains a mutable object (such as a list), the list's reference inside the tuple remains fixed, but the list itself can still be modified internally.

```
Memory Diagram: Shallow Immutability
===================================

Tuple Object: my_tuple = (100, [1, 2])
┌───────────────────────────────────────┐
│ Slot 0: Ref ───────────────> int: 100 │ (Immutable)
│ Slot 1: Ref ───────────────> List     │ (Mutable Container)
└───────────────────────────────────────┘
                                 │
                                 ▼
                          ┌─────────────┐
                          │ [1, 2]      │  <-- Elements inside this list
                          └─────────────┘      can still be appended/modified!
```

---

## 💻 Syntax & Structure

### 1. Creating Tuples
Tuples are primarily defined using parentheses `()`, though parentheses are often optional due to **tuple packing**.

```python
# Empty tuple
empty_tuple = ()
empty_tuple_constructor = tuple()

# Standard tuple with multiple elements
coordinates = (37.7749, -122.4194)

# Tuple without parentheses (Tuple Packing)
person = "Alice", 30, "Engineer"

# CRITICAL TRAP: Single-element tuple MUST have a trailing comma
not_a_tuple = (42)    # Evaluates to int: 42
is_a_tuple = (42,)     # Evaluates to tuple: (42,)
```

### 2. Accessing & Slicing Elements
Tuples use zero-based indexing and standard slicing syntax `tuple[start:stop:step]`.

```python
data = ("a", "b", "c", "d", "e")

first_item = data[0]        # 'a'
last_item = data[-1]        # 'e'
sub_sequence = data[1:4]    # ('b', 'c', 'd')
reversed_tuple = data[::-1] # ('e', 'd', 'c', 'b', 'a')
```

### 3. Tuple Packing and Extended Unpacking
Tuple unpacking assigns sequence elements to multiple variables in a single line.

```python
# Basic Unpacking
point = (10, 20, 30)
x, y, z = point  # x=10, y=20, z=30

# Extended Unpacking (using the * star operator)
numbers = (1, 2, 3, 4, 5)
head, *middle, tail = numbers
# head = 1
# middle = [2, 3, 4]  (unpacked variables gather into a list)
# tail = 5
```

### 4. Built-in Tuple Methods
Tuples have only **two** built-in methods due to their immutable nature:

```python
sample_tuple = (1, 2, 3, 2, 4, 2)

# 1. count(value): Returns the number of occurrences of value
twos = sample_tuple.count(2)  # Returns: 3

# 2. index(value): Returns the first zero-based index of value
first_two = sample_tuple.index(2)  # Returns: 1
```

---

## 🧪 Code Examples

Below is a complete, runnable Python 3.12 script demonstrating tuple mechanics, operations, immutability nuances, and memory efficiency comparisons.

```python
import sys

def main() -> None:
    print("=== 1. Tuple Creation & The Single-Element Trap ===")
    int_val = (100)
    tuple_val = (100,)

    print(f"Value: {int_val!r} | Type: {type(int_val).__name__}")
    print(f"Value: {tuple_val!r} | Type: {type(tuple_val).__name__}")

    print("\n=== 2. Tuple Packing & Extended Unpacking ===")
    # Packing user record
    user_data = ("usr_90210", "Alex", "DevOps", "US", "Active")

    # Extended unpacking: capture user_id, name, and gather remaining items
    user_id, name, *details = user_data
    print(f"User ID: {user_id}")
    print(f"Name   : {name}")
    print(f"Details: {details}")

    print("\n=== 3. Immutability & Shallow Immutability ===")
    # Creating a tuple containing a list
    team_data = ("Engineering", ["Alice", "Bob"])
    print(f"Initial Tuple: {team_data}")

    # Attempting to assign a new value directly to a tuple index
    try:
        team_data[0] = "Marketing"
    except TypeError as err:
        print(f"Caught expected error: {err}")

    # Mutating the internal list (Shallow Immutability)
    team_data[1].append("Charlie")
    print(f"Tuple after modifying internal list: {team_data}")

    print("\n=== 4. Tuple Methods & Search Operations ===")
    logs = ("INFO", "WARNING", "ERROR", "INFO", "CRITICAL", "INFO")

    info_count = logs.count("INFO")
    first_error_index = logs.index("ERROR")

    print(f"Count of 'INFO': {info_count}")
    print(f"First occurrence of 'ERROR' at index: {first_error_index}")

    print("\n=== 5. Tuples as Hashable Dictionary Keys ===")
    # Matrix coordinates represented as tuple keys
    grid_weights: dict[tuple[int, int], float] = {
        (0, 0): 1.0,
        (0, 1): 2.5,
        (1, 0): 0.0,
    }
    print(f"Weight at Coordinate (0, 1): {grid_weights[(0, 1)]}")

    print("\n=== 6. Memory Efficiency Comparison (List vs Tuple) ===")
    # Construct identical sequence elements
    sample_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    sample_tuple = (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

    list_size = sys.getsizeof(sample_list)
    tuple_size = sys.getsizeof(sample_tuple)

    print(f"Memory overhead for List  (10 items): {list_size} bytes")
    print(f"Memory overhead for Tuple (10 items): {tuple_size} bytes")
    print(f"Tuples save {list_size - tuple_size} bytes ({((list_size - tuple_size) / list_size) * 100:.1f}%)")

if __name__ == "__main__":
    main()
```

---

## 📊 Expected Output

```text
=== 1. Tuple Creation & The Single-Element Trap ===
Value: 100 | Type: int
Value: (100,) | Type: tuple

=== 2. Tuple Packing & Extended Unpacking ===
User ID: usr_90210
Name   : Alex
Details: ['DevOps', 'US', 'Active']

=== 3. Immutability & Shallow Immutability ===
Initial Tuple: ('Engineering', ['Alice', 'Bob'])
Caught expected error: 'tuple' object does not support item assignment
Tuple after modifying internal list: ('Engineering', ['Alice', 'Bob', 'Charlie'])

=== 4. Tuple Methods & Search Operations ===
Count of 'INFO': 3
First occurrence of 'ERROR' at index: 2

=== 5. Tuples as Hashable Dictionary Keys ===
Weight at Coordinate (0, 1): 2.5

=== 6. Memory Efficiency Comparison (List vs Tuple) ===
Memory overhead for List  (10 items): 136 bytes
Memory overhead for Tuple (10 items): 120 bytes
Tuples save 16 bytes (11.8%)
```

---

## 🌍 Real-World Applications

### 1. Function Multiple Return Values
When a Python function returns multiple comma-separated values, it implicitly packs them into a single tuple.

```python
def calculate_metrics(data: list[float]) -> tuple[float, float]:
    total = sum(data)
    average = total / len(data)
    return total, average  # Implicit tuple packing

total_val, avg_val = calculate_metrics([10.0, 20.0, 30.0])  # Unpacking
```

### 2. Database Records & SQL Query Fetching
Standard Python DB-API drivers (e.g., `sqlite3`, `psycopg2`) return database rows as tuples to maintain strict record structure and integrity:

```python
import sqlite3

conn = sqlite3.connect(":memory:")
cursor = conn.cursor()
cursor.execute("SELECT 'Alice', 30, 'Software Developer'")
user_record = cursor.fetchone()  # Returns: ('Alice', 30, 'Software Developer')
```

### 3. Composite Dictionary Keys
Because lists are unhashable, tuples are essential when you need compound keys in dictionaries, such as geographic coordinates `(lat, lon)` or matrix axes `(x, y, z)`.

---

## 💡 Best Practices

### Do's
- **Use tuples for heterogeneous data**: Use tuples when elements represent different fields of a single record (e.g., `(name, age, job)`). Use lists for homogeneous, variable-length collections (e.g., `[age1, age2, age3]`).
- **Include trailing commas for singletons**: Always write `(item,)` when creating a single-element tuple to avoid accidental scalar evaluation.
- **Leverage tuple unpacking**: Use `a, b = b, a` for variable swapping, and `head, *tail = items` instead of explicit index lookups (`items[0]`, `items[1:]`).

### Don'ts & Common Pitfalls
- **Don't place mutable objects inside hashable tuples**: Avoid placing lists or dictionaries inside tuples if you intend to use the tuple as a dictionary key or set element. Modifying the list will raise an unhashable `TypeError`.
- **Don't use tuples when frequent modification is needed**: If your code relies on converting back and forth between lists and tuples (`list(my_tuple)` -> modify -> `tuple(my_list)`), choose a **list** instead.

```python
# ❌ Pitfall: Unhashable tuple containing a mutable list
invalid_key = (1, 2, [3, 4])
bad_dict = {}
# bad_dict[invalid_key] = "Data"  # Raises TypeError: unhashable type: 'list'

# ✅ Fix: Use nested immutable tuples
valid_key = (1, 2, (3, 4))
good_dict = {valid_key: "Data"}
```

---

## 📝 Summary & Key Takeaways

1. **Immutable & Ordered**: Tuples maintain exact element order and cannot be mutated once initialized.
2. **Memory Efficient & Fast**: Because tuples are fixed in size, CPython optimizes memory usage and accelerates element iteration compared to dynamic lists.
3. **Syntax Rules**: Parentheses define tuples, but the **comma** actually creates them. Always include a trailing comma for single-element tuples `(x,)`.
4. **Unpacking**: The Python `*` operator unlocks flexible tuple decomposition without manual slicing or indexing.
5. **Hashable Keys**: Immutable tuples containing only immutable types can be hashed, making them ideal composite keys for Python dictionaries.

**Next Up (Day 14):** *Dictionaries - Hash Maps & Key-Value Storage* — We will dive deep into how Python implements super-fast $O(1)$ lookups using hash tables!
