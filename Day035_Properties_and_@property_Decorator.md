# Day 035: Properties and @property Decorator

> **Difficulty:** Intermediate | **Topic:** OOP | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives

- Understand the **Uniform Access Principle** and why Pythonic encapsulation differs from languages like Java or C++.
- Master the built-in `@property` decorator to access methods as if they were standard attributes.
- Implement robust attribute getters, setters (`@<name>.setter`), and deleters (`@<name>.deleter`) to enforce data validation.
- Construct dynamically computed (read-only) attributes without breaking public object interfaces.
- Avoid common pitfall patterns, such as infinite recursion caused by attribute naming collisions.

---

## 📚 Theory & Concepts

### The Encapsulation Dilemma

In traditional object-oriented languages like Java or C++, raw public attributes are often discouraged. Developers are taught to make instance variables private and wrap them in explicit getter and setter methods immediately:

```python
# Unpythonic "Java-style" in Python
class BankAccount:

    def __init__(self, balance: float):
        self._balance = balance  # Pseudo-private attribute

    def get_balance(self) -> float:
        return self._balance

    def set_balance(self, value: float) -> None:
        if value < 0:
            raise ValueError("Balance cannot be negative.")
        self._balance = value
```

Calling `account.get_balance()` and `account.set_balance(100)` everywhere makes code verbose and unpythonic. Python adheres to the **Uniform Access Principle**: all services provided by an object should be available through a uniform notation, regardless of whether they are implemented through computation or storage.

Python encourages you to start simple with plain public attributes:

```python
class BankAccount:

    def __init__(self, balance: float):
        self.balance = balance  # Direct public attribute
```

However, what happens when business logic changes later, and you must validate that `balance` is never set to a negative number? In languages without properties, changing `account.balance = 500` to `account.set_balance(500)` breaks every piece of client code using your class.

### Enter the `@property` Decorator

Python solves this with the `@property` decorator. It allows you to turn a method into an **attribute access hook**. External code continues using clean dot-notation (`obj.attr`), but under the hood, Python transparently calls your getter, setter, or deleter methods.

```
       Client Code Interaction                       Internal Execution
┌──────────────────────────────────┐        ┌──────────────────────────────────┐
│ account.balance                  │───────>│ Executes getter: balance(self)   │
├──────────────────────────────────┤        ├──────────────────────────────────┤
│ account.balance = 250            │───────>│ Executes setter: balance(self, v)│
├──────────────────────────────────┤        ├──────────────────────────────────┤
│ del account.balance              │───────>│ Executes deleter: balance(self)  │
└──────────────────────────────────┘        └──────────────────────────────────┘
```

By wrapping attribute access in methods, you can:
1. **Validate input** before modifying internal state.
2. **Compute values on the fly** without storing redundant data in memory.
3. **Refactor existing classes** without breaking public APIs.

---

## 💻 Syntax & Structure

### Anatomy of `@property`

The `@property` decorator wraps three distinct operations corresponding to attribute access lifecycle:

1. **Getter** (`@property`): Called when reading `obj.attr`.
2. **Setter** (`@<attr>.setter`): Called when writing `obj.attr = value`.
3. **Deleter** (`@<attr>.deleter`): Called when deleting `del obj.attr`.

```python
class SmartDevice:

    def __init__(self, device_id: str, temperature: float) -> None:
        self.device_id = device_id
        # Private backing field used to store the actual state
        self._temperature = temperature

    # 1. GETTER
    @property
    def temperature(self) -> float:
        """The temperature property getter."""
        print("Reading temperature...")
        return self._temperature

    # 2. SETTER
    @temperature.setter
    def temperature(self, value: float) -> None:
        """The temperature property setter with validation."""
        print(f"Attempting to set temperature to {value}°C...")
        if value < -273.15:
            raise ValueError("Temperature below absolute zero is impossible!")
        self._temperature = value

    # 3. DELETER
    @temperature.deleter
    def temperature(self) -> None:
        """The temperature property deleter."""
        print("Resetting temperature attribute...")
        del self._temperature
```

> ⚠️ **Critical Rule**: The getter, setter, and deleter methods **must all share the exact same method name** (in this case, `temperature`). The backing attribute where data is stored typically uses a leading underscore (`_temperature`) to avoid naming collisions.

---

## 🧪 Code Examples

Below is a complete, executable script demonstrating a real-world `Product` class. It demonstrates value validation, computed read-only properties, and property deletion.

```python
class Product:
    """Represents a store item with price validation and calculated discounts."""

    def __init__(self, name: str, original_price: float, discount_percent: float = 0.0) -> None:
        self.name = name
        # Using setter validation right inside __init__
        self.price = original_price
        self.discount_percent = discount_percent

    # --- PRICE PROPERTY ---
    @property
    def price(self) -> float:
        """Get the base price of the product."""
        return self._price

    @price.setter
    def price(self, value: float) -> None:
        """Set the base price, ensuring it is non-negative."""
        if not isinstance(value, (int, float)):
            raise TypeError("Price must be a numeric value.")
        if value < 0:
            raise ValueError("Price cannot be negative.")
        self._price = float(value)

    # --- DISCOUNT PERCENT PROPERTY ---
    @property
    def discount_percent(self) -> float:
        """Get the current discount percentage."""
        return self._discount_percent

    @discount_percent.setter
    def discount_percent(self, value: float) -> None:
        """Set discount percentage, validating range between 0 and 100."""
        if not (0 <= value <= 100):
            raise ValueError("Discount percent must be between 0 and 100.")
        self._discount_percent = float(value)

    # --- COMPUTED READ-ONLY PROPERTY ---
    @property
    def final_price(self) -> float:
        """Calculate the final price dynamically after discount (Read-Only)."""
        discount_amount = self._price * (self._discount_percent / 100)
        return round(self._price - discount_amount, 2)

    # --- DELETER ---
    @price.deleter
    def price(self) -> None:
        """Reset price by deleting the underlying attribute."""
        print(f"Log: Clearing price data for product '{self.name}'.")
        del self._price

# --- DEMONSTRATION & TESTING ---
if __name__ == "__main__":
    print("=== 1. Initializing Product ===")
    laptop = Product(name="Gaming Laptop", original_price=1200.0, discount_percent=10.0)
    print(f"Product: {laptop.name}")
    print(f"Base Price: ${laptop.price:.2f}")
    print(f"Discount: {laptop.discount_percent}%")
    print(f"Final Computed Price: ${laptop.final_price:.2f}")

    print("\n=== 2. Updating Price via Setter ===")
    laptop.price = 1000.0
    print(f"New Base Price: ${laptop.price:.2f}")
    print(f"Updated Final Price: ${laptop.final_price:.2f}")

    print("\n=== 3. Validation Failure Tests ===")
    try:
        print("Attempting to set a negative price...")
        laptop.price = -50.0
    except ValueError as e:
        print(f"Caught expected error: {e}")

    try:
        print("Attempting to set discount above 100%...")
        laptop.discount_percent = 150.0
    except ValueError as e:
        print(f"Caught expected error: {e}")

    try:
        print("Attempting to overwrite a read-only property...")
        laptop.final_price = 500.0
    except AttributeError as e:
        print(f"Caught expected error: {e}")

    print("\n=== 4. Deleting Property ===")
    del laptop.price
    
    print("Attempting to access deleted price...")
    try:
        print(laptop.price)
    except AttributeError as e:
        print(f"Caught expected error: {e}")
```

---

## 📊 Expected Output

```text
=== 1. Initializing Product ===
Product: Gaming Laptop
Base Price: $1200.00
Discount: 10.0%
Final Computed Price: $1080.00

=== 2. Updating Price via Setter ===
New Base Price: $1000.00
Updated Final Price: $900.00

=== 3. Validation Failure Tests ===
Attempting to set a negative price...
Caught expected error: Price cannot be negative.
Attempting to set discount above 100%...
Caught expected error: Discount percent must be between 0 and 100.
Attempting to overwrite a read-only property...
Caught expected error: property 'final_price' of 'Product' object has no setter

=== 4. Deleting Property ===
Log: Clearing price data for product 'Gaming Laptop'.
Attempting to access deleted price...
Caught expected error: 'Product' object has no attribute '_price'
```

---

## 🌍 Real-World Applications

### 1. Web Framework ORMs (Django / SQLAlchemy)
Database models frequently use properties to present formatted user data, derive values dynamically, or transform database data prior to rendering:

```python
class UserProfile:

    def __init__(self, first_name: str, last_name: str):
        self.first_name = first_name
        self.last_name = last_name

    @property
    def full_name(self) -> str:
        """Dynamically build user full name for UI display."""
        return f"{self.first_name} {self.last_name}"
```

### 2. Backward Compatibility & API Refactoring
Suppose an updated version of a library deprecates an attribute or changes internal measurement units (e.g., from Fahrenheit to Celsius). By introducing `@property`, existing code continue accessing `obj.fahrenheit` seamless and transparently, while internal storage shifts to Celsius.

### 3. Caching & Lazy Evaluation
Properties can trigger expensive computations (like reading a huge file or querying a database) only when the attribute is first requested, saving startup memory and processor time.

---

## 💡 Best Practices

| Do | Don't |
| :--- | :--- |
| **Do** name backing attributes with a single prefix underscore (`self._name`). | **Don't** name the backing variable identically to the property function (causes infinite recursion). |
| **Do** keep getter execution fast and deterministic. | **Don't** put long-running operations or heavy network requests inside getters without caching. |
| **Do** use read-only properties for computed attributes (`final_price`). | **Don't** implement getters and setters if plain attribute access without validation is sufficient. |
| **Do** call properties inside `__init__` (`self.price = price`) to enforce validation on creation. | **Don't** hide unexpected side effects inside a property read (e.g., mutating database records inside a getter). |

---

### 🚨 Common Pitfall: Infinite Recursion

The single most common mistake when starting with `@property` is referencing the property name inside its own setter or getter:

```python
class RecursionBug:

    def __init__(self, value: int):
        self.value = value

    @property
    def value(self) -> int:
        return self.value  # ❌ BROKEN! Recursively calls the getter until stack overflows.

    @value.setter
    def value(self, val: int) -> None:
        self.value = (
            val  # ❌ BROKEN! Recursively calls the setter until stack overflows.
        )
```

**The Fix:** Always store the actual value in a backing attribute with a leading underscore (`self._value`):

```python
class CorrectImplementation:

    def __init__(self, value: int):
        self.value = value  # Calls the setter for initial validation!

    @property
    def value(self) -> int:
        return self._value  # ✅ Correct backing field reference

    @value.setter
    def value(self, val: int) -> None:
        self._value = val  # ✅ Correct backing field assignment
```

---

## 📝 Summary & Key Takeaways

1. **Pythonic Encapsulation**: Avoid explicit Java-style `get_x()` and `set_x()` methods. Use standard attribute access until validation or computation is required, then refactor to `@property`.
2. **Components**:
   - `@property` converts a method into a **getter**.
   - `@<property_name>.setter` decorates a validation/mutation method executed during assignment (`=`).
   - `@<property_name>.deleter` runs cleanup logic when `del` is invoked on the attribute.
3. **Read-Only Attributes**: Omit the `.setter` decorator to make an attribute strictly read-only. Attempting to assign to it raises an `AttributeError`.
4. **Clean APIs**: Use properties to create computed attributes that recalculate state dynamically without adding additional method call syntax (`()`).

---

### 🔮 What's Next?
Tomorrow on **Day 36**, we will dive into **Class Methods (`@classmethod`) vs Static Methods (`@staticmethod`)**, exploring how to construct alternative constructors, utility helpers, and manage class-level state in Python!
