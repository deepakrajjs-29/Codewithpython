# Day 037: Method Overriding & Polymorphism

> **Difficulty:** Intermediate | **Topic:** OOP | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives

- **Understand Method Overriding**: Learn how child classes redefine methods inherited from parent classes to customize behavior.
- **Master Polymorphism**: Grasp the concept of "many forms" and how Python executes common interfaces across different object types.
- **Leverage Duck Typing**: Apply Python’s core philosophy—*"If it walks like a duck and quacks like a duck, it's a duck"*—to write flexible code.
- **Enforce Contracts with ABCs**: Utilize `abc.ABC` and `@abstractmethod` to define required interfaces for robust system architecture.

---

## 📚 Theory & Concepts

### What is Polymorphism?

The term **Polymorphism** originates from Greek, meaning *"many forms"* (`poly` = many, `morph` = form). In Object-Oriented Programming (OOP), polymorphism allows objects of different classes to be treated as instances of a common superclass, or simply to expose a shared interface (method name).

Polymorphism allows you to write a single function or system component that operates seamlessly on different object types, as long as those objects implement the expected methods.

```
                     ┌───────────────────────┐
                     │   PaymentProcessor    │
                     │  + process_payment()  │
                     └───────────┬───────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ CreditCardPay    │   │  PayPalPayment   │   │  CryptoPayment   │
│------------------│   │------------------│   │------------------│
│ process_payment()│   │ process_payment()│   │ process_payment()│
│ (Charges Card)   │   │ (Calls PayPal API│   │ (Signs Tx on Chain
└──────────────────┘   └──────────────────┘   └──────────────────┘
```

---

### What is Method Overriding?

**Method Overriding** occurs when a child class provides a specific implementation of a method that is already defined in its parent class.

- The method in the child class must share the **same name** as the method in the parent class.
- When the method is invoked on an instance of the child class, Python executes the child's version, ignoring or augmenting the parent's default behavior.

#### Overriding vs. Overloading
| Feature | Method Overriding | Method Overloading |
| :--- | :--- | :--- |
| **Definition** | Redefining a parent class method in a child class. | Defining multiple methods with the same name but different signatures in the same class. |
| **Python Support** | **Natively supported.** | **Not natively supported** (Python keeps only the last defined method unless handled via variable positional/keyword arguments or standard library decorators like `@singledispatch`). |
| **Binding Time** | Runtime (Dynamic polymorphism). | Compile-time / Dispatch time. |

---

### Python's Duck Typing Philosophy

Unlike statically typed languages (e.g., Java or C++), Python does not require strict class inheritance hierarchies to achieve polymorphism. Python relies on **Duck Typing**:

> *"If it walks like a duck and quacks like a duck, it's a duck."*

If an object implements a `.render()` method, Python will happily invoke `.render()`, regardless of whether that object inherits from a base `Widget` class.

---

## 💻 Syntax & Structure

### 1. Basic Method Overriding

```python
class Parent:
    def greet(self) -> str:
        return "Hello from Parent"

class Child(Parent):
    # Overriding parent's greet method
    def greet(self) -> str:
        return "Hello from Child"
```

### 2. Augmenting Parent Behavior with `super()`

```python
class Parent:
    def describe(self) -> None:
        print("I am a Parent class object.")

class Child(Parent):
    def describe(self) -> None:
        super().describe()  # Retain original parent functionality
        print("...and I extend it in the Child class!")  # Add extended behavior
```

### 3. Enforcing Polymorphic Interfaces with Abstract Base Classes (ABCs)

To prevent derived classes from forgetting to implement crucial overridden methods, use Python's built-in `abc` module.

```python
from abc import ABC, abstractmethod

class GraphicShape(ABC):

    @abstractmethod
    def area(self) -> float:
        """Must be implemented by subclasses."""
        pass

class Square(GraphicShape):

    def __init__(self, side: float) -> None:
        self.side = side

    def area(self) -> float:
        return self.side**2
```

---

## 🧪 Code Examples

Below is a complete enterprise payment system demonstrating polymorphism, method overriding, duck typing, and abstract base classes.

```python
from abc import ABC, abstractmethod
from typing import List

# 1. Abstract Base Class enforcing interface contract
class PaymentGateway(ABC):
    """Abstract base class establishing a contract for payment processors."""

    def __init__(self, merchant_id: str) -> None:
        self.merchant_id = merchant_id

    @abstractmethod
    def process_payment(self, amount: float) -> bool:
        """Process the transaction and return True if successful."""
        pass

    def generate_receipt(self, transaction_id: str, amount: float) -> str:
        """Common method shared by all processors (can also be overridden)."""
        return f"[RECEIPT] Tx:{transaction_id} | Merchant:{self.merchant_id} | Amount: ${amount:.2f}"

# 2. Concrete Implementation 1: Credit Card
class CreditCardGateway(PaymentGateway):

    def __init__(self, merchant_id: str, card_number: str) -> None:
        super().__init__(merchant_id)
        self.card_number = card_number

    def process_payment(self, amount: float) -> bool:
        # Method Overriding
        masked_card = f"****-****-****-{self.card_number[-4:]}"
        print(
            f"Charging ${amount:.2f} to Credit Card {masked_card} (Merchant: {self.merchant_id})..."
        )
        return True

# 3. Concrete Implementation 2: PayPal
class PayPalGateway(PaymentGateway):

    def __init__(self, merchant_id: str, email: str) -> None:
        super().__init__(merchant_id)
        self.email = email

    def process_payment(self, amount: float) -> bool:
        # Method Overriding
        print(
            f"Authenticating PayPal user {self.email} and transferring ${amount:.2f}..."
        )
        return True

# 4. Duck-Typed Processor (Does not inherit from PaymentGateway)
class GiftCardProcessor:
    """Demonstrates Duck Typing.

    Does not explicitly subclass PaymentGateway, but implements the required
    interface (`process_payment` and `generate_receipt`).
    """

    def __init__(self, card_code: str) -> None:
        self.card_code = card_code

    def process_payment(self, amount: float) -> bool:
        print(f"Deducting ${amount:.2f} from Gift Card code {self.card_code}...")
        return True

    def generate_receipt(self, transaction_id: str, amount: float) -> str:
        return f"[GIFT RECEIPT] Code:{self.card_code} | Amount: ${amount:.2f}"

# 5. Polymorphic Function
def execute_checkout(processor, amount: float, tx_id: str) -> None:
    """Polymorphic function that works on ANY object that responds to

    `process_payment` and `generate_receipt`.
    """
    print("--- Initiating Checkout ---")
    success = processor.process_payment(amount)

    if success:
        receipt = processor.generate_receipt(tx_id, amount)
        print(receipt)
        print("Transaction Status: SUCCESS\n")
    else:
        print("Transaction Status: FAILED\n")

# Execution / Demonstration
if __name__ == "__main__":
    # Create instances of different payment providers
    cc_gateway = CreditCardGateway(
        merchant_id="MERCH_9981", card_number="4532111122228888"
    )
    paypal_gateway = PayPalGateway(
        merchant_id="MERCH_9981", email="customer@example.com"
    )
    gift_card = GiftCardProcessor(card_code="GC-2026-X992")

    # Polymorphic collection: Storing diverse objects in a single list
    payment_methods = [cc_gateway, paypal_gateway, gift_card]

    # Process transactions using a unified loop interface
    amounts = [150.50, 89.99, 25.00]

    for index, method in enumerate(payment_methods):
        tx_reference = f"TXN-100{index + 1}"
        execute_checkout(
            processor=method, amount=amounts[index], tx_id=tx_reference
        )
```

---

## 📊 Expected Output

```text
--- Initiating Checkout ---
Charging $150.50 to Credit Card ****-****-****-8888 (Merchant: MERCH_9981)...
[RECEIPT] Tx:TXN-1001 | Merchant:MERCH_9981 | Amount: $150.50
Transaction Status: SUCCESS

--- Initiating Checkout ---
Authenticating PayPal user customer@example.com and transferring $89.99...
[RECEIPT] Tx:TXN-1002 | Merchant:MERCH_9981 | Amount: $89.99
Transaction Status: SUCCESS

--- Initiating Checkout ---
Deducting $25.00 from Gift Card code GC-2026-X992...
[GIFT RECEIPT] Code:GC-2026-X992 | Amount: $25.00
Transaction Status: SUCCESS
```

---

## 🌍 Real-World Applications

1. **Database Abstraction Layers (ORMs)**
   Database drivers implement common interfaces like `.connect()`, `.execute()`, and `.close()`. Whether connecting to PostgreSQL, MySQL, or SQLite, application logic executes queries through a polymorphic engine.

2. **GUI Frameworks (e.g., Tkinter, PyQt, Kivy)**
   UI toolkits define base `Widget` components. Custom controls override `.draw()` or `.on_click()` event handlers to deliver specialized rendering logic.

3. **Data Exporters and File Parsers**
   Data processing pipelines accept various parser objects (`CSVParser`, `JSONParser`, `XMLParser`) exposing identical `.parse()` or `.export()` APIs.

4. **Machine Learning Frameworks (e.g., Scikit-Learn)**
   All estimators in Scikit-Learn follow a strict polymorphic API contract: `.fit(X, y)` to train and `.predict(X)` to run inference, regardless of whether the underlying algorithm is linear regression, a random forest, or a neural net.

---

## 💡 Best Practices

- **Adhere to the Liskov Substitution Principle (LSP)**: Derived classes should replace base classes without breaking system execution. Overridden methods must accept equivalent arguments and return compatible types.
- **Maintain Compatible Method Signatures**: Avoid adding mandatory parameters to overridden methods in child classes that are not present in the base method.
- **Use `@override` Decorator (Python 3.12+)**:
  Explicitly mark overridden methods using `typing.override`. This lets static type checkers (like `mypy` or `pyright`) flag errors if the parent method is renamed or missing.
  ```python
  from typing import override

  class Base:

      def execute((self)) -> None:
          pass

  class Derived(Base):

      @override  # Raises a static type error if Base.execute doesn't exist
      def execute(self) -> None:
          print("Executing child logic...")
  ```
- **Prefer Abstract Base Classes (ABCs) for Critical Contracts**: When building public APIs or large systems, use ABCs to guarantee that subclasses implement required methods.

### ⚠️ Common Pitfalls to Avoid

1. **Accidental Function Overloading (Python Myth)**:
   Writing multiple methods with the exact same name in a single Python class does *not* create overloads. Python silently overwrites earlier definitions with the last defined version!
   ```python
   class Calculator:

       def add(self, a, b):
           return a + b

       def add(self, a, b, c):  # BAD: Overwrites the 2-argument 'add' above!
           return a + b + c
```

2. **Forgetting to Call `super()` When Extending Functionality**:
   If you intend to extend rather than completely replace parent setup logic (e.g., in `__init__`), omitting `super().__init__()` can leave base class attributes uninitialized.

---

## 📝 Summary & Key Takeaways

- **Method Overriding** allows a child class to replace or extend the behavior of a parent class method.
- **Polymorphism** allows code to interact with distinct objects using a single, unified interface.
- **Duck Typing** enables polymorphism without needing formal inheritance trees—if an object provides the expected methods, Python executes them smoothly.
- **Abstract Base Classes (`abc.ABC`)** enforce concrete sub-classes to implement critical abstract methods at instantiation time.
- Python 3.12 introduces `@typing.override` to catch invalid method signature overrides during static type checking.

---

### 🔜 What's Next?
Tomorrow on **Day 38**, we will explore **Encapsulation, Name Mangling, and the `@property` Decorator**—learning how to protect class internals and manage property access securely in Python.
