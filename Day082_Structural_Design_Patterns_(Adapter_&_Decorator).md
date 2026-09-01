# Day 082: Structural Design Patterns (Adapter & Decorator)

> **Difficulty:** Advanced | **Topic:** Design Patterns | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Understand the intent and mechanics of Structural Design Patterns in Python.
- Master the **Adapter Pattern** to bridge incompatible interfaces and legacy systems.
- Master the **Decorator Pattern** to dynamically attach new behaviors to objects without altering their underlying code.
- Implement both patterns using clean Python 3.12 syntax, type hinting, and object-oriented principles.
- Recognize real-world software engineering scenarios where these patterns prevent tight coupling and architectural rigidity.

---

## 📚 Theory & Concepts

Structural design patterns deal with object composition. They help ensure that if one part of a system changes, the entire structure doesn't need to change with it. They explain how to assemble objects and classes into larger structures while keeping these structures flexible and efficient.

### 1. The Adapter Pattern
The **Adapter Pattern** acts as a bridge between two incompatible interfaces. It allows objects with incompatible interfaces to collaborate. Imagine you have a legacy system that returns data in XML format, but your modern application architecture expects JSON. Instead of rewriting the legacy codebase (which may be risky or impossible), you write an **Adapter** class that wraps the legacy object and translates its output into the format your application understands.

```mermaid
Client ---> Target Interface <--- Adapter ---> Adaptee (Legacy System)
```

### 2. The Decorator Pattern
The **Decorator Pattern** allows behavior to be added to an individual object, dynamically, without affecting the behavior of other objects from the same class. It is more flexible than static inheritance because the modification occurs at runtime. In Python, decorators can be implemented using classes (implementing the interface of the object they decorate) or via functions wrapping other functions. Here, we focus on the classic structural object-oriented decorator pattern.

```mermaid
Component <--- Decorator <--- ConcreteDecorator
    ^
    |
ConcreteComponent
```

---

## 💻 Syntax & Structure

### Adapter Syntax Structure
The adapter typically implements the target interface expected by the client, holding an internal reference to the adaptee.

```python
from typing import Protocol

class ModernInterface(Protocol):
    def request_data(self) -> dict:
        ...

class LegacySystem:
    def specific_request(self) -> str:
        return "<data>value</data>"

class Adapter(ModernInterface):
    def __init__(self, legacy_system: LegacySystem):
        self.legacy_system = legacy_system

    def request_data(self) -> dict:
        legacy_data = self.legacy_system.specific_request()
        # Translate XML-like string to a dictionary
        return {"data": legacy_data.replace("<data>", "").replace("</data>", "")}
```

### Decorator Syntax Structure
The decorator implements the same interface as the core component and forwards requests to it while adding pre-processing or post-processing behavior.

```python
from abc import ABC, abstractmethod

class Notifier(ABC):
    @abstractmethod
    def send(self, message: str) -> None:
        pass

class EmailNotifier(Notifier):
    def send(self, message: str) -> None:
        print(f"Sending Email: {message}")

class NotifierDecorator(Notifier):
    def __init__(self, wrappee: Notifier):
        self._wrappee = wrappee

    def send(self, message: str) -> None:
        self._wrappee.send(message)

class SMSDecorator(NotifierDecorator):
    def send(self, message: str) -> None:
        super().send(message)
        print(f"Sending SMS backup: {message}")
```

---

## 🧪 Code Examples

Below is a comprehensive, production-grade Python script demonstrating both the **Adapter** and **Decorator** patterns working harmoniously.

```python
from abc import ABC, abstractmethod
import json

# ==========================================
# PART 1: The Adapter Pattern Implementation
# ==========================================

class AnalyticsTarget(ABC):
    """The modern interface expected by our analytics engine."""
    @abstractmethod
    def fetch_metrics(self) -> dict[str, float]:
        pass

class LegacyXMLAnalytics:
    """A legacy service that outputs metrics strictly as XML strings."""
    def get_xml_data(self) -> str:
        # Simulating legacy XML output
        return "<metrics><cpu_usage>85.5</cpu_usage><memory_usage>64.2</memory_usage></metrics>"

class XMLToJSONAdapter(AnalyticsTarget):
    """
    Adapter class that bridges LegacyXMLAnalytics to the AnalyticsTarget interface.
    """
    def __init__(self, legacy_service: LegacyXMLAnalytics) -> None:
        self._legacy_service = legacy_service

    def fetch_metrics(self) -> dict[str, float]:
        xml_string = self._legacy_service.get_xml_data()
        
        # Simple string parsing simulation for demonstration
        cpu = float(xml_string.split("<cpu_usage>")[1].split("</cpu_usage>")[0])
        memory = float(xml_string.split("<memory_usage>")[1].split("</memory_usage>")[0])
        
        # Return structured dictionary expected by modern app
        return {
            "cpu": cpu,
            "memory": memory
        }

# ==========================================
# PART 2: The Decorator Pattern Implementation
# ==========================================

class ReportGenerator(ABC):
    """Component interface for generating status reports."""
    @abstractmethod
    def generate(self) -> str:
        pass

class StandardReport(ReportGenerator):
    """Concrete component providing core reporting functionality."""
    def __init__(self, data: dict[str, float]) -> None:
        self.data = data

    def generate(self) -> str:
        return f"System Metrics Report -> CPU: {self.data['cpu']}% | Memory: {self.data['memory']}%"

class ReportDecorator(ReportGenerator):
    """Base decorator maintaining a reference to a ReportGenerator object."""
    def __init__(self, report: ReportGenerator) -> None:
        self._report = report

    @abstractmethod
    def generate(self) -> str:
        return self._report.generate()

class TimestampDecorator(ReportDecorator):
    """Concrete decorator that appends a UTC timestamp to the report."""
    def generate(self) -> str:
        base_report = self._report.generate()
        timestamp = "2023-10-27 12:00:00 UTC"  # Simulated timestamp
        return f"[{timestamp}] {base_report}"

class EncryptionDecorator(ReportDecorator):
    """Concrete decorator that simulates encrypting the final report string."""
    def generate(self) -> str:
        base_report = self._report.generate()
        # Simulated encryption (reversing string for demonstration)
        encrypted = base_report[::-1]
        return f"ENCRYPTED_PAYLOAD::{encrypted}"

# ==========================================
# EXECUTION / DEMONSTRATION
# ==========================================

if __name__ == "__main__":
    print("--- 1. Adapter Pattern Demo ---")
    legacy_service = LegacyXMLAnalytics()
    # Wrap legacy service with adapter to meet modern requirements
    adapted_analytics: AnalyticsTarget = XMLToJSONAdapter(legacy_service)
    
    metrics = adapted_analytics.fetch_metrics()
    print(f"Modern Analytics Engine consumed data: {metrics}")

    print("\n--- 2. Decorator Pattern Demo ---")
    # Step A: Create base report using adapted metrics
    core_report = StandardReport(metrics)
    print(f"Base Report:\n{core_report.generate()}")

    # Step B: Decorate report with a timestamp
    timed_report = TimestampDecorator(core_report)
    print(f"\nTimed Report:\n{timed_report.generate()}")

    # Step C: Decorate further with encryption (Stacking decorators)
    secure_timed_report = EncryptionDecorator(timed_report)
    print(f"\nSecure & Timed Report:\n{secure_timed_report.generate()}")
```

---

## 📊 Expected Output

```text
--- 1. Adapter Pattern Demo ---
Modern Analytics Engine consumed data: {'cpu': 85.5, 'memory': 64.2}

--- 2. Decorator Pattern Demo ---
Base Report:
System Metrics Report -> CPU: 85.5% | Memory: 64.2%

Timed Report:
[2023-10-27 12:00:00 UTC] System Metrics Report -> CPU: 85.5% | Memory: 64.2%

Secure & Timed Report:
ENCRYPTED_PAYLOAD::%2.46 :yromeM | %5.58 :UPC -> troper metsyS ]CTU 00:00:21 72-01-3202[
```

---

## 🌍 Real-World Applications

- **Adapter Pattern in Web Frameworks & ORMs:** Used extensively when integrating third-party payment gateways (Stripe, PayPal) where each gateway has a completely different SDK method signature, but your e-commerce platform expects a unified `PaymentProcessor` interface.
- **Adapter Pattern in Logging:** Wrapping legacy logging libraries or standard output streams to conform to a centralized application logging interface.
- **Decorator Pattern in Middleware:** Python web frameworks like FastAPI and Django use decorator-like patterns (and function decorators) to add authentication checks, logging, compression, and caching to HTTP endpoints dynamically.
- **Decorator Pattern in GUI Toolkits:** Adding scrolling, borders, or drop shadows dynamically to graphical UI components without subclassing explosion.

---

## 💡 Best Practices

- **Favor Composition Over Inheritance:** Both adapter and decorator patterns rely heavily on object composition rather than deep subclass hierarchies, preventing class explosion.
- **Keep Interfaces Clean:** Ensure target interfaces (in Adapter) and component interfaces (in Decorator) remain small, focused, and adhere to the **Interface Segregation Principle (ISP)**.
- **Transparent Wrapping:** In the Decorator pattern, ensure the decorator class mirrors the exact method signature of the component interface so clients cannot tell the difference between wrapped and unwrapped objects.
- **Common Pitfall:** Avoid deep decorator chains when order dependency becomes too complex to debug. Keep stacking intuitive.

---

## 📝 Summary & Key Takeaways

Today you explored structural design patterns in Python. You learned how the **Adapter Pattern** helps integrate legacy or incompatible codebases without modification, and how the **Decorator Pattern** allows flexible, runtime behavior enhancement through object wrapping. 

Tomorrow, in **Day 83**, we will continue our exploration of design patterns by diving into **Behavioral Design Patterns (Observer & Strategy)**, learning how objects interact and distribute responsibility across systems.
