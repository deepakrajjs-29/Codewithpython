# Day 029: Raising Exceptions & Custom Error Classes

> **Difficulty:** Intermediate | **Topic:** Error Handling | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Master explicit exception triggering using the `raise` keyword to enforce domain rules and fail fast.
- Create robust, domain-specific custom exception classes by inheriting from Python's built-in `Exception`.
- Design maintainable error hierarchies for libraries, frameworks, and complex applications.
- Leverage exception chaining (`raise ... from ...`) to preserve underlying cause tracebacks during error translation.

---

## 📚 Theory & Concepts

### Why Explicitly Raise Exceptions?
In software engineering, silent failures are dangerous. When a function receives invalid inputs or enters an invalid state, continuing execution can lead to data corruption or unpredictable behavior later in the call stack. 

The **Fail-Fast Principle** dictates that a system should immediately halt operation and report an error as soon as a failure condition occurs. In Python, we enforce this by explicitly throwing errors using the `raise` keyword.

```
[ Caller Function ]
        │
        │ Calls process_payment(amount=-50)
        ▼
[ process_payment ]  ──( Validates amount < 0 )──► [ raise ValueError ]
        │                                                     │
        │ (Halts execution immediately)                       │ (Unwinds stack)
        ▼                                                     ▼
  Execution Stopped                                 Caught by Except Block
```

### Built-in vs. Custom Exceptions
Python provides a rich set of built-in exceptions (`ValueError`, `TypeError`, `KeyError`, etc.). While built-in exceptions work well for general programming errors, enterprise software demands **domain-specific semantics**.

| Type | Example | When to Use |
| :--- | :--- | :--- |
| **Built-in Exception** | `ValueError("Invalid age")` | Generic utility functions, standard data type mismatches. |
| **Custom Exception** | `InsufficientFundsError` | Domain-specific business logic failures (e.g., Banking, Billing). |

Custom exceptions allow callers to filter and handle domain errors specifically, without accidentally catching unrelated standard library errors.

### The Python Exception Hierarchy
All standard and custom error classes in Python form a single inheritance tree starting at `BaseException`. When building custom exceptions, you **must inherit from `Exception`**, not `BaseException`.

```
                  BaseException
                        │
        ┌───────────────┴───────────────┐
  SystemExit                   Exception
  KeyboardInterrupt                     │
                                ┌───────┴───────┐
                          StandardError   AppBaseError (Your Base Exception)
                          (ValueError,          │
                           TypeError...)  ┌─────┴────────────────┐
                                   PaymentError          UserNotFoundError
                                          │
                              InsufficientFundsError
```

> ⚠️ **Critical Rule:** Direct inheritance from `BaseException` bypasses standard `except Exception:` blocks, preventing callers from catching your errors cleanly and potentially intercepting system signals like `KeyboardInterrupt` (Ctrl+C).

### Exception Chaining (`raise ... from ...`)
When catching an exception and throwing a higher-level custom exception in its place, you risk losing the original stack trace. Python 3 provides explicit exception chaining using the `from` clause:

- `raise CustomError(...) from original_error`: Sets `__cause__`, explicitly linking the original issue to the new exception.
- `raise CustomError(...) from None`: Suppresses the contextual traceback, hiding internal implementation details from end users.

---

## 💻 Syntax & Structure

### 1. The `raise` Statement
To raise an exception, use `raise` followed by an instance of an exception class:

```python
# Raising a built-in exception
def set_age(age: int) -> None:
    if age < 0:
        raise ValueError(f"Age cannot be negative. Received: {age}")
```

### 2. Basic Custom Exception Class
Define a custom exception by subclassing `Exception`. It is standard Python convention (PEP 8) to end custom exception names with `Error`.

```python
class InvalidTransactionError(Exception):
    """Raised when an illegal financial transaction is attempted."""
    pass
```

### 3. Custom Exception with Rich Contextual State
By overriding `__init__`, you can attach domain-specific data attributes to the exception instance, making debugging and error handling significantly easier.

```python
class InsufficientFundsError(Exception):
    """Raised when an account balance is lower than the requested withdrawal."""
    
    def __init__(self, balance: float, amount: float) -> None:
        self.balance = balance
        self.amount = amount
        self.shortfall = amount - balance
        super().__init__(
            f"Cannot withdraw ${amount:.2f}. Available balance: ${balance:.2f} "
            f"(Shortfall: ${self.shortfall:.2f})"
        )
```

### 4. Exception Chaining Syntax
Preserve the root cause traceback across architectural layers (e.g., database driver error to service layer error):

```python
try:
    # Low-level operation (e.g., parsing raw payload)
    raw_value = int("invalid_number")
except ValueError as cause:
    # High-level domain error context
    raise DataValidationError("Failed to parse incoming request payload.") from cause
```

---

## 🧪 Code Examples

The following self-contained script models a payment engine demonstrating exception hierarchies, custom error state, parameter validation, and explicit exception chaining.

```python
"""
Day 29: Raising Exceptions & Custom Error Classes
Demonstrating enterprise error handling, custom exception state, and chaining.
"""

from typing import Dict

# ============================================================================
# 1. Domain Exception Hierarchy
# ============================================================================

class BankingError(Exception):
    """Base exception for all errors produced by the banking module."""
    pass

class InsufficientFundsError(BankingError):
    """Raised when an account balance cannot cover a transaction."""
    
    def __init__(self, account_id: str, balance: float, amount: float) -> None:
        self.account_id = account_id
        self.balance = balance
        self.amount = amount
        self.shortfall = amount - balance
        
        message = (
            f"Account '{self.account_id}' attempt to withdraw ${self.amount:.2f} "
            f"failed. Current balance: ${self.balance:.2f}. Shortfall: ${self.shortfall:.2f}."
        )
        super().__init__(message)

class AccountLockedError(BankingError):
    """Raised when operating on a frozen account."""
    
    def __init__(self, account_id: str, reason: str) -> None:
        self.account_id = account_id
        self.reason = reason
        super().__init__(f"Account '{account_id}' is locked. Reason: {self.reason}")

# ============================================================================
# 2. Service Implementation
# ============================================================================

class BankAccount:
    def __init__(self, account_id: str, initial_balance: float) -> None:
        if initial_balance < 0:
            raise ValueError(f"Initial balance cannot be negative (${initial_balance:.2f}).")
            
        self.account_id = account_id
        self.balance = initial_balance
        self.is_locked = False

    def lock_account(self, reason: str) -> None:
        self.is_locked = True
        self._lock_reason = reason

    def withdraw(self, amount: float) -> float:
        # Input Validation (Built-in Exception)
        if amount <= 0:
            raise ValueError(f"Withdrawal amount must be positive. Received: ${amount:.2f}")

        # Business Rule Enforcements (Custom Exceptions)
        if self.is_locked:
            raise AccountLockedError(self.account_id, getattr(self, "_lock_reason", "Security Hold"))

        if amount > self.balance:
            raise InsufficientFundsError(self.account_id, self.balance, amount)

        self.balance -= amount
        return self.balance

def process_external_gateway_payment(account: BankAccount, amount: float) -> None:
    """Wrapper demonstrating Exception Chaining."""
    try:
        account.withdraw(amount)
    except BankingError as err:
        # Re-package low-level domain error into higher-level integration exception
        raise RuntimeError(f"Payment gateway rejected transaction for account '{account.account_id}'.") from err

# ============================================================================
# 3. Demonstration & Execution
# ============================================================================

if __name__ == "__main__":
    print("=== Test 1: Validating Negative Deposit (Built-in ValueError) ===")
    try:
        acc = BankAccount("ACC-1001", -50.00)
    except ValueError as e:
        print(f"Caught Expected Error: {e}\n")

    acc = BankAccount("ACC-1001", 250.00)

    print("=== Test 2: Handling Custom InsufficientFundsError with State ===")
    try:
        acc.withdraw(500.00)
    except InsufficientFundsError as e:
        print(f"Caught Exception: {e}")
        print(f"  -> Account ID: {e.account_id}")
        print(f"  -> Requested:  ${e.amount:.2f}")
        print(f"  -> Available:  ${e.balance:.2f}")
        print(f"  -> Shortfall:  ${e.shortfall:.2f}\n")

    print("=== Test 3: Account Locking Exception ===")
    acc.lock_account("Suspicious Activity Detected")
    try:
        acc.withdraw(20.00)
    except AccountLockedError as e:
        print(f"Caught Exception: {e}")
        print(f"  -> Reason Code: {e.reason}\n")

    print("=== Test 4: Exception Chaining (`raise ... from ...`) ===")
    unlocked_acc = BankAccount("ACC-2002", 100.00)
    try:
        process_external_gateway_payment(unlocked_acc, 300.00)
    except RuntimeError as gateway_err:
        print(f"Caught Outer Exception: {gateway_err}")
        print(f"Root Cause Exception:   {gateway_err.__cause__}")
```

---

## 📊 Expected Output

```text
=== Test 1: Validating Negative Deposit (Built-in ValueError) ===
Caught Expected Error: Initial balance cannot be negative ($-50.00).

=== Test 2: Handling Custom InsufficientFundsError with State ===
Caught Exception: Account 'ACC-1001' attempt to withdraw $500.00 failed. Current balance: $250.00. Shortfall: $250.00.
  -> Account ID: ACC-1001
  -> Requested:  $500.00
  -> Available:  $250.00
  -> Shortfall:  $250.00

=== Test 3: Account Locking Exception ===
Caught Exception: Account 'ACC-1001' is locked. Reason: Suspicious Activity Detected
  -> Reason Code: Suspicious Activity Detected

=== Test 4: Exception Chaining (`raise ... from ...`) ===
Caught Outer Exception: Payment gateway rejected transaction for account 'ACC-2002'.
Root Cause Exception:   Account 'ACC-2002' attempt to withdraw $300.00 failed. Current balance: $100.00. Shortfall: $200.00.
```

---

## 🌍 Real-World Applications

1. **REST API Frameworks (FastAPI / Flask)**
   Custom exceptions are mapped directly to HTTP status codes using framework exception handlers.
   ```python
   # Custom exception maps seamlessly to HTTP 404
   class ResourceNotFoundError(Exception):
       def __init__(self, resource_type: str, item_id: str):
           self.resource_type = resource_type
           self.item_id = item_id
           super().__init__(f"{resource_type} with ID '{item_id}' was not found.")
   ```

2. **Database Abstraction Layers (ORMs)**
   Libraries like SQLAlchemy encapsulate raw driver exceptions (e.g., `psycopg2.OperationalError`) into generic library exceptions (`sqlalchemy.exc.OperationalError`) via explicit exception chaining (`raise ... from ...`), shielding developers from vendor-specific internals.

3. **SDK and Package Engineering**
   When publishing open-source software or enterprise internal libraries, exposing a base library error (e.g., `requests.exceptions.RequestException`) lets consumers catch *all* library-specific errors using a single `except` block.

---

## 💡 Best Practices

- **Inherit from `Exception`**: Never subclass `BaseException` directly. Subclass `Exception` so standard application error handlers catch your custom exceptions cleanly.
- **Suffix Class Names with `Error`**: Adhere strictly to PEP 8 guidelines (e.g., `ValidationError`, `AuthenticationError`).
- **Create Module-Level Base Exceptions**: Define an abstract base class exception for your library or package (`class AppBaseError(Exception): pass`). Inherit all module-specific errors from it.
- **Store Diagnostic Attributes**: Attach rich metadata directly to custom exception instances inside `__init__` rather than embedding unstructured text strings into messages.
- **Preserve Cause via Chaining**: Use `raise NewException(...) from cause_exception` when wrapping lower-level exceptions to maintain full tracebacks for debugging.
- **Avoid Over-engineering**: Do not create custom exception classes for standard errors covered by `ValueError`, `TypeError`, or `KeyError`.

---

## 📝 Summary & Key Takeaways

1. The **`raise` statement** explicitly interrupts control flow to signal error states immediately.
2. Custom exceptions define **clear domain semantics** for your applications and allow precise caller-side exception filtering.
3. Defining custom attributes on error instances turns exceptions into **data-rich diagnostic tools**.
4. **Exception chaining (`from`)** provides a transparent audit trail of failure chains across architectural boundaries.

**Next Up:** **Day 30 — Context Managers & The `with` Statement** (Resource Management and Allocation Cleanups).
