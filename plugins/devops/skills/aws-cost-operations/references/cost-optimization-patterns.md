# Cost Optimization Patterns

Use these patterns when the user needs savings guidance, pre-deployment estimates, or a concrete monthly cost review workflow.

## Pattern 1: Cost estimation before deployment

**When**: Before approving new AWS infrastructure.

**MCP server**: AWS Pricing MCP

**Workflow**:
1. List every planned resource and expected usage.
2. Query pricing for the target region and one fallback region.
3. Convert usage assumptions into monthly cost.
4. Flag high-variance resources such as Lambda, NAT, data transfer, and storage growth.
5. Record the estimate next to the architecture decision.

**Example estimate**:
```text
Resource: Lambda Function
Invocations: 1,000,000/month
Duration: 3 seconds average
Memory: 512 MB
Region: us-east-1
Estimated monthly cost: <pricing query result>
```

## Pattern 2: Monthly cost review

**When**: First week of every month.

**MCP servers**: Cost Explorer MCP, Billing and Cost Management MCP

**Workflow**:
1. Review total spend against budget.
2. Rank top services by monthly cost.
3. Identify anomalies above the team threshold.
4. Break cost down by environment, application, or tag.
5. Flag untagged or mis-tagged spend.
6. Turn findings into a short optimization list with expected savings.

**Metrics to capture**:
- month-over-month delta
- cost by service
- cost by environment
- untagged cost

## Pattern 3: Right-sizing

**When**: Quarterly, or when utilization alarms suggest waste.

**MCP servers**: CloudWatch MCP, Cost Explorer MCP

**Workflow**:
1. Pull utilization for EC2, RDS, DynamoDB, and Lambda.
2. Identify over-provisioned resources with sustained low usage.
3. Identify under-provisioned resources that need scale rather than cost cuts.
4. Estimate savings from the proposed change.
5. Apply the resize in the lowest-risk environment first.
6. Re-check performance after the change.

**Common targets**:
- EC2 instances with low CPU
- RDS instances with excess headroom
- DynamoDB tables with low sustained throughput
- Lambda functions with oversized memory

## Pattern 4: Unused resource cleanup

**When**: Monthly, or after a cost anomaly.

**MCP servers**: Cost Explorer MCP, CloudTrail MCP

**Workflow**:
1. List idle or zero-usage resources.
2. Check CloudTrail for recent access or mutation.
3. Tag candidates for review.
4. Confirm ownership before deletion.
5. Remove confirmed-unused resources.
6. Record savings and update any recurring cleanup automation.

**Typical cleanup list**:
- unattached EBS volumes
- old snapshots and AMIs
- idle load balancers
- unused Elastic IPs
- long-stopped EC2 instances
