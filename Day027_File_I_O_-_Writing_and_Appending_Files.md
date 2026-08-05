# Day 027: File I/O - Writing and Appending Files

> **Difficulty:** Intermediate | **Topic:** File Handling | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Master Python's file-writing modes: `'w'`, `'a'`, and `'x'`.
- Understand the technical differences between `write()` and `writelines()`.
- Use context managers (`with`) to handle file resources cleanly and prevent memory leaks.
- Avoid critical file-handling bugs such as unintended file truncation and missing newline characters.
- Implement robust exception handling for common file-writing errors.

---

## 📚 Theory & Concepts

Writing data to persistent storage is a fundamental operation in software engineering. While reading files retrieves data from disk to memory (RAM), writing transfers data from memory back to persistent disk storage.

### How Python Writes to Files

When Python opens a file for writing, it interacts with the Operating System (OS) to request a file handle and disk space. Python uses an internal **buffer**—a temporary memory storage area—to optimize disk writes. Instead of writing byte-by-byte to disk (which is hardware-expensive), Python collects data in the buffer and **flushes** it to disk when:
1. The buffer reaches its capacity.
2. The file is explicitly closed via `.close()` or exiting a `with` context block.
3. The `.flush()` method is called manually.

```
       [ RAM Memory ]                     [ Operating System ]             [ Hard Disk ]
+--------------------------+           +----------------------+         +-----------------+
| Data: "Log Entry\n"     |           |  Buffer Memory Area  |         | physical_file.txt|
|  --> file.write(...)    |  =======> |  [ Data... ]         | ======> |                 |
+--------------------------+           +----------------------+         +-----------------+
                                          (Auto-flushed on close)
```

---

### File Modes Comparison

Choosing the correct mode parameter in `open()` dictates how the operating system handles existing files:

| Mode | Name | Description | If File Exists | If File Does Not Exist |
| :--- | :--- | :--- | :--- | :--- |
| **`'w'`** | Write | Opens for writing. | **Truncates (erases)** content! | Creates a new file. |
| **`'a'`** | Append | Opens for appending. Writes at end of file. | Preserves content; appends to end. | Creates a new file. |
| **`'x'`** | Exclusive | Opens for exclusive creation. | **Raises `FileExistsError`**. | Creates a new file. |
| **`'w+'`**| Write & Read| Opens for reading and writing. | **Truncates (erases)** content! | Creates a new file. |
| **`'a+'`**| Append & Read| Opens for reading and appending. | Preserves content; appends to end. | Creates a new file. |

> ⚠️ **Warning:** Using mode `'w'` on an existing file instantly wipes its contents clean *before* you write anything to it. Use `'a'` if you want to preserve existing data or `'x'` if you want to prevent accidental overwrites.

---

## 💻 Syntax & Structure

### 1. Basic File Writing with `write()`

The `write()` method takes a single string parameter and writes it to the file. It returns the number of characters written.

```python
# Writing to a file (Truncates existing content)
with open("output.txt", mode="w", encoding="utf-8") as file:
    chars_written: int = file.write("Hello, World!\n")
    print(f"Written characters: {chars_written}")
```

### 2. Appending to a File

Append mode (`'a'`) places the file cursor at the end of the file. Existing content remains unchanged.

```python
# Appending to an existing file
with open("output.txt", mode="a", encoding="utf-8") as file:
    file.write("Appending a new line.\n")
```

### 3. Writing Multiple Lines with `writelines()`

The `writelines()` method takes an iterable of strings (such as a list) and writes them sequentially. 

```python
lines: list[str] = [
    "First line\n",
    "Second line\n",
    "Third line\n"
]

with open("batch.txt", mode="w", encoding="utf-8") as file:
    file.writelines(lines)
```

> 💡 **Important:** `writelines()` does **not** automatically add newline (`\n`) characters between elements. You must explicitly include `\n` in each string or format them beforehand.

---

## 🧪 Code Examples

The following script demonstrates safe file creation, appending, batch line writing, and handling collision errors using a real-world system logger simulation.

```python
import os
from datetime import datetime
from pathlib import Path

def initialize_log_file(filepath: Path) -> None:
    """Initializes a log file safely using exclusive creation ('x')."""
    try:
        with open(filepath, mode="x", encoding="utf-8") as file:
            header: str = f"=== System Log Initialized at {datetime.now().isoformat()} ===\n"
            file.write(header)
        print(f"[SUCCESS] Created new log file: {filepath}")
    except FileExistsError:
        print(f"[INFO] Log file '{filepath}' already exists. Skipping creation.")

def append_log_entry(filepath: Path, level: str, message: str) -> None:
    """Appends a timestamped log entry to the specified log file."""
    timestamp: str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_line: str = f"[{timestamp}] [{level.upper()}]: {message}\n"
    
    with open(filepath, mode="a", encoding="utf-8") as file:
        file.write(log_line)
    print(f"[LOGGED] Added {level} entry.")

def write_system_metrics(filepath: Path, metrics: list[dict[str, str | float]]) -> None:
    """Writes formatted system metrics using writelines()."""
    formatted_lines: list[str] = []
    
    formatted_lines.append("\n--- System Metrics Snapshot ---\n")
    for metric in metrics:
        line = f"Metric: {metric['name']:<15} | Value: {metric['value']}{metric['unit']}\n"
        formatted_lines.append(line)
        
    with open(filepath, mode="a", encoding="utf-8") as file:
        file.writelines(formatted_lines)
    print("[SUCCESS] Appended metrics batch to file.")

def display_file_contents(filepath: Path) -> None:
    """Reads and prints the current contents of the file."""
    print(f"\n--- Reading File: {filepath} ---")
    if filepath.exists():
        with open(filepath, mode="r", encoding="utf-8") as file:
            print(file.read(), end="")
    else:
        print("File does not exist.")

def main() -> None:
    log_path = Path("application.log")

    # Step 1: Initialize log file safely
    initialize_log_file(log_path)
    
    # Attempting to initialize again demonstrates 'x' mode protection
    initialize_log_file(log_path)

    # Step 2: Append single log entries
    append_log_entry(log_path, "INFO", "Application service started.")
    append_log_entry(log_path, "WARNING", "High memory usage detected (84%).")

    # Step 3: Write multiple lines in batch mode
    metrics_data = [
        {"name": "CPU_Usage", "value": 45.2, "unit": "%"},
        {"name": "RAM_Usage", "value": 6.8, "unit": "GB"},
        {"name": "Disk_Free", "value": 120.5, "unit": "GB"},
    ]
    write_system_metrics(log_path, metrics_data)

    # Step 4: Display output
    display_file_contents(log_path)

    # Clean up file after demonstration
    if log_path.exists():
        os.remove(log_path)
        print(f"\n[CLEANUP] Deleted temporary log file: {log_path}")

if __name__ == "__main__":
    main()
```

---

## 📊 Expected Output

```text
[SUCCESS] Created new log file: application.log
[INFO] Log file 'application.log' already exists. Skipping creation.
[LOGGED] Added INFO entry.
[LOGGED] Added WARNING entry.
[SUCCESS] Appended metrics batch to file.

--- Reading File: application.log ---
=== System Log Initialized at 2026-03-30T10:15:30.123456 ===
[2026-03-30 10:15:30] [INFO]: Application service started.
[2026-03-30 10:15:30] [WARNING]: High memory usage detected (84%).

--- System Metrics Snapshot ---
Metric: CPU_Usage       | Value: 45.2%
Metric: RAM_Usage       | Value: 6.8GB
Metric: Disk_Free       | Value: 120.5GB

[CLEANUP] Deleted temporary log file: application.log
```

---

## 🌍 Real-World Applications

### 1. Application Logging & Auditing
Production software continuously writes event logs to track runtime activity, user actions, security alerts, and errors. Appending (`'a'`) ensures historical data is maintained without being destroyed when the application restarts.

### 2. Exporting Reports & Datasets
Data analysis pipelines generate final outputs in structured text formats like CSV, TSV, or Markdown. Developers use write modes (`'w'` or `'x'`) to construct these output artifacts iteratively or in batch operations.

### 3. Thread-Safe File Initialization (Atomic Lock Signals)
Using exclusive creation mode (`'x'`) allows concurrent scripts or microservices to check and acquire file locks. If two processes attempt to write to `app.lock` simultaneously, one succeeds while the other fails cleanly with a `FileExistsError`, preventing race conditions.

---

## 💡 Best Practices

- **Always specify `encoding="utf-8"`:** Operating systems use different default text encodings (Windows uses `cp1252` by default, whereas Linux/macOS uses `utf-8`). Hardcoding `encoding="utf-8"` guarantees cross-platform consistency.
- **Use Context Managers (`with open(...)`):** Context managers ensure files are closed automatically, even if an uncaught exception is raised inside the block.
- **Explicitly handle line breaks (`\n`):** Remember that `write()` and `writelines()` do not add trailing newlines automatically.
- **Use `'x'` mode to prevent accidental overwrites:** When generating output files that must not overwrite existing data, use `'x'` mode paired with a `try-except FileExistsError` block.
- **Convert non-string types before writing:** The `.write()` method only accepts strings. Always convert numeric or structured data explicitly (`f"{number}"` or `str(number)`).

---

## 📝 Summary & Key Takeaways

1. **`'w'` mode is destructive:** It immediately truncates the file to 0 bytes upon opening.
2. **`'a'` mode is additive:** It positions the cursor at the end of the file and preserves existing data.
3. **`'x'` mode is defensive:** It raises `FileExistsError` if the file already exists, making it ideal for safe file creation.
4. **`writelines()` takes an iterable of strings:** It does not append newlines automatically—you must format each string manually.
5. **Context managers (`with`) are mandatory:** They handle resource closing and flush internal buffers to disk properly.

---

### What's Next?
Tomorrow on **Day 28**, we will explore **Structured File Handling: CSV and JSON Files**, learning how to read, write, and parse real-world structured data formats cleanly using Python's standard library modules!
