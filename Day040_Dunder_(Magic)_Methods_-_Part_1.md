# Day 040: Dunder (Magic) Methods - Part 1

> **Difficulty:** Intermediate | **Topic:** OOP | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Understand what special (dunder) methods are and how Python's data model utilizes them.
- Master custom string representations using `__str__` and `__repr__` and know when to use each.
- Implement container length and truthiness evaluation using `__len__` and `__bool__`.
- Define custom value-based equality logic for instances using `__eq__`.

---

## 📚 Theory & Concepts

### What Are Dunder Methods?
In Python, **dunder methods** (short for **D**ouble **UNDER**score methods) are special pre-defined methods that start and end with two underscores (e.g., `__init__`, `__str__`). They are also referred to as **magic methods** or **special methods**.

Dunder methods are not typically meant to be called directly like `obj.__str__()`. Instead, Python invokes them implicitly when specific operations or built-in functions are applied to an object.

For example:
- `len(my_list)` triggers `my_list.__len__()`
- `str(my_object)` or `print(my_object)` triggers `my_object.__str__()`
- `a == b` triggers `a.__eq__(b)`

This design concept is central to Python's **Data Model**. By implementing dunder methods in your custom classes, you allow your custom objects to behave like native Python types (lists, dictionaries, numbers), integrating seamlessly with language features.

---

### Object Representation: `__repr__` vs `__str__`

Python provides two distinct methods for creating string representations of objects:

| Feature | `__repr__` | `__str__` |
| :--- | :--- | :--- |
| **Primary Goal** | Unambiguous representation | Readable representation |
| **Target Audience** | Developers (debugging, logging) | End-users / User Interfaces |
| **Triggered By** | `repr(obj)`, interactive REPL, fallback for `str()` | `str(obj)`, `print(obj)`, f-strings `{obj}` |
| **Ideal Format** | Executable Python code (e.g., `Item("Laptop", 999.99)`) | Human-friendly text (e.g., `Laptop ($999.99)`) |

```
                       ┌─────────────────────────┐
                       │  print(obj) / str(obj)  │
                       └────────────┬────────────┘
                                    │
                         Is __str__ defined?
                             /         \
                           YES          NO
                           /             \
             ┌────────────▼───┐       ┌───▼────────────┐
             │ Exec __str__() │       │ Exec __repr__()│
             └────────────────┘       └────────────────┘
```

> **Key Rule:** If you only implement one of these, implement `__repr__`. Python uses `__repr__` as a fallback when `__str__` is missing.

---

### Object Sizing and Truthiness: `__len__` and `__bool__`

1. **`__len__(self)`**: Evaluates when built-in `len(obj)` is called. Must return a non-negative integer representing the size or item count of the object.
2. **`__bool__(self)`**: Evaluates when `bool(obj)` is called or when an object is tested in a conditional statement (`if obj:`). Must return `True` or `False`.

```
                    ┌──────────────────────────┐
                    │      if obj: / bool(obj) │
                    └─────────────┬────────────┘
                                  │
                       Is __bool__ defined?
                           /          \
                         YES           NO
                         /              \
           ┌────────────▼───┐        Is __len__ defined?
           │ Exec __bool__()│          /           \
           └────────────────┘        YES            NO
                                     /               \
                       ┌────────────▼───┐      ┌──────▼────────┐
                       │ len(obj) != 0  │      │ Default: True │
                       └────────────────┘      └───────────────┘
```

---

### Value Equality: `__eq__`

By default, Python compares objects using memory identity (`is`). Two distinct object instances in memory with identical attributes will evaluate to `False` when compared with `==` unless `__eq__` is overridden.

Overriding `__eq__(self, other)` allows you to define structural equality based on attribute values rather than memory addresses.

---

## 💻 Syntax & Structure

Here is the standard structural syntax for implementing basic dunder methods in a custom class:

```python
class Item:
    def __init__(self, name: str, price: float) -> None:
        """Initialize object instance attributes."""
        self.name = name
        self.price = price

    def __repr__(self) -> str:
        """Developer-focused string representation.
        Ideally matches the code required to recreate the object.
        """
        return f"Item(name={self.name!r}, price={self.price})"

    def __str__(self) -> str:
        """User-friendly string representation."""
        return f"{self.name} (${self.price:.2f})"

    def __len__(self) -> int:
        """Return logical length (e.g., string length of product name)."""
        return len(self.name)

    def __bool__(self) -> bool:
        """Determine truthiness based on custom business logic."""
        return self.price > 0.0

    def __eq__(self, other: object) -> bool:
        """Check value equality against another object."""
        if not isinstance(other, Item):
            return NotImplemented
        return self.name == other.name and self.price == other.price
```

---

## 🧪 Code Examples

Below is a complete, runnable example featuring a `ShoppingCart` and `Item` domain model. It demonstrates `__init__`, `__repr__`, `__str__`, `__len__`, `__bool__`, and `__eq__`.

```python
from typing import List

class Item:
    """Represents an individual item in a store."""

    def __init__(self, name: str, price: float) -> None:
        self.name = name
        self.price = price

    def __repr__(self) -> str:
        return f"Item(name={self.name!r}, price={self.price})"

    def __str__(self) -> str:
        return f"{self.name} - ${self.price:.2f}"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Item):
            return NotImplemented
        return self.name == other.name and self.price == other.price

class ShoppingCart:
    """Represents a customer's shopping cart containing items."""

    def __init__(self, owner: str) -> None:
        self.owner: str = owner
        self._items: List[Item] = []

    def add_item(self, item: Item) -> None:
        """Add an item to the cart."""
        self._items.append(item)

    def __repr__(self) -> str:
        return f"ShoppingCart(owner={self.owner!r}, items={self._items!r})"

    def __str__(self) -> str:
        item_count = len(self._items)
        return f"{self.owner}'s Cart containing {item_count} item(s)"

    def __len__(self) -> int:
        """Length is defined as total count of items in cart."""
        return len(self._items)

    def __bool__(self) -> bool:
        """Cart is Truthy if it contains at least one item."""
        return len(self._items) > 0

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, ShoppingCart):
            return NotImplemented
        return self.owner == other.owner and self._items == other._items

# --- Demonstration Code ---
if __name__ == "__main__":
    # 1. Item creation and equality
    item1 = Item("Mechanical Keyboard", 120.00)
    item2 = Item("Mechanical Keyboard", 120.00)
    item3 = Item("Ergonomic Mouse", 60.00)

    print("--- Item String Representations ---")
    print(f"str(item1)  : {str(item1)}")
    print(f"repr(item1) : {repr(item1)}")

    print("\n--- Item Equality Check ---")
    print(f"item1 == item2 : {item1 == item2}")  # True due to __eq__
    print(f"item1 == item3 : {item1 == item3}")  # False
    print(f"item1 is item2 : {item1 is item2}")  # False (different memory addresses)

    # 2. Shopping Cart creation and container behavior
    cart1 = ShoppingCart("Alice")
    cart2 = ShoppingCart("Alice")

    print("\n--- Empty Cart Evaluation ---")
    print(f"str(cart1)      : {cart1}")
    print(f"repr(cart1)     : {repr(cart1)}")
    print(f"len(cart1)      : {len(cart1)}")
    print(f"bool(cart1)     : {bool(cart1)}")
    print(f"Is cart active? : {'Yes' if cart1 else 'No'}")

    # 3. Adding items and re-evaluating
    cart1.add_item(item1)
    cart1.add_item(item3)
    
    cart2.add_item(item1)
    cart2.add_item(item3)

    print("\n--- Populated Cart Evaluation ---")
    print(f"str(cart1)      : {cart1}")
    print(f"repr(cart1)     : {repr(cart1)}")
    print(f"len(cart1)      : {len(cart1)}")
    print(f"bool(cart1)     : {bool(cart1)}")
    print(f"Is cart active? : {'Yes' if cart1 else 'No'}")

    print("\n--- Cart Equality Check ---")
    print(f"cart1 == cart2 : {cart1 == cart2}")
```

---

## 📊 Expected Output

```text
--- Item String Representations ---
str(item1)  : Mechanical Keyboard - $120.00
repr(item1) : Item(name='Mechanical Keyboard', price=120.0)

--- Item Equality Check ---
item1 == item2 : True
item1 == item3 : False
item1 is item2 : False

--- Empty Cart Evaluation ---
str(cart1)      : Alice's Cart containing 0 item(s)
repr(cart1)     : ShoppingCart(owner='Alice', items=[])
len(cart1)      : 0
bool(cart1)     : False
Is cart active? : No

--- Populated Cart Evaluation ---
str(cart1)      : Alice's Cart containing 2 item(s)
repr(cart1)     : ShoppingCart(owner='Alice', items=[Item(name='Mechanical Keyboard', price=120.0), Item(name='Ergonomic Mouse', price=60.0)])
len(cart1)      : 2
bool(cart1)     : True
Is cart active? : Yes

--- Cart Equality Check ---
cart1 == cart2 : True
```

---

## 🌍 Real-World Applications

1. **Object-Relational Mappers (ORMs):** Frameworks like SQLAlchemy and Django ORM implement `__repr__` on database models so that developers can quickly identify record instances in logs and debug terminals (`<User id=42, username='johndoe'>`).
2. **Data Processing Frameworks:** Libraries like Pandas and PyTorch override representation and sizing dunders on custom data structures (`DataFrame`, `Tensor`) to print clean, structured tabular summaries and report shape metrics seamlessly via `len()`.
3. **Domain-Driven Design (DDD) Value Objects:** Domain entities that need structural equality rather than reference identity (e.g., `Money(amount=100, currency='USD')`, `GPSCoordinates(lat=40.7128, lon=-74.0060)`) rely heavily on `__eq__`.

---

## 💡 Best Practices

- **Always define `__repr__` first:** It provides invaluable context during debugging sessions and unit test failures.
- **Use `!r` in format strings for `__repr__`:** Using `f"{self.attr!r}"` automatically applies `repr()` to attributes, wrapping strings in quotes cleanly.
- **Return `NotImplemented` instead of raising `TypeError` in `__eq__`:** If the type being compared isn't supported, returning `NotImplemented` allows Python to check if the reverse operation is supported by the other object (`other.__eq__(self)`).
- **Ensure `__len__` returns a valid integer:** Returning non-integers or negative numbers from `__len__` will raise a `TypeError` or `ValueError` at runtime.

### ⚠️ Common Pitfalls to Avoid
- **Infinite Recursion in `__len__` or `__str__`:** Avoid calling `len(self)` inside `__len__()` or `str(self)` inside `__str__()`. This triggers recursion errors.
- **Returning standard text in `__repr__`:** Do not return plain readable sentences in `__repr__`. Keep user-friendly prose reserved exclusively for `__str__`.

---

## 📝 Summary & Key Takeaways

- Dunder methods allow custom classes to integrate directly into Python's built-in functionality and operators.
- `__repr__` is designed for **developers** (unambiguous, precise); `__str__` is designed for **users** (readable).
- `__len__` controls `len()` output; `__bool__` controls boolean evaluation and truthiness checks.
- `__eq__` converts comparison logic from memory address matching (`is`) to attribute-value comparison (`==`).

**Preview for Tomorrow:** On **Day 41**, we will dive into **Dunder Methods - Part 2**, exploring **Operator Overloading** (`__add__`, `__sub__`, `__mul__`) and **Container Emulation** (`__getitem__`, `__setitem__`).
