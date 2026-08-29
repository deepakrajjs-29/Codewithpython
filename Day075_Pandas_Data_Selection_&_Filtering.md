# Day 075: Pandas Data Selection & Filtering

> **Difficulty:** Intermediate | **Topic:** Data Science | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Master label-based (`.loc`) and integer-position-based (`.iloc`) data selection in Pandas.
- Implement complex boolean filtering using single and multiple conditions (`&`, `|, `~`).
- Utilize advanced filtering methods like `.isin()`, `.query()`, and `.between()` for cleaner code.
- Avoid common data manipulation pitfalls like `SettingWithCopyWarning`.

---

## 📚 Theory & Concepts

When working with data science workflows in Python, data frames rarely stay pristine; you constantly need to slice, dice, and query specific subsets of your data. Pandas provides robust tools to extract exact rows and columns based on labels, positional indices, or conditional logic.

Understanding the distinction between index-based positioning and label-based indexing is fundamental. While native Python slicing relies heavily on implicit integers, Pandas handles both explicit index labels (which can be strings, dates, or custom integers) and implicit positional integers (0-indexed from the top left).

```mermaid
graph TD
    A[Pandas DataFrame] --> B{Selection Method}
    B -->|Label-based| C[.loc[row_label, col_label]]
    B -->|Position-based| D[.iloc[row_idx, col_idx]]
    B -->|Conditional Filtering| E[Boolean Masks / .query()]
```

### Core Selection Mechanisms
1. **`[]` (Indexer Operator):** Primarily used for column extraction (`df['column']`) or simple row slicing (`df[0:5]`). Avoid using it for simultaneous row and column indexing to prevent ambiguity.
2. **`.loc` (Location-based):** Accesses a group of rows and columns by **labels** or a boolean array. The end points of slices are *inclusive*.
3. **`.iloc` (Integer-location-based):** Accesses a group of rows and columns by **integer positions** (0-indexed). The end points of slices are *exclusive* (like standard Python lists).

---

## 💻 Syntax & Structure

Here is how you structure selection and filtering operations in Pandas:

```python
import pandas as pd

# 1. Selecting Columns
df["column_name"]  # Returns a Series
df[["col1", "col2"]]  # Returns a DataFrame

# 2. Selecting with .loc (Label-based)
df.loc[row_selector, column_selector]
df.loc[df["age"] > 30, ["name", "city"]]

# 3. Selecting with .iloc (Position-based)
df.iloc[0:5, 1:3]  # Rows 0 to 4, Columns 1 to 2

# 4. Complex Boolean Filtering
filtered_df = df[(df["age"] > 25) & (df["department"] == "Engineering")]
```

---

## 🧪 Code Examples

Let's look at a complete, runnable script demonstrating comprehensive data selection and filtering techniques on a mock employee dataset.

```python
import pandas as pd

# Creating sample dataset
data = {
    "EmployeeID": [101, 102, 103, 104, 105, 106],
    "Name": [
        "Alice Smith",
        "Bob Jones",
        "Charlie Brown",
        "Diana Prince",
        "Evan Wright",
        "Fiona Gallagher",
    ],
    "Department": [
        "Engineering",
        "Marketing",
        "Engineering",
        "HR",
        "Marketing",
        "Engineering",
    ],
    "Age": [28, 34, 41, 29, 52, 38],
    "Salary": [75000, 62000, 110000, 54000, 95000, 88000],
    "Remote": [True, False, True, False, True, True],
}

df = pd.DataFrame(data)
df.set_index("EmployeeID", inplace=True)

print("--- 1. Original DataFrame with Custom Index ---")
print(df, "\n")

# --- Label-based Selection (.loc) ---
print("--- 2. Selection using .loc (Label-based) ---")
# Select a single row by index label and specific columns
print(df.loc[103, ["Name", "Department", "Salary"]])
print("\n")

# Slicing rows by label (inclusive of 104) and columns by range
print(df.loc[101:104, "Name": "Salary"])
print("\n")

# --- Position-based Selection (.iloc) ---
print("--- 3. Selection using .iloc (Position-based) ---")
# Select rows 0 to 2 (exclusive of 3) and columns 0 to 3
print(df.iloc[0:3, 0:3])
print("\n")

# --- Boolean Filtering ---
print("--- 4. Boolean Filtering (Engineering dept and Salary > 80000) ---")
eng_high_earners = df[(df["Department"] == "Engineering") & (df["Salary"] > 80000)]
print(eng_high_earners[["Name", "Salary"]])
print("\n")

# --- Advanced Filtering: .isin() and .between() ---
print("--- 5. Advanced Filtering using .isin() & .between() ---")
marketing_or_hr = df[df["Department"].isin(["Marketing", "HR"])]
print("Marketing or HR Staff:")
print(marketing_or_hr[["Name", "Department"]])

print("\nEmployees aged between 30 and 45:")
age_bracket = df[df["Age"].between(30, 45)]
print(age_bracket[["Name", "Age"]])
print("\n")

# --- Advanced Filtering: .query() ---
print("--- 6. Filtering using .query() method ---")
query_result = df.query("Remote == True and Salary > 80000")
print(query_result[["Name", "Salary", "Remote"]])
```

---

## 📊 Expected Output

```text
--- 1. Original DataFrame with Custom Index ---
               Name   Department  Age  Salary  Remote
EmployeeID                                           
101     Alice Smith  Engineering   28   75000    True
102       Bob Jones    Marketing   34   62000   False
103   Charlie Brown  Engineering   41  110000    True
104    Diana Prince           HR   29   54000   False
105     Evan Wright    Marketing   52   95000    True
106 Fiona Gallagher  Engineering   38   88000    True 

--- 2. Selection using .loc (Label-based) ---
Name          Charlie Brown
Department      Engineering
Salary               110000
Name: 103, dtype: object

                 Name   Department  Age  Salary
EmployeeID                                     
101       Alice Smith  Engineering   28   75000
102         Bob Jones    Marketing   34   62000
103     Charlie Brown  Engineering   41  110000
104      Diana Prince           HR   29   54000

--- 3. Selection using .iloc (Position-based) ---
               Name   Department  Age
EmployeeID                           
101     Alice Smith  Engineering   28
102       Bob Jones    Marketing   34
103   Charlie Brown  Engineering   41

--- 4. Boolean Filtering (Engineering dept and Salary > 80000) ---
               Name  Salary
EmployeeID                 
103   Charlie Brown  110000
106 Fiona Gallagher   88000

--- 5. Advanced Filtering using .isin() & .between() ---
Marketing or HR Staff:
               Name Department
EmployeeID                    
102       Bob Jones  Marketing
104    Diana Prince         HR
105     Evan Wright  Marketing

Employees aged between 30 and 45:
               Name  Age
EmployeeID              
102       Bob Jones   34
103   Charlie Brown   41
106 Fiona Gallagher   38

--- 6. Filtering using .query() method ---
               Name  Salary  Remote
EmployeeID                         
103   Charlie Brown  110000    True
105     Evan Wright   95000    True
106 Fiona Gallagher   88000    True
```

---

## 🌍 Real-World Applications
- **Financial Risk Analysis:** Slicing transaction ledgers to isolate high-value wire transfers occurring outside normal business hours.
- **E-Commerce Analytics:** Filtering user clickstream logs for specific product categories using `.isin()` to measure campaign conversion rates.
- **Healthcare Informatics:** Extracting patient vitals that breach clinical warning thresholds using boolean condition masks.

---

## 💡 Best Practices
- **Use Bitwise Operators:** Always wrap individual boolean conditions in parentheses and use `&` (and), `|` (or), and `~` (not) instead of Python's logical keywords `and`, `or`, and `not`.
- **Beware of `SettingWithCopyWarning`:** When filtering data, always use `.loc[row_indexer, col_indexer] = value` if you intend to modify the underlying DataFrame in-place rather than chaining brackets `df[df['col'] > 5]['col'] = 10`.
- **Leverage `.query()` for Readability:** For complex numeric filters, `.query("age > 30 and salary < 50000")` offers cleaner, SQL-like readability compared to traditional indexing syntax.

---

## 📝 Summary & Key Takeaways
Today you mastered the art of slicing and dicing data within Pandas DataFrames. You learned how label-based indexing (`.loc`) and positional indexing (`.iloc`) give you precise control over your coordinate spaces, while boolean masks, `.isin()`, `.between()`, and `.query()` streamline condition-based filtering. 

Tomorrow, in **Day 76**, we will build on this foundation by learning how to handle missing data and clean messy datasets efficiently!
