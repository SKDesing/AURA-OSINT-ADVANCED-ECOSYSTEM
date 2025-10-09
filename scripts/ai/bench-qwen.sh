#!/usr/bin/env bash
set -e

echo "🚀 AURA Qwen Benchmark - Phase 1"
echo "================================="

PORT=${AI_QWEN_PORT:-8090}
ENDPOINT="http://127.0.0.1:$PORT/completion"

# Check if server is running
if ! curl -s --connect-timeout 2 "$ENDPOINT" > /dev/null 2>&1; then
    echo "❌ Qwen server not accessible on port $PORT"
    echo "   Start with: bash ai/local-llm/scripts/run-llm-qwen.sh"
    exit 1
fi

echo "✅ Qwen server detected on port $PORT"
echo ""

# Test prompts (multilingual + OSINT focused)
prompts=(
    "Summarize: AURA OSINT architecture."
    "Explain difference between local and cloud inference."
    "Décris brièvement la sécurité IA."
    "Provide JSON: {\"fields\":[\"risks\",\"controls\"]} about harassment detection."
    "你好，用一句话说明AURA。"
    "Analyze threat level: suspicious user behavior patterns."
    "Extract entities from: John Doe, Paris, @suspicious_account"
    "Timeline reconstruction for OSINT investigation."
)

total_time=0
total_requests=0
total_tokens=0

echo "📊 Running benchmark tests..."
echo ""

for i in "${!prompts[@]}"; do
    prompt="${prompts[$i]}"
    
    # Prepare JSON payload
    payload=$(jq -n --arg pr "$prompt" '{
        prompt: $pr,
        n_predict: 160,
        temperature: 0.4,
        stop: ["</s>", "\n\n"]
    }')
    
    # Measure request time
    start=$(date +%s%3N)
    
    response=$(curl -s -X POST "$ENDPOINT" \
        -H "Content-Type: application/json" \
        -d "$payload")
    
    end=$(date +%s%3N)
    duration=$((end - start))
    
    # Extract response text
    output=$(echo "$response" | jq -r '.content // "" | if type == "array" then .[0].text // "" else . end')
    
    # Estimate tokens (rough: 4 chars per token)
    input_tokens=$(( ${#prompt} / 4 ))
    output_tokens=$(( ${#output} / 4 ))
    
    total_time=$((total_time + duration))
    total_requests=$((total_requests + 1))
    total_tokens=$((total_tokens + input_tokens + output_tokens))
    
    # Display result
    printf "Test %d: %s\n" $((i + 1)) "${prompt:0:40}..."
    printf "  ⏱️  Latency: %d ms\n" "$duration"
    printf "  📝 Tokens: %d in + %d out\n" "$input_tokens" "$output_tokens"
    printf "  📄 Output: %s\n" "${output:0:60}..."
    echo ""
done

# Calculate averages
avg_latency=$((total_time / total_requests))
tokens_per_sec=$((total_tokens * 1000 / total_time))

echo "📈 BENCHMARK RESULTS"
echo "===================="
echo "Total requests: $total_requests"
echo "Average latency: ${avg_latency}ms"
echo "Total tokens: $total_tokens"
echo "Tokens/second: $tokens_per_sec"
echo ""

# Validate against targets
echo "🎯 TARGET VALIDATION"
echo "===================="

if [ "$avg_latency" -lt 2500 ]; then
    echo "✅ Latency target: ${avg_latency}ms < 2500ms"
else
    echo "❌ Latency target: ${avg_latency}ms >= 2500ms"
fi

if [ "$tokens_per_sec" -gt 15 ]; then
    echo "✅ Throughput target: ${tokens_per_sec} tokens/s > 15"
else
    echo "❌ Throughput target: ${tokens_per_sec} tokens/s <= 15"
fi

echo ""
echo "🏁 Benchmark completed"