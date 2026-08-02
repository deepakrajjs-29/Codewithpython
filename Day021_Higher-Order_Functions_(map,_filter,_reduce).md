# Day 021: Higher-Order Functions (map, filter, reduce)

> **Difficulty:** Intermediate | **Topic:** Functional Programming | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Understand the concept of Higher-Order Functions (HOFs) and first-class functions in Python.
- Master the built-in functions `map()` and `filter()` for data transformation and selection.
- Learn how to perform cumulative aggregation using `functools.reduce()`.
- Compare lazy evaluation with eager evaluation when working with functional tools.
- Learn when to choose functional tools (`map`, `filter`) over Pythonic alternatives (list comprehensions).

---

## 📚 Theory & Concepts

### What is a Higher-Order Function?
In Python, functions are **first-class citizens**. This means functions can be:
1. Assigned to variables.
2. Passed as arguments to other functions.
3. Returned from other functions.

A **Higher-Order Function (HOF)** is simply a function that does at least one of the following:
* Accepts one or more functions as arguments.
* Returns a function as its result.

### The Functional Core Trio: `map`, `filter`, and `reduce`

Functional programming emphasizes immutable data and pure function transformations. Python provides three core higher-order functions to process sequences declaratively:

```
                  +-----------------------------------+
                  |         Input Sequence            |
                  |    [1, 2, 3, 4, 5, 6, 7, 8]       |
                  +-----------------------------------+
                                    |
                                    v
  +-------------------------------------------------------------------+
  | filter(is_even)   =>   Filters elements by predicate boolean      |
  +-------------------------------------------------------------------+
                                    |
                                    v [2, 4, 6, 8]
  +-------------------------------------------------------------------+
  | map(square)        =>   Transforms each element individually       |
  +-------------------------------------------------------------------+
                                    |
                                    v [4, 16, 36, 64]
  +-------------------------------------------------------------------+
  | reduce(add)        =>   Aggregates elements down to a single value  |
  +-------------------------------------------------------------------+
                                    |
                                    v
                              Output: 120
```

1. **`map(func, iterable)`**: Applies `func` to every item in `iterable`. It yields results lazily using an iterator, meaning values are computed on demand rather than stored in memory all at once.
2. **`filter(func, iterable)`**: Evaluates each item in `iterable` against a predicate function `func` (a function returning `True` or `False`). Items returning `True` are retained. Like `map()`, it evaluates lazily.
3. **`reduce(func, iterable[, initializer])`**: Resides in the `functools` module. It applies a binary function `func(x, y)` cumulatively to sequence items, reducing the sequence to a single scalar value.

---

## 💻 Syntax & Structure

### 1. `map()` Syntax
```python
map(function, iterable, *more_iterables)
```
- `function`: A callable object (named function or `lambda`) applied to every element.
- `iterable`: One or more sequence/collection objects.
- **Returns**: A `map` iterator object.

### 2. `filter()` Syntax
```python
filter(function_or_none, iterable)
```
- `function_or_none`: A predicate function returning a boolean. If set to `None`, elements that evaluate to `False` in a truth testing context (e.g., `0`, `""`, `None`, `False`) are removed.
- **Returns**: A `filter` iterator object.

### 3. `reduce()` Syntax
```python
from functools import reduce

reduce(function, iterable[, initializer])
```
- `function`: A function accepting two arguments: `reduce(f, [a, b, c])` calculates `f(f(a, b), c)`.
- `initializer`: Optional starting value placed before the sequence items. If provided, `reduce(f, [a, b], init)` calculates `f(f(init, a), b)`.

---

## 🧪 Code Examples

The following script demonstrates each tool individually and concludes with an integrated functional data pipeline.

```python
"""
Day 021: Higher-Order Functions (map, filter, reduce) Demonstration
"""

from functools import reduce
from typing import Dict, List

def Section_1_Map_Transformations() -> None:
    print("--- 1. MAP TRANSFORMATIONS ---")
    
    # Raw temperatures in Celsius
    celsius_temps = [0.0, 12.5, 20.0, 37.0, 100.0]

    # Target function to convert C to F
    def celsius_to_fahrenheit(c: float) -> float:
        return round((c * 9 / 5) + 32, 2)

    # Applying map with a standard named function
    fahrenheit_map = map(celsius_to_fahrenheit, celsius_temps)

    print(f"Map iterator object: {fahrenheit_map}")
    print(f"Converted values:    {list(fahrenheit_map)}")

    # Map with multiple iterables (parallel processing)
    base_numbers = [2, 3, 4, 5]
    exponents = [3, 2, 4, 2]
    powers = list(map(pow, base_numbers, exponents))
    print(f"Parallel map result (pow): {powers}")

def Section_2_Filter_Selection() -> None:
    print("\n--- 2. FILTER SELECTION ---")
    
    raw_user_inputs = ["alice", "", "bob", "   ", "charlie", None, "david", "123"]

    # Filter out empty or None values using None as predicate
    truthy_values = list(filter(None, raw_user_inputs))
    print(f"Filtered non-empty inputs: {truthy_values}")

    # Custom predicate: Keep valid alpha usernames with length >= 4
    def is_valid_username(name: object) -> bool:
        return isinstance(name, str) and name.isalpha() and len(name) >= 4

    valid_users = list(filter(is_valid_username, raw_user_inputs))
    print(f"Valid usernames (alpha >= 4): {valid_users}")

def Section_3_Reduce_Aggregations() -> None:
    print("\n--- 3. REDUCE AGGREGATIONS ---")

    numbers = [10, 25, 30, 45, 50]

    # Calculate sum using reduce
    total_sum = reduce(lambda acc, curr: acc + curr, numbers, 0)
    print(f"Calculated sum via reduce: {total_sum}")

    # Find maximum value using reduce
    max_value = reduce(lambda a, b: a if a > b else b, numbers)
    print(f"Maximum value via reduce:  {max_value}")

def Section_4_Integrated_Data_Pipeline() -> None:
    print("\n--- 4. INTEGRATED DATA PIPELINE ---")

    # Raw transaction data records
    transactions: List[Dict[str, object]] = [
        {"id": "TX101", "amount": 150.00, "status": "completed", "currency": "USD"},
        {"id": "TX102", "amount": -20.00, "status": "failed", "currency": "USD"},
        {"id": "TX103", "amount": 450.50, "status": "completed", "currency": "USD"},
        {"id": "TX104", "amount": 89.99, "status": "pending", "currency": "USD"},
        {"id": "TX105", "amount": 1200.00, "status": "completed", "currency": "USD"},
    ]

    # Processing Pipeline:
    # Step 1: Filter only completed transactions
    completed_txs = filter(lambda tx: tx["status"] == "completed", transactions)

    # Step 2: Map to extract amount field
    amounts = map(lambda tx: float(tx["amount"]), completed_txs)

    # Step 3: Reduce to calculate total completed revenue
    total_revenue = reduce(lambda acc, amount: acc + amount, amounts, 0.0)

    print(f"Total Revenue from Completed Transactions: ${total_revenue:,.2f}")

if __name__ == "__main__":
    Section_1_Map_Transformations()
    Section_2_Filter_Selection()
    Section_3_Reduce_Aggregations()
    Section_4_Integrated_Data_Pipeline()
```

---

## 📊 Expected Output

```text
--- 1. MAP TRANSFORMATIONS ---
Map iterator object: <map object at 0x7f9a801b0790>
Converted values:    [32.0, 54.5, 68.0, 98.6, 212.0]
Parallel map result (pow): [8, 9, 256, 25]

--- 2. FILTER SELECTION ---
Filtered non-empty inputs: ['alice', 'bob', '   ', 'charlie', 'david', '123']
Valid usernames (alpha >= 4): ['alice', 'charlie', 'david']

--- 3. REDUCE AGGREGATIONS ---
Calculated sum via reduce: 160
Maximum value via reduce:  50

--- 4. INTEGRATED DATA PIPELINE ---
Total Revenue from Completed Transactions: $1,800.50
```

---

## 🌍 Real-World Applications

1. **ETL (Extract, Transform, Load) Data Ingestion**:
   In data engineering pipelines, raw incoming records are passed through `filter` stages to sanitize nulls/corrupt entries, mapped into unified schema objects via `map`, and accumulated into batches or summary statistics via `reduce`.

2. **Log Parsing and Telemetry Aggregation**:
   Server log processing uses filtering to select specific status codes (e.g., HTTP 5xx errors), extracts response latency metrics with mapping, and calculates total downtime or mean time between failures with reductions.

3. **Financial Portfolio Rebalancing**:
   Financial applications apply functions across asset streams: mapping currency conversions across varying foreign positions, filtering risk compliance parameters, and computing portfolio net asset value (NAV).

---

## 💡 Best Practices

- **Understand Lazy Evaluation**: Both `map()` and `filter()` return iterators. They generate items on demand and consume memory efficiently ($O(1)$ space complexity). Remember that iterators are **exhaustible**; once consumed (e.g., converted to a list), they cannot be re-used.
- **Always Provide an Initializer to `reduce()`**: Passing an initial value (e.g., `reduce(op, seq, 0)`) ensures your code executes safely even if the input sequence is empty. Calling `reduce()` on an empty sequence without an initializer raises a `TypeError`.
- **Prefer Comprehensions for Readability**: Guido van Rossum (Python's creator) designed Python list comprehensions to replace simple `map()` and `filter()` calls.

| Functional Approach | Pythonic Comprehension Alternative |
| :--- | :--- |
| `map(lambda x: x * 2, nums)` | `[x * 2 for x in nums]` |
| `filter(lambda x: x > 0, nums)` | `[x for x in nums if x > 0]` |
| `map(f, filter(p, nums))` | `[f(x) for x in nums if p(x)]` |

> 📌 **Rule of Thumb**: Use `map()` or `filter()` when you already have an existing named function to apply or when working lazily with large iterators. Use List Comprehensions when writing short inline expressions or complex nested conditions.

---

## 📝 Summary & Key Takeaways

### Key Takeaways
- Higher-Order Functions accept functions as arguments or return functions.
- `map()` transforms every element in an iterable without modifying the original length.
- `filter()` selectively keeps elements that satisfy a boolean predicate.
- `reduce()` (imported from `functools`) collapses a sequence down to a single value using a binary function.
- `map()` and `filter()` are evaluated lazily; wrap them in `list()` or iterate over them to evaluate their values.

### What's Next?
On **Day 22**, we will build on functional programming concepts by diving deep into **Decorators & Function Wrappers**, learning how to wrap, modify, and extend function behavior without altering source code!
