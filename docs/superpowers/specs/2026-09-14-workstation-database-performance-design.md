# Workstation Database Performance Design

## Goal

Reduce memory and HDD pressure from the local Zabbix, ALINA, and BDB Docker stacks while prioritizing interactive workstation responsiveness and MySQL speed.

## Design

- Limit Zabbix PHP-FPM to four recyclable workers and cap the web container at 2 GiB.
- Tune Zabbix MySQL for an HDD-backed development/monitoring workload: 1 GiB buffer pool, no binary log, no Performance Schema, relaxed transaction flushing, direct I/O, bounded connections and caches, and a 2 GiB container limit.
- Reduce ALINA and BDB MySQL buffer pools to 384 MiB, disable Performance Schema and slow-query logging, retain relaxed durability settings, and cap each container at 1 GiB.
- Keep `innodb_doublewrite` enabled because it protects against torn-page corruption rather than providing a security feature.
- Configure Zabbix retention to 7 days of history, 90 days of trends, 30 days of events, and 7 days of audit/session data.
- Back up every changed file, validate Compose configuration, recreate only affected services, and verify health, effective settings, memory, swap, and I/O pressure.

## Constraints

- Do not move persistent databases between disks in this change.
- Do not delete database volumes.
- Do not create Git commits.
- Do not build the JavaScript SPA.

