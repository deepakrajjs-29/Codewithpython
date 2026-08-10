# Day 038: Multiple Inheritance & Method Resolution Order (MRO)

> **Difficulty:** Intermediate | **Topic:** OOP | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Define and implement multiple inheritance in Python classes.
- Understand the **Diamond Problem** and how Python resolves method lookup collisions.
- Master Python’s **C3 Linearization Algorithm** and how to inspect method resolution order using `__mro__` and `mro()`.
- Use `super()` correctly in cooperative multiple inheritance hierarchies using `**kwargs`.
- Design robust software structures using **Mixins** while avoiding common inheritance pitfalls.

---

## 📚 Theory & Concepts

### 1. What is Multiple Inheritance?
In Object-Oriented Programming (OOP), **multiple inheritance** occurs when a subclass derives directly from more than one parent class. This allows the child class to inherit attributes and behaviors from multiple source classes.

While powerful, multiple inheritance introduces ambiguity: if two parent classes define the exact same method or attribute, which one should the child class execute?

```
      [ ParentA ]       [ ParentB ]
           \                 /
            \               /
             [ ChildClass ]
```

---

### 2. The Diamond Problem
The classic ambiguity pattern in OOP is called the **Diamond Problem**. It occurs when a child class inherits from two parent classes that both inherit from a single base class:

```
          [ BaseClass ]
           /         \
          /           \
     [ ParentA ]   [ ParentB ]
          \           /
           \         /
         [ ChildClass ]
```

If `BaseClass` defines a method `process()`, and both `ParentA` and `ParentB` override `process()`, calling `ChildClass().process()` presents a dilemma: should Python call `ParentA`'s implementation or `ParentB`'s? Should `BaseClass`'s method be called once or twice?

---

### 3. C3 Linearization & Method Resolution Order (MRO)
Python resolves this ambiguity deterministically using the **C3 Linearization Algorithm** (introduced in Python 2.3). 

The output of C3 Linearization is a linear sequence known as the **Method Resolution Order (MRO)**. Python uses this ordered list to search for attributes and methods from left to right.

Key properties guaranteed by C3 Linearization:
1. **Subclass Precedence:** A subclass is always checked before its parent classes.
2. **Declaration Order Preservation:** If a class inherits from `(A, B)`, `A` is searched before `B`.
3. **Monotonicity:** The precedence order among parent classes is preserved across the entire inheritance tree.

---

### 4. How `super()` Works in Multiple Inheritance
A common misconception is that `super()` calls the direct parent class. In Python, **`super()` calls the next class in the MRO list**, not necessarily a direct parent.

This concept is called **Cooperative Multiple Inheritance**. For `super()` to chain correctly through all classes:
- Every class in the hierarchy must call `super()`.
- Top-level methods must accept `**kwargs` or matching arguments to allow parameter passing down the chain.

---

## 💻 Syntax & Structure

### Basic Multiple Inheritance & MRO Inspection

```python
class ParentA:
    def execute(self) -> None:
        print("ParentA execution")

class ParentB:
    def execute(self) -> None:
        print("ParentB execution")

# Inheritance order matters: ParentA comes before ParentB
class Child(ParentA, ParentB):
    pass

obj = Child()
obj.execute()  # Executes ParentA.execute()

# Inspecting the MRO
print(Child.__mro__)  # Tuple format
print(Child.mro())    # List format
```

### Cooperative `super()` Syntax with Keyword Arguments

```python
class Base:
    def __init__(self, **kwargs) -> None:
        # Passes remaining arguments to object.__init__()
        super().__init__()
        print("Base initialized")

class FeatureA(Base):
    def __init__(self, feature_a_setting: str, **kwargs) -> None:
        super().__init__(**kwargs)
        self.feature_a_setting = feature_a_setting
        print(f"FeatureA initialized: {self.feature_a_setting}")

class FeatureB(Base):
    def __init__(self, feature_b_setting: int, **kwargs) -> None:
        super().__init__(**kwargs)
        self.feature_b_setting = feature_b_setting
        print(f"FeatureB initialized: {self.feature_b_setting}")

class CombinedFeature(FeatureA, FeatureB):
    def __init__(self, feature_a_setting: str, feature_b_setting: int) -> None:
        super().__init__(
            feature_a_setting=feature_a_setting,
            feature_b_setting=feature_b_setting
        )
```

---

## 🧪 Code Examples

The following runnable script demonstrates cooperative multiple inheritance, method delegation, and MRO inspection in a realistic hardware abstraction scenario.

```python
"""
Day 038: Multiple Inheritance & Method Resolution Order (MRO)
Demonstration of C3 Linearization and Cooperative Inheritance.
"""

from typing import Any

class BaseDevice:
    """Root base class for all hardware devices."""

    def __init__(self, device_id: str, **kwargs: Any) -> None:
        super().__init__()  # Passes remaining arguments up to `object`
        self.device_id = device_id
        print(f"[BaseDevice] Initialized device ID: {self.device_id}")

    def describe(self) -> str:
        return f"Device ID: {self.device_id}"

class Scanner(BaseDevice):
    """Subclass providing scanning functionality."""

    def __init__(self, resolution_dpi: int, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self.resolution_dpi = resolution_dpi
        print(f"[Scanner] Initialized with DPI: {self.resolution_dpi}")

    def describe(self) -> str:
        parent_desc = super().describe()
        return f"{parent_desc} | Scanner: {self.resolution_dpi} DPI"

class Printer(BaseDevice):
    """Subclass providing printing functionality."""

    def __init__(self, print_speed_ppm: int, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self.print_speed_ppm = print_speed_ppm
        print(f"[Printer] Initialized with Speed: {self.print_speed_ppm} PPM")

    def describe(self) -> str:
        parent_desc = super().describe()
        return f"{parent_desc} | Printer: {self.print_speed_ppm} PPM"

class MultiFunctionPrinter(Scanner, Printer):
    """
    Child class deriving from both Scanner and Printer.
    Demonstrates Diamond Problem resolution via MRO.
    """

    def __init__(self, device_id: str, resolution_dpi: int, print_speed_ppm: int) -> None:
        print("[MultiFunctionPrinter] Initializing setup sequence...")
        super().__init__(
            device_id=device_id,
            resolution_dpi=resolution_dpi,
            print_speed_ppm=print_speed_ppm,
        )
        print("[MultiFunctionPrinter] Ready for operation.")

def main() -> None:
    print("--- Creating MultiFunctionPrinter Instance ---")
    mfp = MultiFunctionPrinter(
        device_id="MFP-9000",
        resolution_dpi=1200,
        print_speed_ppm=45
    )

    print("\n--- Method Resolution Order Inspection ---")
    for idx, cls in enumerate(MultiFunctionPrinter.__mro__, start=1):
        print(f"{idx}. {cls.__name__}")

    print("\n--- Executing Method Call Across MRO ---")
    description = mfp.describe()
    print(f"Final Description: {description}")

if __name__ == "__main__":
    main()
```

---

## 📊 Expected Output

```text
--- Creating MultiFunctionPrinter Instance ---
[MultiFunctionPrinter] Initializing setup sequence...
[BaseDevice] Initialized device ID: MFP-9000
[Printer] Initialized with Speed: 45 PPM
[Scanner] Initialized with DPI: 1200
[MultiFunctionPrinter] Ready for operation.

--- Method Resolution Order Inspection ---
1. MultiFunctionPrinter
2. Scanner
3. Printer
4. BaseDevice
5. object

--- Executing Method Call Across MRO ---
Final Description: Device ID: MFP-9000 | Printer: 45 PPM | Scanner: 1200 DPI
```

---

## 🌍 Real-World Applications

### 1. Django Framework Mixins
Web frameworks like Django heavily use multiple inheritance via **Mixins** to compose view logic cleanly without massive inheritance trees:

```python
# Conceptual Django View Pattern
class UserProfileView(LoginRequiredMixin, PermissionRequiredMixin, TemplateView):
    template_name = "profile.html"
    permission_required = "users.can_view_profile"
```
Each mixin handles a single, decoupled responsibility (authentication check, permission check, template rendering).

### 2. Plugin & Extension Architecture
Large software systems (such as GUI toolkits, game engines, and ORMs) use multiple inheritance to mix optional capabilities—such as `JSONSerializableMixin`, `DatabaseStorableMixin`, or `LoggingMixin`—into core domain models without repeating logic.

---

## 💡 Best Practices

- **Prefer Mixins over Deep Hierarchies:** A Mixin is a lightweight class intended to add specific functionality, not to be instantiated on its own. Keep mixins focused on a single responsibility.
- **Always Use `super()` Consistently:** Never mix explicit parent class calls (e.g., `ParentClass.__init__(self)`) with `super()`. Doing so breaks the MRO chain and causes methods to execute out of order or multiple times.
- **Accept `**kwargs` in Cooperative Methods:** Because you cannot always predict which class `super()` will invoke next in a dynamic MRO hierarchy, pass parameters using keyword arguments (`**kwargs`).
- **Inspect MRO When Debugging:** Use `ClassName.mro()` or `ClassName.__mro__` whenever method behavior seems unexpected in complex hierarchies.
- **Prefer Composition Over Inheritance:** If the relationship is not strictly an "is-a" relationship, compose objects by passing instances instead of inheriting.

---

## 📝 Summary & Key Takeaways

- **Multiple Inheritance** allows a class to derive from more than one base class, encouraging modular behavior reuse.
- The **Diamond Problem** is resolved in Python using the **C3 Linearization Algorithm**, generating a clear, deterministic lookup order called the **MRO**.
- **`super()`** does not refer to the direct parent class; it refers to the **next class in the instance's MRO chain**.
- Inspect the resolution path anytime using `Class.__mro__` or `Class.mro()`.

**Next Lesson (Day 39):** Polymorphism, Duck Typing, & Abstract Base Classes (ABCs) in Python.
