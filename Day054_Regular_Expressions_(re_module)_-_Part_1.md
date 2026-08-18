# Day 054: Regular Expressions (re module) - Part 1

> **Difficulty:** Intermediate | **Topic:** Text Processing | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Understand what Regular Expressions (regex) are and why they are indispensable for pattern matching and text processing in Python.
- Master the core functions of Python's built-in `re` module (`search`, `match`, `findall`, `finditer`).
- Learn fundamental metacharacters, character classes, and basic anchors to construct reliable pattern matchers.
- Apply compiled regex patterns (`re.compile`) to optimize performance for repetitive search operations.

---

## 📚 Theory & Concepts

Text processing is a core competency of any software engineer. While basic string methods like `.split()`, `.replace()`, `.startswith()`, and `.find()` are sufficient for simple tasks, they break down rapidly when dealing with complex, variable, or unstructured text. 

Enter **Regular Expressions** (commonly shortened to **regex**). A regular expression is a specialized sequence of characters that forms a search pattern. Developed in theoretical computer science, regex acts as a powerful mini-programming language embedded within Python to match strings of text, such as particular characters, words, or patterns of characters.

### Why the `re` Module Matters
In Python, text manipulation with standard string methods requires writing cumbersome nested loops and conditional statements to parse logs, sanitize user input, or scrape data. The `re` module simplifies this into concise, declarative expressions.

```
[Raw Text] ---> [ Regex Engine & Pattern ] ---> [ Match / Extracted Data ]
```

### The Anatomy of a Regex Pattern
A regex pattern consists of a combination of **literals** (exact characters to match, like `cat`) and **metacharacters** (characters with special parsing meanings, like `^`, `$`, `\d`, or `.*`).

| Symbol | Description | Example |
| :--- | :--- | :--- |
| `.` | Matches any character except a newline. | `a.c` matches "abc", "a3c", "a-c" |
| `^` | Matches the start of a string. | `^Hello` matches "Hello world" |
| `$` | Matches the end of a string. | `world$` matches "Hello world" |
| `\d` | Matches any digit (0-9). | `\d\d` matches "42" |
| `\w` | Matches any alphanumeric character plus underscore. | `\w+` matches "Python_3" |
| `\s` | Matches any whitespace character (space, tab, newline). | `a\sb` matches "a b" |

---

## 💻 Syntax & Structure

To use regular expressions in Python, you must first import the built-in module:

```python
import re

# Basic syntax pattern using re.search()
pattern = r"your_pattern_here"
text = "string to search within"

match_object = re.search(pattern, text)
if match_object:
    print("Found:", match_object.group())
```

### Crucial Note: Raw Strings (`r""`)
Always use **raw strings** when defining regular expressions in Python. In a raw string (prefixed with `r`), backslashes (`\`) are treated as literal characters rather than Python escape sequences (like `\n` for newline or `\t` for tab). This prevents conflicts between Python's string escaping and regex syntax.

---

## 🧪 Code Examples

Let's explore a comprehensive, runnable script demonstrating the primary functions of the `re` module: `search`, `match`, `findall`, and compiled patterns.

```python
import re

# Sample text containing structured data (logs/records)
log_data = """
User 402 logged in at 08:30 AM from IP 192.168.1.15.
User 99 logged out at 05:45 PM from IP 10.0.0.4.
Admin user root accessed system at 12:00 PM.
"""

print("--- 1. re.search() Example ---")
# re.search() looks for the FIRST location where the regex pattern produces a match
ip_pattern = r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"
first_ip = re.search(ip_pattern, log_data)

if first_ip:
    print(f"First IP found: {first_ip.group()}")

print("\n--- 2. re.findall() Example ---")
# re.findall() finds ALL occurrences of the pattern and returns them as a list of strings
all_ips = re.findall(ip_pattern, log_data)
print(f"All IPs extracted: {all_ips}")

# Extract all time stamps using a pattern
time_pattern = r"\d{2}:\d{2}\s(?:AM|PM)"
all_times = re.findall(time_pattern, log_data)
print(f"All timestamps extracted: {all_times}")

print("\n--- 3. re.match() Example ---")
# re.match() checks for a match ONLY at the very beginning of the string
sentence_start = "Error: Connection timed out."
match_error = re.match(r"Error", sentence_start)
match_timeout = re.match(r"timeout", sentence_start)

print(f"Matches 'Error' at start: {bool(match_error)}")
print(f"Matches 'timeout' at start: {bool(match_timeout)}")

print("\n--- 4. Compiled Patterns (re.compile) ---")
# For patterns used repeatedly, compile them first for better performance and readability
user_pattern = re.compile(r"User\s+(\d+)")

matches = user_pattern.findall(log_data)
print(f"Extracted User IDs using compiled pattern: {matches}")
```

---

## 📊 Expected Output

When you run the code example above, you will see the following terminal output:

```text
--- 1. re.search() Example ---
First IP found: 192.168.1.15

--- 2. re.findall() Example ---
All IPs extracted: ['192.168.1.15', '10.0.0.4']
All timestamps extracted: ['08:30 AM', '05:45 PM', '12:00 PM']

--- 3. re.match() Example ---
Matches 'Error' at start: True
Matches 'timeout' at start: False

--- 4. Compiled Patterns (re.compile) ---
Extracted User IDs using compiled pattern: ['402', '99']
```

---

## 🌍 Real-World Applications

Regular expressions are a fundamental pillar of data processing and engineering. You will encounter them frequently in scenarios such as:
- **Log Parsing & Monitoring:** Extracting error codes, IP addresses, timestamps, and service statuses from server log files (e.g., Nginx, Apache, or Kubernetes pods).
- **Data Validation:** Verifying structural integrity for user inputs such as email addresses, phone numbers, postal codes, and credit card numbers before database insertion.
- **Web Scraping:** Finding specific HTML patterns, URLs, or embedded tokens within raw web pages or API responses when HTML parsers like BeautifulSoup are too heavy.
- **Text Scrubbing / NLP Preprocessing:** Removing unwanted symbols, markdown tags, or emojis from raw textual datasets prior to training machine learning models.

---

## 💡 Best Practices

- **Always use raw strings:** Prefix your regex patterns with `r` (e.g., `r"\d+"`) to avoid unexpected bugs caused by Python string escape translation.
- **Compile repetitive patterns:** If you execute the same regex search inside a loop or across thousands of records, use `re.compile()` to cache the compiled pattern automaton and speed up execution.
- **Keep expressions readable:** Complex regex strings ("regex rot") become write-only code quickly. Use verbose mode (`re.VERBOSE` or `re.X`) to add inline comments and whitespace to complicated patterns.
- **Common Pitfall to Avoid:** Do not use regular expressions to parse complex, nested structures like HTML or JSON. While tempting, regex cannot handle arbitrary nesting limits reliably; use dedicated parsers like `html.parser`, `BeautifulSoup`, or the `json` module instead.

---

## 📝 Summary & Key Takeaways
Today you took your first step into advanced text processing by exploring Python's `re` module. You learned how to define patterns using metacharacters, extract text using `search`, `match`, and `findall`, and optimize performance using `re.compile`. 

In **Day 55 (Regular Expressions - Part 2)**, we will level up our skills by diving into capture groups, non-capturing groups, lookaheads, lookbehinds, and string substitution using `re.sub()`. Keep practicing your pattern matching!
