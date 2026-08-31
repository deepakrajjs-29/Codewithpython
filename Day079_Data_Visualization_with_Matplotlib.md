# Day 079: Data Visualization with Matplotlib

> **Difficulty:** Intermediate | **Topic:** Data Visualization | **Reading Time:** 15 mins

---

## 🎯 Learning Objectives
- Master Matplotlib's Object-Oriented (OO) interface and understand the distinction between `Figure`, `Axes`, and `Axis`.
- Build and customize fundamental chart types: line plots, bar charts, scatter plots, and histograms.
- Create multi-panel figures using `plt.subplots()` with shared axes, custom grids, and aligned layouts.
- Apply professional visual styling, annotations, legends, color maps, and grid controls.
- Export production-quality charts to static image formats (PNG, SVG, PDF) with proper DPI and boundary configurations.

---

## 📚 Theory & Concepts

### 1. The Architecture of Matplotlib
Matplotlib is organized into a hierarchical structure of graphical components called **Artists**. Understanding this hierarchy prevents confusion between Matplotlib's two distinct interfaces: the state-based `pyplot` interface (procedural, similar to MATLAB) and the **Object-Oriented (OO) interface** (explicit, modular, and professional).

```
+-------------------------------------------------------------+
| Figure (The complete canvas/window)                         |
|                                                             |
|  +-----------------------------------+  +----------------+  |
|  | Axes 1 (The actual subplot/chart) |  | Axes 2         |  |
|  |                                   |  |                |  |
|  |  Y-Axis                           |  |                |  |
|  |    ^                              |  |                |  |
|  |    |     * Line / Scatter Marker  |  |   [Bar Chart]  |  |
|  |    |    /                         |  |                |  |
|  |    +---------> X-Axis             |  |                |  |
|  |      Title, Ticks, Labels, Legend |  |                |  |
|  +-----------------------------------+  +----------------+  |
+-------------------------------------------------------------+
```

- **`Figure`**: The top-level container that holds all elements of the graphic, including one or more `Axes`, colorbars, titles, and legends.
- **`Axes`**: The actual plotting area where data is drawn. A single `Figure` can contain multiple `Axes` instances (e.g., subplots in a dashboard).
- **`Axis`**: The numerical coordinate scale (X-axis, Y-axis, Z-axis) responsible for ticks, tick labels, and axis limits.
- **`Artist`**: Virtually every visible element on the figure (lines, text, patches, markers) is an `Artist` object tied to an `Axes`.

### 2. State-Based vs. Object-Oriented Interface

| Feature | State-Based (`plt.plot`) | Object-Oriented (`ax.plot`) |
| :--- | :--- | :--- |
| **Approach** | Implicit global state tracking | Explicit instance method invocation |
| **Code Readability** | Fast for interactive one-liners | Structured, maintainable, scalable |
| **Multi-Panel Control** | Error-prone and cumbersome | Clean array indexing (`axes[row, col]`) |
| **Best Used For** | Quick interactive exploration | Production scripts, libraries, reports |

---

## 💻 Syntax & Structure

### Initializing Figure and Axes Objects
The primary entry point for the Object-Oriented API is `plt.subplots()`:

```python
import matplotlib.pyplot as plt

# Create a Figure with a 2x2 grid of Axes
fig, axes = plt.subplots(nrows=2, ncols=2, figsize=(10, 8), layout="constrained")

# Access individual subplots via 2D array indexing
ax_top_left = axes[0, 0]
ax_top_right = axes[0, 1]
ax_bottom_left = axes[1, 0]
ax_bottom_right = axes[1, 1]
```

### Core Plot Methods and Axis Styling
Each `Axes` object provides standard methods to draw data and configure labels:

```python
# Drawing data
ax.plot(x, y, color="#1f77b4", linestyle="--", linewidth=2.0, label="Trend")
ax.scatter(x, y, color="#ff7f0e", marker="o", s=50, alpha=0.8)
ax.bar(categories, values, color="#2ca02c", width=0.6)
ax.hist(data, bins=30, edgecolor="black", alpha=0.7)

# Configuring axes metadata
ax.set_title("System Latency Distribution", fontsize=14, fontweight="bold")
ax.set_xlabel("Time (seconds)", fontsize=11)
ax.set_ylabel("Requests / sec", fontsize=11)
ax.set_xlim(0, 100)
ax.set_ylim(bottom=0)
ax.grid(True, linestyle=":", alpha=0.6)
ax.legend(loc="upper right", frameon=True)
```

---

## 🧪 Code Examples

The following production script generates a four-panel systems performance report, applies custom styling, annotates key outliers, and exports the result.

```python
import matplotlib.pyplot as plt
import numpy as np

# Set random seed for reproducible demo data
np.random.seed(42)

# 1. Generate Synthetic System Telemetry Data
timestamps = np.arange(1, 25)  # 24 hours
cpu_usage = 45 + 15 * np.sin(timestamps / 3) + np.random.normal(0, 3, size=24)
memory_usage = np.linspace(40, 85, 24) + np.random.normal(0, 2, size=24)

service_names = ["Auth", "Payments", "Search", "Ingestion", "Frontend"]
p99_latencies_ms = [45.2, 120.8, 85.4, 210.1, 32.6]

response_sizes_kb = np.random.exponential(scale=150, size=500)
concurrent_users = np.random.randint(100, 2500, size=60)
error_rates = (concurrent_users * 0.002) + np.random.exponential(scale=0.5, size=60)

# 2. Instantiate Figure and Subplots (2x2 Dashboard Layout)
fig, axes = plt.subplots(nrows=2, ncols=2, figsize=(14, 10), layout="constrained")
fig.suptitle("Production Infrastructure Monitoring Report (24h Window)", fontsize=16, fontweight="bold")

# -------------------------------------------------------------
# Panel 1: Time Series (Line Plot) - CPU & Memory Utilization
# -------------------------------------------------------------
ax1 = axes[0, 0]
ax1.plot(timestamps, cpu_usage, color="#0077b6", linewidth=2.0, marker="o", markersize=4, label="CPU (%)")
ax1.plot(timestamps, memory_usage, color="#d62828", linewidth=2.0, linestyle="--", label="Memory (%)")
ax1.set_title("Resource Utilization Over Time", fontsize=12, fontweight="bold")
ax1.set_xlabel("Hour of Day")
ax1.set_ylabel("Utilization Rate (%)")
ax1.set_ylim(0, 100)
ax1.set_xticks(np.arange(0, 25, 4))
ax1.grid(True, linestyle="--", alpha=0.5)
ax1.legend(loc="upper left")

# Annotate Peak CPU Usage
max_cpu_idx = int(np.argmax(cpu_usage))
ax1.annotate(
    f"Peak: {cpu_usage[max_cpu_idx]:.1f}%",
    xy=(timestamps[max_cpu_idx], cpu_usage[max_cpu_idx]),
    xytext=(timestamps[max_cpu_idx] - 4, cpu_usage[max_cpu_idx] + 12),
    arrowprops=dict(facecolor="black", shrink=0.08, width=1, headwidth=6),
    fontweight="bold",
    fontsize=9
)

# -------------------------------------------------------------
# Panel 2: Microservice Latency Comparison (Bar Chart)
# -------------------------------------------------------------
ax2 = axes[0, 1]
colors = ["#2a9d8f" if val < 100 else "#e76f51" for val in p99_latencies_ms]
bars = ax2.bar(service_names, p99_latencies_ms, color=colors, edgecolor="black", linewidth=0.8, width=0.55)
ax2.axhline(100, color="gray", linestyle=":", linewidth=1.5, label="SLA Threshold (100ms)")
ax2.set_title("Service P99 Latency (ms)", fontsize=12, fontweight="bold")
ax2.set_xlabel("Service Name")
ax2.set_ylabel("Latency (ms)")
ax2.grid(axis="y", linestyle="--", alpha=0.5)
ax2.legend(loc="upper left")

# Attach exact value labels on top of each bar
for bar in bars:
    height = bar.get_height()
    ax2.annotate(
        f"{height:.1f}",
        xy=(bar.get_x() + bar.get_width() / 2, height),
        xytext=(0, 3),
        textcoords="offset points",
        ha="center",
        va="bottom",
        fontsize=9,
        fontweight="bold"
    )

# -------------------------------------------------------------
# Panel 3: Payload Distribution (Histogram)
# -------------------------------------------------------------
ax3 = axes[1, 0]
counts, bins, patches = ax3.hist(
    response_sizes_kb, 
    bins=25, 
    color="#457b9d", 
    edgecolor="white", 
    density=False, 
    alpha=0.85
)
ax3.set_title("API Payload Size Distribution", fontsize=12, fontweight="bold")
ax3.set_xlabel("Response Size (KB)")
ax3.set_ylabel("Frequency (Request Count)")
ax3.grid(axis="y", linestyle="--", alpha=0.5)

# -------------------------------------------------------------
# Panel 4: Load vs Error Correlation (Scatter Plot)
# -------------------------------------------------------------
ax4 = axes[1, 1]
scatter = ax4.scatter(
    concurrent_users, 
    error_rates, 
    c=error_rates, 
    cmap="YlOrRd", 
    edgecolor="black", 
    s=70, 
    alpha=0.85
)
cbar = fig.colorbar(scatter, ax=ax4, shrink=0.9)
cbar.set_label("Error Rate Index", fontsize=9)
ax4.set_title("Concurrency vs Error Frequency", fontsize=12, fontweight="bold")
ax4.set_xlabel("Active Concurrent Users")
ax4.set_ylabel("Errors / Sec")
ax4.grid(True, linestyle="--", alpha=0.5)

# 3. Export Chart to Disk
output_filename = "infrastructure_report.png"
fig.savefig(output_filename, dpi=300, bbox_inches="tight")
plt.close(fig)

print(f"[SUCCESS] Dashboard compiled and saved to: {output_filename}")
print(f"[METRICS] Processed 24 time-steps, {len(service_names)} services, {len(response_sizes_kb)} payloads.")
```

---

## 📊 Expected Output

```text
[SUCCESS] Dashboard compiled and saved to: infrastructure_report.png
[METRICS] Processed 24 time-steps, 5 services, 500 payloads.
```

---

## 🌍 Real-World Applications

- **Observability and Telemetry Dashboards**: Engineering teams write automated cron jobs in Python that parse Prometheus or CloudWatch metrics and generate nightly visual health reports.
- **Exploratory Data Analysis (EDA)**: Data scientists create distribution histograms, correlation heatmaps, and scatter matrices before feeding datasets into machine learning pipelines.
- **Algorithmic Backtesting**: Financial systems plot portfolio equity curves, drawdown charts, and trade execution points over historical price candlesticks.
- **Academic and Whitepaper Publishing**: Matplotlib produces vector graphics (PDF/SVG) with LaTeX typography support for scientific journals and publications.

---

## 💡 Best Practices

- **Always use `plt.subplots()`**: Avoid mixing procedural `plt.title()` or `plt.xlabel()` calls with the object-oriented API (`ax.set_title()`, `ax.set_xlabel()`).
- **Leverage `layout="constrained"`**: Replace the older `plt.tight_layout()` with `layout="constrained"` in `plt.subplots()` to automatically prevent overlapping tick labels, titles, and legends.
- **Prevent Memory Leaks in Batch Pipelines**: Always explicitly close figure canvases using `plt.close(fig)` after saving to disk. Failing to close figures keeps them active in Matplotlib's internal state manager.
- **Export at 300 DPI for Presentations & Print**: When calling `fig.savefig()`, pass `dpi=300` and `bbox_inches="tight"` to ensure sharp lines and eliminate excess whitespace.
- **Choose Colorblind-Friendly Palettes**: Avoid pure red-green contrasting pairs for critical indicators; utilize perceptually uniform colormaps like `viridis`, `plasma`, or categorical palettes like `Tableau 10`.

---

## 📝 Summary & Key Takeaways

- Matplotlib's core hierarchy relies on **`Figure`** (the top-level window/canvas) and **`Axes`** (the individual plotting surfaces).
- The **Object-Oriented API** (`fig, ax = plt.subplots()`) provides explicit control over complex subplots and eliminates state-management bugs.
- Key chart types—line plots (`ax.plot`), bar charts (`ax.bar`), histograms (`ax.hist`), and scatter plots (`ax.scatter`)—share unified styling paradigms for limits, grids, and legends.
- Precision controls such as `ax.annotate()`, custom color maps, and direct bar-top labeling elevate raw plots into production-grade visual reports.

**Next Up (Day 080):** We will explore **Statistical Data Visualization with Seaborn**, taking visual analytics further with high-level themes, automatic regression plots, heatmaps, and complex relational distributions.
