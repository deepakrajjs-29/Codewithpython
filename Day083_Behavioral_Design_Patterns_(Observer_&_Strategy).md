# Day 083: Behavioral Design Patterns (Observer & Strategy)

> **Difficulty:** Advanced | **Topic:** Design Patterns | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Understand the core purpose of Behavioral Design Patterns and how they manage communication between objects.
- Master the **Observer Pattern** for implementing decoupled event-driven architectures and publish-subscribe models.
- Master the **Strategy Pattern** for encapsulating interchangeable algorithms and eliminating complex conditional statements.
- Write production-ready, idiomatic Python code implementing both design patterns using modern Python type hinting.

---

## 📚 Theory & Concepts

Behavioral design patterns focus on assignment of responsibilities between objects, identifying common communication patterns, and carrying out these patterns. Instead of focusing on *how* objects are created (Creational) or *how* they are composed (Structural), behavioral patterns focus on *how objects interact and distribute responsibility*.

Today, we look at two of the most powerful behavioral patterns in software engineering:

### 1. The Observer Pattern
The **Observer** pattern defines a one-to-many dependency between objects so that when one object (the **Subject**) changes state, all its dependents (**Observers**) are notified and updated automatically. 

```
[ Subject / Observable ] 
        │ (State Changes)
        ├──────Notify()──────> [ Observer A ]
        ├──────Notify()──────> [ Observer B ]
        └──────Notify()──────> [ Observer C ]
```

* **When to use:** When changes to the state of one object may require changing other objects, and you don't know beforehand how many objects need to be changed.
* **Benefits:** Loose coupling between subjects and observers; support for broadcast-style communication.

### 2. The Strategy Pattern
The **Strategy** pattern defines a family of algorithms, encapsulates each one into a separate class, and makes their objects interchangeable at runtime. This lets the algorithm vary independently from clients that use it.

```
[ Client ] ──Uses──> [ Strategy Interface ]
                           ▲
            ┌──────────────┴──────────────┐
            │                             │
    [ ConcreteStrategyA ]         [ ConcreteStrategyB ]
```

* **When to use:** When you have many related classes that differ only in their behavior, or when you need different variants of an algorithm.
* **Benefits:** Eliminates massive `if-elif-else` conditional statements; open/closed principle compliance (add new strategies without modifying existing context code).

---

## 💻 Syntax & Structure

Here is how the structural skeleton of both patterns looks in modern Python using abstract base classes (`abc` module) and type hinting:

```python
from abc import ABC, abstractmethod
from typing import List, Protocol

# --- Strategy Pattern Structure ---
class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount: float) -> str:
        pass

class ShoppingCart:
    def __init__(self, strategy: PaymentStrategy):
        self._strategy = strategy

    def checkout(self, amount: float) -> str:
        return self._strategy.pay(amount)

# --- Observer Pattern Structure ---
class Observer(Protocol):
    def update(self, subject: 'Subject') -> None:
        ...

class Subject:
    def __init__(self) -> None:
        self._observers: List[Observer] = []

    def attach(self, observer: Observer) -> None:
        self._observers.append(observer)

    def notify(self) -> None:
        for observer in self._observers:
            observer.update(self)
```

---

## 🧪 Code Examples

Below is a complete, runnable script implementing both the **Observer Pattern** (for an inventory stock tracking alert system) and the **Strategy Pattern** (for a flexible shipping cost calculator).

```python
from abc import ABC, abstractmethod
from typing import List

# ==========================================
# 1. OBSERVER PATTERN IMPLEMENTATION
# ==========================================

class InventoryObserver(ABC):
    """Abstract Observer interface."""
    @abstractmethod
    def update(self, product_name: str, stock_level: int) -> None:
        pass

class InventorySubject:
    """The Subject being observed."""
    def __init__(self, product_name: str, stock_level: int) -> None:
        self._product_name = product_name
        self._stock_level = stock_level
        self._observers: List[InventoryObserver] = []

    def attach(self, observer: InventoryObserver) -> None:
        self._observers.append(observer)
        print(f"[Subject] Attached observer: {type(observer).__name__}")

    def detach(self, observer: InventoryObserver) -> None:
        self._observers.remove(observer)
        print(f"[Subject] Detached observer: {type(observer).__name__}")

    def notify(self) -> None:
        print(f"\n[Subject] Notifying {len(self._observers)} observers of stock update for '{self._product_name}'...")
        for observer in self._observers:
            observer.update(self._product_name, self._stock_level)

    @property
    def stock_level(self) -> int:
        return self._stock_level

    @stock_level.setter
    def stock_level(self, new_stock: int) -> None:
        self._stock_level = new_stock
        self.notify()

class RestockEmailNotifier(InventoryObserver):
    """Concrete Observer 1: Sends email alerts."""
    def update(self, product_name: str, stock_level: int) -> None:
        print(f"   -> [Email Alert] Product '{product_name}' low stock warning! Only {stock_level} units left.")

class WarehouseRestockBot(InventoryObserver):
    """Concrete Observer 2: Automatically triggers warehouse restocking orders."""
    def update(self, product_name: str, stock_level: int) -> None:
        if stock_level < 5:
            print(f"   -> [Warehouse Bot] Automated re-order ticket generated for '{product_name}'.")
        else:
            print(f"   -> [Warehouse Bot] Stock level of '{product_name}' is sufficient. No action taken.")

# ==========================================
# 2. STRATEGY PATTERN IMPLEMENTATION
# ==========================================

class ShippingStrategy(ABC):
    """Abstract Strategy interface for calculating shipping costs."""
    @abstractmethod
    def calculate_cost(self, weight_kg: float) -> float:
        pass

class StandardShipping(ShippingStrategy):
    def calculate_cost(self, weight_kg: float) -> float:
        return weight_kg * 3.50

class ExpressShipping(ShippingStrategy):
    def calculate_cost(self, weight_kg: float) -> float:
        return weight_kg * 7.25 + 10.00  # Flat base fee + weight

class OvernightShipping(ShippingStrategy):
    def calculate_cost(self, weight_kg: float) -> float:
        return weight_kg * 12.00 + 25.00 # Premium service

class OrderContext:
    """The Context class that utilizes a ShippingStrategy."""
    def __init__(self, weight_kg: float, strategy: ShippingStrategy) -> None:
        self.weight_kg = weight_kg
        self._strategy = strategy

    def set_strategy(self, strategy: ShippingStrategy) -> None:
        print(f"\n[Context] Switching shipping strategy to {type(strategy).__name__}")
        self._strategy = strategy

    def compute_shipping_cost(self) -> float:
        return self._strategy.calculate_cost(self.weight_kg)

# ==========================================
# EXECUTION & DEMONSTRATION
# ==========================================

if __name__ == "__main__":
    print("--- DEMONSTRATING OBSERVER PATTERN ---")
    item = InventorySubject("Python Mastery Book", stock_level=12)
    
    email_notifier = RestockEmailNotifier()
    warehouse_bot = WarehouseRestockBot()
    
    item.attach(email_notifier)
    item.attach(warehouse_bot)
    
    # Trigger state change causing notifications
    print("\nSimulating stock drop...")
    item.stock_level = 3

    print("\n" + "="*40 + "\n")

    print("--- DEMONSTRATING STRATEGY PATTERN ---")
    order_weight = 4.5  # kg
    
    # Start with standard shipping
    order = OrderContext(order_weight, StandardShipping())
    print(f"Standard Shipping Cost for {order_weight}kg: ${order.compute_shipping_cost():.2f}")
    
    # Switch dynamically to Express Shipping
    order.set_strategy(ExpressShipping())
    print(f"Express Shipping Cost for {order_weight}kg: ${order.compute_shipping_cost():.2f}")

    # Switch dynamically to Overnight Shipping
    order.set_strategy(OvernightShipping())
    print(f"Overnight Shipping Cost for {order_weight}kg: ${order.compute_shipping_cost():.2f}")
```

---

## 📊 Expected Output

```text
--- DEMONSTRATING OBSERVER PATTERN ---
[Subject] Attached observer: RestockEmailNotifier
[Subject] Attached observer: WarehouseRestockBot

Simulating stock drop...

[Subject] Notifying 2 observers of stock update for 'Python Mastery Book'...
   -> [Email Alert] Product 'Python Mastery Book' low stock warning! Only 3 units left.
   -> [Warehouse Bot] Automated re-order ticket generated for 'Python Mastery Book'.

========================================

--- DEMONSTRATING STRATEGY PATTERN ---
Standard Shipping Cost for 4.5kg: $15.75

[Context] Switching shipping strategy to ExpressShipping
ExpressShipping Cost for 4.5kg: $42.63

[Context] Switching shipping strategy to OvernightShipping
OvernightShipping Cost for 4.5kg: $79.00
```

---

## 🌍 Real-World Applications

1. **GUI Frameworks & Event Listeners (Observer):** Modern UI frameworks (like PyQt, Django Signals, or React/Redux-inspired architectures) rely heavily on the observer pattern. When a button is clicked or a form field changes, registered listeners execute callbacks instantly.
2. **Financial Pricing & Risk Engines (Strategy):** Payment gateways (Stripe, PayPal) or tax calculation engines use the Strategy pattern to select the right calculation algorithm dynamically depending on the user's geographic location, currency, or subscription tier without breaking core checkout logic.
3. **Machine Learning Model Inference (Strategy):** Switching between distinct inference optimization engines (e.g., ONNX Runtime, TensorRT, or PyTorch eager execution) via a unified scoring interface.

---

## 💡 Best Practices

- **Keep Observers Lightweight:** Avoid long-blocking operations inside observer `update()` methods. If network requests or heavy I/O operations are necessary, dispatch them asynchronously using Python's `asyncio` or background thread workers.
- **Favor Composition over Inheritance:** Both Observer and Strategy patterns emphasize composition, allowing behavior and event handling to be plugged in dynamically at runtime rather than locked behind rigid class hierarchies.
- **Common Pitfalls to Avoid:**
  - *Memory Leaks in Observers:* Failing to detach observers can keep objects alive in memory indefinitely if the subject maintains strong references. Use weak references (`weakref` module) when managing subscriber lists in long-running applications.
  - *Over-engineering:* Do not apply the Strategy pattern if you only have a single algorithm that will never change. Simple conditional statements (`if/else`) are more readable for straightforward, static branching logic.

---

## 📝 Summary & Key Takeaways
Today we explored behavioral design patterns, which manage how objects cooperate and distribute duties. The **Observer Pattern** allows you to broadcast state changes across decoupled components cleanly, while the **Strategy Pattern** helps you swap algorithms dynamically at runtime and banish monolithic conditional statement blocks.

Tomorrow, in **Day 84**, we will transition into architectural patterns, examining how to structure full-scale Python systems using the **MVC (Model-View-Controller)** pattern. Keep practicing!
