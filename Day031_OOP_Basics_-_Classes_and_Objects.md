# Day 031: OOP Basics - Classes and Objects

> **Difficulty:** Intermediate | **Topic:** OOP | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives

- Understand the fundamental differences between Procedural and Object-Oriented Programming (OOP).
- Define custom Python **classes** using standard PEP 8 naming conventions.
- Instantiate independent **objects** (instances) from class blueprints.
- Master the `__init__` constructor method and understand the role of the `self` parameter.
- Add instance attributes and custom instance methods to model real-world state and behavior.

---

## 📚 Theory & Concepts

### The Shift Paradigm: Procedural vs. Object-Oriented

Up to this point, you have largely written **procedural code**: writing functions that accept data, process it, and return a result. Data structures (like dictionaries or lists) and functions remain separated.

**Object-Oriented Programming (OOP)** is a paradigm built around combining **data (state)** and **functions (behavior)** into single cohesive units called **objects**.

```
Procedural Approach:      Data (dicts, lists)  --->  Functions (process data)
Object-Oriented Approach: [ Object = Data (Attributes) + Functions (Methods) ]
```

### What is a Class vs. an Object?

- **Class (The Blueprint):** A user-defined data type that outlines the structure and capabilities. It defines what attributes an entity will possess and what actions it can perform. Defining a class does not allocate memory for data—it only defines the model.
- **Object (The Instance):** A concrete realization of a class allocated in memory. You can create multiple unique objects from a single class blueprint, each holding its own distinct state.

```
+-------------------------------------------------------+
|                    CLASS BLUEPRINT                    |
|                   class BankAccount                   |
+-------------------------------------------------------+
| Attributes: account_holder, balance                   |
| Methods:    deposit(), withdraw(), display_statement()|
+-------------------------------------------------------+
                           |
             Instantiation | account1 = BankAccount("Alice", 500)
                           v
+-------------------------------------------------------+
|                    OBJECT INSTANCE                    |
|             account1 (Memory: 0x7f8a3c)               |
+-------------------------------------------------------+
| account_holder = "Alice"                              |
| balance = 500.0                                       |
+-------------------------------------------------------+
```

### Key Components of Python OOP

1. **`__init__()` (The Constructor):** A special double-underscore ("dunder") method that Python automatically invokes whenever a new object is created. It initializes the object's initial attributes (state).
2. **`self` Parameter:** Represents the specific instance of the object being acted upon. Python passes this argument implicitly when calling instance methods. Inside `__init__` or methods, `self.attribute_name` binds a variable directly to that specific instance.
3. **Attributes:** Variables that belong to an object (`self.balance`).
4. **Methods:** Functions defined inside a class that operate on its attributes (`self.deposit(amount)`).

---

## 💻 Syntax & Structure

Here is the fundamental structure of a class in Python 3.12 with type annotations:

```python
class ClassName:
    """Class docstring explaining the blueprint's purpose."""

    def __init__(self, parameter_one: str, parameter_two: float) -> None:
        """The constructor method to initialize instance attributes."""
        # Instance Attributes
        self.attribute_one: str = parameter_one
        self.attribute_two: float = parameter_two

    def instance_method(self, amount: float) -> float:
        """An instance method operating on instance state via `self`."""
        self.attribute_two += amount
        return self.attribute_two

# Instantiating an object
my_object = ClassName(parameter_one="Initial Value", parameter_two=100.0)

# Accessing attributes and calling methods
print(my_object.attribute_one)
my_object.instance_method(50.0)
```

---

## 🧪 Code Examples

Below is a complete, executable program demonstrating a `BankAccount` class. It manages account balances, records transaction logs, and prevents invalid operations.

```python
class BankAccount:
    """Models a standard bank account with balance tracking and transaction history."""

    def __init__(self, account_holder: str, initial_balance: float = 0.0) -> None:
        """Initialize the account holder, balance, and transaction history."""
        self.account_holder: str = account_holder
        self.balance: float = initial_balance
        self.transaction_history: list[str] = []
        
        # Log opening event
        self._record_transaction(f"Account created with opening balance: ${initial_balance:.2f}")

    def deposit(self, amount: float) -> float:
        """Deposit funds into the account if the amount is valid."""
        if amount <= 0:
            print(f"[{self.account_holder}] Deposit failed: Amount must be greater than zero.")
            return self.balance

        self.balance += amount
        self._record_transaction(f"Deposited: ${amount:.2f}")
        print(f"[{self.account_holder}] Successfully deposited ${amount:.2f}.")
        return self.balance

    def withdraw(self, amount: float) -> float:
        """Withdraw funds from the account if sufficient balance exists."""
        if amount <= 0:
            print(f"[{self.account_holder}] Withdrawal failed: Amount must be greater than zero.")
            return self.balance

        if amount > self.balance:
            print(f"[{self.account_holder}] Insufficient funds! Attempted: ${amount:.2f}, Available: ${self.balance:.2f}")
            return self.balance

        self.balance -= amount
        self._record_transaction(f"Withdrew: ${amount:.2f}")
        print(f"[{self.account_holder}] Successfully withdrew ${amount:.2f}.")
        return self.balance

    def display_statement(self) -> None:
        """Prints a full statement of the account state and history."""
        print(f"\n========================================")
        print(f" ACCOUNT STATEMENT: {self.account_holder.upper()}")
        print(f" Current Balance: ${self.balance:.2f}")
        print(f"----------------------------------------")
        print(" Transaction History:")
        for index, record in enumerate(self.transaction_history, start=1):
            print(f"  {index}. {record}")
        print(f"========================================\n")

    def _record_transaction(self, note: str) -> None:
        """Internal helper method to record activity in the log."""
        self.transaction_history.append(note)

# --- Execution Script ---
if __name__ == "__main__":
    # Create two distinct BankAccount objects
    alice_acc = BankAccount("Alice Smith", 500.00)
    bob_acc = BankAccount("Bob Jones", 100.00)

    print("=== Executing Transactions ===")
    
    # Alice's operations
    alice_acc.deposit(250.00)
    alice_acc.withdraw(100.00)
    alice_acc.withdraw(1000.00)  # Intentionally triggers error

    # Bob's operations
    bob_acc.deposit(50.00)
    bob_acc.withdraw(30.00)

    # Print final statements to verify isolated states
    alice_acc.display_statement()
    bob_acc.display_statement()
```

---

## 📊 Expected Output

```text
=== Executing Transactions ===
[Alice Smith] Successfully deposited $250.00.
[Alice Smith] Successfully withdrew $100.00.
[Alice Smith] Insufficient funds! Attempted: $1000.00, Available: $650.00
[Bob Jones] Successfully deposited $50.00.
[Bob Jones] Successfully withdrew $30.00.

========================================
 ACCOUNT STATEMENT: ALICE SMITH
 Current Balance: $650.00
----------------------------------------
 Transaction History:
  1. Account created with opening balance: $500.00
  2. Deposited: $250.00
  3. Withdrew: $100.00
========================================

========================================
 ACCOUNT STATEMENT: BOB JONES
 Current Balance: $120.00
----------------------------------------
 Transaction History:
  1. Account created with opening balance: $100.00
  2. Deposited: $50.00
  3. Withdrew: $30.00
========================================
```

---

## 🌍 Real-World Applications

Object-Oriented Programming forms the backbone of commercial software engineering:

- **Database ORMs (Object-Relational Mapping):** Toolkits like SQLAlchemy or Django ORM map database tables directly to Python classes. Rows in a table become individual instances of that class.
- **GUI Frameworks:** In frameworks like PyQt, CustomTkinter, or Kivy, every screen element (Button, Slider, Window) is an object with internal state (color, dimensions, click listeners).
- **Game Engine Entities:** In game development, classes define `Player`, `Enemy`, or `Item` entities, maintaining individual attributes like health points, coordinates, and weapon inventories.
- **API Clients & SDKs:** Cloud SDKs (like AWS `boto3`) instantiate client objects that hold session credentials, connection endpoints, and API request methods.

---

## 💡 Best Practices

- **Follow PEP 8 Naming Conventions:** Class names **must** use `PascalCase` (e.g., `BankAccount`, `UserProfile`), while variable and method names use `snake_case` (e.g., `deposit_funds`).
- **Initialize All State in `__init__`:** Declare all expected instance variables within the `__init__` constructor. Dynamically adding new attributes outside `__init__` makes code difficult to maintain and leads to unexpected `AttributeError` exceptions.
- **Avoid Mutable Default Parameters:** Never pass mutable defaults like lists or dictionaries into `__init__` arguments (e.g., `def __init__(self, history=[]):`). Instead, default to `None` and instantiate the collection inside the constructor:
  ```python
  def __init__(self, history: list[str] | None = None) -> None:
      self.history = history if history is not None else []
  ```
- **Keep Methods Focused:** Methods should perform a single logical task related directly to the instance's state.

---

## 📝 Summary & Key Takeaways

1. A **Class** is a blueprint defining structure and behavior; an **Object** is an active instance of that blueprint residing in memory.
2. The **`__init__`** method is the constructor that runs automatically during object creation to bind attributes to the instance.
3. The **`self`** parameter explicitly references the specific object instance calling a method or accessing an attribute.
4. Each object created from a class maintains **isolated instance attributes**, allowing multiple instances to operate independently without state collisions.

**Tomorrow's Teaser:** On Day 32, we will dive deeper into OOP principles by exploring **Encapsulation and Access Modifiers**—learning how to protect instance attributes from invalid direct modifications using public, protected, and private visibility rules alongside `@property` decorators!
