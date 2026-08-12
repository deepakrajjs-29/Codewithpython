# Day 042: Data Classes (dataclasses module)

> **Difficulty:** Intermediate | **Topic:** OOP | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives

- **Understand** the purpose of Python's `dataclasses` module and how it eliminates repetitive Object-Oriented boilerplate code.
- **Master** the `@dataclass` decorator parameters (`frozen`, `order`, `slots`, `kw_only`).
- **Utilize** `field()` to manage default values, mutable default handling (`default_factory`), and field visibility.
- **Implement** custom post-initialization logic using the `__post_init__()` hook.
- **Convert** dataclass instances seamlessly into dictionaries and tuples for serialization.

---

## 📚 Theory & Concepts

### The Boilerplate Problem in Python OOP

When building object-oriented data containers (classes primarily used to store attributes), traditional Python classes require significant boilerplate code. To make a standard class behave properly, you must explicitly implement standard dunder (double underscore) methods such as `__init__`, `__repr__`, and `__eq__`.

Consider a simple `InventoryItem` class written using traditional OOP:

```python
class InventoryItem:
    def __init__(self, name: str, unit_price: float, quantity: int = 0):
        self.name = name
        self.unit_price = unit_price
        self.quantity = quantity

    def __repr__(self):
        return f"InventoryItem(name={self.name!r}, unit_price={self.unit_price!r}, quantity={self.quantity!r})"

    def __eq__(self, other):
        if not isinstance(other, InventoryItem):
            return NotImplemented
        return (self.name, self.unit_price, self.quantity) == (other.name, other.unit_price, other.quantity)
```

Writing this code repeatedly is tedious, error-prone, and visually noisy. 

### Enter Data Classes (`dataclasses`)

Introduced in **Python 3.7** (and continuously improved in 3.10+ with `slots` and `kw_only`), the `@dataclass` decorator inspects variable annotations on a class and automatically generates boilerplate dunder methods behind the scenes.

```mermaid
graph TD
    A[Class with Variable Annotations] --> B[@dataclass Decorator]
    B --> C[Auto-generated __init__]
    B --> D[Auto-generated __repr__]
    B --> E[Auto-generated __eq__]
    B --> F[Optional: Ordering __lt__, Immutability, Memory Slots]
```

### Comparing Data Structure Options

| Feature | `dict` | `namedtuple` | Regular `class` | `@dataclass` |
| :--- | :--- | :--- | :--- | :--- |
| **Type Hints Supported** | Optional | Partial | Manual | **Native** |
| **Mutability** | Mutable | Immutable | Mutable | **Configurable** |
| **Default Auto-`__repr__`** | Yes (dictionary format) | Yes | No (Object address) | **Yes (Clean representation)** |
| **Custom Methods** | No | No | Yes | **Yes** |
| **Default Values** | N/A | Supported | Manual | **Supported (`field()`)** |

---

## 💻 Syntax & Structure

### Basic Dataclass Structure

A dataclass relies on class variable **type annotations**. Unannotated fields are ignored by the dataclass code generator.

```python
from dataclasses import dataclass, field
from typing import List

@dataclass
class User:
    username: str                     # Required field (no default)
    email: str                        # Required field (no default)
    is_active: bool = True            # Optional field with scalar default
    tags: List[str] = field(default_factory=list)  # Mutable default factory
```

### Key Decorator Parameters

The `@dataclass` decorator accepts several configuration parameters:

```python
@dataclass(
    init=True,       # Generates __init__() (Default: True)
    repr=True,       # Generates __repr__() (Default: True)
    eq=True,         # Generates __eq__() (Default: True)
    order=False,     # Generates comparison methods: <, <=, >, >= (Default: False)
    unsafe_hash=False, # Generates __hash__() forceably (Default: False)
    frozen=False,    # Makes instances immutable (read-only) (Default: False)
    match_args=True, # Generates __match_args__ for structural pattern matching (Default: True)
    kw_only=False,   # Forces all fields to be keyword arguments (Default: False)
    slots=False      # Uses __slots__ for reduced memory footprint (Default: False)
)
class Config:
    pass
```

### The `field()` Helper Function

To customize individual attributes, Python provides `field()`:

```python
from dataclasses import dataclass, field

@dataclass
class Product:
    name: str
    price: float
    # Exclude internal field from auto-generated __repr__ and comparison
    internal_id: str = field(repr=False, compare=False)
    # Dynamic mutable defaults MUST use default_factory
    categories: list[str] = field(default_factory=list)
```

---

## 🧪 Code Examples

Below is a complete, executable Python script demonstrating real-world dataclass capabilities: basic creation, `default_factory`, custom initialization with `__post_init__`, immutability (`frozen`), ordering (`order`), memory optimization (`slots`), and serialization using `asdict`.

```python
from dataclasses import dataclass, field, asdict, astuple
from typing import List
from datetime import datetime

# Example 1: Frozen (Immutable) and Ordered Dataclass
@dataclass(frozen=True, order=True)
class PriorityItem:
    priority: int
    name: str = field(compare=False)  # Sorting is based solely on 'priority'

# Example 2: Complex Dataclass with __post_init__, slots, and field customization
@dataclass(slots=True, kw_only=True)
class OrderItem:
    product_name: str
    unit_price: float
    quantity: int = 1
    total_price: float = field(init=False)  # Calculated inside __post_init__

    def __post_init__(self) -> None:
        """Runs automatically after __init__ completes."""
        if self.unit_price < 0:
            raise ValueError(f"Price cannot be negative: {self.unit_price}")
        if self.quantity <= 0:
            raise ValueError(f"Quantity must be positive: {self.quantity}")
        
        # Calculate total price dynamically
        object.__setattr__(self, 'total_price', round(self.unit_price * self.quantity, 2))

@dataclass
class ShoppingCart:
    customer_id: str
    created_at: str = field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    items: List[OrderItem] = field(default_factory=list)

    def add_item(self, item: OrderItem) -> None:
        self.items.append(item)

    @property
    def grand_total(self) -> float:
        return sum(item.total_price for item in self.items)

def main() -> None:
    print("--- 1. Immutable & Ordered Dataclasses ---")
    item1 = PriorityItem(priority=2, name="Fix critical bug")
    item2 = PriorityItem(priority=1, name="Write documentation")
    
    print(f"Item 1: {item1}")
    print(f"Is Item 2 higher priority than Item 1? {item2 < item1}")

    # Attempting to modify a frozen dataclass raises FrozenInstanceError
    try:
        item1.priority = 5
    except Exception as e:
        print(f"Caught expected error on assignment: {type(e).__name__}")

    print("\n--- 2. Post-Init & Default Factories ---")
    cart = ShoppingCart(customer_id="CUST-9876")
    
    laptop = OrderItem(product_name="Pro Laptop", unit_price=1299.99, quantity=2)
    mouse = OrderItem(product_name="Wireless Mouse", unit_price=29.50, quantity=1)
    
    cart.add_item(laptop)
    cart.add_item(mouse)

    print(f"Cart Owner: {cart.customer_id}")
    print(f"Cart Creation Time: {cart.created_at}")
    for item in cart.items:
        print(f" - {item.product_name}: {item.quantity} x ${item.unit_price} = ${item.total_price}")
    print(f"Grand Total: ${cart.grand_total:.2f}")

    print("\n--- 3. Dataclass Serialization ---")
    # Convert dataclass instance to standard Python dictionary and tuple
    cart_dict = asdict(cart)
    laptop_tuple = astuple(laptop)

    print(f"Serialized Dictionary Key Count: {len(cart_dict)}")
    print(f"Cart Dict 'items' sample: {cart_dict['items'][0]}")
    print(f"Laptop as Tuple: {laptop_tuple}")

if __name__ == "__main__":
    main()
```

---

## 📊 Expected Output

```text
--- 1. Immutable & Ordered Dataclasses ---
Item 1: PriorityItem(priority=2, name='Fix critical bug')
Is Item 2 higher priority than Item 1? True
Caught expected error on assignment: FrozenInstanceError

--- 2. Post-Init & Default Factories ---
Cart Owner: CUST-9876
Cart Creation Time: 2026-03-30 10:00:00
 - Pro Laptop: 2 x $1299.99 = $2599.98
 - Wireless Mouse: 1 x $29.5 = $29.5
Grand Total: $2629.48

--- 3. Dataclass Serialization ---
Serialized Dictionary Key Count: 3
Cart Dict 'items' sample: {'product_name': 'Pro Laptop', 'unit_price': 1299.99, 'quantity': 2, 'total_price': 2599.98}
Laptop as Tuple: ('Pro Laptop', 1299.99, 2, 2599.98)
```

---

## 🌍 Real-World Applications

1. **API Request / Response DTOs (Data Transfer Objects):** Dataclasses parse incoming payload structures (JSON/HTTP) into strongly-typed objects for clean internal consumption across business layers.
2. **Configuration Management:** Storing application-wide settings (e.g., database connection strings, API tokens) using `@dataclass(frozen=True)` prevents accidental runtime configuration mutations.
3. **Machine Learning Experiments:** Encapsulating model hyperparameters, dataset metadata, and runtime metrics in ordered dataclasses simplifies experiment logging and tracking.
4. **Data Pipelines & ETL Services:** Converting row records from SQL or NoSQL databases into typed Python data classes ensures standard structure before passing records downstream.

---

## 💡 Best Practices

- **Always Use `default_factory` for Mutables:** Never assign a mutable object directly as a default parameter (`items: list = []` raises a `ValueError`). Use `field(default_factory=list)` instead.
- **Leverage `slots=True` in Python 3.10+:** Using `@dataclass(slots=True)` drastically improves instantiation speed and reduces memory usage by replacing `__dict__` with predefined slots.
- **Enforce Mutability Guardrails with `frozen=True`:** Use immutable dataclasses whenever objects are meant to represent persistent state values or dict keys (which require hashability).
- **Avoid Dataclass Over-engineering:** Dataclasses do **not** perform runtime type checking by default. If strict schema validation and type coercion are required at boundaries, consider libraries like `pydantic`.

### Common Pitfalls to Avoid

❌ **Wrong (Mutable Default Bug):**
```python
@dataclass
class UserGroup:
    name: str
    members: list = []  # Raises ValueError at runtime!
```

✅ **Right:**
```python
@dataclass
class UserGroup:
    name: str
    members: list = field(default_factory=list)  # Correct dynamic allocation
```

---

## 📝 Summary & Key Takeaways

- The `dataclasses` module provides `@dataclass` to generate boilerplates (`__init__`, `__repr__`, `__eq__`) automatically based on class variable type annotations.
- Use `field()` to fine-tune behavior: skip attributes from representations (`repr=False`), exclude from comparison (`compare=False`), or manage mutable defaults (`default_factory`).
- `__post_init__()` provides a hook for post-instantiation attribute calculations, adjustments, or validation checks.
- Control object behavior using decorator parameters: `frozen=True` (immutable), `order=True` (sorting), `slots=True` (memory optimization), and `kw_only=True` (keyword enforcement).
- Utility functions `asdict()` and `astuple()` allow easy conversion of structured dataclass objects into raw formats.

**Preview for Tomorrow (Day 43):** We will explore **Abstract Base Classes (ABCs)** and formal **Interfaces** using the `abc` module to enforce structural architecture across large applications!
