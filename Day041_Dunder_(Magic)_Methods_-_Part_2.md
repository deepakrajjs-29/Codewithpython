# Day 041: Dunder (Magic) Methods - Part 2

> **Difficulty:** Intermediate | **Topic:** OOP | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives

- **Overload binary and scalar operators** (`+`, `-`, `*`) using `__add__`, `__radd__`, and `__iadd__` to build mathematical and domain-specific object behaviors.
- **Emulate built-in container types** by implementing sequence magic methods (`__len__`, `__getitem__`, `__setitem__`, `__contains__`).
- **Create callable object instances** using `__call__` to retain state across invocations like function objects (functors).
- **Gracefully handle type mismatches** in custom operators using `NotImplemented` instead of raising `TypeError`.

---

## 📚 Theory & Concepts

In **Day 40**, you learned how dunder methods manage object lifecycle (`__init__`), string representations (`__str__`, `__repr__`), and equality checks (`__eq__`). 

**Part 2** explores advanced dunder methods that allow custom objects to integrate seamlessly into Python's arithmetic operators, collection protocols, and function-call semantics.

### 1. Operator Overloading & Reflected Methods

When you evaluate `a + b`, Python does not hardcode arithmetic for custom classes. Instead, it delegates the operation to the left operand's `__add__` method:

```text
a + b  --->  type(a).__add__(a, b)
```

However, if `a` does not know how to add `b` (for example, adding an `int` to a custom `Vector` class: `5 + vector`), Python falls back to the **reflected (or right-sided) method** on the right operand:

```text
5 + v1
 ├── 1. Try type(5).__add__(5, v1)  ---> Returns NotImplemented
 └── 2. Fallback to type(v1).__radd__(v1, 5) ---> Vector(6, ...)
```

#### Binary Operator Fallback Mechanism

```text
           +-----------------------+
           | Compute Expression    |
           |      a + b            |
           +-----------+-----------+
                       |
                       v
       +---------------+---------------+
       | Call type(a).__add__(a, b)    |
       +---------------+---------------+
                       |
             Returns value / NotImplemented?
            /                         \
      Valid Value                 NotImplemented
          /                             \
         v                               v
+------------------+           +-----------------------+
| Return Result    |           | Call type(b).__radd__(b, a) |
+------------------+           +-----------+-----------+
                                           |
                                 Returns value / NotImplemented?
                                /                         \
                          Valid Value                 NotImplemented
                              /                             \
                             v                               v
                    +------------------+           +-------------------+
                    | Return Result    |           | Raise TypeError   |
                    +------------------+           +-------------------+
```

> **Crucial Rule:** When an operator method encounters an unsupported type, it should return the singleton `NotImplemented` instead of raising `TypeError`. This signal informs Python to try the reflected method on the right-hand operand.

### 2. In-Place Operators (`__iadd__`, `__isub__`)

In-place operators correspond to augmented assignment operators like `+=` or `-=`. 

- `__add__`: Creates and returns a **new instance**.
- `__iadd__`: Mutates the **existing instance** in-place (if mutable) and returns `self`.

If `__iadd__` is not implemented, Python falls back to `a = a + b` using `__add__`.

### 3. Container & Sequence Emulation

You can make instances of custom classes behave like lists, dictionaries, or tuples by implementing sequence dunder methods:

| Dunder Method | Trigger Expression | Purpose |
| :--- | :--- | :--- |
| `__len__(self)` | `len(obj)` | Returns the item count |
| `__getitem__(self, key)` | `obj[key]` | Accesses an item by index/key or slice |
| `__setitem__(self, key, val)`| `obj[key] = val` | Assigns a value at an index/key |
| `__delitem__(self, key)` | `del obj[key]` | Removes an item at an index/key |
| `__contains__(self, item)` | `item in obj` | Custom membership test (`True`/`False`) |

### 4. Callable Objects (`__call__`)

Implementing `__call__` allows instances of a class to be invoked directly like functions (`obj(arg1, arg2)`). This pattern is useful for creating stateful functions, decorators, or transformation pipelines.

---

## 💻 Syntax & Structure

### Arithmetic and In-Place Overloading

```python
class NumericPoint:
    def __init__(self, value: float):
        self.value = value

    def __add__(self, other: object) -> "NumericPoint":
        """Handles: point + other"""
        if isinstance(other, NumericPoint):
            return NumericPoint(self.value + other.value)
        if isinstance(other, (int, float)):
            return NumericPoint(self.value + other)
        return NotImplemented

    def __radd__(self, other: object) -> "NumericPoint":
        """Handles: scalar + point (reflected addition)"""
        return self.__add__(other)

    def __iadd__(self, other: object) -> "NumericPoint":
        """Handles: point += other (in-place addition)"""
        if isinstance(other, NumericPoint):
            self.value += other.value
        elif isinstance(other, (int, float)):
            self.value += other
        else:
            return NotImplemented
        return self
```

### Container Emulation & Callable Semantics

```python
class SmartList:
    def __init__(self, items: list):
        self._data = list(items)

    def __len__(self) -> int:
        return len(self._data)

    def __getitem__(self, index: int | slice):
        return self._data[index]

    def __setitem__(self, index: int, value):
        self._data[index] = value

    def __contains__(self, item) -> bool:
        return item in self._data

    def __call__(self, factor: int):
        """Allows class instance to be called like a function."""
        return [item * factor for item in self._data]
```

---

## 🧪 Code Examples

The following program demonstrates arithmetic overloading (`Vector2D`) and container emulation (`DataSetPipeline`).

```python
class Vector2D:
    """A 2D mathematical vector with custom arithmetic operator overloading."""

    def __init__(self, x: float, y: float) -> None:
        self.x = float(x)
        self.y = float(y)

    def __repr__(self) -> str:
        return f"Vector2D(x={self.x}, y={self.y})"

    # --- Standard Binary Addition ---
    def __add__(self, other: object) -> "Vector2D":
        if isinstance(other, Vector2D):
            return Vector2D(self.x + other.x, self.y + other.y)
        if isinstance(other, (int, float)):
            return Vector2D(self.x + other, self.y + other)
        return NotImplemented

    # --- Reflected Addition (Scalar + Vector2D) ---
    def __radd__(self, other: object) -> "Vector2D":
        return self.__add__(other)

    # --- In-Place Addition (Vector2D += Vector2D | Scalar) ---
    def __iadd__(self, other: object) -> "Vector2D":
        if isinstance(other, Vector2D):
            self.x += other.x
            self.y += other.y
        elif isinstance(other, (int, float)):
            self.x += other
            self.y += other
        else:
            return NotImplemented
        return self

    # --- Multiplication (Vector2D * Scalar) ---
    def __mul__(self, scalar: float) -> "Vector2D":
        if isinstance(scalar, (int, float)):
            return Vector2D(self.x * scalar, self.y * scalar)
        return NotImplemented

    def __rmul__(self, scalar: float) -> "Vector2D":
        return self.__mul__(scalar)

    # --- Container / Indexing Protocol ---
    def __len__(self) -> int:
        return 2

    def __getitem__(self, index: int) -> float:
        components = (self.x, self.y)
        try:
            return components[index]
        except IndexError:
            raise IndexError("Vector2D index out of range. Use 0 for x, 1 for y.")

    # --- Callable Functor Protocol ---
    def __call__(self, scale_factor: float) -> "Vector2D":
        """Calling the vector instance scales component values."""
        return self * scale_factor

class DataBuffer:
    """Custom collection class implementing sequence dunder protocols."""

    def __init__(self, initial_data: list[str] | None = None) -> None:
        self._items: list[str] = list(initial_data) if initial_data else []

    def __len__(self) -> int:
        return len(self._items)

    def __getitem__(self, index: int | slice) -> str | list[str]:
        return self._items[index]

    def __setitem__(self, index: int, value: str) -> None:
        if not isinstance(value, str):
            raise TypeError("DataBuffer elements must be strings.")
        self._items[index] = value

    def __contains__(self, item: str) -> bool:
        return item in self._items

    def __repr__(self) -> str:
        return f"DataBuffer({self._items})"

# ==========================================
# Execution & Demonstration
# ==========================================
if __name__ == "__main__":
    print("--- 1. Vector Arithmetic & Reflected Addition ---")
    v1 = Vector2D(3, 4)
    v2 = Vector2D(1, 2)

    v3 = v1 + v2
    print(f"v1 + v2       = {v3}")

    v_scalar = v1 + 10
    print(f"v1 + 10       = {v_scalar}")

    v_reflected = 5 + v1
    print(f"5 + v1 (radd) = {v_reflected}")

    v_mul = v1 * 3
    print(f"v1 * 3        = {v_mul}")

    print("\n--- 2. In-Place Addition (__iadd__) ---")
    v_in_place = Vector2D(10, 20)
    print(f"Before +=     : {v_in_place} (ID: {id(v_in_place)})")
    v_in_place += Vector2D(5, 5)
    print(f"After +=      : {v_in_place} (ID: {id(v_in_place)})")

    print("\n--- 3. Callable Instance (__call__) ---")
    scaled_v1 = v1(2.5)  # Vector invoked like a function
    print(f"v1(2.5)       = {scaled_v1}")

    print("\n--- 4. Container Operations ---")
    print(f"v1[0] (x)     = {v1[0]}")
    print(f"v1[1] (y)     = {v1[1]}")

    buffer = DataBuffer(["Python", "Rust", "Go"])
    print(f"Buffer        = {buffer}")
    print(f"len(buffer)   = {len(buffer)}")
    print(f"'Python' in buffer = {'Python' in buffer}")

    buffer[1] = "C++"
    print(f"Updated Buffer= {buffer}")
    print(f"Slice [0:2]   = {buffer[0:2]}")
```

---

## 📊 Expected Output

```text
--- 1. Vector Arithmetic & Reflected Addition ---
v1 + v2       = Vector2D(x=4.0, y=6.0)
v1 + 10       = Vector2D(x=13.0, y=14.0)
5 + v1 (radd) = Vector2D(x=8.0, y=9.0)
v1 * 3        = Vector2D(x=9.0, y=12.0)

--- 2. In-Place Addition (__iadd__) ---
Before +=     : Vector2D(x=10.0, y=20.0) (ID: 139823485812816)
After +=      : Vector2D(x=15.0, y=25.0) (ID: 139823485812816)

--- 3. Callable Instance (__call__) ---
v1(2.5)       = Vector2D(x=7.5, y=10.0)

--- 4. Container Operations ---
v1[0] (x)     = 3.0
v1[1] (y)     = 4.0
Buffer        = DataBuffer(['Python', 'Rust', 'Go'])
len(buffer)   = 3
'Python' in buffer = True
Updated Buffer= DataBuffer(['Python', 'C++', 'Go'])
Slice [0:2]   = ['Python', 'C++']
```

---

## 🌍 Real-World Applications

### 1. Deep Learning Frameworks (PyTorch & TensorFlow)
In **PyTorch**, every neural network layer inherits from `torch.nn.Module`, which implements `__call__`. Passing data to a layer invokes `forward()` via `__call__`:

```python
model = NeuralNetwork()
output = model(input_tensor)  # Triggers model.__call__
```

PyTorch `Dataset` classes also implement container methods (`__len__` and `__getitem__`) to allow batching and slicing.

### 2. Scientific & Financial Computing (NumPy & Pandas)
Data processing libraries use operator overloading (`__add__`, `__mul__`, `__eq__`) to support vectorized math across arrays and series:

```python
# Element-wise operations achieved via dunder methods
portfolio_value = stock_prices * share_counts
```

### 3. ORMs and Database Query Builders
Object-Relational Mappers like **SQLAlchemy** overload comparison operators (`__eq__`, `__gt__`) on column attributes to generate SQL clauses:

```python
# Generates SQL: WHERE users.age > 21
query = session.query(User).filter(User.age > 21)
```

---

## 💡 Best Practices

- **Return `NotImplemented` for Unknown Types:** In arithmetic dunders (`__add__`, `__sub__`, etc.), return `NotImplemented` instead of raising a `TypeError`. This lets Python attempt reflected operations (`__radd__`) or gracefully report type errors.
- **Maintain In-Place Mutation Semantics:** In `__iadd__` or `__isub__`, modify `self` directly and **always return `self`**. If your class is designed to be immutable, do not implement `__iadd__`; Python will default to `a = a + b`.
- **Support Slicing inside `__getitem__`:** When building a sequence container class, delegate slice handling directly to an underlying list/tuple, or check `if isinstance(index, slice):` to handle sliced ranges properly.
- **Do Not Overload Operators Unintuitively:** Only implement operator methods if the operation is domain-appropriate. Overloading `+` to mean "append to file" or `*` to mean "close connection" makes code confusing and prone to bugs.

---

## 📝 Summary & Key Takeaways

1. **Arithmetic Overloading**: Dunder methods like `__add__`, `__sub__`, and `__mul__` define custom behavior for mathematical operators.
2. **Reflected Methods (`__radd__`)**: Provide fallback support when the left operand does not know how to handle the right operand.
3. **In-Place Operators (`__iadd__`)**: Mutate existing instances in-place and return `self` to preserve object identity.
4. **Sequence Emulation**: Implementing `__len__`, `__getitem__`, `__setitem__`, and `__contains__` allows custom instances to behave like native Python lists or dicts.
5. **Callable Instances**: Implementing `__call__` turns object instances into stateful callable functions.

---

**Next Lesson (Day 42):** *Context Managers & The Context Manager Protocol (`__enter__` and `__exit__`)*.
