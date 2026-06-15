# PowerShell Recipes

Use these patterns as starting points for Microsoft 365 and Entra ID admin work.

## Security Audit

```powershell
Connect-MgGraph -Scopes "Directory.Read.All","Policy.Read.All","AuditLog.Read.All"
Get-MgSubscribedSku | Select-Object SkuPartNumber, ConsumedUnits, @{N="Total";E={$_.PrepaidUnits.Enabled}}
Get-MgPolicyAuthorizationPolicy | Select-Object AllowInvitesFrom, DefaultUserRolePermissions
```

## Bulk Provisioning

```powershell
Import-Csv .\employees.csv | ForEach-Object {
    $passwordProfile = @{
        Password = (New-Guid).ToString().Substring(0,16) + "!"
        ForceChangePasswordNextSignIn = $true
    }

    New-MgUser -DisplayName $_.DisplayName `
               -UserPrincipalName $_.UserPrincipalName `
               -Department $_.Department `
               -AccountEnabled `
               -PasswordProfile $passwordProfile
}
```

## Conditional Access In Report-Only Mode

```powershell
$policy = @{
    DisplayName = "Require MFA for Admins"
    State = "enabledForReportingButNotEnforced"
    Conditions = @{ Users = @{ IncludeRoles = $adminRoles } }
    GrantControls = @{ Operator = "OR"; BuiltInControls = @("mfa") }
}

New-MgIdentityConditionalAccessPolicy -BodyParameter $policy
```

## Offboarding

```powershell
$user = Get-MgUser -Filter "userPrincipalName eq '$upn'"
Update-MgUser -UserId $user.Id -AccountEnabled:$false
Invoke-MgInvalidateAllUserRefreshToken -UserId $user.Id
```

## Safety Checks

- prefer report-only policies before enforcement
- set usage location before assigning licenses
- use dry-run output before bulk license removal
- verify module and scope setup before blaming the tenant
