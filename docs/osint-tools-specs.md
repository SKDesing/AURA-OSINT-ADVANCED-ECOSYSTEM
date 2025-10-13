# 📋 SPÉCIFICATIONS TECHNIQUES - OUTILS OSINT

## 🔍 SHERLOCK - Username Search

### Input
```json
{
  "type": "username",
  "value": "john_doe"
}
```

### Command
```bash
sherlock john_doe --json --output /tmp/sherlock_results.json
```

### Output
```json
{
  "john_doe": {
    "Instagram": {
      "url": "https://instagram.com/john_doe",
      "status": "found"
    },
    "Twitter": {
      "url": "https://twitter.com/john_doe",
      "status": "found"
    }
  }
}
```

### Wrapper
```javascript
async function runSherlock(username) {
  const { exec } = require('child_process');
  return new Promise((resolve, reject) => {
    exec(`sherlock ${username} --json`, (error, stdout) => {
      if (error) reject(error);
      resolve(JSON.parse(stdout));
    });
  });
}
```

---

## 🔍 HOLEHE - Email to Sites

### Input
```json
{
  "type": "email",
  "value": "john@example.com"
}
```

### Command
```bash
holehe john@example.com --json
```

### Output
```json
{
  "email": "john@example.com",
  "results": [
    {"site": "twitter", "exists": true},
    {"site": "instagram", "exists": true}
  ]
}
```

---

## 🔀 AMASS - Subdomain Enum

### Input
```json
{
  "type": "domain",
  "value": "example.com"
}
```

### Command
```bash
amass enum -d example.com -json /tmp/amass_results.json
```

### Output
```json
{
  "domain": "example.com",
  "subdomains": [
    "www.example.com",
    "mail.example.com",
    "api.example.com"
  ]
}
```

---

## 🔀 SUBFINDER - Subdomain Discovery

### Input
```json
{
  "type": "domain",
  "value": "example.com"
}
```

### Command
```bash
subfinder -d example.com -json -o /tmp/subfinder_results.json
```

### Output
```json
{
  "host": "www.example.com",
  "ip": "93.184.216.34",
  "source": "crtsh"
}
```

---

## 🔍 MAIGRET - Username Search (Advanced)

### Input
```json
{
  "type": "username",
  "value": "john_doe"
}
```

### Command
```bash
maigret john_doe --json /tmp/maigret_results.json
```

### Output
```json
{
  "username": "john_doe",
  "sites": [
    {
      "site": "GitHub",
      "url": "https://github.com/john_doe",
      "status": "found"
    }
  ]
}
```

---

## 📊 RÉSUMÉ - INPUTS/OUTPUTS

| Outil | Input Type | Output Format | Avg Time | API Key |
|-------|-----------|---------------|----------|---------|
| Sherlock | Username | JSON | 30s | ❌ |
| Holehe | Email | JSON | 15s | ❌ |
| Amass | Domain | JSON | 2-5min | ❌ |
| Subfinder | Domain | JSON | 30s | ❌ |
| Maigret | Username | JSON | 45s | ❌ |
| DNSRecon | Domain | Text | 30s | ❌ |
| Nmap | IP/Domain | XML | 1-5min | ❌ |
| Whois | Domain | Text | 5s | ❌ |

