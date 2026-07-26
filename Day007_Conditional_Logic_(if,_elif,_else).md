# Day 007: Conditional Logic (if, elif, else)

> **Difficulty:** Beginner | **Topic:** Control Flow | **Reading Time:** 12 mins

---

## 🎯 Learning Objectives
- Master the fundamental control flow mechanisms using `if`, `elif`, and `else` statements.
- Understand Python's boolean evaluation rules, including implicit **Truthiness** and **Falsiness**.
- Combine logical operators (`and`, `or`, `not`) to construct complex boolean decisions.
- Implement concise conditional logic using Python's **Ternary Operator** (Conditional Expressions).
- Apply best practices to write clean, flat, and maintainable decision-making code.

---

## 📚 Theory & Concepts

### What is Control Flow?
By default, Python executes instructions sequentially, line-by-line, from top to bottom. However, real-world software must make decisions dynamically based on changing data or user interactions. 

**Control Flow** refers to the order in which individual statements, instructions, or function calls are executed or evaluated. Conditional logic allows a program to branch down different execution paths depending on whether specified conditions evaluate to `True` or `False`.

```
                      [ Start ]
                          │
                          ▼
                 /─────────────────\
                <  Condition True?  >
                 \─────────────────/
                   /             \
            True  /               \  False
                 ▼                 ▼
          [ Execute Block A ]   [ Execute Block B ]
                 \                 /
                  \               /
                   ▼             ▼
                      [ Continue ]
```

### Truthiness and Falsiness in Python
In Python, conditional statements do not strictly require a explicit boolean value (`True` or `False`). Every Python object has an implicit truth value when evaluated in a boolean context (such as an `if` statement).

#### Falsy Values in Python
The following values are considered **Falsy** (evaluate to `False`):
- Boolean: `False`
- Null Value: `None`
- Zero Numerical Values: `0`, `0.0`, `0j`
- Empty Sequences & Collections: `""` (empty string), `()` (empty tuple), `[]` (empty list), `{}` (empty dict), `set()` (empty set)

#### Truthy Values
Virtually everything else in Python is considered **Truthy** (evaluates to `True`), including non-zero numbers, non-empty strings, and instantiated objects.

---

## 💻 Syntax & Structure

### Basic `if`, `elif`, `else` Structure
Python relies strictly on **indentation** (typically 4 spaces) to define block scope rather than using curly braces `{}` or keywords like `end`.

```python
if primary_condition:
    # Executed if primary_condition is True
    statement_block_1
elif secondary_condition:
    # Executed if primary_condition is False AND secondary_condition is True
    statement_block_2
else:
    # Executed if all preceding conditions are False
    fallback_statement_block
```

### The Ternary Operator (Conditional Expression)
Python provides a compact syntax for assigning values conditionally in a single line:

```python
variable = value_if_true if condition else value_if_false
```

---

## 🧪 Code Examples

Below is a complete, runnable Python script demonstrating conditional statements, truthiness evaluation, compound logical expressions, and ternary assignments.

```python
"""
Day 7: Conditional Logic Mastery
Demonstrates branching execution, truthiness, compound conditions, and ternary logic.
"""

# ==========================================
# 1. Basic Branching Logic (if, elif, else)
# ==========================================
print("--- 1. Age Verification Check ---")

user_age = 20
has_valid_id = True

if user_age >= 21 and has_valid_id:
    print("Access Level: Full access granted (21+ tier).")
elif user_age >= 18 and has_valid_id:
    print("Access Level: Standard access granted (18+ tier).")
else:
    print("Access Level: Access denied.")

# ==========================================
# 2. Pythonic Truthy & Falsy Evaluations
# ==========================================
print("\n--- 2. Checking Collection & String Truthiness ---")

user_profile_name = "alex_dev"
unread_notifications = []  # Empty list -> Falsy

# Non-empty string evaluates to True implicitly
if user_profile_name:
    print(f"Welcome back, {user_profile_name}!")

# Checking empty list using boolean negation (not)
if not unread_notifications:
    print("Notification Status: Inbox is completely clear.")

# ==========================================
# 3. Ternary Operator (Inline Assignment)
# ==========================================
print("\n--- 3. Inline Ternary Assignment ---")

account_type = "premium"
max_allowed_projects = 100 if account_type == "premium" else 5

print(f"Account Type: {account_type.capitalize()}")
print(f"Project Limit: {max_allowed_projects} active projects")

# ==========================================
# 4. Multi-Tier Discount Calculation
# ==========================================
print("\n--- 4. E-Commerce Pricing Engine ---")

cart_total = 150.00
is_vip_member = True

if cart_total >= 200.00 or (cart_total >= 100.00 and is_vip_member):
    discount_percentage = 0.20
elif cart_total >= 100.00:
    discount_percentage = 0.10
else:
    discount_percentage = 0.00

final_price = cart_total * (1 - discount_percentage)

print(f"Cart Total: ${cart_total:.2f}")
print(f"Discount Applied: {discount_percentage * 100:.0f}%")
print(f"Final Payable Amount: ${final_price:.2f}")
```

---

## 📊 Expected Output

```text
--- 1. Age Verification Check ---
Access Level: Standard access granted (18+ tier).

--- 2. Checking Collection & String Truthiness ---
Welcome back, alex_dev!
Notification Status: Inbox is completely clear.

--- 3. Inline Ternary Assignment ---
Account Type: Premium
Project Limit: 100 active projects

--- 4. E-Commerce Pricing Engine ---
Cart Total: $150.00
Discount Applied: 20%
Final Payable Amount: $120.00
```

---

## 🌍 Real-World Applications

1. **Role-Based Access Control (RBAC):** Web frameworks (e.g., Django, FastApi) use conditional logic to restrict access to specific API endpoints based on user permissions (`admin`, `editor`, `subscriber`).
2. **Data Validation Pipeline:** Before writing data to a database, backend systems check if input parameters exist and fit valid criteria using `if not data:` guards.
3. **Dynamic Pricing & Checkout:** E-commerce platforms apply tiered tax rates, bulk discounts, and shipping fees using multi-branch conditional checks based on location and cart metrics.
4. **Feature Toggling:** Software engineering teams dynamically enable or disable experimental features in production based on user segments or configuration settings.

---

## 💡 Best Practices

- **Avoid Deep Nesting (Flat is better than nested):** Deeply nested `if` statements hard to read and maintain. Use early return patterns or combine conditions using logical operators (`and`, `or`).

  ❌ *Poor Approach:*
  ```python
  if user:
      if user.is_active:
          if user.has_permission:
              process_data()
  ```

  ✅ *Pythonic Approach:*
  ```python
  if not (user and user.is_active and user.has_permission):
      return
  process_data()
  ```

- **Utilize Implicit Truthiness:** Do not explicitly compare boolean expressions to `True` or `False`.
  - ❌ `if is_active == True:`
  - ✅ `if is_active:`
  - ❌ `if len(items) > 0:`
  - ✅ `if items:`

- **Avoid Chaining Ternary Operators:** Keep ternary expressions to simple, single-line evaluations. If logic requires multiple `elif` branches, convert it to a standard `if-elif-else` block for readability.

- **Beware of the Assignment Operator Pitfall:** Do not confuse the assignment operator `=` with the equality comparison operator `==`.

---

## 📝 Summary & Key Takeaways

- Conditional branching allows Python programs to make decisions dynamically based on variable states.
- The standard structure uses `if`, optional intermediate `elif` blocks, and an optional fallback `else` clause.
- Python evaluates non-boolean objects as **Truthy** or **Falsy**. Empty sequences (`""`, `[]`, `{}`) and zero values (`0`, `0.0`) evaluate to `False`.
- **Ternary operators** offer a clean method for simple conditional variable assignments: `val = A if condition else B`.

**Preview for Day 8:** Tomorrow, we will move into **Iterative Control Flow**, mastering `while` loops, infinite execution traps, and loop control statements (`break`, `continue`, `else`).
