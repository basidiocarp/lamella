# Troubleshooting

Use this reference when Microsoft 365 or Entra ID admin flows fail in ways that are easy to misdiagnose.

## Authentication

### MFA required

Cause: the account needs MFA and the session path cannot satisfy it.

Try:

```powershell
Connect-MgGraph -Scopes "User.Read.All" -UseDeviceAuthentication
```

### Consent missing

Cause: the app registration or delegated session lacks required consent.

Try:

- grant admin consent
- retry with the correct admin account
- confirm the requested scopes match the task

## Module Issues

### Microsoft.Graph command missing

```powershell
Install-Module Microsoft.Graph -Scope CurrentUser -Force
Import-Module Microsoft.Graph
```

### Exchange Online connection failure

```powershell
Connect-ExchangeOnline -UserPrincipalName admin@tenant.com
Connect-ExchangeOnline -Device
```

## Common Admin Failures

- `UsageLocation` missing before license assignment
- role activation delay after PIM activation
- throttling from large Graph reads
- Conditional Access blocking the admin path being tested

When a change looks broken, verify role scope, policy state, and module health before assuming tenant corruption.
