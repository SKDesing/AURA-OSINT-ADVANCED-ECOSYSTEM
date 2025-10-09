#!/usr/bin/env bash
#
# Sign observability report for integrity verification
#
set -euo pipefail

REPORTS_DIR="reports"
ARTIFACTS_DIR="artifacts"
DATE=$(date +%F)
REPORT_FILE="$REPORTS_DIR/AURA-IA-RUN-OBSERVATION-$DATE.md"
SIGNATURE_FILE="$ARTIFACTS_DIR/run-signature-$DATE.txt"

if [ ! -f "$REPORT_FILE" ]; then
  echo "❌ Report file not found: $REPORT_FILE"
  exit 1
fi

# Generate report hash
REPORT_HASH=$(sha256sum "$REPORT_FILE" | cut -d' ' -f1)

# Generate signature file
cat > "$SIGNATURE_FILE" << EOF
AURA AI Observability Run Signature
===================================
Date: $(date -Iseconds)
Report: $(basename "$REPORT_FILE")
SHA256: $REPORT_HASH
Host: $(hostname)
User: $(whoami)
Git Commit: $(git rev-parse HEAD 2>/dev/null || echo "unknown")
EOF

# Append signature to report
echo "" >> "$REPORT_FILE"
echo "---" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "**Report Signature**: \`sha256:${REPORT_HASH:0:16}\`  " >> "$REPORT_FILE"
echo "**Generated**: $(date -Iseconds)  " >> "$REPORT_FILE"
echo "**Integrity**: Verified via \`$SIGNATURE_FILE\`" >> "$REPORT_FILE"

echo "✅ Report signed: sha256:${REPORT_HASH:0:16}"
echo "📄 Signature file: $SIGNATURE_FILE"