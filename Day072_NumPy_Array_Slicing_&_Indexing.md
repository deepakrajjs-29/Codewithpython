# Day 072: NumPy Array Slicing & Indexing

> **Difficulty:** Intermediate | **Topic:** Data Science | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Master 1D, 2D, and 3D array indexing in NumPy to retrieve individual elements.
- Apply advanced slicing techniques (`start:stop:step`) across single and multiple dimensions.
- Understand the crucial difference between NumPy views (references) and copies.
- Leverage boolean masking and fancy indexing for complex data filtering.

---

## 📚 Theory & Concepts

In standard Python lists, accessing and manipulating multi-dimensional data requires clumsy nested loops or list comprehensions, which are notoriously slow. NumPy solves this by introducing powerful **indexing** and **slicing** mechanisms designed for high-performance computing.

### 1. Basic Indexing vs. Slicing
- **Indexing** (`arr[i]`) retrieves a single element from an array, reducing the dimensionality by one.
- **Slicing** (`arr[start:stop:step`) extracts a subset of an array, preserving its dimensionality.

### 2. Multi-Dimensional Slicing
In 2D arrays (matrices), axes are zero-indexed as `[row, column]`. You can slice rows and columns simultaneously:
```python
# General 2D syntax
arr[row_start:row_stop, col_start:col_stop]
```

### 3. Views vs. Copies (Crucial Concept)
Unlike standard Python lists—where slicing creates a brand-new copy of the data—**NumPy slicing creates a *view* of the original array**. 
- Modifying a slice *will* modify the original array.
- If you need an independent object, you must explicitly call `.copy()`.

```
Original Array: [[1, 2, 3], [4, 5, 6]]
      │
      └──> Slice View: [2, 3]  (Points to the exact same memory block!)
```

---

## 💻 Syntax & Structure

Here is how you structure fundamental NumPy indexing and slicing operations:

```python
import numpy as np

# Creating a sample 2D array
matrix = np.array([[10, 20, 30], 
                   [40, 50, 60], 
                   [70, 80, 90]])

# 1. Single Element Access
element = matrix[0, 2]       # Row 0, Col 2 -> 30

# 2. Row/Column Slicing
second_row = matrix[1, :]    # Entire row 1 -> [40, 50, 60]
first_col = matrix[:, 0]     # Entire col 0 -> [10, 40, 70]

# 3. Sub-matrix Slicing
sub_matrix = matrix[0:2, 1:3] # Rows 0-1, Cols 1-2
```

---

## 🧪 Code Examples

Let's explore a comprehensive, runnable script demonstrating basic indexing, multidimensional slicing, view behavior, and boolean masking.

```python
import numpy as np

print("--- 1. Basic 1D Indexing & Slicing ---")
arr_1d = np.array([5, 10, 15, 20, 25, 30, 35])
print(f"Original 1D: {arr_1d}")
print(f"First element (index 0): {arr_1d[0]}")
print(f"Last element (index -1): {arr_1d[-1]}")
print(f"Slice from index 1 to 5 (exclusive): {arr_1d[1:5]}")
print(f"Slice every 2nd element: {arr_1d[::2]}")

print("\n--- 2. Multi-Dimensional (2D) Slicing ---")
grid = np.array([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12]
])
print(f"Original 2D Grid:\n{grid}")

# Extracting a 2x2 sub-grid from top-right
sub_grid = grid[:2, 2:]
print(f"\nTop-right 2x2 sub-grid:\n{sub_grid}")

print("\n--- 3. Views vs. Copies ---")
print(f"Original row 0: {grid[0]}")
row_view = grid[0, :]
row_view[0] = 99  # Modify the view
print(f"Modified row_view: {row_view}")
print(f"Original grid row 0 after modifying view:\n{grid}") # Notice original changed!

# Safe copy approach
safe_copy = grid[1, :].copy()
safe_copy[0] = 500
print(f"\nModified safe_copy: {safe_copy}")
print(f"Original grid row 1 remains untouched:\n{grid[1]}")

print("\n--- 4. Boolean Masking (Filtering) ---")
data = np.array([12, 45, 2, 89, 33, 20, 7])
# Create a boolean condition array
mask = data > 25
print(f"Condition (data > 25): {mask}")
filtered_data = data[mask]
print(f"Filtered elements: {filtered_data}")
```

---

## 📊 Expected Output

```text
--- 1. Basic 1D Indexing & Slicing ---
Original 1D: [ 5 10 15 20 25 30 35]
First element (index 0): 5
Last element (index -1): 35
Slice from index 1 to 5 (exclusive): [10 15 20 25]
Slice every 2nd element: [ 5 15 25 35]

--- 2. Multi-Dimensional (2D) Slicing ---
Original 2D Grid:
[[ 1  2  3  4]
 [ 5  6  7  8]
 [ 9 10 11 12]]

Top-right 2x2 sub-grid:
[[3 4]
 [7 8]]

--- 3. Views vs. Copies ---
Original row 0: [1 2 3 4]
Modified row_view: [99  2  3  4]
Original grid row 0 after modifying view:
[[99  2  3  4]
 [ 5  6  7  8]
 [ 9 10 11 12]]

Modified safe_copy: [500   6   7   8]
Original grid row 1 remains untouched:
[5 6 7 8]

--- 4. Boolean Masking (Filtering) ---
Condition (data > 25): [False  True False  True  True False False]
Filtered elements: [45 89 33]
```

---

## 🌍 Real-World Applications
- **Computer Vision & Image Processing:** Digital images are stored as multi-dimensional NumPy arrays (Height $\times$ Width $\times$ Color Channels). Slicing allows computer vision engineers to crop images, isolate Region of Interests (ROIs), or adjust color bands.
- **Financial Time Series Analysis:** Slicing allows quantitative analysts to instantly isolate specific trading windows, such as extracting hourly market trends or multi-year backtesting periods from large stock matrices.
- **Machine Learning Data Pipelines:** Features and target labels are routinely sliced out of massive training datasets (e.g., `X = dataset[:, :-1]`, `y = dataset[:, -1]`) prior to model training.

---

## 💡 Best Practices
- **Always check dimensions:** Use `arr.ndim` and `arr.shape` before writing complex slice operations to avoid `IndexError` exceptions.
- **Beware of Memory Leaks via Views:** When working with huge datasets, modifying a view instead of a copy can unintentionally corrupt upstream data structures. Explicitly use `.copy()` when mutation isolation is required.
- **Prefer Boolean Masking over Loops:** Never use `for` loops to filter arrays. NumPy boolean masks run vectorized at C-speed, making them orders of magnitude faster.
- **Avoid Chain Indexing:** Avoid expressions like `arr[1][2]` because it can return either a view or a copy depending on internal memory layout. Always use comma-separated multi-dimensional indices: `arr[1, 2]`.

---

## 📝 Summary & Key Takeaways
Today you unlocked the core mechanics of NumPy data access. You learned that slicing multi-dimensional arrays efficiently extracts subsections without unnecessary memory allocation, though you must remain mindful of the distinction between views and copies. Furthermore, boolean masking empowers you to perform rapid, vectorized data filtering. 

Tomorrow, in **Day 073**, we will build upon these skills as we explore **NumPy Fancy Indexing & Array Broadcasting**, taking our data manipulation proficiency to an advanced level!
