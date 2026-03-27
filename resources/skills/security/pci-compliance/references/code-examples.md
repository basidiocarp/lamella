# PCI Compliance Code Examples

Use these examples to anchor implementation reviews. The goal is to minimize card-data exposure, not to build a larger custom vault than necessary.

## Data Minimization

```python
PROHIBITED_FIELDS = {"full_track_data", "cvv", "pin"}

def reject_prohibited_fields(data: dict) -> None:
    for field in PROHIBITED_FIELDS:
        if field in data:
            raise SecurityError(f"Attempting to store prohibited field: {field}")
```

Review for:

- accidental CVV storage
- debug payload dumps
- logs that capture raw PAN or track data

## Tokenization with a Processor

Prefer processor tokens over custom storage whenever possible.

```python
import stripe

class TokenizedPayment:
    @staticmethod
    def charge_with_token(token_id: str, amount: int) -> dict:
        charge = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            payment_method=token_id,
            confirm=True,
        )
        return {"payment_intent_id": charge.id, "status": charge.status}
```

## Custom Token Vault

If you must build a vault, keep the mapping explicit and encrypted.

```python
import secrets
from cryptography.fernet import Fernet

class TokenVault:
    def __init__(self, encryption_key: bytes):
        self.fernet = Fernet(encryption_key)
        self.vault = {}

    def store_pan(self, pan: str) -> str:
        token = secrets.token_urlsafe(24)
        self.vault[token] = self.fernet.encrypt(pan.encode())
        return token

    def resolve_pan(self, token: str) -> str:
        ciphertext = self.vault[token]
        return self.fernet.decrypt(ciphertext).decode()

    def delete_token(self, token: str) -> None:
        self.vault.pop(token, None)
```

## Encryption at Rest

```python
import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

class EncryptedStorage:
    def __init__(self, key: bytes):
        self.key = key

    def encrypt(self, plaintext: str) -> tuple[bytes, bytes]:
        nonce = os.urandom(12)
        ciphertext = AESGCM(self.key).encrypt(nonce, plaintext.encode(), None)
        return nonce, ciphertext

    def decrypt(self, nonce: bytes, ciphertext: bytes) -> str:
        plaintext = AESGCM(self.key).decrypt(nonce, ciphertext, None)
        return plaintext.decode()
```

## Access Control

```python
from functools import wraps
from flask import session

def require_pci_access(handler):
    @wraps(handler)
    def wrapped(*args, **kwargs):
        user = session.get("user")
        if not user or "pci_access" not in user.get("roles", []):
            return {"error": "Unauthorized access to cardholder data"}, 403
        audit_log(user=user["id"], action="access_cardholder_data", resource=handler.__name__)
        return handler(*args, **kwargs)
    return wrapped
```

## Audit Logging

```python
import json
import logging

class PCIAuditLogger:
    def __init__(self):
        self.logger = logging.getLogger("pci_audit")

    def log_access(self, user_id: str, resource: str, action: str, result: str, ip_address: str) -> None:
        entry = {
            "user_id": user_id,
            "resource": resource,
            "action": action,
            "result": result,
            "ip_address": ip_address,
        }
        self.logger.info(json.dumps(entry))
```

## Card Number Validation

```python
import re

def validate_card_number(card_number: str) -> bool:
    digits = re.sub(r"[\s-]", "", card_number)
    if not digits.isdigit():
        return False

    checksum = 0
    for index, digit in enumerate(reversed(digits)):
        value = int(digit)
        if index % 2 == 1:
            value *= 2
            if value > 9:
                value -= 9
        checksum += value

    return checksum % 10 == 0
```

Validation is not storage approval. A valid PAN is still sensitive data.
