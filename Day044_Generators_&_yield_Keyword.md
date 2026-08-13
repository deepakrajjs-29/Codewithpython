# Day 044: Generators & yield Keyword

> **Difficulty:** Intermediate | **Topic:** Advanced Topics | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Differentiate between standard functions using `return` and generator functions using `yield`.
- Implement lazy evaluation to optimize memory footprint when handling large or infinite datasets.
- Construct generator functions and inline generator expressions.
- Control stateful execution using generator methods such as `next()`, `.send()`, and `.close()`.

---

## 📚 Theory & Concepts

### What is a Generator?
In Python, a **generator** is a special type of iterator that yields values one at a time on demand, rather than computing all values in advance and storing them in memory. This paradigm is known as **lazy evaluation**.

While regular functions compute a result and return it—destroying their local stack frame and variables in the process—generator functions yield execution back to the caller while **pausing their execution state**. When called again, the function resumes right where it left off, maintaining all local variables and internal state.

### Regular Functions vs. Generator Functions

| Feature | Standard Function (`return`) | Generator Function (`yield`) |
| :--- | :--- | :--- |
| **Execution** | Runs to completion once called | Pauses execution when `yield` is encountered |
| **Return Value** | Single value or object tuple | Yields a `generator` object |
| **Memory Footprint** | Loads full result set into RAM | Computes values on-demand ($O(1)$ memory) |
| **State Retention** | Stack destroyed after returning | Stack state frozen until next iteration |
| **Protocol** | Callable | Implements Iterator Protocol (`__iter__`, `__next__`) |

### How `yield` Operates Under the Hood

When Python encounters the `yield` keyword inside a function definition, it marks that function as a generator function. Calling the function does **not** execute its body immediately; instead, it returns a `generator` object.

```
+-------------------------------------------------------------------+
|                        Generator Execution Flow                   |
+-------------------------------------------------------------------+

 Caller                           Generator Function
   |                                      |
   |---- 1. Call function() ----------->| (Returns Generator Object)
   |                                      |
   |---- 2. next(gen) ------------------>| Code runs until 'yield x'
   |                                      | [State Suspended / Frozen]
   |<--- 3. Returns x -------------------|
   |                                      |
   |---- 4. next(gen) ------------------>| Code resumes after 'yield x'
   |                                      | Runs until next 'yield y'
   |<--- 5. Returns y -------------------|
   |                                      |
   |---- 6. next(gen) ------------------>| No more yields found
   |                                      | Raises StopIteration
   |<--- 7. StopIteration ----------------|
```

When `next()` is invoked on the generator:
1. Execution starts or resumes at the instruction immediately following the last executed `yield`.
2. Execution continues until another `yield` statement is hit, or the end of the function is reached.
3. If `yield` is hit, the yielded value is returned, and execution is suspended.
4. If the function exits without yielding, Python automatically raises a `StopIteration` exception, telling loops (`for` loops) to terminate.

---

## 💻 Syntax & Structure

### 1. Generator Function Definition
A generator function uses standard `def` syntax but replaces or supplements `return` with `yield`.

```python
def my_generator():
    yield "First item"
    yield "Second item"
    yield "Third item"

# Instantiating the generator object
gen = my_generator()
```

### 2. Generator Expressions
Similar to list comprehensions, generator expressions provide a concise inline syntax. They use round parentheses `()` instead of square brackets `[]`.

```python
# List Comprehension (Eager Evaluation - occupies memory immediately)
list_comp = [x * 2 for x in range(1000)]

# Generator Expression (Lazy Evaluation - creates values on demand)
gen_exp = (x * 2 for x in range(1000))
```

### 3. Generator Instance Methods
Generators support advanced bidirectional communication methods:
- `gen.send(value)`: Passes a value into the generator function that becomes the result of the current `yield` expression.
- `gen.close()`: Raises a `GeneratorExit` exception inside the generator to interrupt execution.

---

## 🧪 Code Examples

The following script demonstrates basic iteration, memory consumption differences, generator expressions, and advanced generator methods (`send()` and `close()`).

```python
import sys

def count_up_to(max_val: int):
    """Simple generator yielding numbers up to max_val."""
    count = 1
    while count <= max_val:
        yield count
        count += 1

def list_squares(n: int) -> list[int]:
    """Eager evaluation using List Comprehension."""
    return [x**2 for x in range(n)]

def gen_squares(n: int):
    """Lazy evaluation using Generator Function."""
    for x in range(n):
        yield x**2

def running_accumulator():
    """Advanced generator demonstrating bidirectional data flow via send()."""
    total = 0
    while True:
        # yield returns 'total' to caller and receives 'val' sent via send()
        val = yield total
        if val is None:
            break
        total += val

def main():
    print("--- 1. Basic Generator Iteration ---")
    counter = count_up_to(3)
    print(f"Generator object: {counter}")
    print(f"First call : {next(counter)}")
    print(f"Second call: {next(counter)}")
    print(f"Third call : {next(counter)}")

    print("\n--- 2. Memory Footprint Comparison ---")
    n = 100_000
    list_data = list_squares(n)
    gen_data = gen_squares(n)

    print(f"Memory size of List ({n:,} items)     : {sys.getsizeof(list_data):,} bytes")
    print(f"Memory size of Generator ({n:,} items): {sys.getsizeof(gen_data):,} bytes")

    print("\n--- 3. Generator Expression ---")
    gen_exp = (x**2 for x in range(5))
    print("Yielding values from expression:", end=" ")
    for val in gen_exp:
        print(val, end=" ")
    print()

    print("\n--- 4. Advanced: Generator Methods (send & close) ---")
    acc = running_accumulator()

    # Prime the generator (advance to the first yield statement)
    initial_val = next(acc)
    print(f"Generator primed. Initial total: {initial_val}")

    # Send values into the generator
    print(f"Sent 10 -> New Running Total: {acc.send(10)}")
    print(f"Sent 25 -> New Running Total: {acc.send(25)}")
    print(f"Sent 15 -> New Running Total: {acc.send(15)}")

    # Close the generator cleanly
    acc.close()
    print("Generator successfully closed.")

if __name__ == "__main__":
    main()
```

---

## 📊 Expected Output

```text
--- 1. Basic Generator Iteration ---
Generator object: <generator object count_up_to at 0x7f9a101b3e40>
First call : 1
Second call: 2
Third call : 3

--- 2. Memory Footprint Comparison ---
Memory size of List (100,000 items)     : 800,984 bytes
Memory size of Generator (100,000 items): 208 bytes

--- 3. Generator Expression ---
Yielding values from expression: 0 1 4 9 16 

--- 4. Advanced: Generator Methods (send & close) ---
Generator primed. Initial total: 0
Sent 10 -> New Running Total: 10
Sent 25 -> New Running Total: 35
Sent 15 -> New Running Total: 50
Generator successfully closed.
```

---

## 🌍 Real-World Applications

### 1. Large Log File Processing (ETL Pipelines)
When reading multi-gigabyte server logs, loading the entire file into RAM causes memory exhaustion (`MemoryError`). Generators allow line-by-line streaming and real-time processing:

```python
def read_large_log(file_path: str):
    with open(file_path, "r", encoding="utf-8") as file:
        for line in file:
            if "ERROR" in line:
                yield line.strip()

# Pipeline pattern: Stream through lines without loading full file
for error in read_large_log("server.log"):
    # Process each log entry individually
    pass
```

### 2. Infinite Data Streams & ID Generation
Generators can model sequences that have no theoretical end, such as continuous sensor updates, unique incrementing sequence keys, or mathematical series.

```python
def generate_ids():
    current_id = 1000
    while True:
        yield f"USR-{current_id}"
        current_id += 1

id_stream = generate_ids()
user_1 = next(id_stream)  # 'USR-1000'
user_2 = next(id_stream)  # 'USR-1001'
```

### 3. Pipeline Data Processing
Chaining multiple generator functions creates memory-efficient data processing pipelines where data flows through transformations step-by-step.

---

## 💡 Best Practices

- **Prefer Generators for Memory Safety:** Use generators whenever processing datasets larger than available RAM or datasets of unpredictable size.
- **Remember Generators are One-Time Use:** Generators consume values during iteration. Once exhausted, a generator cannot be reset or iterated over again; you must instantiate a new generator object.
- **Always Prime Generators Before `.send()`:** Call `next(gen)` or `gen.send(None)` once to advance execution to the first `yield` before sending actual data into the generator.
- **Use Parentheses Omission in Functions:** When passing a generator expression directly into a single-argument function (e.g., `sum`, `max`), omit the extra set of inner parentheses:
  ```python
  # Preferred syntax
  total = sum(x**2 for x in range(100))

  # Redundant syntax
  total = sum((x**2 for x in range(100)))
  ```
- **Avoid Complex Logic with `.send()`:** Overusing `.send()`, `.throw()`, and state mutations inside generators can lead to hard-to-debug code. Keep custom control flow clear and predictable.

---

## 📝 Summary & Key Takeaways

1. **`yield` replaces `return`:** Yielding returns a value to the caller and suspends function state, preserving local variables for future `next()` calls.
2. **Lazy Evaluation:** Values are generated on-demand rather than precomputed, maintaining an $O(1)$ memory footprint regardless of dataset size.
3. **Generator Expressions:** Compact `(expr for item in iterable)` syntax creates inline generators efficiently.
4. **Exhaustion Protocol:** Generators raise `StopIteration` automatically when execution completes and cannot be re-used after being fully consumed.

**Teaser for Tomorrow:** On **Day 45**, we will explore **Decorators & Function Wrappers**, learning how to dynamically alter or extend the behavior of Python functions cleanly using metaprogramming principles!
