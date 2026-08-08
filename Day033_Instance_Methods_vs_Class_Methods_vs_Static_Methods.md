# Day 033: Instance Methods vs Class Methods vs Static Methods

> **Difficulty:** Intermediate | **Topic:** OOP | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives

- Understand the fundamental differences between instance methods, class methods, and static methods in Python.
- Master the use of decorators `@classmethod` and `@staticmethod`.
- Implement alternative constructors using `@classmethod`.
- Choose the correct method type to maintain clean, modular, and idiomatic Object-Oriented Python code.

---

## 📚 Theory & Concepts

In Python Object-Oriented Programming (OOP), methods defined inside a class do not all behave the same way. Python categorizes methods into three distinct types based on how they interact with class data and instance data:

1. **Instance Methods**
2. **Class Methods**
3. **Static Methods**

Understanding when and how to use each method type is essential for writing robust software and utilizing Python's dynamic object model effectively.

---

### The Three Method Types Visualized

```
+-----------------------------------------------------------------------+
|                             PYTHON CLASS                              |
|                                                                       |
|  1. Instance Method (default)                                         |
|     - Takes `self` as 1st arg                                         |
|     - Accesses & modifies Instance State AND Class State              |
|                                                                       |
|  2. Class Method (@classmethod)                                       |
|     - Takes `cls` as 1st arg                                          |
|     - Accesses & modifies Class State ONLY                            |
|                                                                       |
|  3. Static Method (@staticmethod)                                     |
|     - Takes NO implicit arguments (`self` or `cls`)                   |
|     - Cannot access Instance State or Class State directly            |
|     - Acts as an isolated utility function inside the class namespace |
+-----------------------------------------------------------------------+
```

---

### Comparison Matrix

| Feature | Instance Method | Class Method (`@classmethod`) | Static Method (`@staticmethod`) |
| :--- | :--- | :--- | :--- |
| **First Argument** | `self` (Instance object) | `cls` (Class object) | None (Explicit parameters only) |
| **Decorator** | None | `@classmethod` | `@staticmethod` |
| **Modifies Instance State?** | Yes | No | No |
| **Modifies Class State?** | Yes | Yes | No |
| **Primary Purpose** | Define behaviors that operate on object data | Factory methods / Alternative constructors, modifying class-wide settings | Utility functions logically scoped inside a class |
| **Call Mechanism** | `instance.method()` | `Class.method()` or `instance.method()` | `Class.method()` or `instance.method()` |

---

## 💻 Syntax & Structure

Here is how each method type is declared within a Python class:

```python
class DemoClass:
    class_variable: str = "Class Level Data"

    def __init__(self, value: str) -> None:
        self.instance_variable: str = value

    # 1. Instance Method
    def instance_method(self) -> str:
        """Accesses instance state via self."""
        return f"Instance Method called. Variable: {self.instance_variable}"

    # 2. Class Method
    @classmethod
    def class_method(cls) -> str:
        """Accesses class state via cls."""
        return f"Class Method called. Class Var: {cls.class_variable}"

    # 3. Static Method
    @staticmethod
    def static_method(x: int, y: int) -> int:
        """Isolated utility function. No self or cls."""
        return x + y
```

### Key Rules of Invocation

* **Instance Methods** automatically receive the specific instance object as their first positional parameter (`self`). Calling `obj.instance_method()` is equivalent to `DemoClass.instance_method(obj)`.
* **Class Methods** receive the class object itself as their first positional parameter (`cls`). Calling `DemoClass.class_method()` passes `DemoClass` implicitly.
* **Static Methods** receive no implicit first argument. They behave identically to normal standalone functions, but reside within the class's namespace for grouping purposes.

---

## 🧪 Code Examples

Let's look at a real-world scenario: an **Employee Management System**. 

This system will track individual employee details using **instance methods**, adjust company-wide policies and build employee objects from formatted strings using **class methods**, and validate email formats using a **static method**.

```python
from datetime import datetime

class Employee:
    # Class Attributes
    company_name: str = "TechCorp Global"
    minimum_salary: float = 30000.0
    total_employees: int = 0

    def __init__(self, name: str, salary: float) -> None:
        # Instance Attributes
        self.name: str = name
        self.salary: float = salary
        
        # Track employee count on creation
        Employee.total_employees += 1

    # -------------------------------------------------------------
    # 1. Instance Method
    # -------------------------------------------------------------
    def apply_raise(self, percentage: float) -> None:
        """Modifies specific instance state (salary)."""
        if percentage > 0:
            raise_amount = self.salary * (percentage / 100)
            self.salary += raise_amount
            print(f"[{self.name}] Received a {percentage}% raise. New salary: ${self.salary:,.2f}")
        else:
            print(f"[{self.name}] Invalid raise percentage.")

    def get_details(self) -> str:
        """Reads specific instance state."""
        return f"Employee: {self.name} | Salary: ${self.salary:,.2f} | Company: {self.company_name}"

    # -------------------------------------------------------------
    # 2. Class Methods
    # -------------------------------------------------------------
    @classmethod
    def set_company_name(cls, new_name: str) -> None:
        """Modifies class state across all instances."""
        old_name = cls.company_name
        cls.company_name = new_name
        print(f"[Class Config] Company name updated from '{old_name}' to '{cls.company_name}'")

    @classmethod
    def from_string(cls, emp_str: str) -> "Employee":
        """
        Alternative Constructor (Factory Method).
        Parses a string formatted as 'Name-Salary' and returns a new Employee instance.
        """
        name, salary_str = emp_str.split("-")
        salary = float(salary_str)
        return cls(name=name, salary=salary)

    # -------------------------------------------------------------
    # 3. Static Methods
    # -------------------------------------------------------------
    @staticmethod
    def is_valid_salary(salary: float) -> bool:
        """
        Utility Function: Checks if a salary meets baseline requirements.
        Does not depend on instance attributes or class attributes.
        """
        return salary >= Employee.minimum_salary

    @staticmethod
    def is_workday(day: datetime) -> bool:
        """Utility Function: Determines if a given date falls on a workday."""
        return day.weekday() < 5  # 0-4 are Monday through Friday

# =====================================================================
# Execution & Testing
# =====================================================================
if __name__ == "__main__":
    print("--- 1. Testing Instance Methods ---")
    emp1 = Employee("Alice Smith", 85000.0)
    emp2 = Employee("Bob Jones", 45000.0)

    print(emp1.get_details())
    emp1.apply_raise(10.0)

    print("\n--- 2. Testing Class Methods ---")
    # Updating class-level attribute via @classmethod
    Employee.set_company_name("TechCorp Solutions")
    print(emp1.get_details())
    print(emp2.get_details())

    # Creating an instance using an alternative constructor (@classmethod)
    emp3_data = "Charlie Brown-92000"
    emp3 = Employee.from_string(emp3_data)
    print(f"Created via factory method: {emp3.get_details()}")
    print(f"Total Employees Count: {Employee.total_employees}")

    print("\n--- 3. Testing Static Methods ---")
    # Calling static methods independently of instance data
    salary_to_check = 25000.0
    valid = Employee.is_valid_salary(salary_to_check)
    print(f"Is ${salary_to_check:,.2f} a valid starting salary? {valid}")

    test_date = datetime(2026, 3, 30)  # Monday
    print(f"Is {test_date.strftime('%Y-%m-%d')} a workday? {Employee.is_workday(test_date)}")
```

---

## 📊 Expected Output

```text
--- 1. Testing Instance Methods ---
Employee: Alice Smith | Salary: $85,000.00 | Company: TechCorp Global
[Alice Smith] Received a 10.0% raise. New salary: $93,500.00

--- 2. Testing Class Methods ---
[Class Config] Company name updated from 'TechCorp Global' to 'TechCorp Solutions'
Employee: Alice Smith | Salary: $93,500.00 | Company: TechCorp Solutions
Employee: Bob Jones | Salary: $45,000.00 | Company: TechCorp Solutions
Created via factory method: Employee: Charlie Brown | Salary: $92,000.00 | Company: TechCorp Solutions
Total Employees Count: 3

--- 3. Testing Static Methods ---
Is $25,000.00 a valid starting salary? False
Is 2026-03-30 a workday? True
```

---

## 🌍 Real-World Applications

1. **Alternative Constructors (Factory Pattern):**
   Python standard libraries heavily use `@classmethod` for constructor overloading. For instance, `datetime.datetime.fromtimestamp()` or `dict.fromkeys()` are class methods that instantiate objects from different data formats.

2. **Database and API Adapters:**
   When working with databases, class methods are frequently used to construct model instances from raw SQL query dictionaries, ORM results, or JSON payloads returned by API calls (e.g., `User.from_dict(json_payload)`).

3. **Isolated Domain Validation Logic:**
   Static methods are widely used in enterprise frameworks (like Django or Flask) to house validation rules, mathematical transformations, or formatting helpers that naturally belong inside a class domain model without coupling them to runtime instance state.

---

## 💡 Best Practices

- **Use `@classmethod` for Alternative Constructors:**
  When providing multiple ways to create an instance, name the methods starting with `from_` (e.g., `from_json`, `from_csv`, `from_tuple`). Always use `cls(...)` inside class methods instead of hardcoding the class name so subclassing works correctly.

- **Do Not Default to `@staticmethod` for Global Functions:**
  If a utility function has no relation to the class domain, place it at the module level instead of making it a static method. Use `@staticmethod` only when logically namespace-grouping functions within a class makes code cleaner and more readable.

- **Maintain Conventional Parameter Names:**
  Always use `self` for instance methods and `cls` for class methods. Deviating from these conventions violates standard PEP 8 naming style and confuses other developers.

### Common Pitfalls to Avoid

- ❌ **Forgetting the Decorator:** Forgetting `@classmethod` or `@staticmethod` results in runtime errors (`TypeError`) because Python will attempt to pass `self` implicitly when invoked on an instance.
- ❌ **Hardcoding Class Names in Class Methods:** Using `Employee(...)` inside `@classmethod` instead of `cls(...)` breaks inheritance when sub-classes inherit that method.

---

## 📝 Summary & Key Takeaways

Today you mastered the three primary method types in Python Object-Oriented Programming:

1. **Instance Methods**: The standard method type. Operate on instance data via `self`.
2. **Class Methods**: Marked with `@classmethod`. Operate on class-level data via `cls` and act as powerful alternative constructors.
3. **Static Methods**: Marked with `@staticmethod`. Plain utility functions bound to the class's namespace without implicit implicit `self` or `cls` arguments.

### Decision Flowchart

```
Need access to instance attributes/methods (self)?
├── YES ──> Use Instance Method
└── NO  ──> Need access to class attributes/other class methods (cls)?
            ├── YES ──> Use Class Method (@classmethod)
            └── NO  ──> Is it related to the class domain?
                        ├── YES ──> Use Static Method (@staticmethod)
                        └── NO  ──> Use Top-Level Module Function
```

**Next Lesson Preview:** Tomorrow (Day 34), we will dive into **Encapsulation, Private Attributes, and Python Properties (`@property`)** to control read/write access to object state cleanly.
