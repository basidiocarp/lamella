# PCI Compliance Code Examples

## Data Minimization

```python
PROHIBITED_DATA = {
    'full_track_data': 'Magnetic stripe data',
    'cvv': 'Card verification code/value',
    'pin': 'PIN or PIN block'
}
// ... (22 lines trimmed)
        for field in self.prohibited_fields:
            if field in data:
                raise SecurityError(f"Attempting to store prohibited field: {field}")
```

## Tokenization with Stripe

```python
import stripe

class TokenizedPayment:
    @staticmethod
    def charge_with_token(token_id, amount):
// ... (13 lines trimmed)
            'customer_id': customer_id,
            'has_payment_method': True
        }
```

## Custom Tokenization

```python
import secrets
from cryptography.fernet import Fernet

class TokenVault:
    def __init__(self, encryption_key):
// ... (15 lines trimmed)

    def delete_token(self, token):
        self.vault.pop(token, None)
```

## Encryption at Rest (AES-256-GCM)

```python
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

class EncryptedStorage:
    def __init__(self, encryption_key):
// ... (11 lines trimmed)
        aesgcm = AESGCM(self.key)
        plaintext = aesgcm.decrypt(nonce, ciphertext, None)
        return plaintext.decode()
```

## Access Control Decorator

```python
from functools import wraps
from flask import session

def require_pci_access(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = session.get('user')
        if not user or 'pci_access' not in user.get('roles', []):
            return {'error': 'Unauthorized access to cardholder data'}, 403
        audit_log(user=user['id'], action='access_cardholder_data', resource=f.__name__)
        return f(*args, **kwargs)
    return decorated_function
```

## Audit Logging

```python
class PCIAuditLogger:
    def __init__(self):
        self.logger = logging.getLogger('pci_audit')

    def log_access(self, user_id, resource, action, result):
// ... (17 lines trimmed)
            'ip_address': request.remote_addr
        }
        self.logger.info(json.dumps(entry))
```

## Input Validation (Luhn Algorithm)

```python
import re

def validate_card_number(card_number):
    card_number = re.sub(r'[\s-]', '', card_number)
    if not card_number.isdigit():
// ... (11 lines trimmed)
        return checksum % 10

    return luhn_checksum(card_number) == 0
```
