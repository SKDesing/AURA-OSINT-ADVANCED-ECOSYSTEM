#!/usr/bin/env python3
"""
Generate scenario index from observability run results for easier parsing.
"""
import json, os, glob, re
from datetime import datetime

DURING_DIR = "logs/run/during"
OUTPUT_FILE = f"{DURING_DIR}/scenario-index.json"

def extract_scenario_data():
    """Extract key data from each scenario JSON file."""
    scenarios = {}
    
    scenario_files = {
        'A': 'llm-baseline.json',
        'B': 'router-ner.json', 
        'C': 'forensic.json',
        'D': 'harassment.json',
        'E': 'cache-loop.txt',
        'F': 'pruning.json',
        'G': ['rag-ingest1.json', 'rag-ingest2.json', 'rag-query.json'],
        'H': 'guardrails.json',
        'I': 'degrade.json',
        'J': 'stress-latencies.txt'
    }
    
    for scenario_id, files in scenario_files.items():
        scenario_data = {
            'scenario_id': scenario_id,
            'status': 'unknown',
            'latency_ms': 0,
            'tokens_in': 0,
            'tokens_out': 0,
            'algorithm_used': None,
            'cache_hit': False,
            'error': None
        }
        
        try:
            if scenario_id == 'E':  # Cache test
                cache_file = f"{DURING_DIR}/{files}"
                if os.path.exists(cache_file):
                    with open(cache_file) as f:
                        lines = f.readlines()
                        if len(lines) >= 2:
                            scenario_data['cache_hit'] = 'hit' in lines[1].lower()
                            scenario_data['status'] = 'completed'
                        
            elif scenario_id == 'J':  # Stress test
                stress_file = f"{DURING_DIR}/{files}"
                if os.path.exists(stress_file):
                    with open(stress_file) as f:
                        latencies = [float(line.strip()) for line in f if line.strip()]
                        if latencies:
                            scenario_data['latency_ms'] = sum(latencies) / len(latencies)
                            scenario_data['status'] = 'completed'
                            
            elif scenario_id == 'G':  # RAG multi-file
                rag_data = {}
                for rag_file in files:
                    file_path = f"{DURING_DIR}/{rag_file}"
                    if os.path.exists(file_path):
                        with open(file_path) as f:
                            data = json.load(f)
                            if 'query' in rag_file:
                                scenario_data['latency_ms'] = data.get('latency_ms', 0)
                                scenario_data['status'] = 'completed'
                                
            else:  # Single JSON file scenarios
                file_path = f"{DURING_DIR}/{files}"
                if os.path.exists(file_path):
                    with open(file_path) as f:
                        data = json.load(f)
                        
                    scenario_data['status'] = data.get('status', 'completed')
                    scenario_data['latency_ms'] = data.get('latency_ms', 0)
                    scenario_data['tokens_in'] = data.get('input_tokens', 0)
                    scenario_data['tokens_out'] = data.get('output_tokens', 0)
                    
                    # Extract algorithm info
                    meta = data.get('meta', {})
                    if 'algorithm_path' in meta:
                        scenario_data['algorithm_used'] = meta['algorithm_path']
                    elif 'algorithm_used' in meta:
                        scenario_data['algorithm_used'] = meta['algorithm_used']
                        
        except Exception as e:
            scenario_data['error'] = str(e)
            scenario_data['status'] = 'error'
            
        scenarios[scenario_id] = scenario_data
    
    return scenarios

def main():
    if not os.path.exists(DURING_DIR):
        print(f"❌ During directory not found: {DURING_DIR}")
        return
        
    scenarios = extract_scenario_data()
    
    index = {
        'generated_at': datetime.now().isoformat(),
        'total_scenarios': len(scenarios),
        'completed_scenarios': len([s for s in scenarios.values() if s['status'] == 'completed']),
        'scenarios': scenarios
    }
    
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(index, f, indent=2)
    
    print(f"📋 Scenario index generated: {OUTPUT_FILE}")
    
    # Summary
    completed = index['completed_scenarios']
    total = index['total_scenarios']
    print(f"✅ Scenarios completed: {completed}/{total}")
    
    if completed < total:
        failed = [sid for sid, data in scenarios.items() if data['status'] != 'completed']
        print(f"❌ Failed scenarios: {', '.join(failed)}")

if __name__ == "__main__":
    main()