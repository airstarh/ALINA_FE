# Workstation Database Performance Implementation Plan

> **For agentic workers:** Execute inline against the live Docker host. Steps use checkbox syntax for tracking.

**Goal:** Reduce MySQL, Zabbix PHP-FPM, swap, and HDD pressure on the 16-GiB workstation.

**Architecture:** Persist tuning in each stack's Compose configuration, validate before deployment, recreate affected containers in dependency order, and verify live effective settings. Maintain a journal with exact backups and rollback commands.

**Tech Stack:** Docker Compose, MySQL 8.0/8.4, Zabbix 7.0, PHP-FPM 8.5, Linux PSI/sysstat.

**Spec:** `docs/superpowers/specs/2026-09-14-workstation-database-performance-design.md`

## Global Constraints

- No Git commits.
- No JavaScript SPA build.
- No volume deletion or database relocation.
- Preserve InnoDB doublewrite protection.

### Task 1: Capture configuration and runtime baseline

- [x] Locate all effective Compose files and environment overrides.
- [x] Save timestamped backups beside every file that will change.
- [x] Record current container memory, swap, MySQL variables, and Zabbix retention.

### Task 2: Persist resource and MySQL tuning

- [x] Update Zabbix Compose with PHP-FPM worker limits and container memory caps.
- [x] Add the approved Zabbix MySQL performance arguments.
- [x] Update ALINA and BDB MySQL arguments and memory limits.
- [x] Validate every effective Compose model before restart.

### Task 3: Apply Zabbix retention and server tuning

- [x] Update supported Zabbix housekeeping settings through the database.
- [x] Persist bounded Zabbix server process/cache settings in Compose environment.
- [x] Verify database values before recreating containers.

### Task 4: Deploy and verify

- [x] Recreate MySQL services one at a time and wait for health.
- [x] Recreate Zabbix server and web services and wait for health.
- [x] Verify effective MySQL variables and PHP-FPM worker count.
- [x] Measure container memory, swap activity, I/O wait, PSI, and logs.
- [x] Write results and rollback commands to `PERFORMANCE_TUNING_JOURNAL.md`.
