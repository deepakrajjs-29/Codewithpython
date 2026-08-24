# Day 065: Functional Tools (functools & itertools)

> **Difficulty:** Advanced | **Topic:** Standard Library | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Master memory-efficient stream processing using the `itertools` module.
- Implement combinatoric, infinite, and terminating iterators to solve complex sequence-manipulation problems.
- Leverage `functools` for function transformations, partial evaluation, memoization, and generic dispatching.
- Understand the operational mechanics of lazy evaluation versus eager computation in modern Python pipelines.

---

## 📚 Theory & Concepts

Python embraces functional programming concepts alongside its object-oriented foundation. Two flagship standard library modules power advanced functional programming in Python:

1. **`itertools`**: Provides foundational building blocks for creating fast, memory-efficient iterators. It enables *iterator algebra*—combining simple iterators into sophisticated sequence processors without allocating intermediate lists in memory.
2. **`functools`**: Provides higher-order functions (functions that act on or return other functions) and operations on callable objects.

### Lazy Evaluation vs. Eager Evaluation

In eager evaluation, operations calculate and store the entire result in memory upfront. In lazy evaluation, values are computed strictly on-demand (one item at a time).

```text
Eager Evaluation (Lists):
[1, 2, 3, 4] ──(Map + Filter)──> Allocate [4, 16] in RAM ──> Consume

Lazy Evaluation (Iterators / itertools):
Stream: 1 ──> Filter (Drop)
        2 ──> Transform ──> Yield 4  ───> Consumer receives 4
        3 ──> Filter (Drop)
        4 ──> Transform ──> Yield 16 ───> Consumer receives 16
        (Memory footprint remains constant: O(1))
```

### The Three Families of `itertools`

| Category | Functions | Purpose |
| :--- | :--- | :--- |
| **Infinite Iterators** | `count()`, `cycle()`, `repeat()` | Produce unbounded streams for continuous polling, indexing, or padding. |
| **Terminating Iterators** | `accumulate()`, `chain()`, `compress()`, `dropwhile()`, `takewhile()`, `islice()`, `pairwise()`, `groupby()` | Process finite streams conditionally, sequentially, or in aggregation batches. |
| **Combinatoric Iterators** | `product()`, `permutations()`, `combinations()`, `combinations_with_replacement()` | Generate permutations, Cartesian products, and combinations systematically. |

### Core `functools` Utilities

- **`lru_cache` / `cache`**: Decorators that wrap functions with a memoizing callable, saving recent return values to avoid redundant computation.
- **`partial`**: Freezes a portion of a function's arguments/keywords, producing a new callable with a simplified signature.
- **`reduce`**: Applies a function of two arguments cumulatively to sequence items, reducing the iterable to a single value.
- **`singledispatch`**: Transforms a standard function into a polymorphic, single-dispatch generic function based on the type of the first argument.
- **`wraps`**: Preserves function docstrings, names, and annotations when building custom decorators.

---

## 💻 Syntax & Structure

### Common `itertools` Signatures

```python
import itertools

# Infinite sequence generation
counter = itertools.count(start=100, step=5)  # 100, 105, 110, ...
cycler = itertools.cycle(["A", "B", "C"])      # A, B, C, A, B, ...

# Slicing an iterator without memory allocation
sliced = itertools.islice(iterable, start, stop, step)

# Adjacent element pairing (Python 3.10+)
pairs = itertools.pairwise(["x", "y", "z"])  # ('x', 'y'), ('y', 'z')

# Cartesian Product
prod = itertools.product([1, 2], ["a", "b"])  # (1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')

# Grouping (Requires input to be sorted by the key function)
grouped = itertools.groupby(sorted_iterable, key=key_func)
```

### Common `functools` Signatures

```python
import functools

# Memoization
@functools.lru_cache(maxsize=128)
def expensive_call(n: int) -> int:
    ...

# Argument Pre-binding
base_func = lambda x, y, z: x + y + z
prefilled = functools.partial(base_func, 10, y=20)  # prefilled(z=5) -> 35

# Single-dispatch Generic Function
@functools.singledispatch
def process(arg):
    raise NotImplementedError("Unsupported type")

@process.register(int)
def _(arg: int):
    return arg * 2

@process.register(str)
def _(arg: str):
    return arg.strip().upper()
```

---

## 🧪 Code Examples

The following self-contained script demonstrates real-world patterns combining `functools` and `itertools`.

```python
"""
Day 065: Functional Tools Demonstration
Author: Python Mastery Course
"""

import functools
import itertools
import operator
from typing import Any

# ---------------------------------------------------------
# 1. itertools: Stream Processing & Combinatorics
# ---------------------------------------------------------
def demonstrate_itertools() -> None:
    print("=== 1. ITERTOOLS DEMONSTRATION ===")

    # A. Infinite generator with islice
    # Generate squares of even numbers from an unbounded stream
    infinite_evens = itertools.count(start=0, step=2)
    first_five_even_squares = [
        x**2 for x in itertools.islice(infinite_evens, 5)
    ]
    print(f"First 5 even squares: {first_five_even_squares}")

    # B. Pairwise delta analysis (Python 3.10+)
    stock_prices = [100.0, 102.5, 101.0, 105.5, 107.0]
    price_deltas = [
        round(curr - prev, 2)
        for prev, curr in itertools.pairwise(stock_prices)
    ]
    print(f"Stock price deltas: {price_deltas}")

    # C. Cartesian Product & Combinations
    suits = ["♠", "♥"]
    ranks = ["A", "K"]
    deck = list(itertools.product(suits, ranks))
    print(f"Cartesian product (Deck subset): {deck}")

    pairs = list(itertools.combinations(deck, 2))
    print(f"Total 2-card combinations from subset: {len(pairs)}")

    # D. itertools.groupby (Dataset MUST be sorted by key)
    transactions = [
        {"dept": "Engineering", "amount": 1200},
        {"dept": "Marketing", "amount": 450},
        {"dept": "Engineering", "amount": 800},
        {"dept": "HR", "amount": 300},
        {"dept": "Marketing", "amount": 900},
    ]

    key_func = operator.itemgetter("dept")
    sorted_txs = sorted(transactions, key=key_func)

    print("\nDepartment Spend Totals:")
    for dept, group in itertools.groupby(sorted_txs, key=key_func):
        total_spend = sum(item["amount"] for item in group)
        print(f" - {dept:12}: ${total_spend}")

# ---------------------------------------------------------
# 2. functools: Function Composition & Transformation
# ---------------------------------------------------------

# A. Single-dispatch polymorphism
@functools.singledispatch
def format_payload(data: Any) -> str:
    """Fallback handler for unsupported types."""
    return f"[UNKNOWN TYPE] {repr(data)}"

@format_payload.register(dict)
def _(data: dict) -> str:
    items = [f"{k}={v}" for k, v in data.items()]
    return f"[DICT] {', '.join(items)}"

@format_payload.register(list)
def _(data: list) -> str:
    items = ", ".join(str(x) for x in data)
    return f"[LIST] count={len(data)} values=[{items}]"

# B. Memoization with lru_cache
@functools.lru_cache(maxsize=32)
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

def demonstrate_functools() -> None:
    print("\n=== 2. FUNCTOOLS DEMONSTRATION ===")

    # A. functools.partial: Specialized functions
    base_tax_calculator = lambda rate, price: round(price * (1 + rate), 2)
    ny_tax = functools.partial(base_tax_calculator, 0.08875)
    ca_tax = functools.partial(base_tax_calculator, 0.07250)

    cart_total = 250.00
    print(f"NY Final Price ($250): ${ny_tax(cart_total)}")
    print(f"CA Final Price ($250): ${ca_tax(cart_total)}")

    # B. functools.reduce: Multi-stage accumulator
    pipeline_filters = [
        lambda x: x + 10,  # 5 + 10 = 15
        lambda x: x * 2,   # 15 * 2 = 30
        lambda x: x - 5,   # 30 - 5 = 25
    ]
    initial_value = 5
    transformed = functools.reduce(
        lambda val, func: func(val), pipeline_filters, initial_value
    )
    print(f"Pipeline reduction result: {transformed}")

    # C. Generic single-dispatch execution
    print(format_payload({"status": 200, "service": "auth"}))
    print(format_payload([10, 20, 30, 40]))
    print(format_payload(3.14159))

    # D. Fibonacci Cache Stats
    _ = fibonacci(30)
    print(f"Fibonacci Cache Info: {fibonacci.cache_info()}")

if __name__ == "__main__":
    demonstrate_itertools()
    demonstrate_functools()
```

---

## 📊 Expected Output

```text
=== 1. ITERTOOLS DEMONSTRATION ===
First 5 even squares: [0, 4, 16, 36, 64]
Stock price deltas: [2.5, -1.5, 4.5, 1.5]
Cartesian product (Deck subset): [('♠', 'A'), ('♠', 'K'), ('♥', 'A'), ('♥', 'K')]
Total 2-card combinations from subset: 6

Department Spend Totals:
 - Engineering : $2000
 - HR          : $300
 - Marketing   : $1350

=== 2. FUNCTOOLS DEMONSTRATION ===
NY Final Price ($250): $272.19
CA Final Price ($250): $268.12
Pipeline reduction result: 25
[DICT] status=200, service=auth
[LIST] count=4 values=[10, 20, 30, 40]
[UNKNOWN TYPE] 3.14159
Fibonacci Cache Info: CacheInfo(hits=28, misses=31, maxsize=32, currsize=31)
```

---

## 🌍 Real-World Applications

### 1. High-Throughput Streaming & ETL Pipelines
When processing gigabyte-scale CSV or JSON logs, reading entire datasets into memory causes Out-Of-Memory (OOM) crashes. Using `itertools.islice()` and `itertools.chain()` allows chunking large files into bounded batches that stream directly through transformation steps with fixed $O(1)$ memory consumption.

### 2. Financial Pipeline Reductions
Complex pricing architectures use `functools.reduce` and `functools.partial` to apply ordered series of tax rules, localized surcharges, dynamic discount matrix multipliers, and currency converters over transaction streams.

### 3. Clean API Serialization
`functools.singledispatch` cleanly decouples type-handling logic from domain classes. Serialization formats (JSON, XML, Protobuf) can be extended without modifying core business entities or relying on nested `isinstance()` checks.

---

## 💡 Best Practices

- **Pre-sort before using `itertools.groupby`**: `groupby()` aggregates only *consecutive* matching keys. If the input iterable is not sorted by the grouping key first, separate groups with the same key will be processed independently.
- **Prevent Cache Memory Bloat**: Prefer `functools.lru_cache(maxsize=N)` with an explicit maximum size over `functools.cache` (unbounded) when caching functions with high-cardinality input domains to prevent memory leaks.
- **Ensure Cached Arguments are Hashable**: All arguments passed to `lru_cache` must be immutable and hashable (e.g., tuples, primitives, frozen dataclasses). Passing `dict` or `list` instances raises a `TypeError`.
- **Always Wrap Custom Decorators**: Use `functools.wraps` inside custom decorator factories to retain metadata (`__name__`, `__doc__`, `__annotations__`) of the wrapped function.
- **Do Not Prematurely Materialize Iterators**: Avoid calling `list(itertools.islice(...))` prematurely if the downstream consumer can process the sequence iteratively.

---

## 📝 Summary & Key Takeaways

```text
┌──────────────────────────────────────────────────────────────┐
│                    PYTHON FUNCTIONAL CORE                    │
├──────────────────────────────┬───────────────────────────────┤
│          itertools           │           functools           │
├──────────────────────────────┼───────────────────────────────┤
│ • Infinite streams           │ • Execution Memoization       │
│ • Combinatorics (Perm/Comb)  │ • Partial Application         │
│ • Chunking & Slicing         │ • Reductions & Aggregations   │
│ • Pairwise & Grouping        │ • Dynamic Generic Dispatch    │
└──────────────────────────────┴───────────────────────────────┘
```

- `itertools` abstracts away pointer math and boundary checking for complex sequence operations with minimal memory overhead.
- `functools` provides structural utilities for currying, caching, and polymorphically dispatching function calls.
- Combining these modules results in cleaner, more modular, and significantly faster Python applications.

**Next Up:** **Day 066: Context Managers & The `contextlib` Module** — Learn how to construct custom resource-management pipelines using generators and context utilities.
