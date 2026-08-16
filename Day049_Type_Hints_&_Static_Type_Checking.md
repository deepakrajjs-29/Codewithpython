# Day 049: Type Hints & Static Type Checking

> **Difficulty:** Intermediate | **Topic:** Best Practices | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Master modern Python 3.12 type annotation syntax for variables, functions, and collections.
- Understand the philosophy of **Gradual Typing** and how type annotations bridge dynamic flexibility and static safety.
- Utilize advanced typing constructs including `Union` (`|`), `Optional`, `Callable`, `Literal`, and `TypedDict`.
- Learn how static analysis tools like `mypy` catch bugs before code runs, without impacting runtime execution speed.

---

## 📚 Theory & Concepts

### Dynamic Typing vs. Static Type Checking

Python is fundamentally a **dynamically and strongly typed** language. Types are bound to values at runtime, not to variable names at compile time. While this offers rapid development speed, it introduces risks in medium-to-large codebases:

```python
# Valid runtime syntax, but causes a crash during execution
def calculate_tax(amount, rate):
    return amount * rate

calculate_tax("100", 0.05)  # TypeError: can't multiply sequence by non-int of type 'float'
```

To solve this without sacrificing runtime flexibility, Python introduced **Type Hints** (via [PEP 484](https://peps.python.org/pep-0484/)) and the concept of **Gradual Typing**.

```
+-------------------------------------------------------------------------+
|                           DEVELOPMENT STAGE                             |
|                                                                         |
|  [ Source Code with Type Hints ]  ------>  [ Static Checker (e.g., Mypy)] |
|                                                    |                    |
|                                            Catches type errors          |
|                                            before execution!            |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                            RUNTIME STAGE                                |
|                                                                         |
|  [ Python Interpreter (CPython) ]                                       |
|  * Ignores type annotations completely                                  |
|  * Executes code at standard dynamic speed                              |
|  * Stores annotations in `__annotations__` metadata                     |
+-------------------------------------------------------------------------+
```

### Key Milestones in Modern Python Typing

1. **Python 3.5 (PEP 484):** Introduced the `typing` module and function annotation standards.
2. **Python 3.9 (PEP 585):** Standard collections (`list`, `dict`, `set`, `tuple`) became generic directly without importing capitalized variants from `typing` (e.g., `list[int]` instead of `typing.List[int]`).
3. **Python 3.10 (PEP 604):** Introduced the pipe operator `|` for union types (e.g., `int | str` instead of `Union[int, str]`).
4. **Python 3.12 (PEP 695):** Added dedicated `type` statement syntax for type aliases.

---

## 💻 Syntax & Structure

### 1. Variables and Primitives
```python
name: str = "Alice"
age: int = 30
salary: float = 85000.50
is_active: bool = True
```

### 2. Built-in Collections (Python 3.9+)
```python
scores: list[int] = [95, 88, 92]
user_lookup: dict[str, int] = {"admin": 1, "guest": 2}
unique_ids: set[str] = {"usr_01", "usr_02"}
coordinates: tuple[float, float] = (12.5, 45.8)
arbitrary_length_ints: tuple[int, ...] = (1, 2, 3, 4, 5)
```

### 3. Modern Union and Optional Syntax (Python 3.10+)
```python
# Union: Accepts either string or integer
identifier: str | int = 101

# Optional: Accepts a string or None
middle_name: str | None = None
```

### 4. Function Annotations
```python
def process_transaction(
    account_id: str,
    amount: float,
    flags: list[str] | None = None
) -> bool:
    ...
```

---

## 🧪 Code Examples

Below is a complete, executable Python 3.12 script demonstrating practical type hints, custom structural contracts with `TypedDict`, function callbacks with `Callable`, and runtime metadata inspection.

```python
"""
Day 49: Comprehensive Demonstration of Type Hints & Static Type Checking
Target Python Version: 3.12+
"""

from typing import Callable, Literal, TypedDict

# --- 1. Type Aliases (Python 3.12 `type` statement) ---
type UserID = int
type Coordinate = tuple[float, float]
type AccessRole = Literal["viewer", "editor", "admin"]

# --- 2. Structural Typing with TypedDict ---
class UserProfile(TypedDict):
    id: UserID
    username: str
    role: AccessRole
    location: Coordinate
    bio: str | None

# --- 3. Complex Function Signatures ---
def filter_records[T](items: list[T], predicate: Callable[[T], bool]) -> list[T]:
    """Generic filtering function that preserves the item type."""
    return [item for item in items if predicate(item)]

def create_user_profile(
    user_id: UserID,
    username: str,
    role: AccessRole = "viewer",
    coordinates: Coordinate = (0.0, 0.0),
    bio: str | None = None,
) -> UserProfile:
    """Constructs a typed user profile dictionary."""
    return {
        "id": user_id,
        "username": username,
        "role": role,
        "location": coordinates,
        "bio": bio,
    }

def format_user_summary(user: UserProfile) -> str:
    """Formats a user profile for display."""
    bio_text = user["bio"] if user["bio"] is not None else "No bio provided"
    return (
        f"User #{user['id']} ({user['username']}) - Role: {user['role'].upper()}\n"
        f"  Location: {user['location']}\n"
        f"  Bio: {bio_text}"
    )

# --- 4. Main Demonstration Routine ---
def main() -> None:
    print("=== 1. Creating and Inspecting Typed Profiles ===")
    user1 = create_user_profile(
        user_id=101,
        username="dev_alex",
        role="admin",
        coordinates=(37.7749, -122.4194),
        bio="Python backend engineer",
    )
    user2 = create_user_profile(
        user_id=102,
        username="guest_sam",
        role="viewer",
        coordinates=(40.7128, -74.0060),
    )

    print(format_user_summary(user1))
    print("-" * 40)
    print(format_user_summary(user2))

    print("\n=== 2. Generic Higher-Order Functions ===")
    numbers: list[int] = [12, 45, 68, 23, 90, 11]
    even_numbers = filter_records(numbers, lambda x: x % 2 == 0)
    print(f"Original: {numbers}")
    print(f"Filtered (Evens): {even_numbers}")

    users: list[UserProfile] = [user1, user2]
    admins = filter_records(users, lambda u: u["role"] == "admin")
    print(f"Admin Users Count: {len(admins)}")
    print(f"Admin Username: {admins[0]['username']}")

    print("\n=== 3. Inspecting Annotations at Runtime ===")
    # Demonstrating that annotations are stored in the __annotations__ dictionary
    print("create_user_profile annotations:")
    for param, annotation in create_user_profile.__annotations__.items():
        print(f"  - {param}: {annotation}")

if __name__ == "__main__":
    main()
```

---

## 📊 Expected Output

```text
=== 1. Creating and Inspecting Typed Profiles ===
User #101 (dev_alex) - Role: ADMIN
  Location: (37.7749, -122.4194)
  Bio: Python backend engineer
----------------------------------------
User #102 (guest_sam) - Role: VIEWER
  Location: (40.7128, -74.006)
  Bio: No bio provided

=== 2. Generic Higher-Order Functions ===
Original: [12, 45, 68, 23, 90, 11]
Filtered (Evens): [12, 68, 90]
Admin Users Count: 1
Admin Username: dev_alex

=== 3. Inspecting Annotations at Runtime ===
create_user_profile annotations:
  - user_id: UserID
  - username: <class 'str'>
  - role: AccessRole
  - coordinates: Coordinate
  - bio: str | None
  - return: UserProfile
```

---

## 🌍 Real-World Applications

| Area | Application Scenario | Why Type Hints Matter |
| :--- | :--- | :--- |
| **Web Frameworks** | **FastAPI & Pydantic** | Inspect annotations at startup to auto-validate HTTP request bodies and generate OpenAPI/Swagger schemas. |
| **Enterprise Refactoring** | **Monorepo Codebases** | Tools like `mypy` detect signature changes across hundreds of interdependent services during CI/CD builds. |
| **Developer Tooling** | **IDE IntelliSense** | VS Code (Pylance) and PyCharm provide exact autocompletion and highlight incorrect arguments instantly. |
| **Data Pipelines** | **Data Parsing & ETL** | Guarantees downstream processing receives validated columns and predictable nullability structures. |

---

## 💡 Best Practices

- **Use built-in generics:** Prefer `list[str]`, `dict[str, int]`, and `tuple[int, ...]` over the deprecated `typing.List` or `typing.Dict`.
- **Prefer `|` over `Union` and `Optional`:** Write `str | None` instead of `Optional[str]`, and `int | float` instead of `Union[int, float]`.
- **Avoid abusing `Any`:** Using `typing.Any` disables static analysis for that expression, eliminating the benefits of type checking.
- **Differentiate Static vs. Runtime:** Remember that `def add(a: int, b: int) -> int:` does **not** enforce type checks at runtime. Use tools like `mypy` in CI pipelines:
  ```bash
  mypy --strict your_script.py
  ```
- **Annotate public APIs:** Prioritize typing function parameters, return values, and exported module members over every trivial internal local variable.

---

## 📝 Summary & Key Takeaways

- Python utilizes **Gradual Typing**: you can incrementally annotate critical parts of your codebase without breaking existing dynamic code.
- Annotations are completely ignored by the runtime interpreter—they carry no runtime performance penalty.
- Modern Python (3.10+) provides clean syntax like union operators (`A | B`), built-in generic collections, and `TypedDict` for structured dictionary validation.
- Static checkers (`mypy`, `pyright`) analyze annotated code to detect type mismatches, missing `None` checks, and contract violations before your code reaches production.

**Coming Up Next:** In **Day 50**, we will explore **Python Decorators in Depth**, mastering how to dynamically alter and wrap function behavior using functional programming patterns and type-safe wrappers!
