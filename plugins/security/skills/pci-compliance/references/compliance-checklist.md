# PCI DSS Compliance Checklist

## Network Security

- [ ] Firewall configured and maintained
- [ ] No vendor default passwords
- [ ] Network segmentation implemented

## Data Protection

- [ ] No storage of CVV, track data, or PIN
- [ ] PAN encrypted when stored
- [ ] PAN masked when displayed
- [ ] Encryption keys properly managed

## Vulnerability Management

- [ ] Anti-virus installed and updated
- [ ] Secure development practices
- [ ] Regular security patches
- [ ] Vulnerability scanning performed

## Access Control

- [ ] Access restricted by role
- [ ] Unique IDs for all users
- [ ] Multi-factor authentication
- [ ] Physical security measures

## Monitoring

- [ ] Audit logs enabled
- [ ] Log review process
- [ ] File integrity monitoring
- [ ] Regular security testing

## Policy

- [ ] Security policy documented
- [ ] Risk assessment performed
- [ ] Security awareness training
- [ ] Incident response plan

---

## SAQ Types

### SAQ A (Least Requirements ~20 questions)
- E-commerce using hosted payment page
- No card data on your systems

### SAQ A-EP (~180 questions)
- E-commerce with embedded payment form
- Uses JavaScript to handle card data

### SAQ D (Most Requirements ~300 questions)
- Store, process, or transmit card data
- Full PCI DSS requirements

---

## Common Violations

1. **Storing CVV**: Never store card verification codes
2. **Unencrypted PAN**: Card numbers must be encrypted at rest
3. **Weak Encryption**: Use AES-256 or equivalent
4. **No Access Controls**: Restrict who can access cardholder data
5. **Missing Audit Logs**: Must log all access to payment data
6. **Insecure Transmission**: Always use TLS 1.2+
7. **Default Passwords**: Change all default credentials
8. **No Security Testing**: Regular penetration testing required

---

## Reducing PCI Scope

1. **Use Hosted Payments**: Stripe Checkout, PayPal, etc.
2. **Tokenization**: Replace card data with tokens
3. **Network Segmentation**: Isolate cardholder data environment
4. **Outsource**: Use PCI-compliant payment processors
5. **No Storage**: Never store full card details
