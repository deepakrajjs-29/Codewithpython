# Day 061: Concurrency - Multithreading (threading)

> **Difficulty:** Advanced | **Topic:** Concurrency | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Differentiate between concurrency and parallelism, understanding how the Global Interpreter Lock (GIL) affects CPython threads.
- Create, manage, and coordinate threads using Python's standard `threading` module.
- Identify race conditions and prevent shared-state corruption using synchronization primitives (`Lock`, `RLock`).
- Implement robust, thread-safe task pipelines using `concurrent.futures.ThreadPoolExecutor`.

---

## 📚 Theory & Concepts

### 1. Concurrency vs. Parallelism
- **Concurrency** is about **dealing with** lots of things at once (structure). It allows multiple tasks to make progress by interleaving execution on a single core or across multiple cores.
- **Parallelism** is about **doing** lots of things at once (execution). It requires multiple CPU cores executing separate tasks simultaneously.

```text
Concurrency (Single Core - Time Slicing / Context Switching):
Core 0: [ Task A ][ Task B ][ Task A ][ Task C ][ Task B ] ---> Time

Parallelism (Multi-Core):
Core 0: [ ===== Task A ===== ] ---> Time
Core 1: [ ===== Task B ===== ] ---> Time
```

### 2. Python Threads and the Global Interpreter Lock (GIL)
In CPython (the standard Python implementation), memory management is not entirely thread-safe. To prevent race conditions inside internal memory structures, CPython uses the **Global Interpreter Lock (GIL)**—a mutual exclusion lock that ensures **only one native thread executes Python bytecode at any given instant**.

| Task Type | Bottleneck | GIL Impact | Recommended Tool |
|---|---|---|---|
| **I/O-Bound** (Network requests, file I/O, database queries) | Waiting on external devices | Minimal impact. Threads release the GIL while waiting on OS-level I/O. | `threading` / `asyncio` |
| **CPU-Bound** (Image processing, machine learning, cryptography) | Pure CPU calculation | High penalty. Multiple threads fight over the GIL on a single core. | `multiprocessing` |

### 3. Thread Synchronization & Race Conditions
When multiple threads read and write shared data concurrently without synchronization, operations can interleave unpredictably, resulting in a **race condition**.

To maintain data integrity, synchronization primitives are used:
- **`threading.Lock`**: A standard mutual exclusion lock. Once acquired by one thread, other threads attempting to acquire it will block until it is released.
- **`threading.RLock`** (Reentrant Lock): Can be acquired multiple times by the *same* thread without deadlocking itself.
- **`threading.Semaphore`**: Maintains an internal counter allowing a fixed number of threads concurrent access to a resource.

---

## 💻 Syntax & Structure

### Basic Thread Lifecycle

```python
import threading
import time

def worker(task_name: str, duration: int) -> None:
    """Target function executed by a worker thread."""
    print(f"[{task_name}] Starting...")
    time.sleep(duration)  # Simulates I/O operation (releases GIL)
    print(f"[{task_name}] Completed.")

# 1. Instantiate the Thread object
thread = threading.Thread(
    target=worker,
    args=("DownloadWorker", 2),
    name="Worker-1",
    daemon=False  # If True, thread exits abruptly when main thread terminates
)

# 2. Start thread execution (invokes target in a new OS thread)
thread.start()

# 3. Wait for thread to complete before proceeding
thread.join()
```

### Locking Mechanism Syntax

```python
import threading

balance_lock = threading.Lock()
shared_balance = 100

def withdraw(amount: int) -> None:
    global shared_balance
    # Context manager automatically handles acquire() and release()
    with balance_lock:
        if shared_balance >= amount:
            shared_balance -= amount
```

---

## 🧪 Code Examples

The following script demonstrates three core multithreading concepts:
1. **Thread Creation and Joining** (Simulating concurrent network requests).
2. **Race Condition Prevention** using `threading.Lock`.
3. **Thread Pool Management** using `concurrent.futures.ThreadPoolExecutor`.

```python
import concurrent.futures
import threading
import time
from typing import List

# ==========================================
# 1. Race Condition vs Thread-Safe Counter
# ==========================================

class BankAccount:
    """Thread-safe bank account implementation."""
    def __init__(self, initial_balance: int = 0) -> None:
        self.balance = initial_balance
        self._lock = threading.Lock()

    def deposit(self, amount: int) -> None:
        """Atomically deposit funds using a lock."""
        with self._lock:
            current = self.balance
            time.sleep(0.0001)  # Force OS context switch to simulate race condition
            self.balance = current + amount

# ==========================================
# 2. Worker Simulation (I/O Bound)
# ==========================================

def fetch_resource(resource_id: int) -> str:
    """Simulates fetching data over a high-latency network connection."""
    thread_name = threading.current_thread().name
    print(f"[{thread_name}] Fetching resource #{resource_id}...")
    time.sleep(0.5)  # Simulated network latency
    return f"Resource #{resource_id} payload (Thread: {thread_name})"

# ==========================================
# Main Execution Pipeline
# ==========================================

def main() -> None:
    print("=== Part 1: Thread-Safe Shared State ===")
    account = BankAccount(initial_balance=0)
    threads: List[threading.Thread] = []

    # Spawn 10 concurrent threads depositing into the same account
    for i in range(10):
        t = threading.Thread(target=account.deposit, args=(10,), name=f"Depositor-{i+1}")
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    print(f"Final Balance: ${account.balance} (Expected: $100)\n")

    print("=== Part 2: ThreadPoolExecutor Task Processing ===")
    resource_ids = [101, 102, 103, 104]
    
    # ThreadPoolExecutor manages thread allocation, reuse, and result retrieval
    with concurrent.futures.ThreadPoolExecutor(max_workers=2, thread_name_prefix="PoolWorker") as executor:
        # submit() schedules callables and returns Future objects
        future_to_id = {executor.submit(fetch_resource, res_id): res_id for res_id in resource_ids}
        
        for future in concurrent.futures.as_completed(future_to_id):
            res_id = future_to_id[future]
            try:
                result = future.result()
                print(f"Result received: {result}")
            except Exception as exc:
                print(f"Resource #{res_id} generated an exception: {exc}")

if __name__ == "__main__":
    main()
```

---

## 📊 Expected Output

```text
=== Part 1: Thread-Safe Shared State ===
Final Balance: $100 (Expected: $100)

=== Part 2: ThreadPoolExecutor Task Processing ===
[PoolWorker_0] Fetching resource #101...
[PoolWorker_1] Fetching resource #102...
[PoolWorker_0] Fetching resource #103...
Result received: Resource #101 payload (Thread: PoolWorker_0)
[PoolWorker_1] Fetching resource #104...
Result received: Resource #102 payload (Thread: PoolWorker_1)
Result received: Resource #103 payload (Thread: PoolWorker_0)
Result received: Resource #104 payload (Thread: PoolWorker_1)
```

*(Note: The exact order of task completion in Part 2 may vary slightly depending on OS thread scheduling).*

---

## 🌍 Real-World Applications

1. **Web Scraping & API Aggregators**: Fetching hundreds of REST endpoints or HTML pages concurrently. Threads spend over 95% of their lifecycle waiting on HTTP network sockets, allowing high concurrency despite the GIL.
2. **Desktop GUI Applications (Tkinter, PyQt)**: Long-running background operations (e.g., file export, database synchronization) run in dedicated worker threads to prevent the main UI thread from freezing.
3. **Log Aggregation & Streaming I/O**: Asynchronously reading system metrics, tailing local log files, and streaming batches to centralized storage (e.g., Elasticsearch, AWS CloudWatch).
4. **Microservice Middleware**: Handling multi-client socket communication where each incoming network connection can be processed in an isolated thread worker.

---

## 💡 Best Practices

- **Use Context Managers for Locks**: Always use `with lock:` instead of manual `lock.acquire()` and `lock.release()`. If an exception occurs inside a manual block before `release()`, the lock stays acquired permanently, causing a **deadlock**.
- **Prefer `ThreadPoolExecutor` Over Raw `Thread` Objects**: `concurrent.futures.ThreadPoolExecutor` provides automatic worker reuse, task queues, exception propagation, and structured concurrency.
- **Do Not Use Threads for CPU-Bound Work**: For heavy mathematical calculations, data transformation, or cryptography, use `multiprocessing` or native C-extensions (like NumPy) that explicitly release the GIL.
- **Keep Daemon Threads Read-Only**: Daemon threads are terminated abruptly when non-daemon threads finish. Avoid performing file writes or database transactions inside daemon threads, as buffers may not flush correctly.

---

## 📝 Summary & Key Takeaways

- Multithreading in CPython is best suited for **I/O-bound operations** because the **GIL** restricts bytecode execution to a single core at any time.
- Use `threading.Thread` for fine-grained thread control and `concurrent.futures.ThreadPoolExecutor` for structured worker pools.
- Mutable shared state accessed across threads **must** be synchronized using `threading.Lock` to eliminate race conditions.
- Always join non-daemon threads or manage execution within context managers to guarantee clean program termination.

**Next Up (Day 62):** We will tackle **CPU-Bound Concurrency** using Python's `multiprocessing` module to bypass the GIL and leverage multiple physical CPU cores.
