#!/usr/bin/env python3
"""
Qwen Direct - Sans Ollama
API HTTP pour Qwen via Transformers
"""

from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import json

app = Flask(__name__)

# Charger le modèle Qwen
print("🔄 Chargement de Qwen...")
model_name = "Qwen/Qwen2.5-7B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map="auto"
)
print("✅ Qwen chargé!")

@app.route('/api/generate', methods=['POST'])
def generate():
    data = request.json
    prompt = data.get('prompt', '')
    
    # Tokenize et générer
    inputs = tokenizer(prompt, return_tensors="pt")
    
    with torch.no_grad():
        outputs = model.generate(
            inputs.input_ids,
            max_length=inputs.input_ids.shape[1] + 500,
            temperature=0.3,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id
        )
    
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    response = response[len(prompt):].strip()
    
    return jsonify({"response": response})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "model": "qwen2.5-7b"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=11434)