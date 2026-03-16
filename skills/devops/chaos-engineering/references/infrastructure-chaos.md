# Infrastructure Chaos Engineering

## Network Latency Injection

```python
# Using toxiproxy for network chaos
import requests
from typing import Literal

class ToxiproxyClient:
// ... (58 lines trimmed)

# Inject 200ms latency with 50ms jitter
toxiproxy.add_latency("postgres", latency_ms=200, jitter_ms=50)
```

## AWS Zone Failure Simulation

```python
import boto3
from datetime import datetime, timedelta

class AWSChaosSimulator:
    def __init__(self, region: str):
// ... (75 lines trimmed)
            "deregistered_targets": len(targets_to_deregister),
            "availability_zone": availability_zone
        }
```

## Server Resource Exhaustion

```bash
#!/bin/bash
# CPU stress test using stress-ng

# Install stress-ng
sudo apt-get install -y stress-ng
// ... (12 lines trimmed)
# Network bandwidth saturation
# Using iperf3 to saturate network
iperf3 -c target-server -t 300 -P 10  # 10 parallel streams for 5 minutes
```

## Docker Container Chaos with Pumba

```bash
#!/bin/bash
# Pumba - chaos testing for Docker

# Kill random container every 30 seconds
pumba --interval 30s kill --signal SIGKILL "re2:^myapp"
// ... (26 lines trimmed)

# Stop all containers matching pattern for 2 minutes
pumba stop --duration 2m "re2:^production-.*"
```

## DNS Failure Simulation

```python
# Using dnsmasq or editing /etc/hosts for DNS chaos

import subprocess
import time
from contextlib import contextmanager
// ... (42 lines trimmed)
with DNSChaos.block_domain('api.external-service.com', duration_seconds=120):
    # Run tests while DNS is blocked
    print("DNS blocked - testing fallback behavior")
```

## Certificate Expiry Simulation

```python
from datetime import datetime, timedelta
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
// ... (43 lines trimmed)
    )

    return cert_pem, key_pem
```

## Quick Reference

| Failure Type | Tool | Command/Method |
|--------------|------|----------------|
| Network latency | toxiproxy | `add_latency(proxy, ms)` |
| Packet loss | toxiproxy/pumba | `loss --percent 20` |
| AZ failure | AWS API | `simulate_az_failure(az, asg)` |
| CPU stress | stress-ng | `--cpu N --cpu-load 80` |
| Memory exhaustion | stress-ng | `--vm 1 --vm-bytes XG` |
| Container kill | pumba | `kill --signal SIGKILL` |
| DNS failure | /etc/hosts | Block domain resolution |
| Cert expiry | cryptography | Generate expired cert |
