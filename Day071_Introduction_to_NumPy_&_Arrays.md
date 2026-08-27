# Day 071: Introduction to NumPy & Arrays

> **Difficulty:** Intermediate | **Topic:** Data Science | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Understand the limitations of standard Python lists for numerical computing and why **NumPy** is the industry standard.
- Master the creation and manipulation of **NumPy arrays (`ndarrays`)**.
- Learn about array dimensions, data types (`dtypes`), and basic shape operations.
- Perform efficient vectorised mathematical operations without explicit `for` loops.

---

## 📚 Theory & Concepts

Welcome to **Data Science Week**! Up until now, you have built robust software using Python’s built-in data structures: lists, dictionaries, tuples, and sets. While lists are exceptionally flexible for general-purpose programming (holding a mix of strings, integers, and objects), they are fundamentally inefficient for large-scale mathematical and numerical computations.

### Why Python Lists Fail at Scale
Python lists are actually arrays of pointers pointing to objects scattered across system memory. 
- **Memory Overhead:** Every element in a Python list carries full type information and reference counts, consuming far more memory than the raw data itself.
- **CPU Cache Misses:** Because list elements are scattered pointers, accessing them sequentially causes CPU cache misses, drastically slowing down execution.

### Enter NumPy (`Numerical Python`)
`NumPy` solves these problems by introducing the **`ndarray`** (N-dimensional array). 

```
Python List (Pointers to scattered objects):
[ Pointer ] ---> [ Object 1 (Int) ]
[ Pointer ] ---> [ Object 2 (Int) ]

NumPy Array (Contiguous block of homogeneous memory):
[ Value 1 | Value 2 | Value 3 | Value 4 ] (Packed tightly in RAM)
```

Key characteristics of NumPy arrays:
1. **Homogeneous Data:** All elements must be of the same data type (e.g., all 64-bit integers or all 32-bit floats). This allows C-level optimizations.
2. **Contiguous Memory:** Elements are stored in continuous blocks of memory, allowing lightning-fast CPU vectorisation (SIMD - Single Instruction, Multiple Data).
3. **Vectorisation:** Operations happen on entire arrays simultaneously, eliminating slow Python `for` loops.

---

## 💻 Syntax & Structure

To use NumPy, you must first import it. The standard convention is to alias it as `np`:

```python
import numpy as np

# Creating an array from a Python list
my_list = [1, 2, 3, 4, 5]
arr = np.array(my_list)

# Creating arrays using built-in NumPy functions
zeros_arr = np.zeros((3, 3))          # 3x3 matrix of zeros
ones_arr = np.array([2, 4, 6], dtype=float) # Explicit data type
range_arr = np.arange(0, 10, 2)       # Start, stop, step
linear_space = np.linspace(0, 1, 5)   # 5 numbers evenly spaced between 0 and 1
```

### Essential Array Attributes
```python
print(arr.ndim)   # Number of dimensions (axes)
print(arr.shape)  # Dimensions of the array (rows, columns)
print(arr.size)   # Total number of elements
print(arr.dtype)  # Data type of the elements
```

---

## 🧪 Code Examples

Here is a comprehensive script demonstrating array creation, inspection, vectorised arithmetic, and basic slicing.

```python
import numpy as np

def run_numpy_demo():
    print("--- 1. Array Creation & Attributes ---")
    # Creating a 2D array (Matrix)
    matrix = np.array([[1, 2, 3], [4, 5, 6]], dtype=np.int32)
    
    print(f"Matrix:\n{matrix}")
    print(f"Dimensions (ndim): {matrix.ndim}")
    print(f"Shape (rows, cols): {matrix.shape}")
    print(f"Data Type (dtype): {matrix.dtype}")
    print(f"Total Size: {matrix.size} elements\n")

    print("--- 2. Specialized Array Initialisation ---")
    # Identity matrix, zeros, and random values
    identity = np.eye(3)
    random_vals = np.random.rand(2, 3) # Uniformly distributed between 0 and 1
    
    print(f"3x3 Identity Matrix:\n{identity}\n")
    print(f"2x3 Random Array:\n{random_vals}\n")

    print("--- 3. Vectorised Arithmetic vs Python Lists ---")
    python_list = [1, 2, 3, 4, 5]
    numpy_arr = np.array(python_list)

    # Vectorisation: Multiply every element by 2 without a loop
    scaled_arr = numpy_arr * 2
    print(f"Original NumPy Array: {numpy_arr}")
    print(f"Scaled NumPy Array (* 2): {scaled_arr}")

    # Mathematical operations apply element-wise automatically
    squared_arr = numpy_arr ** 2
    print(f"Squared Elements (** 2): {squared_arr}\n")

    print("--- 4. Indexing and Slicing ---")
    data = np.array([[10, 20, 30], 
                     [40, 50, 60], 
                     [70, 80, 90]])
    
    # Extracting a specific element [row, col]
    print(f"Element at row 1, col 2: {data[1, 2]}") # Outputs 60
    
    # Slicing rows and columns [start:stop, start:stop]
    print(f"First two rows, all columns:\n{data[:2, :]}")
    print(f"Column 1 onwards, last two rows:\n{data[1:, 1:]}")

if __name__ == "__main__":
    run_numpy_demo()
```

---

## 📊 Expected Output

```text
--- 1. Array Creation & Attributes ---
Matrix:
[[1 2 3]
 [4 5 6]]
Dimensions (ndim): 2
Shape (rows, cols): (2, 3)
Data Type (dtype): int32
Total Size: 6 elements

--- 2. Specialized Array Initialisation ---
3x3 Identity Matrix:
[[1. 0. 0.]
 [0. 1. 0.]
 [0. 0. 1.]]

2x3 Random Array:
[[0.417022   0.72032449 0.00011437]
 [0.30233257 0.14675589 0.09233859]]

--- 3. Vectorised Arithmetic vs Python Lists ---
Original NumPy Array: [1 2 3 4 5]
Scaled NumPy Array (* 2): [ 2  4  6  8 10]
Squared Elements (** 2): [ 1  4  9 16 25]

--- 4. Indexing and Slicing ---
Element at row 1, col 2: 60
First two rows, all columns:
[[10 20 30]
 [40 50 60]]
Column 1 onwards, last two rows:
[[50 60]
 [80 90]]
```

---

## 🌍 Real-World Applications
- **Image Processing:** Digital images are stored as multi-dimensional arrays of pixel intensities (Height × Width × Color Channels RGB). NumPy arrays allow rapid transformations like cropping, filtering, and scaling.
- **Machine Learning & AI:** Frameworks like PyTorch and TensorFlow rely on tensor operations built upon the core architectural principles pioneered by NumPy.
- **Financial Modelling:** Calculating moving averages, portfolio variances, and risk metrics over massive historical stock pricing tables.

---

## 💡 Best Practices
- Always specify an explicit `dtype` when memory optimization or specific numerical precision (e.g., `np.float32` vs `np.float64`) is critical for your hardware.
- Avoid writing explicit `for` loops over NumPy arrays when performing arithmetic; leverage vectorised operations to let C execute the loops behind the scenes.
- **Common Pitfall:** Assigning a slice to a new variable (e.g., `sub_arr = arr[:2]`) creates a *view*, not a copy. Modifying `sub_arr` will mutate the original array unless you explicitly call `.copy()`.

---

## 📝 Summary & Key Takeaways
Today you discovered how NumPy overcomes the performance bottlenecks of native Python structures by utilizing contiguous, homogeneous blocks of memory. You learned how to initialise `ndarrays`, inspect their structural attributes, perform lightning-fast vectorised arithmetic, and slice multi-dimensional data matrices.

Tomorrow, in **Day 072**, we will build directly upon this foundation by exploring advanced indexing, boolean masking, and analytical broadcasting techniques in NumPy!
