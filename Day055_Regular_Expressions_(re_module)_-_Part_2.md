# Day 055: Regular Expressions (re module) - Part 2

> **Difficulty:** Intermediate | **Topic:** Text Processing | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Master capturing groups, non-capturing groups, and named capturing groups to extract structured data.
- Utilize zero-width assertions (positive/negative lookaheads and lookbehinds) for context-aware pattern matching.
- Perform advanced string transformations using `re.sub()` and `re.subn()` with callback functions.
- Optimize pattern execution using `re.compile()` and leverage compilation flags (`re.IGNORECASE`, `re.MULTILINE`, `re.DOTALL`, `re.VERBOSE`).

---

## 📚 Theory & Concepts

In Day 54, you explored the fundamentals of regular expressions: character sets, anchors, and basic quantifiers. Today, we delve into the advanced mechanics of Python's `re` module that turn regex from a simple search tool into a high-performance parsing and data-transformation engine.

### 1. Grouping Mechanisms
Parentheses `()` in regular expressions serve two primary purposes: defining precedence for operators and creating sub-patterns called **groups**.

- **Capturing Groups `(pattern)`:** Isolates sub-matches that can be extracted independently via `match.group(n)` or referenced in substitutions.
- **Non-Capturing Groups `(?:pattern)`:** Groups tokens together for quantification without allocating memory to store the captured sub-string.
- **Named Groups `(?P<name>pattern)`:** Assigns an explicit key to a captured group, allowing dictionary-like access via `match.group('name')` or `match.groupdict()`.

### 2. Lookaround Assertions (Zero-Width Matches)
Lookarounds match a position in the text based on what comes before or after it, without including those characters in the final match result. Because they do not consume characters in the string, they are called **zero-width assertions**.

```
                        Lookaround Assertions
                                 │
        ┌────────────────────────┴────────────────────────┐
        ▼                                                 ▼
    Lookahead                                         Lookbehind
(Checks text AFTER current position)             (Checks text BEFORE current position)
  ├── Positive: (?=pattern)                        ├── Positive: (?<=pattern)
  └── Negative: (?!pattern)                        └── Negative: (?<!pattern)
```

- **Positive Lookahead `(?=...)`:** Matches if the enclosed pattern matches immediately to the right.
- **Negative Lookahead `(?!...)`:** Matches if the enclosed pattern does **not** match immediately to the right.
- **Positive Lookbehind `(?<=...)`:** Matches if the enclosed pattern matches immediately to the left.
- **Negative Lookbehind `(?<!...)`:** Matches if the enclosed pattern does **not** match immediately to the left.

> **Note on Python Lookbehinds:** Python's built-in `re` module requires lookbehind patterns to have a fixed length. Patterns like `(?<=a|bc)` are valid, but quantifiers with variable length like `(?<=\w+)` will raise an `re.error: look-behind requires fixed-width pattern`.

### 3. Compilation Flags & Regex Compilation
Compiling patterns with `re.compile()` converts a regex string into an internal bytecode object (`re.Pattern`), eliminating recompilation overhead across multiple search iterations. Flags modify the engine's parsing logic:

| Flag | Inline Equivalent | Purpose |
| :--- | :--- | :--- |
| `re.IGNORECASE` / `re.I` | `(?i)` | Case-insensitive matching. |
| `re.MULTILINE` / `re.M` | `(?m)` | `^` and `$` match beginning/end of each line, not just the whole string. |
| `re.DOTALL` / `re.S` | `(?s)` | Makes the `.` special character match any character *including* a newline `\n`. |
| `re.VERBOSE` / `re.X` | `(?x)` | Ignores unescaped whitespace and enables inline comments (`#`) for readability. |

---

## 💻 Syntax & Structure

### Named Capturing and Dictionary Access
```python
import re

pattern = re.compile(r"(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})")
match = pattern.search("Release date: 2026-03-15")

if match:
    year = match.group("year")       # '2026'
    data_dict = match.groupdict()   # {'year': '2026', 'month': '03', 'day': '15'}
```

### Lookarounds
```python
# Match numbers only if preceded by a dollar sign (Positive Lookbehind)
prices = re.findall(r"(?<=\$)\d+(?:\.\d{2})?", "Apples: $3.50, Oranges: 2.00€, Bananas: $12")
# Result: ['3.50', '12']
```

### Functional Replacement with `re.sub()`
```python
def transform_callback(match: re.Match) -> str:
    return match.group(1).upper()

# Replaces lowercase tags with uppercase versions
cleaned = re.sub(r"<(/?[a-z]+)>", transform_callback, "<div><span>hello</span></div>")
```

---

## 🧪 Code Examples

Below is a complete script demonstrating named groups, lookaround assertions, verbose patterns, and transformation via `re.sub()` with callback functions.

```python
"""
Day 55: Advanced Regular Expressions Demonstration
"""

import re
from typing import Dict, Any

def demo_named_groups_log_parser() -> None:
    print("--- 1. Named Groups & Structured Parsing ---")
    log_line = '192.168.1.45 - - [10/Oct/2026:13:55:36 +0000] "GET /api/v1/users HTTP/1.1" 200 4523'

    # Using re.VERBOSE (re.X) for complex patterns
    log_pattern = re.compile(
        r"""
        ^(?P<ip>\d{1,3}(?:\.\d{1,3}){3})     # IPv4 address
        \s-\s-\s                             # Separator
        \[(?P<timestamp>[^\]]+)\]            # Timestamp within brackets
        \s"(?P<method>[A-Z]+)\s              # HTTP Method
        (?P<endpoint>\S+)\s                  # Request URI
        (?P<protocol>[^"]+)"\s               # Protocol
        (?P<status>\d{3})\s                  # Status code
        (?P<bytes_sent>\d+)$                 # Bytes sent
        """,
        re.VERBOSE,
    )

    match = log_pattern.search(log_line)
    if match:
        data: Dict[str, Any] = match.groupdict()
        print(f"IP Address : {data['ip']}")
        print(f"Timestamp  : {data['timestamp']}")
        print(f"Request    : {data['method']} {data['endpoint']}")
        print(f"Status Code: {data['status']}")
        print(f"Payload Size: {data['bytes_sent']} bytes\n")

def demo_lookarounds() -> None:
    print("--- 2. Lookaround Assertions ---")
    text = "User passwords: pass1234, ValidP@ss1, weak, Secure#Pass2026, short1"

    # Password validation rule:
    # Must contain at least one uppercase letter: (?=.*[A-Z])
    # Must contain at least one digit: (?=.*\d)
    # Must contain at least one special character: (?=.*[@#$%^&+=])
    # Must be at least 8 characters long: [A-Za-z\d@#$%^&+=]{8,}
    password_validator = re.compile(
        r"""
        ^
        (?=.*[A-Z])       # Positive lookahead for at least one uppercase
        (?=.*\d)          # Positive lookahead for at least one digit
        (?=.*[@#$%^&+=])  # Positive lookahead for at least one special char
        [A-Za-z\d@#$%^&+=]{8,} # Allowed characters and minimum length
        $
        """,
        re.VERBOSE,
    )

    passwords = [p.strip() for p in text.split(":")[1].split(",")]
    for pwd in passwords:
        is_valid = bool(password_validator.match(pwd))
        status = "VALID" if is_valid else "INVALID"
        print(f"Password '{pwd:<15}' -> {status}")

    print("\nExtracting currency amounts using Lookbehinds:")
    financial_data = "Item A costs $45.00, Item B costs €38.50, Item C costs $120.99."
    # Extract only USD amounts ($ sign is consumed by the lookbehind assertion)
    usd_amounts = re.findall(r"(?<=\$)\d+\.\d{2}", financial_data)
    print(f"USD Values extracted: {usd_amounts}\n")

def demo_dynamic_substitution() -> None:
    print("--- 3. Dynamic Substitutions via Callback Functions ---")
    source_code = "def get_user_by_id(user_id, account_status): return True"

    def snake_to_camel(match: re.Match) -> str:
        # match.group(1) is the character immediately following an underscore
        return match.group(1).upper()

    # Match an underscore followed by a lowercase letter
    camel_case_code, total_replacements = re.subn(
        r"_([a-z])", snake_to_camel, source_code
    )

    print(f"Original Code : {source_code}")
    print(f"CamelCase     : {camel_case_code}")
    print(f"Replacements  : {total_replacements}\n")

def demo_multiline_and_dotall() -> None:
    print("--- 4. Compilation Flags (DOTALL & MULTILINE) ---")
    document = """# Section 1
Content line 1
Content line 2

# Section 2
Content line 3"""

    # MULTILINE: ^ matches at the start of each line
    headers = re.findall(r"^#\s+(.+)$", document, re.MULTILINE)
    print(f"Headers found (re.MULTILINE): {headers}")

    html_payload = "<div>\n<p>Day 55: Advanced Regex</p>\n</div>"
    # DOTALL: . matches newlines as well
    inner_content = re.search(r"<div>(.*)</div>", html_payload, re.DOTALL)
    if inner_content:
        cleaned_body = inner_content.group(1).strip()
        print(f"Extracted block (re.DOTALL):\n{cleaned_body}")

if __name__ == "__main__":
    demo_named_groups_log_parser()
    demo_lookarounds()
    demo_dynamic_substitution()
    demo_multiline_and_dotall()
```

---

## 📊 Expected Output

```text
--- 1. Named Groups & Structured Parsing ---
IP Address : 192.168.1.45
Timestamp  : 10/Oct/2026:13:55:36 +0000
Request    : GET /api/v1/users
Status Code: 200
Payload Size: 4523 bytes

--- 2. Lookaround Assertions ---
Password 'pass1234       ' -> INVALID
Password 'ValidP@ss1     ' -> VALID
Password 'weak           ' -> INVALID
Password 'Secure#Pass2026' -> VALID
Password 'short1         ' -> INVALID

Extracting currency amounts using Lookbehinds:
USD Values extracted: ['45.00', '120.99']

--- 3. Dynamic Substitutions via Callback Functions ---
Original Code : def get_user_by_id(user_id, account_status): return True
CamelCase     : def getUserById(userId, accountStatus): return True
Replacements  : 4

--- 4. Compilation Flags (DOTALL & MULTILINE) ---
Headers found (re.MULTILINE): ['Section 1', 'Section 2']
Extracted block (re.DOTALL):
<p>Day 55: Advanced Regex</p>
```

---

## 🌍 Real-World Applications

1. **High-Throughput Log Processing (ETL Pipelines):**  
   Web servers (Nginx, Apache) produce massive streams of text logs. Pre-compiled patterns using `re.VERBOSE` and named capture groups parse unstructured strings into structured database records or analytics streams (like Elasticsearch or Datadog).

2. **Data Sanitization and PII Redaction:**  
   Security compliance (GDPR, HIPAA, PCI-DSS) requires scrubbing personally identifiable information (PII). Using `re.sub()` with lookarounds allows masking credit card or social security numbers while preserving last digits (e.g., converting `1234-5678-9012-3456` to `****-****-****-3456`).

3. **Complex Input Validation & Password Policies:**  
   Lookaheads allow verifying multiple distinct criteria on the same string in a single scan without having to write separate conditional loops.

4. **Lexical Analyzers and Tokenizers:**  
   Compilers and template engines (like Jinja) tokenize source code into keywords, literals, and operators using compiled named-group regex patterns.

---

## 💡 Best Practices

- **Use `re.VERBOSE` for Long Patterns:** Break complex expressions across multiple lines with comments. Self-documenting regex dramatically lowers maintenance overhead.
- **Prefer Non-Capturing Groups `(?:...)`:** If you do not need the extracted content of a group, make it non-capturing. It optimizes memory consumption and avoids cluttering match indices.
- **Pre-compile Hot Paths with `re.compile()`:** When executing a regular expression within a loop or high-frequency function, compile it once at module load time.
- **Beware of Catastrophic Backtracking:** Avoid nesting indefinite quantifiers like `(a+)+` or `(.*a)+`. When fed non-matching strings, the regex engine evaluates an exponential number of permutations, hanging your Python process.
- **Always Use Raw Strings `r"..."`:** Raw strings prevent Python's string parser from interpreting backslashes before the regex engine receives them, preventing subtle bugs with escape sequences (e.g., `\b` as word boundary vs backspace).

---

## 📝 Summary & Key Takeaways

- **Named Groups (`(?P<name>...)`)** improve code readability by producing clean dictionaries through `.groupdict()`.
- **Lookarounds (`(?=...)`, `(?!...)`, `(?<=...)`, `(?<!...)`)** match context without consuming characters, enabling powerful zero-width validations.
- **`re.sub()` with a callable** allows arbitrary Python code execution during pattern-matching substitutions.
- **Compilation Flags (`re.X`, `re.S`, `re.M`, `re.I`)** give fine-grained control over pattern evaluation rules.

**Tomorrow (Day 56):** We transition from unstructured text processing to **File Handling and Path Manipulation with `pathlib`**, mastering modern filesystem operations in Python.
