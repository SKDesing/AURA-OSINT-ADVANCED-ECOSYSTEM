#!/usr/bin/env python3
"""
Compare current observability run with previous run to detect regressions.
"""
import json, glob, os, sys
from datetime import datetime

def load_latest_kpis(exclude_current=True):
    """Load the two most recent KPI files for comparison."""
    pattern = "artifacts/observability-kpis-*.json"
    files = sorted(glob.glob(pattern), reverse=True)
    
    if len(files) < 2:
        return None, None
    
    current_file = files[0] if not exclude_current else None
    previous_file = files[1] if len(files) > 1 else files[0]
    
    current = None
    previous = None
    
    if current_file:
        with open(current_file) as f:
            current = json.load(f)
    
    if previous_file:
        with open(previous_file) as f:
            previous = json.load(f)
    
    return current, previous

def calculate_delta(current_val, previous_val):
    """Calculate percentage change between two values."""
    if previous_val == 0:
        return float('inf') if current_val > 0 else 0
    return ((current_val - previous_val) / previous_val) * 100

def format_delta(delta):
    """Format delta with appropriate color coding."""
    if abs(delta) < 1:
        return f"{delta:+.1f}%"
    elif delta > 0:
        return f"+{delta:.1f}%"
    else:
        return f"{delta:.1f}%"

def main():
    current, previous = load_latest_kpis()
    
    if not previous:
        print("❌ No previous run found for comparison")
        return
    
    if not current:
        print("❌ No current run KPIs found")
        return
    
    print("📊 AURA AI Run Comparison")
    print("=" * 40)
    print(f"Current:  {current['ts']}")
    print(f"Previous: {previous['ts']}")
    print()
    
    # Key metrics to compare
    metrics = [
        ("tokens_saved_ratio", "Tokens Saved Ratio", "%", "higher_better"),
        ("semantic_cache_hit_ratio", "Cache Hit Ratio", "%", "higher_better"),
        ("tokens_in", "Tokens Input", "", "neutral"),
        ("tokens_out", "Tokens Output", "", "neutral"),
        ("stress_latency_ms.p95", "Stress p95 Latency", "ms", "lower_better"),
        ("stress_latency_ms.avg", "Stress Avg Latency", "ms", "lower_better"),
        ("rag_retrieved_chunks_total", "RAG Chunks", "", "higher_better"),
        ("pruning_events", "Pruning Events", "", "higher_better")
    ]
    
    regressions = []
    improvements = []
    
    for metric_path, name, unit, direction in metrics:
        # Handle nested metrics like stress_latency_ms.p95
        if "." in metric_path:
            key, subkey = metric_path.split(".", 1)
            current_val = current.get(key, {}).get(subkey, 0)
            previous_val = previous.get(key, {}).get(subkey, 0)
        else:
            current_val = current.get(metric_path, 0)
            previous_val = previous.get(metric_path, 0)
        
        if previous_val == 0 and current_val == 0:
            continue
            
        delta = calculate_delta(current_val, previous_val)
        delta_str = format_delta(delta)
        
        # Determine if this is a regression or improvement
        is_regression = False
        is_improvement = False
        
        if direction == "higher_better":
            if delta < -5:  # 5% threshold
                is_regression = True
            elif delta > 5:
                is_improvement = True
        elif direction == "lower_better":
            if delta > 5:
                is_regression = True
            elif delta < -5:
                is_improvement = True
        
        status = "🔴" if is_regression else "🟢" if is_improvement else "⚪"
        
        print(f"{status} {name:<25} {current_val:>8}{unit} ({delta_str})")
        
        if is_regression:
            regressions.append(f"{name}: {delta_str}")
        elif is_improvement:
            improvements.append(f"{name}: {delta_str}")
    
    print()
    
    if regressions:
        print("⚠️  REGRESSIONS DETECTED:")
        for reg in regressions:
            print(f"   - {reg}")
        print()
    
    if improvements:
        print("✅ IMPROVEMENTS:")
        for imp in improvements:
            print(f"   + {imp}")
        print()
    
    # Overall assessment
    if len(regressions) > 2:
        print("❌ OVERALL: Multiple regressions detected")
        sys.exit(1)
    elif regressions:
        print("⚠️  OVERALL: Minor regressions detected")
        sys.exit(0)
    else:
        print("✅ OVERALL: No significant regressions")
        sys.exit(0)

if __name__ == "__main__":
    main()