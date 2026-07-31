# Day 017: User-Defined Functions

> **Difficulty:** Beginner | **Topic:** Functions | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives

- **Understand the DRY Principle:** Learn why functions are essential for writing modular, readable, and maintainable code by avoiding repetition.
- **Define and Call Functions:** Master the `def` keyword, proper naming conventions, and the mechanics of invoking a user-defined function.
- **Manage Data Flow:** Learn how to pass data into functions using parameters and send results back using the `return` statement.
- **Distinguish Output Mechanics:** Clearly differentiate between displaying values using `print()` and returning values to caller code using `return`.

---

## 📚 Theory & Concepts

### What is a User-Defined Function?

In Python, a **function** is a named, reusable block of code designed to perform a specific, single task. While Python comes with many built-in functions like `len()`, `print()`, and `sum()`, **user-defined functions** are custom functions created by developers to solve domain-specific problems.

### The DRY Principle (Don't Repeat Yourself)

Before functions exist in a codebase, developers often find themselves copying and pasting identical or near-identical blocks of code. This practice violates the **DRY (Don't Repeat Yourself)** software design principle. 

Duplicate code leads to:
- Higher risk of bugs (fixing a bug in one place requires remembering to fix it everywhere).
- Bloated, hard-to-read scripts.
- Difficult maintenance and testing.

Functions allow you to isolate a task once and re-use it across your program.

```
Without Functions (WET - Write Everything Twice):
[ Code Block A ] ---> [ Code Block A ] ---> [ Code Block A ]

With Functions (DRY - Don't Repeat Yourself):
[ Function A ] <--- Called from Location 1
               <--- Called from Location 2
               <--- Called from Location 3
```

### Execution Control Flow

When Python encounters a function definition (`def`), it compiles the code inside the function but **does not execute it immediately**. Execution occurs only when the function is explicitly **called** (invoked).

```
   Main Program Flow                    Function Scope
+-----------------------+           +--------------------+
| 1. Define function    | --------> | (Code registered)  |
| 2. Execute Line A     |           +--------------------+
| 3. Call function()    | --------> | 4. Execute Step 1  |
|                       |           | 5. Execute Step 2  |
| 7. Receive Result     | <-------- | 6. Return Value    |
| 8. Execute Line B     |           +--------------------+
+-----------------------+
```

### `print()` vs. `return`: The Critical Difference

A common point of confusion for beginners is the difference between printing a value and returning a value:

| Feature | `print()` | `return` |
| :--- | :--- | :--- |
| **Purpose** | Displays text to the terminal for human viewing. | Passes data back to the calling code for further computation. |
| **Data Retention** | Value is lost after display; evaluates to `None`. | Value can be stored in a variable, passed to another function, or used in math expressions. |
| **Program Flow** | Does not exit the function. | Immediately exits the function and passes execution back to caller. |

---

## 💻 Syntax & Structure

### Function Anatomy

To define a user-defined function, use the `def` keyword followed by the function name, parentheses `()`, and a colon `:`. The code block inside must be indented (typically 4 spaces).

```python
def function_name(parameter_1: type, parameter_2: type) -> return_type:
    """Docstring: Optional brief description of what the function does."""
    # Function body (statements)
    result = parameter_1 + parameter_2
    return result  # Optional return statement
```

### Key Elements Breakdown

1. **`def` Keyword:** Informs Python that a function definition is starting.
2. **Function Name:** Follows `snake_case` naming conventions (e.g., `calculate_tax`). Must be a descriptive verb or verb phrase.
3. **Parameters:** Variables declared inside the function header that act as placeholders for incoming values (arguments).
4. **Docstring:** A multi-line string immediately following the function header, used to document the function's purpose.
5. **Function Body:** Indented statements executed whenever the function is called.
6. **`return` Statement:** Terminates execution of the function and optionally passes back a value to the caller. If omitted, the function implicitly returns `None`.

---

## 🧪 Code Examples

Below is a complete, executable Python program demonstrating user-defined functions: basic calls, parameterized functions, functions returning values, and multi-value returns.

```python
# ==========================================
# Day 17: User-Defined Functions Demonstration
# ==========================================

# 1. Basic Function without Parameters or Return Value
def display_welcome_banner() -> None:
    """Prints a standard application header to the console."""
    print("=" * 40)
    print("      PYTHON MASTERY COURSE: DAY 17      ")
    print("=" * 40)

# 2. Function with Parameters and a Single Return Value
def calculate_rectangle_area(width: float, height: float) -> float:
    """Calculates and returns the area of a rectangle given width and height."""
    area = width * height
    return area

# 3. Function with Logic and Early Return
def check_pass_status(score: int) -> str:
    """Determines student academic standing based on test score."""
    if score >= 70:
        return "Pass with Distinction"
    elif score >= 50:
        return "Pass"
    else:
        return "Needs Improvement"

# 4. Function Returning Multiple Values (Tuple Unpacking)
def calculate_statistics(numbers: list[float]) -> tuple[float, float, float]:
    """Calculates minimum, maximum, and average from a list of numbers."""
    total_sum = sum(numbers)
    count = len(numbers)
    
    minimum = min(numbers)
    maximum = max(numbers)
    average = total_sum / count
    
    return minimum, maximum, average

# ==========================================
# Main Program Execution
# ==========================================
if __name__ == "__main__":
    # Call Basic Function
    display_welcome_banner()
    print()

    # Call Function with Parameters and capture Return Value
    rect_width = 8.5
    rect_height = 4.0
    calculated_area = calculate_rectangle_area(rect_width, rect_height)
    print(f"Rectangle Dimensions: {rect_width} x {rect_height}")
    print(f"Calculated Area: {calculated_area} sq units\n")

    # Call Function with Conditional Returns
    student_scores = [85, 62, 42]
    print("--- Grade Evaluation ---")
    for score in student_scores:
        status = check_pass_status(score)
        print(f"Score: {score} -> Result: {status}")
    print()

    # Call Function with Multiple Returned Values
    dataset = [12.5, 45.0, 78.2, 23.4, 99.1, 5.8]
    min_val, max_val, avg_val = calculate_statistics(dataset)
    
    print("--- Dataset Analysis ---")
    print(f"Dataset: {dataset}")
    print(f"Minimum Value : {min_val}")
    print(f"Maximum Value : {max_val}")
    print(f"Average Value : {avg_val:.2f}")
```

---

## 📊 Expected Output

```text
========================================
      PYTHON MASTERY COURSE: DAY 17      
========================================

Rectangle Dimensions: 8.5 x 4.0
Calculated Area: 34.0 sq units

--- Grade Evaluation ---
Score: 85 -> Result: Pass with Distinction
Score: 62 -> Result: Pass
Score: 42 -> Result: Needs Improvement

--- Dataset Analysis ---
Dataset: [12.5, 45.0, 78.2, 23.4, 99.1, 5.8]
Minimum Value : 5.8
Maximum Value : 99.1
Average Value : 44.00
```

---

## 🌍 Real-World Applications

User-defined functions are the primary building blocks of modern software systems. Here are common scenarios where they are heavily used:

1. **Data Preprocessing Pipelines (Data Science & AI):**
   Functions encapsulate data transformation operations (e.g., stripping whitespace, converting timestamps, removing invalid records) so raw data can be cleaned predictably before model training.

2. **Web Backend API Handlers (Web Development):**
   Frameworks like Flask or FastAPI map incoming web requests to specific user-defined functions. A function reads payload data, interacts with a database, and returns a structured JSON response.

3. **Financial Computation Modules (Enterprise Software):**
   Functions contain strict business logic rules, such as calculating compound interest, applying currency exchange rates, or evaluating user credit scores. Wrapping logic in functions ensures consistency across thousands of transactions.

---

## 💡 Best Practices

### Recommended Guidelines
- **Single Responsibility Principle (SRP):** Design every function to perform **one single task** and perform it well. If a function is doing multiple unrelated things, break it up into smaller helper functions.
- **Use Clear `snake_case` Names:** Name functions using action verbs that describe what the function does (e.g., `parse_user_input`, `send_email_notification`).
- **Include Docstrings:** Write docstrings for non-trivial functions explaining their purpose, arguments, and expected return output.
- **Leverage Type Hints:** Use Python 3.12+ type hints (`def add(a: int, b: int) -> int:`) to improve code clarity and assist IDE auto-completion.

### Common Pitfalls to Avoid
- **Confusing `print()` and `return`:**
  ```python
  # BAD: Returns None, printing directly prevents caller from using result
  def add_bad(a, b):
      print(a + b)

  # GOOD: Returns result value to caller
  def add_good(a, b):
      return a + b
  ```
- **Forgetting Parentheses During Call:** Writing `func_name` refers to the function object itself, whereas `func_name()` actually executes the function.
- **Unintended Execution Side Effects:** Avoid modifying global variables inside functions whenever possible. Pass data explicitly via arguments and return results.

---

## 📝 Summary & Key Takeaways

Today you learned how user-defined functions transform repetitive scripts into modular, maintainable software.

- **Functions** are defined using `def function_name(parameters):` and called using `function_name(arguments)`.
- **Parameters** act as placeholders inside the function, receiving actual **arguments** when called.
- The **`return`** keyword yields data back to the caller and terminates function execution immediately.
- Functions default to returning **`None`** if no explicit `return` statement is defined.

### 🔮 Tomorrow's Preview
On **Day 18**, we will expand on user-defined functions by exploring **Function Arguments & Scope**: positional vs. keyword arguments, default parameter values, variable-length arguments (`*args`, `**kwargs`), and local vs. global variable scope!
