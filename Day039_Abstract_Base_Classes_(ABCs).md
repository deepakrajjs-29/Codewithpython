# Day 039: Abstract Base Classes (ABCs)

> **Difficulty:** Intermediate | **Topic:** OOP | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives

- **Understand** the core concept of Abstract Base Classes (ABCs) and why explicit contracts matter in Object-Oriented Programming.
- **Master** Python's built-in `abc` module using `ABC`, `@abstractmethod`, and abstract properties.
- **Compare** Duck Typing (informal interfaces) with Abstract Base Classes (formal interface enforcement).
- **Implement** custom abstract classes, concrete implementations, and handle runtime instantiation errors gracefully.

---

## 📚 Theory & Concepts

### What is an Abstract Base Class?

In Python, Object-Oriented Programming historically relies heavily on **Duck Typing** ("If it walks like a duck and quacks like a duck, it's a duck"). Duck typing provides maximum flexibility, but as software projects grow, relying purely on implicit expectations can introduce subtle bugs. If a developer forgets to implement a required method in a child class, the error is only discovered at runtime when that specific missing method is called.

An **Abstract Base Class (ABC)** solves this by providing a formal blueprint (or "contract") for derived classes. 

Key characteristics of Abstract Base Classes:
1. **Cannot be instantiated directly**: You cannot create objects directly from an abstract class.
2. **Enforces method implementation**: Subclasses *must* override all abstract methods defined in the base class before they can be instantiated.
3. **Fails early at instantiation time**: If a subclass fails to implement even one abstract method, Python raises a `TypeError` when you try to create an instance, rather than waiting until the missing method is invoked.

---

### Duck Typing vs. Formal Interfaces (ABCs)

| Feature | Duck Typing (Informal) | Abstract Base Classes (Formal) |
| :--- | :--- | :--- |
| **Enforcement** | Dynamic (at call time) | Static / Instantiation time |
| **Contract** | Implicit (assumed methods exist) | Explicit (mandated by code) |
| **Failure Point** | `AttributeError` when method is called | `TypeError` when object is created |
| **Best Used For** | Small scripts, highly dynamic tools | Frameworks, large codebases, plugins |

---

### Architecture Visualisation

```text
                  +-------------------------+
                  |  PaymentProcessor (ABC) |  <-- Cannot be instantiated!
                  +-------------------------+
                  | + currency (Property)   |
                  | + process_payment()     |
                  +-------------------------+
                               |
         +---------------------+---------------------+
         |                                           |
+--------------------------+               +--------------------+
| CreditCardProcessor      |               | CryptoProcessor    |
+--------------------------+               +--------------------+
| Implements currency      |               | Missing currency?  |
| Implements process_payment               |                    |
+--------------------------+               +--------------------+
             |                                       |
     Instantiable!                           Instantiating raises
                                             TypeError immediately!
```

---

## 💻 Syntax & Structure

Python provides the `abc` module in its standard library. To create an abstract base class:

1. Inherit from `abc.ABC`.
2. Decorate methods that must be overridden using `@abstractmethod`.
3. Decorate abstract properties using `@property` combined with `@abstractmethod`.

```python
from abc import ABC, abstractmethod

class BaseService(ABC):
    """Abstract Base Class for background services."""

    @property
    @abstractmethod
    def service_name(self) -> str:
        """Abstract property: must return the service name."""
        pass

    @abstractmethod
    def start(self) -> None:
        """Abstract method: start the service logic."""
        pass

    def log_status(self) -> None:
        """Concrete method: inherited directly by all subclasses."""
        print(f"[{self.service_name}] Service status: ACTIVE")
```

> **Note on Decorator Order:** When combining `@property` and `@abstractmethod`, always place `@property` **on top** of `@abstractmethod`.

---

## 🧪 Code Examples

Let's build a robust, complete payment processing engine that enforces strict interfaces across different payment providers.

```python
from abc import ABC, abstractmethod

class PaymentProcessor(ABC):
    """Abstract Base Class defining the interface for payment gateways."""

    @property
    @abstractmethod
    def currency(self) -> str:
        """Returns the standard currency code used by the processor."""
        pass

    @abstractmethod
    def authenticate(self) -> bool:
        """Authenticates credentials with the API gateway."""
        pass

    @abstractmethod
    def process_payment(self, amount: float) -> bool:
        """Executes a payment transaction for a given amount."""
        pass

    def generate_receipt(self, transaction_id: str, amount: float) -> str:
        """Concrete method shared across all implementations."""
        return f"RECEIPT [{transaction_id}]: Processed {self.currency} {amount:.2f}"

class CreditCardProcessor(PaymentProcessor):
    """Concrete implementation for Credit Card processing."""

    def __init__(self, merchant_id: str, currency: str = "USD") -> None:
        self.merchant_id = merchant_id
        self._currency = currency

    @property
    def currency(self) -> str:
        return self._currency

    def authenticate(self) -> bool:
        print(f"[CreditCard] Authenticating Merchant ID: {self.merchant_id}...")
        return True

    def process_payment(self, amount: float) -> bool:
        if self.authenticate():
            print(f"[CreditCard] Charging {self.currency} {amount:.2f} via Card API.")
            return True
        return False

class CryptoProcessor(PaymentProcessor):
    """Concrete implementation for Crypto processing."""

    def __init__(self, wallet_address: str) -> None:
        self.wallet_address = wallet_address

    @property
    def currency(self) -> str:
        return "ETH"

    def authenticate(self) -> bool:
        print(f"[Crypto] Verifying Wallet Signature: {self.wallet_address[:6]}...")
        return True

    def process_payment(self, amount: float) -> bool:
        if self.authenticate():
            print(f"[Crypto] Transferring {amount:.2f} {self.currency} on Blockchain.")
            return True
        return False

class IncompleteProcessor(PaymentProcessor):
    """Incomplete implementation missing abstract methods (For demonstration)."""

    def __init__(self) -> None:
        pass

def execute_checkout(processor: PaymentProcessor, amount: float) -> None:
    """Polymorphic helper function that interacts purely via the ABC interface."""
    print(f"\n--- Initiating Transaction ({processor.currency}) ---")
    success = processor.process_payment(amount)
    if success:
        receipt = processor.generate_receipt("TXN-99482", amount)
        print(f"Success: {receipt}")
    else:
        print("Transaction Failed!")

# --- Execution Demonstration ---
if __name__ == "__main__":
    # 1. Attempting to instantiate the Abstract Base Class directly
    print("=== Step 1: Direct ABC Instantiation Test ===")
    try:
        base_processor = PaymentProcessor()
    except TypeError as err:
        print(f"Expected Error Caught: {err}")

    # 2. Attempting to instantiate an incomplete subclass
    print("\n=== Step 2: Incomplete Subclass Instantiation Test ===")
    try:
        incomplete = IncompleteProcessor()
    except TypeError as err:
        print(f"Expected Error Caught: {err}")

    # 3. Using valid concrete implementations polymorphically
    print("\n=== Step 3: Valid Implementations Execution ===")
    card_proc = CreditCardProcessor(merchant_id="MERCHANT_8832")
    crypto_proc = CryptoProcessor(wallet_address="0x71C7656EC7ab88b098defB751B7401B5f6d8976F")

    execute_checkout(card_proc, 149.99)
    execute_checkout(crypto_proc, 2.5)
```

---

## 📊 Expected Output

```text
=== Step 1: Direct ABC Instantiation Test ===
Expected Error Caught: Can't instantiate abstract class PaymentProcessor without an implementation for abstract methods 'authenticate', 'currency', 'process_payment'

=== Step 2: Incomplete Subclass Instantiation Test ===
Expected Error Caught: Can't instantiate abstract class IncompleteProcessor without an implementation for abstract methods 'authenticate', 'currency', 'process_payment'

=== Step 3: Valid Implementations Execution ===

--- Initiating Transaction (USD) ---
[CreditCard] Authenticating Merchant ID: MERCHANT_8832...
[CreditCard] Charging USD 149.99 via Card API.
Success: RECEIPT [TXN-99482]: Processed USD 149.99

--- Initiating Transaction (ETH) ---
[Crypto] Verifying Wallet Signature: 0x71C7...
[Crypto] Transferring 2.50 ETH on Blockchain.
Success: RECEIPT [TXN-99482]: Processed ETH 2.50
```

---

## 🌍 Real-World Applications

1. **Plugin Architecture Systems**:
   Frameworks like `pytest`, `datasette`, or web frameworks use ABCs to define strict plugin interfaces. Plugin authors must subclass the base interface, ensuring compatibility across updates.

2. **Database Abstraction Layers (DAL)**:
   ORMs like SQLAlchemy define abstract database drivers (e.g., `Dialect`). Specific backends (`PostgreSQL`, `MySQL`, `SQLite`) inherit from this base class and guarantee that methods like `connect()`, `execute()`, and `rollback()` exist.

3. **Machine Learning Pipelines**:
   Libraries such as `scikit-learn` rely heavily on implicit and formal contracts. Classes like `BaseEstimator` enforce that custom transformers implement `fit()`, `transform()`, and `fit_transform()`.

---

## 💡 Best Practices

- **Keep ABCs Focused (Interface Segregation)**: Design small, highly targeted abstract classes rather than monolithic ones.
- **Provide Default Implementation when appropriate**: `@abstractmethod` functions can actually contain default code! Subclasses can invoke it using `super().method_name()`.
- **Order Decorators Correctly**: Always stack `@property` above `@abstractmethod`.
- **Avoid Over-engineering**: Do not create ABCs for tiny scripts or trivial class hierarchies where simple inheritance or basic duck typing is sufficient.

```python
# GOOD: Abstract method with reusable baseline logic
class BaseRepository(ABC):

    @abstractmethod
    def save(self, data: dict) -> bool:
        """Validates baseline input before saving."""
        if not isinstance(data, dict):
            raise ValueError("Data must be a dictionary.")
        return True

class SqlRepository(BaseRepository):

    def save(self, data: dict) -> bool:
        super().save(data)  # Executes validation in base class
        print("Saving to database...")
        return True
```

---

## 📝 Summary & Key Takeaways

- Abstract Base Classes (`ABCs`) enable developers to establish formal **contracts** in Python Object-Oriented Programming.
- Inheriting from `abc.ABC` prevents direct class instantiation and enforces subclass compliance.
- Missing abstract methods raise a `TypeError` **at instantiation time**, helping catch architectural bugs early.
- Combine `@property` with `@abstractmethod` to enforce mandatory attributes or state accessors in subclasses.

**Next Up (Day 40):** *Protocols and Structural Subtyping (PEP 544)* — Discover how modern Python achieves lightweight, explicit Duck Typing without requiring formal inheritance!
