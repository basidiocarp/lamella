# Network and Observability

## Network Exposure

Check:

- databases are private
- SSH or RDP is restricted to VPN, bastion, or an equivalent admin path
- ingress rules are narrow by port and source
- flow logs or equivalent network telemetry are enabled

Example restricted security group:

```terraform
resource "aws_security_group" "app" {
  name = "app-sg"

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["203.0.113.0/24"]
  }
}
```

## Logging and Monitoring

Security reviews should verify:

- auth failures are logged
- admin actions are auditable
- retention meets policy needs
- alerts exist for suspicious events

```typescript
const logSecurityEvent = async (event: SecurityEvent) => {
  await cloudwatch.putLogEvents({
    logGroupName: "security-events",
    logStreamName: "prod-app",
    logEvents: [{ timestamp: Date.now(), message: JSON.stringify(event) }],
  })
}
```
