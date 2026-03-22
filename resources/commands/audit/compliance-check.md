# Regulatory Compliance Check

## Context

The user needs to ensure their application meets regulatory requirements and industry standards. Focus on practical implementation of compliance controls, automated monitoring, and audit trail generation.

## Requirements

$ARGUMENTS

## Instructions

### 1. Compliance Framework Analysis

Identify applicable regulations and standards:

**Regulatory Mapping**

```python
class ComplianceAnalyzer:
    def __init__(self):
        self.regulations = {
            'GDPR': {
                'scope': 'EU data protection',
                'applies_if': [
                    'Processing EU residents data',
# ... (79 lines trimmed for brevity)

        return sorted(applicable, key=lambda x: x['priority'], reverse=True)
```

### 2. Data Privacy Compliance

Implement privacy controls:

**GDPR Implementation**

````python
class GDPRCompliance:
    def implement_privacy_controls(self):
        """
        Implement GDPR-required privacy controls
        """
        controls = {}

# ... (119 lines trimmed for brevity)

**Privacy by Design**
```python
# Implement privacy by design principles
class PrivacyByDesign:
    def implement_data_minimization(self):
        """
        Collect only necessary data
        """
        # Before (collecting too much)
        bad_user_model = {
            'email': str,
            'password': str,
            'full_name': str,
            'date_of_birth': date,
            'ssn': str,  # Unnecessary
            'address': str,  # Unnecessary for basic service
            'phone': str,  # Unnecessary
            'gender': str,  # Unnecessary
            'income': int  # Unnecessary
        }

        # After (data minimization)
        good_user_model = {
            'email': str,  # Required for authentication
            'password_hash': str,  # Never store plain text
            'display_name': str,  # Optional, user-provided
            'created_at': datetime,
            'last_login': datetime
        }

        return good_user_model

    def implement_pseudonymization(self):
        """
        Replace identifying fields with pseudonyms
        """
        def pseudonymize_record(record):
            # Generate consistent pseudonym
            user_pseudonym = hashlib.sha256(
                f"{record['user_id']}{SECRET_SALT}".encode()
            ).hexdigest()[:16]

            return {
                'pseudonym': user_pseudonym,
                'data': {
                    # Remove direct identifiers
                    'age_group': self._get_age_group(record['age']),
                    'region': self._get_region(record['ip_address']),
                    'activity': record['activity_data']
                }
            }
````

### 3. Security Compliance

Implement security controls for various standards:

**SOC2 Security Controls**

```python
class SOC2SecurityControls:
    def implement_access_controls(self):
        """
        SOC2 CC6.1 - Logical and physical access controls
        """
        controls = {
            'authentication': '''
# Multi-factor authentication
class MFAEnforcement:
    def enforce_mfa(self, user, resource_sensitivity):
        if resource_sensitivity == 'high':
            return self.require_mfa(user)
        elif resource_sensitivity == 'medium' and user.is_admin:
            return self.require_mfa(user)
        return self.standard_auth(user)

    def require_mfa(self, user):
        factors = []

        # Factor 1: Password (something you know)
        factors.append(self.verify_password(user))

        # Factor 2: TOTP/SMS (something you have)
        if user.mfa_method == 'totp':
            factors.append(self.verify_totp(user))
        elif user.mfa_method == 'sms':
            factors.append(self.verify_sms_code(user))

        # Factor 3: Biometric (something you are) - optional
        if user.biometric_enabled:
            factors.append(self.verify_biometric(user))

        return all(factors)
''',
            'authorization': '''
# Role-based access control
class RBACAuthorization:
    def __init__(self):
        self.roles = {
            'admin': ['read', 'write', 'delete', 'admin'],
            'user': ['read', 'write:own'],
            'viewer': ['read']
        }

    def check_permission(self, user, resource, action):
        user_permissions = self.get_user_permissions(user)

        # Check explicit permissions
        if action in user_permissions:
            return True

        # Check ownership-based permissions
        if f"{action}:own" in user_permissions:
            return self.user_owns_resource(user, resource)

        # Log denied access attempt
        self.log_access_denied(user, resource, action)
        return False
''',
            'encryption': '''
# Encryption at rest and in transit
class EncryptionControls:
    def __init__(self):
        self.kms = KeyManagementService()

    def encrypt_at_rest(self, data, classification):
        if classification == 'sensitive':
            # Use envelope encryption
            dek = self.kms.generate_data_encryption_key()
            encrypted_data = self.encrypt_with_key(data, dek)
            encrypted_dek = self.kms.encrypt_key(dek)

            return {
                'data': encrypted_data,
                'encrypted_key': encrypted_dek,
                'algorithm': 'AES-256-GCM',
                'key_id': self.kms.get_current_key_id()
            }

    def configure_tls(self):
        return {
            'min_version': 'TLS1.2',
            'ciphers': [
                'ECDHE-RSA-AES256-GCM-SHA384',
                'ECDHE-RSA-AES128-GCM-SHA256'
            ],
            'hsts': 'max-age=31536000; includeSubDomains',
            'certificate_pinning': True
        }
'''
        }

        return controls
```

### 4. Audit Logging and Monitoring

Implement comprehensive audit trails:

**Audit Log System**

```python
class ComplianceAuditLogger:
    def __init__(self):
        self.required_events = {
            'authentication': [
                'login_success',
                'login_failure',
                'logout',
                'password_change',
                'mfa_enabled',
                'mfa_disabled'
            ],
            'authorization': [
                'access_granted',
                'access_denied',
                'permission_changed',
                'role_assigned',
                'role_revoked'
            ],
            'data_access': [
                'data_viewed',
                'data_exported',
                'data_modified',
                'data_deleted',
                'bulk_operation'
            ],
            'compliance': [
                'consent_given',
                'consent_withdrawn',
                'data_request',
                'data_erasure',
                'privacy_settings_changed'
            ]
        }

    def log_event(self, event_type, details):
        """
        Create tamper-proof audit log entry
        """
        log_entry = {
            'id': str(uuid.uuid4()),
            'timestamp': datetime.utcnow().isoformat(),
            'event_type': event_type,
            'user_id': details.get('user_id'),
            'ip_address': self._get_ip_address(),
            'user_agent': request.headers.get('User-Agent'),
            'session_id': session.get('id'),
            'details': details,
            'compliance_flags': self._get_compliance_flags(event_type)
        }

        # Add integrity check
        log_entry['checksum'] = self._calculate_checksum(log_entry)

        # Store in immutable log
        self._store_audit_log(log_entry)

        # Real-time alerting for critical events
        if self._is_critical_event(event_type):
            self._send_security_alert(log_entry)

        return log_entry

    def _calculate_checksum(self, entry):
        """
        Create tamper-evident checksum
        """
        # Include previous entry hash for blockchain-like integrity
        previous_hash = self._get_previous_entry_hash()

        content = json.dumps(entry, sort_keys=True)
        return hashlib.sha256(
            f"{previous_hash}{content}{SECRET_KEY}".encode()
        ).hexdigest()
```

**Compliance Reporting**

```python
def generate_compliance_report(self, regulation, period):
    """
    Generate compliance report for auditors
    """
    report = {
        'regulation': regulation,
        'period': period,
        'generated_at': datetime.utcnow(),
        'sections': {}
    }

    if regulation == 'GDPR':
        report['sections'] = {
            'data_processing_activities': self._get_processing_activities(period),
            'consent_metrics': self._get_consent_metrics(period),
            'data_requests': {
                'access_requests': self._count_access_requests(period),
                'erasure_requests': self._count_erasure_requests(period),
                'portability_requests': self._count_portability_requests(period),
                'response_times': self._calculate_response_times(period)
            },
            'data_breaches': self._get_breach_reports(period),
            'third_party_processors': self._list_processors(),
            'privacy_impact_assessments': self._get_dpias(period)
        }

    elif regulation == 'HIPAA':
        report['sections'] = {
            'access_controls': self._audit_access_controls(period),
            'phi_access_log': self._get_phi_access_log(period),
            'risk_assessments': self._get_risk_assessments(period),
            'training_records': self._get_training_compliance(period),
            'business_associates': self._list_bas_with_agreements(),
            'incident_response': self._get_incident_reports(period)
        }

    return report
```

## Output Format

1. **Compliance Assessment**: Current compliance status across all applicable regulations
2. **Gap Analysis**: Specific areas needing attention with severity ratings
3. **Implementation Plan**: Prioritized roadmap for achieving compliance
4. **Technical Controls**: Code implementations for required controls

Focus on practical implementation that balances compliance requirements with business operations and user experience.

