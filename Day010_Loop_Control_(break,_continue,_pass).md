# Day 010: Loop Control (break, continue, pass)

> **Difficulty:** Beginner | **Topic:** Control Flow | **Reading Time:** 10 mins

---

## 🎯 Learning Objectives

- **Master the `break` statement** to terminate loop execution immediately based on dynamic runtime conditions.
- **Utilize the `continue` statement** to skip the remainder of the current iteration and jump directly to the next loop cycle.
- **Apply the `pass` statement** as a syntactical placeholder for future logic without altering control flow.
- **Understand Python's `else` clause with loops** and how loop control statements interact with it.

---

## 📚 Theory & Concepts

By default, Python loops (`for` and `while`) iterate predictably across sequential data or until a condition becomes `False`. However, real-world software frequently encounters edge cases—unhandled user input, missing database records, corrupt data files, or critical error flags—that require altering this standard sequential execution.

Python provides three essential loop control keywords: `break`, `continue`, and `pass`.

```
                  +-----------------------+
                  | Start Loop Iteration  |
                  +-----------+-----------+
                              |
                     [ Check Condition ]
                              |
         +--------------------+--------------------+
         |                    |                    |
  [ Hit 'break' ]     [ Hit 'continue' ]    [ Hit 'pass' ]
         |                    |                    |
         v                    v                    v
  Exit Loop Immediately  Skip to Next Iteration  Do Nothing &
  (Jump past loop)      (Re-evaluate loop)       Continue Execution
```

### 1. `break`: The Emergency Exit
The `break` statement completely terminates the innermost execution frame of the current loop. Program control transfers immediately to the first line of code outside the loop block.

### 2. `continue`: The Skip Switch
The `continue` statement stops the execution of the current loop iteration's remaining code block and jumps straight back to the loop header to re-evaluate the condition or retrieve the next sequence item.

### 3. `pass`: The Structural Placeholder
Python relies on indentation to define code blocks. Empty code blocks (like an empty `if` condition or unwritten function body) throw a `IndentationError` or `SyntaxError`. The `pass` statement is a *null operation*; when executed, nothing happens. It acts as a syntactic place-holder for code you intend to write later.

### 4. The Loop `else` Clause
Python uniquely allows an `else` block attached directly to `for` and `while` loops.
- **Rule:** The `else` block executes **only if** the loop completes all iterations naturally (i.e., it was **not** terminated by a `break` statement).

---

## 💻 Syntax & Structure

### The `break` Statement
```python
for item in sequence:
    if condition:
        break  # Immediately exits the loop
```

### The `continue` Statement
```python
while condition:
    # Code before continue runs
    if skip_condition:
        continue  # Skips code below, returns to while condition
    # Code below is skipped when skip_condition is True
```

### The `pass` Statement
```python
for item in sequence:
    if condition:
        pass  # Placeholder: No operation performed, loop continues normally
```

### Loop with `else` Block
```python
for item in sequence:
    if target_found:
        print("Found target!")
        break
else:
    # Runs ONLY if the loop finishes WITHOUT hitting 'break'
    print("Target not found after checking all items.")
```

---

## 🧪 Code Examples

Below is a single, executable script demonstrating `break`, `continue`, `pass`, and the loop `else` pattern using a data processing stream scenario.

```python
"""
Day 10: Loop Control Statements in Python
Demonstrating break, continue, pass, and loop-else constructs.
"""

# Sample dataset representing financial transaction records
# Contains valid numbers, invalid formats, negative values, and sentinel values
transactions = [120.0, -15.0, 0.0, 450.5, "CORRUPTED", 99.0, 2500.0, 300.0]

print("=== 1. Data Cleaning Pipeline (continue & pass) ===")

processed_total = 0.0

for entry in transactions:
    # Scenario A: Using 'pass' for future zero-value auditing logic
    if entry == 0.0:
        pass  # TODO: Log zero-value transactions to audit metrics
        print("  [AUDIT] Zero-value transaction flagged (pass statement executed)")
        continue  # Skip addition to processed total

    # Scenario B: Handle non-numeric corrupted data using 'continue'
    if not isinstance(entry, (int, float)):
        print(f"  [WARN] Invalid data type detected: '{entry}'. Skipping record.")
        continue

    # Scenario C: Handle refunds (negative values) using 'continue'
    if entry < 0:
        print(f"  [SKIP] Negative amount detected (${entry:.2f}). Skipping item.")
        continue

    # Normal Processing Line
    processed_total += entry
    print(f"  [SUCCESS] Processed valid transaction: ${entry:.2f}")

print(f"\nTotal Processed Amount: ${processed_total:.2f}")

print("\n=== 2. High-Value Fraud Monitor (break) ===")

fraud_threshold = 2000.0
clean_batch = [120.0, 450.5, 99.0, 2500.0, 300.0]

for amount in clean_batch:
    if amount > fraud_threshold:
        print(f"  [ALERT] Transaction of ${amount:.2f} exceeds limit (${fraud_threshold:.2f})!")
        print("  [SECURITY] Halting batch execution immediately via 'break'.")
        break
    print(f"  [APPROVED] Transaction cleared: ${amount:.2f}")

print("\n=== 3. Account Lookup System (Loop-else Pattern) ===")

user_database = ["alice_dev", "bob_coder", "charlie_admin", "diana_user"]
search_target = "eve_guest"

# Search for user in database
for username in user_database:
    if username == search_target:
        print(f"  [MATCH] Found target user: {username}")
        break
else:
    # Triggers because loop completed without hitting a break statement
    print(f"  [NOT FOUND] User '{search_target}' does not exist in database.")
```

---

## 📊 Expected Output

```text
=== 1. Data Cleaning Pipeline (continue & pass) ===
  [SUCCESS] Processed valid transaction: $120.00
  [SKIP] Negative amount detected ($-15.00). Skipping item.
  [AUDIT] Zero-value transaction flagged (pass statement executed)
  [SUCCESS] Processed valid transaction: $450.50
  [WARN] Invalid data type detected: 'CORRUPTED'. Skipping record.
  [SUCCESS] Processed valid transaction: $99.00
  [SUCCESS] Processed valid transaction: $2500.00
  [SUCCESS] Processed valid transaction: $300.00

Total Processed Amount: $3469.50

=== 2. High-Value Fraud Monitor (break) ===
  [APPROVED] Transaction cleared: $120.00
  [APPROVED] Transaction cleared: $450.50
  [APPROVED] Transaction cleared: $99.00
  [ALERT] Transaction of $2500.00 exceeds limit ($2000.00)!
  [SECURITY] Halting batch execution immediately via 'break'.

=== 3. Account Lookup System (Loop-else Pattern) ===
  [NOT FOUND] User 'eve_guest' does not exist in database.
```

---

## 🌍 Real-World Applications

1. **Database Querying & Search Optimization:**
   When searching through massive data structures, encountering the desired record means you no longer need to process the remaining million records. Using `break` saves CPU cycles and speeds up search operations dramatically.

2. **ETL & Data Cleaning Pipelines:**
   Real-world data is dirty. During Extraction, Transformation, and Loading (ETL) tasks, invalid values, corrupt logs, or `None` values are filtered out cleanly using `continue` without breaking the program's flow.

3. **API Rate Limiting & Retry Loops:**
   When connecting to network services inside a `while` loop, hitting a successful HTTP 200 OK code triggers a `break` to exit the connection retry loop.

4. **Interface Prototyping (Stubbing):**
   When designing software systems using Top-Down Design, developers write empty class methods, functions, or complex conditional branches filled with `pass` so the code remains valid standard Python syntax while under active construction.

---

## 💡 Best Practices

- **Avoid Overusing `break` and `continue`:** Excessive jumps make control flow difficult to trace (a standard cause of "spaghetti code"). Keep loop conditions clear and concise.
- **Replace Complex Flag Variables with Loop-`else`:** Instead of creating manual flag variables like `found = False`, leverage Python's native `for...else` construct for cleaner code.
- **Do Not Leave Silent `pass` Statements in Production:** Always add a `# TODO:` comment explaining why a `pass` statement exists, or replace it with a `NotImplementedError` or real logging if building production software.

| Keyword | Primary Purpose | Effect on Iteration |
| :--- | :--- | :--- |
| `break` | Terminate loop execution | Instantly terminates the loop |
| `continue` | Skip current iteration step | Aborts current run; moves to next item |
| `pass` | Syntactic placeholder | No effect on execution (Null Operation) |

---

## 📝 Summary & Key Takeaways

Today you mastered control flow modification inside Python loops:
- **`break`** allows for early termination when critical logic requirements or thresholds are met.
- **`continue`** filters out invalid items or unwanted conditions while keeping the loop running.
- **`pass`** avoids syntax errors during early architecture stages by serving as a structural block placeholder.
- **`for...else` / `while...else`** runs fallback code cleanly when a loop executes to completion without encountering a `break`.

**Next Up (Day 11):** *Nested Loops, Scope within Loops, and Algorithmic Complexity Basics.*
