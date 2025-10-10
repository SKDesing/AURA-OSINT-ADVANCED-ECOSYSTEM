# Compliance Roadmap (GDPR, SOC2, ISO27001-ready)

## 🇪🇺 GDPR Compliance

### Registres & Documentation
- [ ] **ROPA** (Registre des activités de traitement)
- [ ] **DPIA** (Data Protection Impact Assessment)
- [ ] **DPA templates** pour partenaires/clients
- [ ] **Politique de rétention** avec purge automatique
- [ ] **DSR playbooks** (Data Subject Rights)

### Minimisation & Protection
- [ ] **Schémas PII-safe** avec pseudonymisation
- [ ] **Chiffrement au repos** (AES-256) et en transit
- [ ] **Journaux d'audit immuables** (WORM)
- [ ] **Consentements** quand requis avec révocation

## 🛡️ SOC2 Type 1 (90j readiness)

### Politiques Requises
- [ ] **Access Control Policy** (SSO+MFA obligatoire)
- [ ] **Change Management Policy** (CI/CD + approvals)
- [ ] **Incident Response Policy** (MTTR < 30min)
- [ ] **Backup & DR Policy** (RTO/RPO définis)
- [ ] **Vendor Management Policy** (due diligence)

### Contrôles Techniques
- [ ] **SSO+MFA** pour tous les accès admin
- [ ] **PAM** (Privileged Access Management)
- [ ] **Secrets management** (SOPS/age + KMS)
- [ ] **Revues trimestrielles** des accès
- [ ] **Monitoring** avec alertes automatiques

### Evidence Pack
- [ ] **Tickets** d'incidents avec résolution
- [ ] **Pipelines CI** avec tests sécurité
- [ ] **Scans** de vulnérabilités réguliers
- [ ] **Journaux** d'accès et modifications
- [ ] **Formations** sécurité équipe

## 🔐 Sécurité Interne

### Secrets & Clés
- [ ] **GitLeaks + BFG** en CI/CD
- [ ] **Rotation clés** tous les 90 jours
- [ ] **SOPS/age + KMS** pour secrets
- [ ] **0 secret en Git** (audit continu)

### Supply Chain
- [ ] **SBOM** (Software Bill of Materials)
- [ ] **OWASP Dependency-Check** automatisé
- [ ] **GitHub Advanced Security** activé
- [ ] **Licences** compatibles recensées

### Threat Modeling
- [ ] **STRIDE** par composant critique
- [ ] **Attack surface** documentée
- [ ] **Mitigations** implémentées et testées
- [ ] **Red team** exercises trimestriels