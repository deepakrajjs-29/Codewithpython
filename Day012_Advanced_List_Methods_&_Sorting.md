# Day 012: Advanced List Methods & Sorting

> **Difficulty:** Beginner | **Topic:** Data Structures | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Master the difference between in-place list modification (`list.sort()`) and creating new sorted sequences (`sorted()`).
- Utilize the `key` parameter and `lambda` functions for custom, multi-attribute, and case-insensitive sorting.
- Apply advanced list operations including `.index()`, `.count()`, `.copy()`, and list reversal techniques.
- Understand memory reference mechanics (shallow copying vs. variable assignment) when cloning lists.

---

## 📚 Theory & Concepts

### 1. In-Place Mutation vs. Non-Mutating Functions
In Python, standard list manipulation methods generally fall into two architectural categories:
1. **In-Place Mutators:** Methods that modify the memory buffer of the existing list instance and return `None`. Examples: `list.sort()`, `list.reverse()`, `list.extend()`.
2. **Non-Mutating Functions:** Functions that accept a list, perform an operation, and return a *new* object, leaving the original list untouched. Example: `sorted()`, `reversed()`.

```
In-Place Mutation (list.sort()):
Original List [ 3, 1, 2 ]  ──► [ Mutates Memory ] ──► Original List [ 1, 2, 3 ]
Return Value: None

Non-Mutating (sorted(list)):
Original List [ 3, 1, 2 ]  ──► [ Creates New Object ] ──► New List [ 1, 2, 3 ]
                                                      └── Original List [ 3, 1, 2 ] (Unchanged)
```

### 2. Under the Hood: Timsort Algorithm
Python uses **Timsort** for ordering operations (used by both `.sort()` and `sorted()`). Timsort is a hybrid, stable sorting algorithm derived from Merge Sort and Insertion Sort. 
- **Time Complexity:** $O(N \log N)$ worst/average case, $O(N)$ best case (when data is already partially ordered).
- **Stability:** Timsort guarantees that two items with equal keys retain their relative order from the input.

### 3. The Power of the `key` Parameter
The `key` parameter accepts a single-argument function (a standard function or a `lambda`). Python applies this function to each list item *prior* to comparison. The original items in the list remain unchanged; only the intermediate transformation values dictate the final ordering.

---

## 💻 Syntax & Structure

### Method Signatures

```python
# 1. Searching & Counting
index_position = list_obj.index(element, start=0, stop=len(list_obj))
occurrence_count = list_obj.count(element)

# 2. Copying
shallow_copy = list_obj.copy()

# 3. In-Place Sorting (Modifies list_obj directly, returns None)
list_obj.sort(key=None, reverse=False)

# 4. Built-in Sorting Function (Returns a new sorted list)
new_list = sorted(iterable, key=None, reverse=False)
```

### Key Functions & Lambda Syntax
A `lambda` is an anonymous inline function defined as `lambda argument: expression`.

```python
# Sort by string length
words = ["python", "c", "javascript"]
words.sort(key=len)

# Sort dictionary items by a specific key using a lambda
data = [{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]
sorted_data = sorted(data, key=lambda person: person["age"])
```

---

## 🧪 Code Examples

```python
# ==========================================
# 1. Searching & Inspection Methods
# ==========================================
print("--- 1. Searching & Inspection ---")
frameworks = ["Django", "Flask", "FastAPI", "Flask", "Pyramid"]

# Count occurrences
flask_count = frameworks.count("Flask")
print(f"'Flask' appears {flask_count} times.")

# Find position (returns first occurrence index)
fastapi_idx = frameworks.index("FastAPI")
print(f"'FastAPI' is at index {fastapi_idx}.")

# Safe search using conditional check to avoid ValueError
search_item = "Tornado"
if search_item in frameworks:
    print(f"Index: {frameworks.index(search_item)}")
else:
    print(f"'{search_item}' was not found in the list.")

print()

# ==========================================
# 2. In-Place sort() vs. Out-of-Place sorted()
# ==========================================
print("--- 2. Sorting Mechanics ---")
numbers = [42, 12, 88, 3, 27]

# Using sorted() -> Creates a new list
sorted_numbers = sorted(numbers)
print(f"Original numbers list: {numbers}")
print(f"New sorted list:       {sorted_numbers}")

# Using .sort() -> Modifies in-place
numbers.sort(reverse=True)
print(f"Original numbers after .sort(reverse=True): {numbers}")

print()

# ==========================================
# 3. Custom Sorting with Key Functions
# ==========================================
print("--- 3. Custom Sorting with Keys ---")
mixed_case_words = ["banana", "Apple", "cherry", "date", "Elderberry"]

# Standard sort (Uppercase letters come before lowercase in ASCII)
ascii_sorted = sorted(mixed_case_words)
print(f"Standard ASCII Sort:      {ascii_sorted}")

# Case-insensitive sort using str.lower key
case_insensitive = sorted(mixed_case_words, key=str.lower)
print(f"Case-Insensitive Sort:    {case_insensitive}")

# Sort by length of string
length_sorted = sorted(mixed_case_words, key=len)
print(f"Sorted by String Length:  {length_sorted}")

print()

# ==========================================
# 4. Sorting Complex Data Structures
# ==========================================
print("--- 4. Sorting Dictionaries & Multi-Attributes ---")
inventory = [
    {"name": "Laptop", "price": 1200, "rating": 4.8},
    {"name": "Mouse", "price": 25, "rating": 4.5},
    {"name": "Monitor", "price": 300, "rating": 4.8},
    {"name": "Keyboard", "price": 100, "rating": 4.2},
]

# Sort by price (ascending)
sorted_by_price = sorted(inventory, key=lambda item: item["price"])
print("Sorted by Price (Lowest First):")
for item in sorted_by_price:
    print(f"  - {item['name']}: ${item['price']}")

# Multi-Attribute Sort: Primary by rating (descending), secondary by price (ascending)
# Using a tuple in key: (-rating, price) negates rating for descending order
multi_sorted = sorted(inventory, key=lambda x: (-x["rating"], x["price"]))
print("\nSorted by Rating (High-to-Low), then Price (Low-to-High):")
for item in multi_sorted:
    print(f"  - {item['name']} | Rating: {item['rating']} | Price: ${item['price']}")

print()

# ==========================================
# 5. List Copying Pitfalls
# ==========================================
print("--- 5. Shallow Copy vs Reference Assignment ---")
original = [1, 2, 3]

# Reference assignment (Both variables point to the SAME memory block)
reference_alias = original
reference_alias.append(99)
print(f"Original after modifying reference alias: {original}")

# Real Shallow Copy
true_copy = original.copy()
true_copy.append(100)
print(f"Original after modifying true copy:      {original}")
print(f"True Copy List:                          {true_copy}")
```

---

## 📊 Expected Output

```text
--- 1. Searching & Inspection ---
'Flask' appears 2 times.
'FastAPI' is at index 2.
'Tornado' was not found in the list.

--- 2. Sorting Mechanics ---
Original numbers list: [42, 12, 88, 3, 27]
New sorted list:       [3, 12, 27, 42, 88]
Original numbers after .sort(reverse=True): [88, 42, 27, 12, 3]

--- 3. Custom Sorting with Keys ---
Standard ASCII Sort:      ['Apple', 'Elderberry', 'Apple' -> 'Apple', 'banana', 'cherry', 'date']
Case-Insensitive Sort:    ['Apple', 'banana', 'cherry', 'date', 'Elderberry']
Sorted by String Length:  ['date', 'Apple', 'banana', 'cherry', 'Elderberry']

--- 4. Sorting Dictionaries & Multi-Attributes ---
Sorted by Price (Lowest First):
  - Mouse: $25
  - Keyboard: $100
  - Monitor: $300
  - Laptop: $1200

Sorted by Rating (High-to-Low), then Price (Low-to-High):
  - Monitor | Rating: 4.8 | Price: $300
  - Laptop | Rating: 4.8 | Price: $1200
  - Mouse | Rating: 4.5 | Price: $25
  - Keyboard | Rating: 4.2 | Price: $100

--- 5. Shallow Copy vs Reference Assignment ---
Original after modifying reference alias: [1, 2, 3, 99]
Original after modifying true copy:      [1, 2, 3, 99]
True Copy List:                          [1, 2, 3, 99, 100]
```

---

## 🌍 Real-World Applications

### 1. E-Commerce Product Filtering & Catalog Layout
Online stores require dynamic sorting based on user selections: Price: Low to High, Highest Customer Rating, or Most Recent Arrival. Custom key sorting enables seamless reorganization of backend API JSON responses before delivering payload data to frontend clients.

### 2. Leaderboards & Tournament Brackets
Gaming backends sort player accounts using multi-key tuples: primary key is total score (descending), and secondary tie-breaker key is completion time (ascending).

### 3. Log File Processing Pipelines
DevOps engineers parse, filter, and sort unstructured server log entries by extracting embedded timestamps using regex or string splitting, ordering operations across distributed instances before error tracing.

---

## 💡 Best Practices

- **Avoid the `None` Return Assignment Bug:** `list.sort()` alters the list in place and returns `None`. Never assign `my_list = my_list.sort()`, as this overwrites your variable with `None`.
- **Always Check Membership Before `index()`:** Calling `.index(x)` on a list that does not contain `x` raises a runtime `ValueError`. Check `if x in my_list:` or wrap inside a `try-except` block.
- **Prefer `sorted()` for Immutables or Preserving Raw Data:** When working with data streams or tuples, use `sorted()`.
- **Use Tuple Keys for Multi-Criteria Sorting:** Return a tuple inside your `key` function (e.g., `key=lambda x: (x.category, x.price)`) to establish robust tie-breaking rules.

### Comparison Reference Matrix

| Feature | `list.sort()` | `sorted(list)` |
| :--- | :--- | :--- |
| **Method Type** | In-place list method | Global built-in function |
| **Return Value** | `None` | New `list` object |
| **Original List Modified?** | Yes | No |
| **Accepts Any Iterable?** | No (Lists only) | Yes (Tuples, Sets, Dicts, Generators) |
| **Space Complexity** | $O(1)$ auxiliary | $O(N)$ auxiliary |

---

## 📝 Summary & Key Takeaways

- Python provides built-in tools for ordering: **`list.sort()`** mutates memory directly, while **`sorted()`** builds a brand-new list object.
- **Timsort** executes under the hood, ensuring safe, stable $O(N \log N)$ sorting performance.
- The **`key`** parameter transforms elements dynamically for comparison without corrupting original underlying dataset values.
- Variable assignment (`a = b`) creates an **alias** pointing to identical memory space; use `.copy()` or list slicing `[:]` to construct independent shallow list clones.

**Next Up for Day 13:** *Tuples & Immutability — Unpacking, Memory Efficiency, and Fixed Data Structures!*
