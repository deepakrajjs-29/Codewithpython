# Day 047: Decorators with Arguments & Class Decorators

> **Difficulty:** Intermediate | **Topic:** Advanced Topics | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Understand the mechanics of **Decorator Factories** to pass configuration arguments to decorators.
- Implement **Classes as Decorators** by leveraging the `__call__` dunder method.
- Apply **Class Decorators** to modify, inspect, or augment entire class definitions dynamically.
- Master metadata preservation using `functools.wraps` across multi-layered closures.

---

## 📚 Theory & Concepts

Yesterday, you learned that a standard Python decorator takes a function as its only argument and returns a replacement wrapper function:

```python
@my_decorator
def greet(): ...
# Equivalent to: greet = my_decorator(greet)
```

However, real-world development frequently requires decorators to be configurable. For instance, a retry decorator might need to know how many times to retry (`@retry(times=3)`), or a caching decorator might require an expiration time (`@cache(ttl_seconds=60)`).

### 1. Decorators with Arguments (Decorator Factories)

When you write `@decorator(arg=value)`, Python executes `decorator(arg=value)` **first**. The return value of that call must be the actual decorator function that accepts the target function. 

This creates a **three-tier closure pattern**:
1. **Outer Function (Factory):** Accepts configuration arguments and returns the decorator.
2. **Middle Function (Decorator):** Accepts the target function and returns the wrapper.
3. **Inner Function (Wrapper):** Accepts `*args, **kwargs` intended for the target function, applies logic, and returns the result.

```
@repeat(num_times=3)
def greet(name): ...

Execution Flow:
repeat(num_times=3) ──> Returns 'decorator_repeat'
decorator_repeat(greet) ──> Returns 'wrapper_repeat'
greet('Alice') ──> Executes 'wrapper_repeat('Alice')'
```

---

### 2. Classes as Decorators

Instead of nested functions, a Python class can act as a decorator if instances of the class are callable. An object becomes callable when its class implements the `__call__` special method.

- **Without Arguments:** `__init__` receives the decorated function, and `__call__` acts as the runtime wrapper.
- **With Arguments:** `__init__` receives the decorator arguments, and `__call__` receives the function and returns the wrapper.

Using classes as decorators is particularly useful when the decorator needs to maintain state across multiple function invocations (e.g., call counters, rate limiters).

---

### 3. Decorating Entire Classes

Decorators aren't limited to functions; they can also decorate class definitions. A class decorator takes a `class` object as its argument and returns either the modified class or a new subclass/wrapper.

```python
@add_timestamp
class User:
    pass
# Equivalent to: User = add_timestamp(User)
```

---

## 💻 Syntax & Structure

### Decorator Factory Pattern
```python
import functools

def decorator_factory(config_param):
    """Outer tier: Receives decorator arguments."""
    def actual_decorator(func):
        """Middle tier: Receives the target function."""
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            """Inner tier: Receives runtime arguments for func."""
            # Use config_param and execute func
            return func(*args, **kwargs)
        return wrapper
    return actual_decorator
```

### Class-Based Decorator Pattern (With State)
```python
import functools

class StateTracker:
    def __init__(self, func):
        self.func = func
        self.call_count = 0
        functools.update_wrapper(self, func)

    def __call__(self, *args, **kwargs):
        self.call_count += 1
        return self.func(*args, **kwargs)
```

---

## 🧪 Code Examples

Below is a complete, self-contained Python script illustrating:
1. A configurable rate-retry decorator factory (`@retry`).
2. A class-based stateful decorator (`@CallLimiter`).
3. A class decorator that dynamically injects utility methods (`@json_serializable`).

```python
import functools
import json
import time

# ==========================================
# 1. Decorator Factory (Decorator with Args)
# ==========================================
def retry(max_attempts: int, delay_seconds: float = 0.1):
    """Decorator factory that retries a function upon Exception."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            attempts = 0
            while attempts < max_attempts:
                try:
                    return func(*args, **kwargs)
                except Exception as exc:
                    attempts += 1
                    print(f"[{func.__name__}] Attempt {attempts} failed: {exc}")
                    if attempts >= max_attempts:
                        print(f"[{func.__name__}] All {max_attempts} attempts exhausted.")
                        raise
                    time.sleep(delay_seconds)
        return wrapper
    return decorator

# ==========================================
# 2. Class as a Decorator (Stateful)
# ==========================================
class CallLimiter:
    """Class-based decorator to restrict the number of allowed executions."""
    def __init__(self, max_calls: int):
        self.max_calls = max_calls
        self.calls = 0

    def __call__(self, func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            if self.calls >= self.max_calls:
                raise RuntimeError(
                    f"Execution blocked: '{func.__name__}' exceeded limit of {self.max_calls} calls."
                )
            self.calls += 1
            return func(*args, **kwargs)
        return wrapper

# ==========================================
# 3. Class Decorator (Modifying a Class)
# ==========================================
def json_serializable(cls):
    """Class decorator adding a .to_json() method to any class."""
    def to_json(self):
        return json.dumps(self.__dict__, default=str)
    
    # Inject the new method into the class namespace
    cls.to_json = to_json
    return cls

# ==========================================
# Demonstration & Usage
# ==========================================

# 1. Testing Decorator with Arguments
@retry(max_attempts=3, delay_seconds=0.05)
def unstable_network_call(success_on_attempt: int, state: dict):
    state["current_attempt"] += 1
    if state["current_attempt"] < success_on_attempt:
        raise ConnectionError("Network unreachable")
    return "Data retrieved successfully!"

# 2. Testing Class-Based Decorator
@CallLimiter(max_calls=2)
def process_payment(amount: float):
    return f"Payment of ${amount:.2f} processed."

# 3. Testing Class Decorator
@json_serializable
class Order:
    def __init__(self, order_id: int, item: str, price: float):
        self.order_id = order_id
        self.item = item
        self.price = price

def main():
    print("--- 1. Testing Decorator Factory (@retry) ---")
    state = {"current_attempt": 0}
    result = unstable_network_call(success_on_attempt=2, state=state)
    print(f"Result: {result}\n")

    print("--- 2. Testing Class-Based Decorator (@CallLimiter) ---")
    print(process_payment(49.99))
    print(process_payment(19.99))
    try:
        print(process_payment(99.99))
    except RuntimeError as err:
        print(f"Caught Expected Error: {err}\n")

    print("--- 3. Testing Class Decorator (@json_serializable) ---")
    order = Order(order_id=101, item="Mechanical Keyboard", price=129.99)
    print(f"Object JSON representation: {order.to_json()}")

if __name__ == "__main__":
    main()
```

---

## 📊 Expected Output

```text
--- 1. Testing Decorator Factory (@retry) ---
[unstable_network_call] Attempt 1 failed: Network unreachable
Result: Data retrieved successfully!

--- 2. Testing Class-Based Decorator (@CallLimiter) ---
Payment of $49.99 processed.
Payment of $19.99 processed.
Caught Expected Error: Execution blocked: 'process_payment' exceeded limit of 2 calls.

--- 3. Testing Class Decorator (@json_serializable) ---
Object JSON representation: {"order_id": 101, "item": "Mechanical Keyboard", "price": 129.99}
```

---

## 🌍 Real-World Applications

| Pattern | Real-World Use Case | Production Library Example |
| :--- | :--- | :--- |
| **Decorator Factory** | Route registration with URL path & HTTP methods | `Flask (@app.route('/login', methods=['POST']))`, `FastAPI` |
| **Decorator Factory** | Role-based authorization & permission checks | `Django (@permission_required('is_staff'))` |
| **Class as Decorator** | Rate limiting / Circuit Breakers (requires internal state) | `tenacity`, `pybreaker` |
| **Class Decorator** | Auto-generating `__init__`, `__repr__`, and `__eq__` | Standard Library `@dataclasses.dataclass` |

---

## 💡 Best Practices

- **Always Use `functools.wraps`**: When wrapping functions, preserve docstrings, function names, and signatures. In class-based decorators where `self` wraps a function, use `functools.update_wrapper(self, func)`.
- **Pass Arguments by Keyword When Defaults Exist**: When defining decorator factories, provide sensible defaults for configuration parameters (e.g., `delay_seconds=0.1`).
- **Separate Decorator Logic from Core Logic**: Ensure your decorator doesn't mutate argument objects unless explicitly designed to do so.
- ⚠️ **Avoid Deep Nesting Without Need**: A 3-tier function closure can be hard to read. If a decorator has complex logic or state, prefer using a **Class as a Decorator**.
- ⚠️ **Method Decorators vs. Function Decorators**: Remember that methods pass `self` as their first positional argument. Ensure your inner wrapper accepts `*args, **kwargs` universally.

---

## 📝 Summary & Key Takeaways

1. **Decorator Factories** are functions that return decorators, enabling arguments like `@my_dec(timeout=5)`.
2. **Classes as Decorators** utilize `__init__` and `__call__` to provide clean state management across invocations.
3. **Class Decorators** accept a `cls` object and allow structural augmentation of classes (similar to how `@dataclass` works).

**Tomorrow's Topic (Day 48):** Context Managers & The `with` Statement Deep Dive (`__enter__`, `__exit__`, and `contextlib`).
