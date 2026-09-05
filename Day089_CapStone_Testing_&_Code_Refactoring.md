# Day 089: CapStone Testing & Code Refactoring

> **Difficulty:** Advanced | **Topic:** Capstone | **Reading Time:** 20 mins

---

## 🎯 Learning Objectives
- Identify critical code smells (God objects, tight coupling, hidden side effects) in prototype capstone projects.
- Apply systematic refactoring patterns (Extract Class, Dependency Injection, Strategy Pattern via `typing.Protocol`) to achieve clean architecture.
- Implement robust unit and integration testing pipelines using Python's `unittest` and `unittest.mock` libraries.
- Decouple side effects (network, disk I/O, database) using abstractions and mock objects to ensure deterministic test execution.
- Validate refactored implementations without altering external system behaviors using automated test suites.

---

## 📚 Theory & Concepts

By Day 89, your Capstone project is likely functional, but working code is not necessarily production-ready code. Prototypes often accumulate technical debt: tight coupling, missing abstractions, untestable monolithic routines, and brittle inline dependencies.

### The Refactoring Cycle: Red-Green-Refactor

Refactoring is the process of restructuring existing computer code without changing its external behavior. Martin Fowler’s discipline pairs refactoring intrinsically with automated testing:

```
       ┌────────────────────────┐
       │ 1. Write Failing Test  │ (RED)
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │ 2. Make Test Pass      │ (GREEN)
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │ 3. Refactor Cleanly    │ (REFACTOR)
       └───────────┬────────────┘
                   │
                   └───────► [Tests remain Green?] ──► Repeat
```

### Common Capstone Code Smells

1. **The God Class / Monolithic Function**: A single module or class handles business rules, file persistence, network requests, validation, and terminal logging.
2. **Hidden Side Effects**: Functions mutate global state or execute network calls without declaring them in their signature.
3. **Hardcoded Dependencies**: Instantiating concrete client objects (e.g., `requests.Session()`, `sqlite3.connect()`) directly inside domain algorithms instead of injecting them.
4. **Primitive Obsession**: Passing raw tuples or dictionaries instead of structured, type-safe data transfer objects (`dataclass` or `NamedTuple`).

### Decoupling with Protocols and Dependency Injection

To make components testable, separate **what** needs to be done from **how** it is done. Using Python 3.8+ `typing.Protocol` (structural subtyping), we define interfaces implicitly. High-level modules depend on abstractions, not concrete implementations:

```
[ Domain Engine ] ──► Depends on ──► [ Storage Protocol (Interface) ]
                                                ▲
                                                │
                       ┌────────────────────────┴────────────────────────┐
                       │                                                 │
          [ Production Database ]                               [ InMemory Test Mock ]
```

---

## 💻 Syntax & Structure

### 1. Defining Abstractions with `typing.Protocol`

```python
from typing import Protocol, runtime_checkable

@runtime_checkable
class TransactionRepository(Protocol):
    def save(self, record_id: str, payload: dict) -> bool:
        """Persist a transaction record."""
        ...

    def get(self, record_id: str) -> dict | None:
        """Retrieve a transaction record by identifier."""
        ...
```

### 2. Dependency Injection Pattern

Avoid constructing dependencies inside consumer classes:

```python
# ANTI-PATTERN: Hardcoded concrete dependency
class PaymentProcessor:
    def __init__(self) -> None:
        self.gateway = StripeGateway(api_key="sk_live_123")  # Untestable

# REFACTORED: Injected dependency
class PaymentProcessor:
    def __init__(self, gateway: PaymentGatewayProtocol) -> None:
        self.gateway = gateway  # Accepts production or mock instance
```

### 3. Isolated Mocking with `unittest.mock`

```python
from unittest.mock import MagicMock, patch

# Create a protocol-compliant mock
mock_repo = MagicMock(spec=TransactionRepository)
mock_repo.save.return_value = True

# Assert interaction contracts
mock_repo.save.assert_called_once_with("TX_101", {"amount": 500})
```

---

## 🧪 Code Examples

Below is a self-contained, fully executable demonstration showing a monolithic, buggy capstone component refactored into clean, decoupled Python 3.12 architecture, accompanied by a comprehensive test suite.

```python
"""
Day 89 Capstone Showcase: Refactoring & Testing Architecture
Demonstrating structural typing, dependency injection, and test harness execution.
"""

from __future__ import annotations

import unittest
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum, auto
from typing import Protocol
from unittest.mock import MagicMock

# =====================================================================
# DOMAIN MODELS (Type-safe, immutable data structures)
# =====================================================================

class OrderStatus(Enum):
    PENDING = auto()
    PROCESSED = auto()
    REJECTED = auto()

@dataclass(frozen=True, slots=True)
class OrderItem:
    item_id: str
    quantity: int
    unit_price: float

    def subtotal(self) -> float:
        return round(self.quantity * self.unit_price, 2)

@dataclass(frozen=True, slots=True)
class Order:
    order_id: str
    customer_email: str
    items: list[OrderItem] = field(default_factory=list)
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    @property
    def total_amount(self) -> float:
        return round(sum(item.subtotal() for item in self.items), 2)

# =====================================================================
# ABSTRACTIONS (Protocols)
# =====================================================================

class PaymentGateway(Protocol):
    def charge(self, email: str, amount: float) -> bool:
        """Execute a payment charge against a customer."""
        ...

class OrderRepository(Protocol):
    def save_order(self, order: Order, status: OrderStatus) -> None:
        """Persist order state into underlying storage."""
        ...

class NotificationService(Protocol):
    def notify(self, email: str, message: str) -> None:
        """Dispatch a critical update notice to an end user."""
        ...

# =====================================================================
# CORE APPLICATION SERVICE (Refactored: Decoupled & Fully Testable)
# =====================================================================

class OrderProcessingEngine:
    """
    Coordinates order validation, payment processing, persistence,
    and customer notifications through injected abstractions.
    """

    def __init__(
        self,
        gateway: PaymentGateway,
        repository: OrderRepository,
        notifier: NotificationService,
    ) -> None:
        self._gateway = gateway
        self._repo = repository
        self._notifier = notifier

    def process_order(self, order: Order) -> OrderStatus:
        if not order.items:
            self._repo.save_order(order, OrderStatus.REJECTED)
            self._notifier.notify(
                order.customer_email, "Order rejected: Cart cannot be empty."
            )
            return OrderStatus.REJECTED

        if order.total_amount <= 0.0:
            self._repo.save_order(order, OrderStatus.REJECTED)
            self._notifier.notify(
                order.customer_email, "Order rejected: Invalid order value."
            )
            return OrderStatus.REJECTED

        # Charge customer
        payment_success = self._gateway.charge(
            order.customer_email, order.total_amount
        )
        if not payment_success:
            self._repo.save_order(order, OrderStatus.REJECTED)
            self._notifier.notify(
                order.customer_email, "Order rejected: Payment transaction failed."
            )
            return OrderStatus.REJECTED

        # Record success
        self._repo.save_order(order, OrderStatus.PROCESSED)
        self._notifier.notify(
            order.customer_email,
            f"Order {order.order_id} confirmed for ${order.total_amount:.2f}.",
        )
        return OrderStatus.PROCESSED

# =====================================================================
# TEST SUITE: UNIT & INTEGRATION CHECKS
# =====================================================================

class TestOrderProcessingEngine(unittest.TestCase):
    def setUp(self) -> None:
        """Initialize mock dependencies before every test run."""
        self.mock_gateway = MagicMock(spec=PaymentGateway)
        self.mock_repo = MagicMock(spec=OrderRepository)
        self.mock_notifier = MagicMock(spec=NotificationService)

        self.engine = OrderProcessingEngine(
            gateway=self.mock_gateway,
            repository=self.mock_repo,
            notifier=self.mock_notifier,
        )

    def test_process_order_success(self) -> None:
        """A valid order with successful payment transitions to PROCESSED."""
        # Arrange
        items = [OrderItem(item_id="PROD_1", quantity=2, unit_price=25.00)]
        order = Order(order_id="ORD_1001", customer_email="dev@example.com", items=items)
        self.mock_gateway.charge.return_value = True

        # Act
        status = self.engine.process_order(order)

        # Assert
        self.assertEqual(status, OrderStatus.PROCESSED)
        self.mock_gateway.charge.assert_called_once_with("dev@example.com", 50.00)
        self.mock_repo.save_order.assert_called_once_with(order, OrderStatus.PROCESSED)
        self.mock_notifier.notify.assert_called_once_with(
            "dev@example.com", "Order ORD_1001 confirmed for $50.00."
        )

    def test_process_order_empty_cart_fails(self) -> None:
        """An order with no items is rejected immediately without charging."""
        # Arrange
        order = Order(order_id="ORD_1002", customer_email="empty@example.com", items=[])

        # Act
        status = self.engine.process_order(order)

        # Assert
        self.assertEqual(status, OrderStatus.REJECTED)
        self.mock_gateway.charge.assert_not_called()
        self.mock_repo.save_order.assert_called_once_with(order, OrderStatus.REJECTED)
        self.mock_notifier.notify.assert_called_once_with(
            "empty@example.com", "Order rejected: Cart cannot be empty."
        )

    def test_process_order_payment_declined(self) -> None:
        """Declined transactions persist as REJECTED and dispatch failure notices."""
        # Arrange
        items = [OrderItem(item_id="PROD_2", quantity=1, unit_price=120.00)]
        order = Order(order_id="ORD_1003", customer_email="declined@example.com", items=items)
        self.mock_gateway.charge.return_value = False

        # Act
        status = self.engine.process_order(order)

        # Assert
        self.assertEqual(status, OrderStatus.REJECTED)
        self.mock_gateway.charge.assert_called_once_with("declined@example.com", 120.00)
        self.mock_repo.save_order.assert_called_once_with(order, OrderStatus.REJECTED)
        self.mock_notifier.notify.assert_called_once_with(
            "declined@example.com", "Order rejected: Payment transaction failed."
        )

if __name__ == "__main__":
    # Execute the test suite programmatically with verbose output
    suite = unittest.TestLoader().loadTestsFromTestCase(TestOrderProcessingEngine)
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)
```

---

## 📊 Expected Output

```text
test_process_order_empty_cart_fails (__main__.TestOrderProcessingEngine.test_process_order_empty_cart_fails)
An order with no items is rejected immediately without charging. ... ok
test_process_order_payment_declined (__main__.TestOrderProcessingEngine.test_process_order_payment_declined)
Declined transactions persist as REJECTED and dispatch failure notices. ... ok
test_process_order_success (__main__.TestOrderProcessingEngine.test_process_order_success)
A valid order with successful payment transitions to PROCESSED. ... ok

----------------------------------------------------------------------
Ran 3 tests in 0.002s

OK
```

---

## 🌍 Real-World Applications

- **Enterprise Payment Gateways (Stripe/PayPal Integrations)**: Refactoring to protocol-based Dependency Injection allows switching payment providers or mocking third-party outages without modifying business logic.
- **Fintech & Audit Systems**: Immutable dataclasses (`frozen=True`, `slots=True`) prevent inadvertent modification of monetary figures as transactions move through validation layers.
- **Microservices Deployment**: Decoupling file system reads and database transactions allows engineers to run thousands of unit tests in milliseconds on CI/CD servers without provisioning local databases or writing files to physical disks.
- **Legacy Migration**: Refactoring legacy Python scripts into clean architectural units ensures zero behavioral divergence through regression test suites before pushing modifications to Kubernetes staging environments.

---

## 💡 Best Practices

- **Always Establish Baseline Tests Before Refactoring**: Never touch production code without an existing test harness. If tests do not exist, write characterization tests around current behaviors first.
- **Enforce Interface Segregation via `typing.Protocol`**: Avoid bloated interfaces. Keep your protocols minimal (1–3 focused methods per protocol) so test fakes are trivial to implement.
- **Use `spec=ProtocolClass` with `MagicMock`**: Always pass `spec=` or `spec_set=` when creating mocks. Unconstrained mocks return a new mock for any arbitrary property accessed, which masks typos and invalid function calls in test code.
- **Replace Generic Dictionaries with Immutable Dataclasses**: Raw nested dictionaries create code rot. Use typed `@dataclass(frozen=True, slots=True)` structures for all domain events and data transfer objects.
- **Beware Over-Mocking**: If your test asserts ten different mock calls in sequence, your unit under test is violating the Single Responsibility Principle. Decompose the class rather than writing more mock assertions.

---

## 📝 Summary & Key Takeaways

1. **Refactoring Preserves Semantics**: Architectural improvements change the internal design while leaving runtime contracts and external outputs unchanged.
2. **Dependency Injection Enables Determinism**: Code that constructs its own external dependencies (network, disk, clock) cannot be tested reliably. Injecting dependencies allows mock substitution in test suites.
3. **Mocks Enforce System Boundaries**: `unittest.mock.MagicMock` with explicit `spec` parameters verifies that your units adhere to contracts without causing side effects.

**Tomorrow (Day 90)**: The grand finale! **CapStone Deployment, Final Review & Beyond**—containerizing your project with Docker, establishing CI/CD automation, and mapping your ongoing trajectory as an advanced Python engineer.
