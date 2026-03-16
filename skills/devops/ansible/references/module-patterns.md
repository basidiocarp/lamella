# Common Ansible Module Usage Patterns

## Core Modules (ansible.builtin)

### Package Management

#### ansible.builtin.package (Universal)
```yaml
- name: Install package (OS-agnostic)
  ansible.builtin.package:
    name: nginx
    state: present
```

#### ansible.builtin.apt (Debian/Ubuntu)
```yaml
- name: Install package with apt
  ansible.builtin.apt:
    name: nginx
    state: present
    update_cache: true
// ... (11 lines trimmed)
      - postgresql
      - redis-server
    state: present
```

#### ansible.builtin.dnf (RHEL 8+/CentOS 8+) - Recommended
```yaml
# NOTE: Use ansible.builtin.dnf for RHEL 8+ and CentOS 8+
# ansible.builtin.yum is deprecated in favor of dnf for modern RHEL systems

- name: Install package with dnf
  ansible.builtin.dnf:
// ... (14 lines trimmed)
      - postgresql
      - redis
    state: present
```

#### ansible.builtin.yum (RHEL 7/CentOS 7 - Legacy)
```yaml
# NOTE: Only use for RHEL 7/CentOS 7 systems
# For RHEL 8+ use ansible.builtin.dnf instead

- name: Install package with yum (legacy systems)
// ... (8 lines trimmed)
    state: present
    enablerepo: epel
```

### File Operations

#### ansible.builtin.file
```yaml
# Create directory
- name: Create directory
  ansible.builtin.file:
    path: /opt/app/config
    state: directory
// ... (22 lines trimmed)
    mode: '0600'
    owner: root
    group: root
```

#### ansible.builtin.copy
```yaml
# Copy file from control node
- name: Copy configuration file
  ansible.builtin.copy:
    src: files/nginx.conf
    dest: /etc/nginx/nginx.conf
// ... (20 lines trimmed)
    src: /tmp/source.txt
    dest: /opt/destination.txt
    remote_src: true
```

#### ansible.builtin.template
```yaml
- name: Deploy configuration from template
  ansible.builtin.template:
    src: templates/app_config.j2
    dest: /etc/app/config.yml
    mode: '0644'
    owner: appuser
    group: appgroup
    backup: true
    validate: '/usr/bin/app validate %s'
```

#### ansible.builtin.fetch
```yaml
- name: Fetch file from remote to control node
  ansible.builtin.fetch:
    src: /var/log/app/error.log
    dest: /tmp/logs/{{ inventory_hostname }}/
    flat: true
```

#### ansible.builtin.lineinfile
```yaml
- name: Ensure line is present
  ansible.builtin.lineinfile:
    path: /etc/hosts
    line: '192.168.1.100 app.local'
    state: present
// ... (12 lines trimmed)
    path: /etc/hosts
    regexp: '.*old-server.*'
    state: absent
```

#### ansible.builtin.blockinfile
```yaml
- name: Add block of text
  ansible.builtin.blockinfile:
    path: /etc/hosts
    block: |
      192.168.1.10 web1.local
      192.168.1.11 web2.local
      192.168.1.20 db1.local
    marker: "# {mark} ANSIBLE MANAGED BLOCK - SERVERS"
    backup: true
```

### Service Management

#### ansible.builtin.service
```yaml
- name: Ensure service is running
  ansible.builtin.service:
    name: nginx
    state: started
    enabled: true
// ... (8 lines trimmed)
    name: apache2
    state: stopped
    enabled: false
```

#### ansible.builtin.systemd
```yaml
- name: Reload systemd daemon
  ansible.builtin.systemd:
    daemon_reload: true

// ... (9 lines trimmed)
    name: apache2
    masked: true
```

### User and Group Management

#### ansible.builtin.user
```yaml
- name: Create user
  ansible.builtin.user:
    name: appuser
    uid: 1500
    group: appgroup
// ... (14 lines trimmed)
    name: appuser
    ssh_key_bits: 4096
    ssh_key_file: .ssh/id_rsa
```

#### ansible.builtin.group
```yaml
- name: Create group
  ansible.builtin.group:
    name: appgroup
    gid: 1500
    state: present
```

#### ansible.builtin.authorized_key
```yaml
- name: Add SSH authorized key
  ansible.builtin.authorized_key:
    user: appuser
    state: present
// ... (8 lines trimmed)
    - ssh-rsa AAAAB3... user1@host
    - ssh-rsa AAAAB3... user2@host
```

### Command Execution

#### ansible.builtin.command
```yaml
- name: Run command (no shell processing)
  ansible.builtin.command: /usr/bin/make install
  args:
    chdir: /opt/app
// ... (7 lines trimmed)
    APP_ENV: production
    DB_HOST: localhost
```

#### ansible.builtin.shell
```yaml
- name: Run shell command (with pipes/redirects)
  ansible.builtin.shell: cat /var/log/app.log | grep ERROR > /tmp/errors.txt
  args:
    executable: /bin/bash
  changed_when: false

- name: Use shell with creates
  ansible.builtin.shell: /opt/install.sh
  args:
    creates: /opt/app/installed.flag
```

#### ansible.builtin.script
```yaml
- name: Run script from control node
  ansible.builtin.script: scripts/setup.sh
  args:
    creates: /etc/app/setup.done
```

### Git Operations

#### ansible.builtin.git
```yaml
- name: Clone repository
  ansible.builtin.git:
    repo: https://github.com/user/repo.git
    dest: /opt/app
    version: main
// ... (11 lines trimmed)
    dest: /opt/app
    key_file: /home/deploy/.ssh/id_rsa
    accept_hostkey: true
```

### Archive Operations

#### ansible.builtin.unarchive
```yaml
- name: Extract archive from control node
  ansible.builtin.unarchive:
    src: files/app.tar.gz
    dest: /opt/
    owner: appuser
// ... (10 lines trimmed)
    src: https://example.com/app.tar.gz
    dest: /opt/
    remote_src: true
```

#### ansible.builtin.archive
```yaml
- name: Create archive
  ansible.builtin.archive:
    path:
      - /opt/app/config
      - /opt/app/data
    dest: /tmp/backup.tar.gz
    format: gz
```

### Download Operations

#### ansible.builtin.get_url
```yaml
- name: Download file
  ansible.builtin.get_url:
    url: https://example.com/file.tar.gz
    dest: /tmp/file.tar.gz
// ... (7 lines trimmed)
    url_username: user
    url_password: "{{ download_password }}"
```

### URI/API Operations

#### ansible.builtin.uri
```yaml
- name: Check API endpoint
  ansible.builtin.uri:
    url: http://localhost:8080/health
    method: GET
    status_code: 200
// ... (19 lines trimmed)
    url: https://api.example.com/data
    method: GET
    dest: /tmp/data.json
```

### Cron Jobs

#### ansible.builtin.cron
```yaml
- name: Add cron job
  ansible.builtin.cron:
    name: "Daily backup"
    minute: "0"
    hour: "2"
// ... (11 lines trimmed)
  ansible.builtin.cron:
    name: "Daily backup"
    state: absent
```

### Debug and Assert

#### ansible.builtin.debug
```yaml
- name: Print variable
  ansible.builtin.debug:
    var: ansible_distribution

// ... (6 lines trimmed)
    msg: "This is a production server"
  when: env == "production"
```

#### ansible.builtin.assert
```yaml
- name: Validate configuration
  ansible.builtin.assert:
    that:
      - ansible_distribution in ['Ubuntu', 'Debian']
      - app_port | int > 0
      - app_port | int < 65536
      - db_password is defined
    fail_msg: "Configuration validation failed"
    success_msg: "Configuration is valid"
    quiet: false
```

### Set Facts

#### ansible.builtin.set_fact
```yaml
- name: Set computed fact
  ansible.builtin.set_fact:
    app_full_version: "{{ app_name }}-{{ app_version }}"
    deployment_time: "{{ ansible_date_time.iso8601 }}"
// ... (9 lines trimmed)
      version: "{{ app_version }}"
      port: "{{ app_port }}"
```

### Include and Import

#### ansible.builtin.include_tasks
```yaml
- name: Include tasks dynamically
  ansible.builtin.include_tasks: "{{ ansible_os_family }}.yml"

- name: Include with variables
  ansible.builtin.include_tasks: deploy.yml
  vars:
    app_version: "1.2.3"
```

#### ansible.builtin.import_tasks
```yaml
- name: Import tasks statically
  ansible.builtin.import_tasks: common.yml
```

#### ansible.builtin.include_vars
```yaml
- name: Load variables from file
  ansible.builtin.include_vars:
    file: "{{ env }}.yml"

- name: Load all YAML files from directory
  ansible.builtin.include_vars:
    dir: vars/
    extensions:
      - yml
      - yaml
```

### Wait Operations

#### ansible.builtin.wait_for
```yaml
- name: Wait for port to be available
  ansible.builtin.wait_for:
    port: 8080
    delay: 5
    timeout: 300
// ... (10 lines trimmed)
    port: 8080
    state: stopped
    timeout: 60
```

### Error Handling with Block/Rescue/Always

#### Basic Block with Rescue
```yaml
- name: Handle errors gracefully
  block:
    - name: Attempt risky operation
      ansible.builtin.command: /opt/risky_script.sh

// ... (9 lines trimmed)
      ansible.builtin.copy:
        content: "{{ ansible_failed_result }}"
        dest: /var/log/error.log
```

#### Block with Rescue and Always
```yaml
- name: Deploy with rollback capability
  block:
    - name: Stop application
      ansible.builtin.service:
        name: myapp
// ... (27 lines trimmed)
      ansible.builtin.wait_for:
        port: 8080
        timeout: 60
```

#### Configuration Update with Validation and Backup
```yaml
- name: Update config with validation
  block:
    - name: Deploy new configuration
      ansible.builtin.template:
        src: nginx.conf.j2
// ... (23 lines trimmed)
      ansible.builtin.uri:
        url: http://localhost/health
        status_code: 200
```

#### Accessing Error Variables in Rescue
```yaml
- name: Use error variables
  block:
    - name: Task that might fail
      ansible.builtin.command: /opt/backup.sh
      register: backup_result
// ... (15 lines trimmed)
          task: "{{ ansible_failed_task.name }}"
          error: "{{ ansible_failed_result.msg }}"
          host: "{{ inventory_hostname }}"
```

#### Flush Handlers After Error
```yaml
- name: Ensure handlers run even on failure
  block:
    - name: Update configuration
      ansible.builtin.copy:
        src: app.conf
// ... (10 lines trimmed)
    - name: Perform recovery actions
      ansible.builtin.debug:
        msg: "Recovering from failure"
```

### File Search and Status

#### ansible.builtin.find
```yaml
# Find old log files
- name: Find log files older than 7 days
  ansible.builtin.find:
    paths: /var/log
    patterns: "*.log"
// ... (46 lines trimmed)
    state: absent
  loop: "{{ directories.files }}"
  when: item.isdir
```

#### ansible.builtin.stat
```yaml
# Check if file exists
- name: Check if config file exists
  ansible.builtin.stat:
    path: /etc/app/config.yml
  register: config_file
// ... (70 lines trimmed)
  when:
    - python_link.stat.exists
    - python_link.stat.islnk
```

### Advanced Control Flow

#### delegate_to
```yaml
# Run task on different host
- name: Add server to load balancer
  ansible.builtin.uri:
    url: "http://lb.example.com/api/add"
    method: POST
// ... (18 lines trimmed)
    -subj "/CN={{ inventory_hostname }}"
  delegate_to: localhost
  become: false
```

#### run_once
```yaml
# Execute once for entire play
- name: Create shared resource
  ansible.builtin.file:
    path: /shared/data
    state: directory
// ... (17 lines trimmed)
  ansible.builtin.command: /opt/seed_data.sh
  run_once: true
  delegate_to: "{{ groups['database'] | first }}"
```

#### local_action
```yaml
# Execute on control node
- name: Generate configuration locally
  local_action:
    module: ansible.builtin.template
    src: config.j2
// ... (23 lines trimmed)
    module: ansible.builtin.command
    cmd: python3 analyze.py --host {{ inventory_hostname }}
  register: analysis_result
```

## Common Collection Modules

### community.general

#### community.general.ufw (Firewall)
```yaml
- name: Allow SSH
  community.general.ufw:
    rule: allow
    port: '22'
    proto: tcp

- name: Enable firewall
  community.general.ufw:
    state: enabled
```

#### community.general.timezone
```yaml
- name: Set timezone
  community.general.timezone:
    name: America/New_York
```

### community.docker

#### community.docker.docker_container
```yaml
- name: Run Docker container
  community.docker.docker_container:
    name: myapp
    image: nginx:latest
// ... (7 lines trimmed)
    env:
      APP_ENV: production
```

### community.postgresql

#### community.postgresql.postgresql_db
```yaml
- name: Create database
  community.postgresql.postgresql_db:
    name: appdb
    state: present
```

### ansible.posix

#### ansible.posix.mount
```yaml
- name: Mount filesystem
  ansible.posix.mount:
    path: /data
    src: /dev/sdb1
    fstype: ext4
    state: mounted
```

#### ansible.posix.sysctl
```yaml
- name: Set sysctl parameter
  ansible.posix.sysctl:
    name: net.ipv4.ip_forward
    value: '1'
    state: present
    reload: true
```

## Cloud Provider Modules

### Amazon AWS (amazon.aws)

#### amazon.aws.ec2_instance
```yaml
# Requirements:
#   - ansible-galaxy collection install amazon.aws
#   - boto3 and botocore Python packages
#   - Python 3.8+

// ... (57 lines trimmed)
    instance_ids:
      - i-0123456789abcdef0
    state: terminated
```

#### amazon.aws.ec2_instance_info
```yaml
# Gather info about all instances
- name: Get all EC2 instances
  amazon.aws.ec2_instance_info:
  register: ec2_instances

// ... (10 lines trimmed)
  ansible.builtin.debug:
    msg: "{{ item.public_ip_address }}"
  loop: "{{ prod_web_servers.instances }}"
```

#### amazon.aws.s3_object
```yaml
# Upload file to S3
- name: Upload file to S3 bucket
  amazon.aws.s3_object:
    bucket: my-backup-bucket
    object: "backups/{{ ansible_date_time.date }}/app.tar.gz"
// ... (15 lines trimmed)
    bucket: my-backup-bucket
    object: "backups/old/app.tar.gz"
    mode: delobj
```

#### amazon.aws.rds_instance
```yaml
# Create RDS instance
- name: Create PostgreSQL RDS instance
  amazon.aws.rds_instance:
    db_instance_identifier: myapp-db
    engine: postgres
// ... (12 lines trimmed)
    tags:
      Environment: production
      Application: myapp
```

### Microsoft Azure (azure.azcollection)

#### azure.azcollection.azure_rm_virtualmachine
```yaml
# Requirements:
#   - ansible-galaxy collection install azure.azcollection
#   - Azure SDK packages (see collection requirements.txt)

# Create VM with defaults
// ... (58 lines trimmed)
    resource_group: myResourceGroup
    name: webserver01
    state: absent
```

#### azure.azcollection.azure_rm_virtualmachine_info
```yaml
# Get all VMs in resource group
- name: Get VM facts
  azure.azcollection.azure_rm_virtualmachine_info:
    resource_group: myResourceGroup
  register: azure_vms
// ... (8 lines trimmed)
- name: Display VM private IP
  ansible.builtin.debug:
    msg: "{{ vm_info.vms[0].network_profile.network_interfaces[0].ip_configurations[0].private_ip_address }}"
```

#### azure.azcollection.azure_rm_storageblob
```yaml
# Upload file to Azure Blob Storage
- name: Upload backup to blob storage
  azure.azcollection.azure_rm_storageblob:
    resource_group: myResourceGroup
    storage_account_name: mystorageaccount
// ... (10 lines trimmed)
    container: configs
    blob: app-config.yml
    dest: /etc/app/config.yml
```

#### azure.azcollection.azure_rm_sqldatabase
```yaml
# Create Azure SQL Database
- name: Create SQL database
  azure.azcollection.azure_rm_sqldatabase:
    resource_group: myResourceGroup
// ... (7 lines trimmed)
      Environment: production
      Application: myapp
```

## Secrets Management Lookups

### HashiCorp Vault

#### community.hashi_vault.hashi_vault lookup
```yaml
# Requirements:
#   - ansible-galaxy collection install community.hashi_vault
#   - hvac Python package

# Retrieve secret from Vault
// ... (14 lines trimmed)
  ansible.builtin.set_fact:
    admin_password: "{{ lookup('community.hashi_vault.hashi_vault', 'secret/data/admin:password', url='https://vault.example.com:8200', auth_method='token', token=vault_token) }}"
  no_log: true
```

### AWS Secrets Manager

#### community.aws.aws_secret lookup
```yaml
# Requirements:
#   - ansible-galaxy collection install community.aws
#   - boto3 and botocore

# Retrieve secret from AWS Secrets Manager
// ... (11 lines trimmed)
  ansible.builtin.set_fact:
    api_key: "{{ lookup('community.aws.aws_secret', 'prod/api/key', version_id='EXAMPLE1-90ab-cdef-fedc-ba987EXAMPLE') }}"
  no_log: true
```

### Azure Key Vault

#### azure.azcollection.azure_keyvault_secret lookup
```yaml
# Requirements:
#   - ansible-galaxy collection install azure.azcollection

# Retrieve secret from Azure Key Vault
- name: Get secret from Key Vault
// ... (9 lines trimmed)
  vars:
    secret_key: "{{ lookup('azure.azcollection.azure_keyvault_secret', 'secret-key', vault_url='https://myvault.vault.azure.net') }}"
  no_log: true
```
