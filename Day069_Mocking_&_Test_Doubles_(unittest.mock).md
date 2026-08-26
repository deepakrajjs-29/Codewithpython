# Day 069: Mocking & Test Doubles (unittest.mock)

> **Difficulty:** Advanced | **Topic:** Testing | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Understand the role of test doubles, stubs, and mocks in automated software testing.
- Master Python’s built-in `unittest.mock` module, specifically `MagicMock`, `Mock`, and `patch`.
- Learn how to isolate units of code by intercepting network requests, database calls, and file I/O.
- Apply modern mocking patterns using context managers and decorators in professional test suites.

---

## 📚 Theory & Concepts

When writing robust unit tests, the goal is to test a single unit of code—such as a function or a method—in complete isolation. However, real-world code rarely exists in a vacuum. It interacts with external dependencies like REST APIs, SQL databases, payment gateways, and the local filesystem. 

If your unit tests rely on these live external systems, they become:
1. **Slow:** Network latency and disk I/O degrade test suite execution speed.
2. **Fragile:** A temporary network outage or a down database causes your tests to fail, even though your code is correct.
3. **Non-Deterministic:** External data changes over time, turning reliable tests into flaky ones.

### Test Doubles
To solve this, we use **Test Doubles**—a generic term for any case where you replace a production object for testing purposes (analogous to a stunt double in filmmaking). The `unittest.mock` library is Python’s standard built-in framework for creating and managing these doubles.

```
+------------------------------------+
|          Target Function           |
|  (Processes data, makes API call)  |
+-----------------+------------------+
                  | Calls API
                  v
       +---------------------+
       |   unittest.mock     | ---> Intercepts call, returns preset data
       |     (Test Double)   |      without hitting the real network
       +---------------------+
```

### Types of Test Doubles in `unittest.mock`
- **`Mock`:** A generic object that records its own calls, arguments, and return values. You can configure it to return specific values or raise specific exceptions.
- **`MagicMock`:** A subclass of `Mock` that pre-configures magic methods (like `__len__`, `__iter__`, `__enter__`) out of the box.
- **`patch`:** A decorator or context manager used to temporarily replace an object in a specific module namespace with a mock during a test run.

---

## 💻 Syntax & Structure

The `unittest.mock` module provides structural tools to substitute dependencies dynamically. Below are the core syntactic patterns you will use in production codebases:

```python
from unittest.mock import MagicMock, patch

# 1. Creating a basic Mock object with preset behavior
mock_db = MagicMock()
mock_db.get_user.return_value = {"id": 1, "name": "Alice"}

# 2. Using patch as a decorator to replace external modules/functions
@patch("myapp.services.requests.get")
def test_external_api(mock_get):
    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = {"status": "success"}
    
    # Call your function that uses requests.get internally...
    
# 3. Using patch as a context manager for precise scoping
def test_file_upload():
    with patch("myapp.services.Uploader.upload") as mock_upload:
        mock_upload.return_value = True
        # Execute test logic here
```

---

## 🧪 Code Examples

Let's build a practical example simulating an e-commerce order processor. Our system needs to fetch user details from a remote API, charge a credit card via a third-party gateway, and save the transaction log. We will mock the external HTTP calls and payment gateway to test our business logic reliably.

```python
# app.py
import requests

class PaymentGatewayError(Exception):
    pass

class OrderProcessor:
    def __init__(self, api_base_url: str):
        self.api_base_url = api_base_url

    def get_user_balance(self, user_id: int) -> float:
        """Makes an external HTTP GET request to fetch user balance."""
        response = requests.get(f"{self.api_base_url}/users/{user_id}")
        if response.status_code != 200:
            raise ValueError("User not found")
        return response.json().get("balance", 0.0)

    def process_payment(self, user_id: int, amount: float) -> str:
        """Processes payment by checking balance and charging via API."""
        balance = self.get_user_balance(user_id)
        
        if balance < amount:
            raise PaymentGatewayError("Insufficient funds")
            
        payload = {"user_id": user_id, "amount": amount}
        response = requests.post(f"{self.api_base_url}/charge", json=payload)
        
        if response.status_code != 200:
            raise PaymentGatewayError("Gateway rejection")
            
        return response.json().get("transaction_id")

# test_app.py
import unittest
from unittest.mock import patch, MagicMock
from app import OrderProcessor, PaymentGatewayError

class TestOrderProcessor(unittest.TestCase):
    
    def setUp(self):
        self.processor = OrderProcessor("https://api.fake-ecommerce.com")

    @patch("app.requests.get")
    def test_get_user_balance_success(self, mock_get):
        # Arrange
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"balance": 150.75}
        mock_get.return_value = mock_response

        # Act
        balance = self.processor.get_user_balance(user_id=42)

        # Assert
        self.assertEqual(balance, 150.75)
        mock_get.assert_called_once_with("https://api.fake-ecommerce.com/users/42")

    @patch("app.requests.post")
    @patch("app.requests.get")
    def test_process_payment_success(self, mock_get, mock_post):
        # Arrange: Setup mock get for balance check
        mock_get_resp = MagicMock()
        mock_get_resp.status_code = 200
        mock_get_resp.json.return_value = {"balance": 200.0}
        mock_get.return_value = mock_get_resp

        # Arrange: Setup mock post for charging payment
        mock_post_resp = MagicMock()
        mock_post_resp.status_code = 200
        mock_post_resp.json.return_value = {"transaction_id": "tx_987654321"}
        mock_post.return_value = mock_post_resp

        # Act
        tx_id = self.processor.process_payment(user_id=42, amount=50.0)

        # Assert
        self.assertEqual(tx_id, "tx_987654321")
        mock_post.assert_called_once_with(
            "https://api.fake-ecommerce.com/charge",
            json={"user_id": 42, "amount": 50.0}
        )

    @patch("app.requests.get")
    def test_process_payment_insufficient_funds(self, mock_get):
        # Arrange
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"balance": 10.0}
        mock_get.return_value = mock_response

        # Act & Assert
        with self.assertRaises(PaymentGatewayError):
            self.processor.process_payment(user_id=42, amount=50.0)

if __name__ == "__main__":
    unittest.main()
```

---

## 📊 Expected Output

When running the unit test file via the terminal, `unittest` executes the test suite in isolation without dispatching actual HTTP requests over the network.

```text
...
----------------------------------------------------------------------
Ran 3 tests in 0.003s

OK
```

---

## 🌍 Real-World Applications

- **Microservice Architectures:** Testing microservice clients without needing companion services spun up in local or staging Docker environments.
- **Third-Party Integrations:** Mocking external SDKs like Stripe, AWS S3, or SendGrid to test error-handling branches (e.g., rate limits, timeouts) safely.
- **Database-Independent Testing:** Intercepting ORM queries or database drivers to verify business logic execution paths without seeding complex relational state.

---

## 💡 Best Practices

- **Patch Where It Is Looked Up, Not Where It Is Defined:** Always patch the target module's namespace where the dependency is imported and used, rather than where the object originated.
- **Inspect Call Assertions:** Utilize `assert_called_once_with()` and `assert_has_calls()` to ensure your unit passes the correct payloads to dependencies.
- **Keep Mocks Minimal:** Avoid over-mocking. If you are mocking every single line of internal code, your test loses its architectural value. Mock only system boundaries and external side effects.
- **Common Pitfall:** Forgetting that `patch` replaces objects temporarily. If a patch path is misspelled, Python creates a mock attribute dynamically instead of throwing an error, leading to silent false positives. Use `autospec=True` in `patch` to enforce signature matching.

---

## 📝 Summary & Key Takeaways
Today you mastered the fundamentals of mocking and test doubles using Python's built-in `unittest.mock` framework. You learned how to isolate code by swapping out live network requests and external systems with programmable test doubles (`Mock` and `MagicMock`), ensuring your unit tests remain fast, reliable, and deterministic.

Tomorrow, we will step up our testing rigor by exploring **Integration & End-to-End Testing**, connecting our isolated units to real test databases and containerized environments.
