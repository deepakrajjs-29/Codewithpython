# Day 036: Single Inheritance

> **Difficulty:** Intermediate | **Topic:** OOP | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- **Understand** the core principles of Inheritance and the **"Is-A"** relationship model in Object-Oriented Programming (OOP).
- **Implement** Single Inheritance in Python by deriving a child class from a single parent class.
- **Master** the `super()` function to invoke parent attributes and methods cleanly without explicit hardcoding.
- **Override** parent class methods in child classes to customize functionality while maintaining polymorphic contracts.
- **Inspect** class hierarchies dynamically using Python's built-in `isinstance()` and `issubclass()` functions.

---

## 📚 Theory & Concepts

### What is Inheritance?

**Inheritance** is one of the foundational pillars of Object-Oriented Programming. It allows a new class (known as the **child**, **derived**, or **subclass**) to inherit attributes and methods from an existing class (known as the **parent**, **base**, or **superclass**).

Inheritance promotes the **DRY (Don't Repeat Yourself)** software design principle. Instead of rewriting redundant code for related entities, you define common attributes and behaviors in a base class and let specialized derived classes inherit and extend that functionality.

```
       ┌────────────────────────┐
       │     Employee (Base)    │
       │ ────────────────────── │
       │ - name: str            │
       │ - employee_id: str     │
       │ - base_salary: float   │
       │ + get_details()        │
       └───────────▲────────────┘
                   │  Inherits from (Is-A)
       ┌───────────┴────────────┐
       │   Developer (Derived)  │
       │ ────────────────────── │
       │ - tech_stack: list     │
       │ + write_code()         │
       └────────────────────────┘
```

### Single Inheritance Defined

**Single Inheritance** occurs when a derived class inherits directly from **exactly one** base class. It represents the simplest and most common form of inheritance.

In Python, every custom class implicitly inherits from the root built-in class `object` unless specified otherwise. When you write `class Developer(Employee):`, you establish an explicit **Single Inheritance** pipeline where `Developer` directly extends `Employee`.

### The "Is-A" Relationship Rule

Before applying inheritance, perform the **"Is-A" Test**:
- A **Developer** *is an* **Employee** $\rightarrow$ Valid Inheritance design.
- A **Manager** *is an* **Employee** $\rightarrow$ Valid Inheritance design.
- An **Employee** *has a* **Laptop** $\rightarrow$ Invalid Inheritance design (This is **Composition**, not Inheritance).

### Core Concepts in Single Inheritance

1. **Code Reusability**: Attributes and methods defined in the parent class are automatically available in instances of the child class.
2. **Method Overriding**: A child class can provide a specific implementation of a method that is already defined in its parent class.
3. **The `super()` Function**: A built-in proxy object that delegates method calls to a parent class, enabling child classes to extend parent behaviors without referring to the parent class name explicitly.

---

## 💻 Syntax & Structure

### Basic Single Inheritance Template

In Python, single inheritance is specified by placing the parent class name inside parentheses immediately after the child class name.

```python
class ParentClass:
    """Base class representing common attributes and behaviors."""
    def __init__(self, parent_attribute: str) -> None:
        self.parent_attribute = parent_attribute

    def primary_action(self) -> str:
        return f"Parent action with attribute: {self.parent_attribute}"

class ChildClass(ParentClass):
    """Derived class inheriting from ParentClass."""
    def __init__(self, parent_attribute: str, child_attribute: int) -> None:
        # Delegate initialization of parent attributes to ParentClass
        super().__init__(parent_attribute)
        self.child_attribute = child_attribute

    def primary_action(self) -> str:
        # Method Overriding: Extend parent functionality using super()
        base_result = super().primary_action()
        return f"{base_result} | Extended by Child with attribute: {self.child_attribute}"

    def specific_action(self) -> str:
        # Unique method belonging exclusively to ChildClass
        return f"Child-specific action using value {self.child_attribute}"
```

### Explaining `super()`
The `super()` function returns a temporary object of the superclass, allowing you to call its methods. Calling `super().__init__(...)` ensures that the base class is properly initialized before the subclass adds its custom attributes.

---

## 🧪 Code Examples

Below is a complete, executable Python program demonstrating Single Inheritance in an Enterprise Resource Management system.

```python
"""
Day 36: Single Inheritance Demonstration
Domain: Enterprise Employee Management System
"""

from typing import List

class Employee:
    """Base class representing a general employee in the organization."""

    def __init__(self, name: str, employee_id: str, base_salary: float) -> None:
        self.name: str = name
        self.employee_id: str = employee_id
        self.base_salary: float = base_salary

    def calculate_bonus((self) -> float:
        """Calculate standard annual bonus (10% of base salary)."""
        return self.base_salary * 0.10

    def get_details(self) -> str:
        """Return formatted employee summary."""
        return (
            f"ID: {self.employee_id} | Name: {self.name} | "
            f"Base Salary: ${self.base_salary:,.2f}"
        )

class Developer(Employee):
    """
    Derived class representing a software developer.
    Inherits directly from Employee (Single Inheritance).
    """

    def __init__(
        self,
        name: str,
        employee_id: str,
        base_salary: float,
        programming_languages: List[str],
    ) -> None:
        # Delegate base initialization to parent class Employee
        super().__init__(name, employee_id, base_salary)
        # Unique subclass attribute
        self.programming_languages: List[str] = programming_languages

    def calculate_bonus(self) -> float:
        """
        Method Overriding: Developers get a higher bonus base (15%)
        plus an additional flat stipend of $2,000 for technical certifications.
        """
        standard_bonus = super().calculate_bonus()  # Reuses base calculation logic
        tech_stipend = 2000.00
        additional_rate_bonus = self.base_salary * 0.05
        return standard_bonus + additional_rate_bonus + tech_stipend

    def write_code(self, language: str) -> str:
        """Subclass-specific method."""
        if language in self.programming_languages:
            return f"🟢 {self.name} is writing production code in {language}."
        return f"🔴 {self.name} is learning {language} on the job!"

def main() -> None:
    print("=== 1. Instantiating Base Employee ===")
    emp1 = Employee(name="Alice Smith", employee_id="EMP-101", base_salary=75000.00)
    print(emp1.get_details())
    print(f"Annual Bonus: ${emp1.calculate_bonus():,.2f}\n")

    print("=== 2. Instantiating Derived Developer ===")
    dev1 = Developer(
        name="Bob Chen",
        employee_id="DEV-202",
        base_salary=110000.00,
        programming_languages=["Python", "TypeScript", "Rust"],
    )
    # Inherited method from Employee base class
    print(dev1.get_details())
    
    # Overridden method call
    print(f"Annual Bonus (Overridden): ${dev1.calculate_bonus():,.2f}")
    
    # Class-specific method call
    print(dev1.write_code("Python"))
    print(dev1.write_code("Java"))
    print()

    print("=== 3. Type Hierarchy & Introspection Checks ===")
    print(f"Is dev1 an instance of Developer? -> {isinstance(dev1, Developer)}")
    print(f"Is dev1 an instance of Employee?  -> {isinstance(dev1, Employee)}")
    print(f"Is Developer a subclass of Employee? -> {issubclass(Developer, Employee)}")
    print(f"Is Employee a subclass of Developer? -> {issubclass(Employee, Developer)}")

if __name__ == "__main__":
    main()
```

---

## 📊 Expected Output

```text
=== 1. Instantiating Base Employee ===
ID: EMP-101 | Name: Alice Smith | Base Salary: $75,000.00
Annual Bonus: $7,500.00

=== 2. Instantiating Derived Developer ===
ID: DEV-202 | Name: Bob Chen | Base Salary: $110,000.00
Annual Bonus (Overridden): $18,500.00
🟢 Bob Chen is writing production code in Python.
🔴 Bob Chen is learning Java on the job!

=== 3. Type Hierarchy & Introspection Checks ===
Is dev1 an instance of Developer? -> True
Is dev1 an instance of Employee?  -> True
Is Developer a subclass of Employee? -> True
Is Employee a subclass of Developer? -> False
```

---

## 🌍 Real-World Applications

### 1. Web Frameworks (Django / Flask)
Single inheritance is heavily relied upon in major Python frameworks. For instance, in Django, every ORM database model inherits directly from `models.Model`:

```python
from django.db import models

# Single Inheritance: Article inherits ORM capabilities from models.Model
class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    pub_date = models.DateTimeField(auto_now_add=True)
```

### 2. Custom Exception Handling
Standardizing domain-specific error handling in modern microservices requires deriving custom errors from built-in exceptions:

```python
class DatabaseConnectionError(Exception):
    """Custom exception raised when database fails to connect."""
    def __init__(self, host: str, port: int) -> None:
        self.message = f"Failed to connect to database server at {host}:{port}"
        super().__init__(self.message)
```

### 3. Deep Learning Frameworks (PyTorch)
In PyTorch, all custom neural network architectures inherit from `torch.nn.Module`:

```python
import torch.nn as nn

class LinearRegressionModel(nn.Module):
    def __init__(self, input_dim: int, output_dim: int) -> None:
        super().__init__()
        self.linear = nn.Linear(input_dim, output_dim)

    def forward(self, x):
        return self.linear(x)
```

---

## 💡 Best Practices

- **Always use `super()`**: Never hardcode parent class method calls like `Employee.__init__(self, ...)` inside a child class. Using `super()` allows Python to properly manage the Method Resolution Order (MRO) and keeps code flexible for future changes.
- **Maintain Liskov Substitution Principle (LSP)**: A derived class should be usable wherever its base class is expected without breaking functionality. Ensure overridden methods accept compatible parameter types and return consistent types.
- **Keep Subclass Constructors Clean**: Call `super().__init__()` at the very beginning of the child class constructor before initializing unique subclass attributes.
- **Prefer Composition over Deep Inheritance**: Use single inheritance when an **"Is-A"** relationship genuinely exists. Avoid creating rigid, deeply nested inheritance chains (e.g., `A` $\rightarrow$ `B` $\rightarrow$ `C` $\rightarrow$ `D` $\rightarrow$ `E`). If hierarchy depth exceeds 2-3 levels, re-evaluate whether **Composition** ("Has-A") is a better choice.

---

## 📝 Summary & Key Takeaways

### Key Takeaways

| Concept | Description | Syntax Example |
| :--- | :--- | :--- |
| **Single Inheritance** | A subclass inheriting from one parent class. | `class Child(Parent):` |
| **`super()` Function** | Delegates method invocation to the parent class. | `super().__init__(arg1)` |
| **Method Overriding** | Redefining a base method in a derived class. | Redefining method with matching signature in subclass. |
| **`isinstance(obj, Class)`** | Checks if an object is an instance of a class or parent class. | `isinstance(dev, Employee) -> True` |
| **`issubclass(Child, Parent)`** | Checks if a class is derived from another class. | `issubclass(Developer, Employee) -> True` |

### What's Next?
Tomorrow on **Day 037**, we will expand upon this foundation by exploring **Multiple and Multilevel Inheritance**, dissecting Python's **Method Resolution Order (MRO)**, and understanding the **C3 Linearization Algorithm**!
