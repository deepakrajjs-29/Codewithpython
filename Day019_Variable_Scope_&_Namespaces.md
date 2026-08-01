# Day 019: Variable Scope & Namespaces

> **Difficulty:** Intermediate | **Topic:** Functions | **Reading Time:** 12 mins

---

## 🎯 Learning Objectives

- Understand how Python tracks variable names using **Namespaces**.
- Master the **LEGB Rule** (Local, Enclosing, Global, Built-in) for variable resolution.
- Effectively utilize the `global` and `nonlocal` keywords to modify scope behaviors.
- Identify and prevent scope-related errors, such as `UnboundLocalError` and built-in name shadowing.

---

## 📚 Theory & Concepts

### What is a Namespace?

In Python, a **namespace** is a system that ensures every name (variable, function, class) in a program is unique and accessible without conflict. Think of a namespace as a dictionary where:
* The **keys** are variable names (e.g., `x`, `total`, `user_id`).
* The **values** are the memory addresses of the objects those names reference.

Python creates and destroys namespaces dynamically as code executes.

---

### What is Variable Scope?

**Scope** defines the physical region of a Python script where a specific namespace is directly accessible without requiring explicit prefixing (e.g., `module.variable`).

When you reference a variable name, Python searches through distinct scopes in a strict hierarchical order known as the **LEGB Rule**.

---

### The LEGB Rule

Python searches for variable names across four levels in a specific order:

```text
       ┌─────────────────────────────────────────┐
       │             B - BUILT-IN                │
       │    (len, print, range, ValueError...)    │
       │  ┌───────────────────────────────────┐  │
       │  │           G - GLOBAL              │  │
       │  │     (Module-level variables)      │  │
       │  │  ┌─────────────────────────────┐  │  │
       │  │  │        E - ENCLOSING        │  │  │
       │  │  │  (Outer nested functions)   │  │  │
       │  │  │  ┌───────────────────────┐  │  │  │
       │  │  │  │      L - LOCAL        │  │  │  │
       │  │  │  │  (Inside function)    │  │  │  │
       │  │  │  └───────────────────────┘  │  │  │
       │  │  └─────────────────────────────┘  │  │
       │  └───────────────────────────────────┘  │
       └─────────────────────────────────────────┘
```

1. **L — Local:** Names defined inside a function body or parameter list. These are created when the function is called and destroyed when it returns.
2. **E — Enclosing:** Names in the local scope of any and all enclosing (outer) functions, searched from the innermost to the outermost outer function.
3. **G — Global:** Names defined at the top level of a module (file) or declared using the `global` keyword.
4. **B — Built-in:** Pre-defined Python names automatically loaded upon interpreter startup (`len`, `abs`, `str`, `dict`, etc.).

If Python searches all four scopes and cannot locate the identifier, it raises a `NameError`.

---

### Scope Modifiers: `global` and `nonlocal`

By default, writing to a variable inside a function creates a **Local** variable. If a variable with the same name exists globally, assigning to it locally will **shadow** (mask) the global variable rather than overwrite it.

To modify variables outside the local scope, Python provides two keywords:

| Keyword | Target Scope | Primary Use Case |
| :--- | :--- | :--- |
| `global` | Module (Global) Scope | Rebind top-level module variables inside a function. |
| `nonlocal` | Outer Enclosing Scope | Rebind variables in nested functions (closures). |

---

## 💻 Syntax & Structure

### 1. Basic Scope Mechanics & Shadowing

```python
x = "Global Scope"  # Global variable

def my_function():
    x = "Local Scope"  # Local variable shadowing global 'x'
    print(x)  # Prints "Local Scope"

my_function()
print(x)  # Prints "Global Scope"
```

---

### 2. The `global` Keyword

```python
counter = 0  # Global variable

def increment():
    global counter  # Declare intent to modify global variable
    counter += 1

increment()
print(counter)  # Outputs: 1
```

---

### 3. The `nonlocal` Keyword

```python
def outer_function():
    score = 100  # Enclosing scope variable

    def inner_function():
        nonlocal score  # Declare intent to modify outer function's variable
        score += 50

    inner_function()
    return score

print(outer_function())  # Outputs: 150
```

---

## 🧪 Code Examples

Below is a complete script demonstrating variable resolution, `global` vs `nonlocal` behavior, namespace inspection using `locals()` and `globals()`, and common scope anomalies.

```python
"""
Day 019: Variable Scope & Namespaces Demonstration
Python 3.12 Syntax
"""

# -------------------------------------------------------------------
# 1. LEGB Scope Resolution & Shadowing
# -------------------------------------------------------------------
app_name = "MasteryApp"  # Global Scope

def display_app_info():
    # Enclosing Scope
    version = "2.0.0"

    def render_header():
        # Local Scope
        # 'app_name' resolves to Global, 'version' resolves to Enclosing
        mode = "Production"  # Local to render_header
        print(f"[{app_name} v{version}] Mode: {mode}")

    render_header()

# -------------------------------------------------------------------
# 2. Modifying Global State vs Local Shadowing
# -------------------------------------------------------------------
user_count = 100

def shadow_user_count():
    # Creates a NEW local variable named user_count
    user_count = 500
    print(f"Inside shadow_user_count(): {user_count}")

def update_global_user_count():
    # Rebinds the existing global variable
    global user_count
    user_count += 1
    print(f"Inside update_global_user_count(): {user_count}")

# -------------------------------------------------------------------
# 3. Enclosing Scope & State Retention (Closures)
# -------------------------------------------------------------------
def create_transaction_tracker(initial_balance: float):
    balance = initial_balance  # Enclosing scope variable

    def deposit(amount: float) -> float:
        nonlocal balance  # Mutates the enclosing scope's 'balance'
        balance += amount
        return balance

    def withdraw(amount: float) -> float:
        nonlocal balance
        if amount <= balance:
            balance -= amount
            return balance
        raise ValueError("Insufficient funds")

    return deposit, withdraw

# -------------------------------------------------------------------
# 4. Introspecting Namespaces
# -------------------------------------------------------------------
def inspect_namespaces():
    temp_var = 42
    print("Local keys in inspect_namespaces():", list(locals().keys()))

# -------------------------------------------------------------------
# Main Execution Flow
# -------------------------------------------------------------------
if __name__ == "__main__":
    print("=== 1. LEGB Resolution ===")
    display_app_info()

    print("\n=== 2. Global Shadowing vs Modification ===")
    print(f"Initial global user_count: {user_count}")
    shadow_user_count()
    print(f"Global user_count after shadowing: {user_count}")
    update_global_user_count()
    print(f"Global user_count after explicit global update: {user_count}")

    print("\n=== 3. Nonlocal Closures ===")
    deposit_fn, withdraw_fn = create_transaction_tracker(100.0)
    print(f"Balance after +$50 deposit: ${deposit_fn(50.0):.2f}")
    print(f"Balance after -$30 withdrawal: ${withdraw_fn(30.0):.2f}")

    print("\n=== 4. Namespace Introspection ===")
    inspect_namespaces()
    print("Is 'app_name' in globals():", "app_name" in globals())
```

---

## 📊 Expected Output

```text
=== 1. LEGB Resolution ===
[MasteryApp v2.0.0] Mode: Production

=== 2. Global Shadowing vs Modification ===
Initial global user_count: 100
Inside shadow_user_count(): 500
Global user_count after shadowing: 100
Inside update_global_user_count(): 101
Global user_count after explicit global update: 101

=== 3. Nonlocal Closures ===
Balance after +$50 deposit: $150.00
Balance after -$30 withdrawal: $120.00

=== 4. Namespace Introspection ===
Local keys in inspect_namespaces(): ['temp_var']
Is 'app_name' in globals(): True
```

---

## 🌍 Real-World Applications

### 1. State Maintenance in Function Factory & Decorator Patterns
When writing decorators or configurable function factories, `nonlocal` provides lightweight, stateful behavior without the overhead of instantiating full object-oriented classes.

```python
def make_rate_limiter(max_calls: int):
    call_count = 0  # State held in enclosing scope

    def rate_limited_function():
        nonlocal call_count
        if call_count >= max_calls:
            raise Exception("API rate limit exceeded!")
        call_count += 1
        return f"Request processed ({call_count}/{max_calls})"

    return rate_limited_function
```

### 2. Centralized Application Configuration
In framework initialization (e.g., FastAPI or Flask applications), global scope variable references are commonly used for read-only database connections, logging instances, and environment settings loaded at application startup.

---

## 💡 Best Practices

### Recommended Approaches

- **Prefer Read-Only Globals:** Treat global variables as immutable constants. Use `UPPER_SNAKE_CASE` naming conventions (e.g., `MAX_RETRIES = 3`).
- **Pass Arguments explicitly:** Instead of relying on global references inside functions, explicitly pass inputs as arguments and return results.
- **Use `nonlocal` over Object Mutability where appropriate:** Use closures with `nonlocal` for simple encapsulation needs.

---

### Pitfalls to Avoid

#### Pitfall 1: `UnboundLocalError`
This occurs when you reference a variable locally *before* assigning to it, causing Python to mark the name as local for the entire function block.

```python
# ❌ INCORRECT: Triggers UnboundLocalError
counter = 10

def bad_increment():
    print(counter)  # Python sees assignment below and marks counter as LOCAL!
    counter += 1  # Raises UnboundLocalError at print statement above

# bad_increment()
```

```python
# ✅ CORRECT: Declare global explicitly or pass as parameter
counter = 10

def good_increment(val: int) -> int:
    return val + 1

counter = good_increment(counter)
```

#### Pitfall 2: Shadowing Built-in Functions
Naming variables after built-in functions breaks access to those built-ins within that scope.

```python
# ❌ INCORRECT: Shadowing built-in 'sum'
sum = [1, 2, 3]  # 'sum' is now a list object globally!
# total = sum([4, 5, 6]) # Raises TypeError: 'list' object is not callable

# ✅ CORRECT: Choose distinct names
numbers_list = [1, 2, 3]
total = sum(numbers_list)
```

---

## 📝 Summary & Key Takeaways

1. **Namespaces map names to objects.** Python manages scopes dynamically using four key levels: **Local**, **Enclosing**, **Global**, and **Built-in** (**LEGB**).
2. **Variable Resolution moves inside-out.** Python resolves names by checking `L -> E -> G -> B`. The search stops at the first matching identifier.
3. **`global` allows mutation of top-level module state**, but overuse leads to tight coupling and unmaintainable code.
4. **`nonlocal` allows inner functions to mutate state in outer nested scopes**, forming the basis for functional closures.
5. **Beware of `UnboundLocalError`**, which happens when a variable is reassigned locally without explicit scope declarations.

---

### What's Next?
Tomorrow, on **Day 020**, we will explore **Lambda Functions & Anonymous Scope**, mastering functional techniques like `map()`, `filter()`, and inline data transformations!
