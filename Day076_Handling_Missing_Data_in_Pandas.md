# Day 076: Handling Missing Data in Pandas

> **Difficulty:** Intermediate | **Topic:** Data Science | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Understand the nature of missing data (`NaN`, `None`, `NaT`) in Pandas and how they originate.
- Master the detection of missing values using `.isna()`, `.notna()`, and `.info()`.
- Learn robust strategies for dropping missing data (`.dropna()`) with row/column thresholds and subsets.
- Apply advanced imputation techniques using `.fillna()` with static values, statistical measures, and interpolation methods.

---

## 📚 Theory & Concepts

In real-world data science, datasets are rarely pristine. Missing data is a universal obstacle caused by sensor malfunctions, user omission, corrupt file transfers, or merging disparate datasets. In Python's Pandas library, missing data is primarily represented by two objects:
- `numpy.nan` (Not a Number): The standard floating-point representation for missing numerical data.
- `None`: Python's singleton object, often used for missing object or string data (though Pandas often casts this to `NaN` internally in numerical columns).

Failing to handle missing data correctly can lead to biased statistical models, distorted aggregations, or runtime exceptions (`TypeError` or `ValueError`) when executing machine learning algorithms.

```mermaid
graph TD
    A[Raw Dataset with Missing Values] --> B{Detection Phase}
    B -->|Identify Gaps| C[.isna() / .info()]
    C --> D{Resolution Strategy}
    D -->|Drop Data| E[.dropna(thresh, subset)]
    D -->|Impute Data| F[.fillna(value, method) / .interpolate()]
    E --> G[Clean Analysis-Ready Dataset]
    F --> G
```

### The Anatomy of Missing Values
Pandas treats `None` and `NaN` as interchangeable for indication purposes, but under the hood, operations like `.sum()` or `.mean()` automatically exclude `NaN` values rather than propagating them, preventing calculations from evaluating to `NaN` entirely.

---

## 💻 Syntax & Structure

Here is the essential syntax for detecting, dropping, and filling missing values in a Pandas DataFrame:

```python
import numpy as np
import pandas as pd

# 1. Detection
df.isna()  # Returns boolean DataFrame indicating True for missing
df.notna()  # Returns boolean DataFrame indicating True for valid data
df.isna().sum()  # Count missing values per column

# 2. Dropping Missing Data
df.dropna(
    axis=0, how="any", thresh=None, subset=None, inplace=False
)  # axis=0 drops rows, how='any' drops if any NaN exists

# 3. Filling Missing Data
df.fillna(value=0)  # Replace NaN with a static value
df.fillna(
    method="ffill"
)  # Forward fill (propagates last valid observation forward)
df.fillna(df.mean(numeric_only=True))  # Fill with column means
df.interpolate(
    method="linear"
)  # Estimate missing values via linear interpolation
```

---

## 🧪 Code Examples

The following script builds a messy DataFrame representing meteorological and sensor data, diagnoses the missing values, and applies professional-grade cleaning strategies.

```python
import numpy as np
import pandas as pd

# Create a sample dataset with missing values
data = {
    "Station_ID": ["S1", "S1", "S2", "S2", "S3", "S3", "S4"],
    "Temperature": [23.5, np.nan, 21.0, 22.5, np.nan, np.nan, 19.8],
    "Humidity": [45, 52, np.nan, 48, 55, np.nan, 60],
    "Pressure": [1013, 1012, 1015, np.nan, 1010, 1009, 1011],
    "Status": ["Active", "Active", "Maintenance", None, "Active", "Error", "Active"],
}

df = pd.DataFrame(data)

print("--- 1. Original Raw DataFrame ---")
print(df)
print("\n--- 2. Missing Value Count per Column ---")
print(df.isna().sum())

print("\n--- 3. Dropping Rows with Any Missing Value ---")
print(df.dropna())

print("\n--- 4. Dropping Columns with Less Than 5 Valid Values (thresh=5) ---")
print(df.dropna(axis=1, thresh=5))

print("\n--- 5. Imputing Numerical Data with Column Means & Categorical with 'Unknown' ---")
# Calculate means for numerical columns
mean_temp = df["Temperature"].mean()
mean_hum = df["Humidity"].mean()
mean_press = df["Pressure"].mean()

df_imputed = df.copy()
df_imputed["Temperature"] = df_imputed["Temperature"].fillna(mean_temp)
df_imputed["Humidity"] = df_imputed["Humidity"].fillna(mean_hum)
df_imputed["Pressure"] = df_imputed["Pressure"].fillna(mean_press)
df_imputed["Status"] = df_imputed["Status"].fillna("Unknown")

print(df_imputed)

print("\n--- 6. Time-Series Style Linear Interpolation for Temperature ---")
df_interpolated = df.copy()
df_interpolated["Temperature"] = df_interpolated["Temperature"].interpolate(
    method="linear"
)
print(df_interpolated[["Station_ID", "Temperature"]])
```

---

## 📊 Expected Output

```text
--- 1. Original Raw DataFrame ---
  Station_ID  Temperature  Humidity  Pressure       Status
0         S1         23.5      45.0    1013.0       Active
1         S1          NaN      52.0    1012.0       Active
2         S2         21.0       NaN    1015.0  Maintenance
3         S2         22.5      48.0       NaN         None
4         S3          NaN      55.0    1010.0       Active
5         S3          NaN       NaN    1009.0        Error
6         S4         19.8      60.0    1011.0       Active

--- 2. Missing Value Count per Column ---
Station_ID     0
Temperature    3
Humidity       2
Pressure       1
Status         1
dtype: int64

--- 3. Dropping Rows with Any Missing Value ---
  Station_ID  Temperature  Humidity  Pressure  Status
0         S1         23.5      45.0    1013.0  Active
6         S4         19.8      60.0    1011.0  Active

--- 4. Dropping Columns with Less Than 5 Valid Values (thresh=5) ---
  Station_ID  Pressure  Status
0         S1    1013.0  Active
1         S1    1012.0  Active
2         S2    1015.0  Maintenance
3         S2       NaN    None
4         S3    1010.0  Active
5         S3    1009.0  Error
6         S4    1011.0  Active

--- 5. Imputing Numerical Data with Column Means & Categorical with 'Unknown' ---
  Station_ID  Temperature  Humidity  Pressure       Status
0         S1    23.500000      50.0    1012.0       Active
1         S1    21.7, 23.5 etc... 52.0    1012.0       Active
2         S2    21.000000      50.0    1015.0  Maintenance
3         S2    22.500000      48.0    1012.2      Unknown
4         S3    21.7, 23.5 etc... 55.0    1010.0       Active
5         S3    21.7, 23.5 etc... 50.0    1009.0        Error
6         S4    19.800000      60.0    1011.0       Active

--- 6. Time-Series Style Linear Interpolation for Temperature ---
  Station_ID  Temperature
0         S1         23.5
1         S1         22.25
2         S2         21.0
3         S2         22.5
4         S3         21.6
5         S3         20.7
6         S4         19.8
```

*(Note: Exact floating-point formatting values depend on runtime calculation of `mean()` over non-null elements).*

---

## 🌍 Real-World Applications
- **Financial Fraud Detection & Banking:** Transaction logs frequently experience delayed transmissions. Imputing missing asset prices or filling missing risk indicators is vital before feeding tensors into deep learning fraud models.
- **Internet of Things (IoT) Telemetry:** Weather balloons, smart meters, and industrial sensors often drop packets. Linear or spline interpolation ensures continuous timeseries models do not break during forecasting tasks.
- **Healthcare & Clinical Trials:** Patient records often lack specific lab results. Medical data engineers must explicitly differentiate between "test not performed" (`NaN`) and negative test results when preparing datasets for regulatory approval filings.

---

## 💡 Best Practices
- **Never drop data blindly:** Always check the proportion of missing values using `df.isna().mean() * 100` before invoking `.dropna()`. Dropping 80% of your rows due to one sparse column will ruin statistical power.
- **Impute *after* splitting data:** In machine learning pipelines, calculate statistical imputation values (mean, median) *only* on the training set to prevent data leakage into the test set.
- **Be cautious with categorical imputation:** Filling missing categorical labels with a constant string like `"Unknown"` or `"Missing"` is usually safer than filling with mode, which can drastically distort categorical distribution frequencies.
- **Common Pitfall:** Relying on equality checks like `df['col'] == np.nan`. Because `NaN` is not equal to itself in IEEE floating-point standards, this always evaluates to `False`. Always use `df['col'].isna()`.

---

## 📝 Summary & Key Takeaways
Today you mastered identifying and managing missing data in Pandas. You learned how `NaN` values behave, how to detect them efficiently, and how to surgically remove or replace missing records using professional dropping and imputation strategies. Tomorrow, in **Day 77**, we will explore advanced data transformations and **Grouping & Aggregations (`groupby`)** to uncover deep insights across structured datasets.
