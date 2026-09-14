# Workstation Performance Tuning Journal

## 2026-09-14 — Initial diagnosis

Host: Kubuntu 26, KDE Plasma 6.6 Wayland, Linux 7.0.0-31, Intel i5-6500 (4 cores), 16 GiB RAM.

Observed before tuning:

- Approximately 11 GiB RAM used and 4.0–4.1 GiB swap occupied.
- I/O PSI `some` reached 21–31%; I/O PSI `full` reached 17–24%.
- `/dev/sda` is a 1-TB rotational Seagate HDD containing `/home`, `/osa`, Docker storage, and the Zabbix MySQL bind mount.
- `zbx_cnt_web` consumed about 3.8 GiB: eleven PHP-FPM workers used roughly 370 MiB RSS each.
- `zbx_cnt_mysql` continuously wrote about 488 KiB/s; its Docker block-write counter was about 126 GB after two days.
- Three MySQL processes collectively held about 1.27 GiB in swap.
- Disk SMART health passed with no pending, uncorrectable, or reallocated sectors.

Approved intent:

- Prefer MySQL speed and workstation responsiveness over crash-durability guarantees such as per-transaction fsync.
- Preserve InnoDB doublewrite because disabling it can turn a power interruption into page corruption.
- Reduce PHP-FPM concurrency, impose memory limits, shorten Zabbix retention, and right-size all three MySQL instances.

Implementation results, exact backup paths, and rollback commands will be appended below.

## 2026-09-14 — Applied configuration

Backups created before installation:

- `/home/qqq/_A001/rep/zbx/docker-compose.yml.before-performance-20260914-163300`
- `/home/qqq/_A001/rep/zbx/zabbix-config.before-performance-20260914-163300.sql`
- `/home/qqq/_A001/rep/ALINA_BE/dc.all.yml.before-performance-20260914-163300`
- `/mnt/d1001/_docker/bdb/mysql/docker-compose.yml.before-performance-20260914-163300`

Persistent changes:

- Zabbix web: PHP-FPM dynamic mode, maximum 4 children, 2 initial workers, 1–2 spare workers, worker recycling after 200 requests, 2-GiB container limit.
- Zabbix server: 2 history syncers, 1 housekeeper, bounded caches, 1-GiB container limit.
- Zabbix MySQL: 1-GiB buffer pool, 512-MiB redo capacity, transaction flush mode 2, `sync_binlog=0`, binlog disabled, Performance Schema disabled, direct I/O, 100 connections, bounded table/thread/temp-table caches, 2-GiB container limit.
- ALINA and BDB MySQL: buffer pools reduced from 1 GiB to 384 MiB each, Performance Schema and slow-query logging disabled, `sync_binlog=0`, thread cache 32, 1-GiB container limits.
- InnoDB doublewrite remains enabled on all databases.
- Zabbix retention: history 7 days globally, trends 90 days globally, events/services 30 days, audit and sessions 7 days.

Validation and deployment:

- All three merged Compose configurations parsed successfully before and after installation.
- MySQL 8.4.7 and 8.0.27 accepted their complete candidate option sets with `mysqld --validate-config`.
- All three MySQL containers were recreated individually and became healthy.
- Zabbix server and web were recreated; web became healthy and returned HTTP 200.
- No recent `error`, `fatal`, `panic`, OOM, or unknown-variable messages were found in affected container logs.

Immediate post-deployment measurements:

- `zbx_cnt_web`: about 66.6 MiB, down from approximately 3.8 GiB; two PHP-FPM workers running after startup.
- `zbx_cnt_server`: about 150.5 MiB.
- MySQL: Zabbix about 474.6 MiB; ALINA about 159.9 MiB; BDB about 152.3 MiB.
- Host memory: 7.9 GiB used, 7.6 GiB available; previously about 11 GiB used and 4.1 GiB available.
- Swap: 2.0 GiB occupied, down from 4.0–4.1 GiB. Remaining swapped pages belong primarily to long-running desktop applications and are not actively churning.
- Memory PSI reached zero in the 10-second window after deployment. I/O remained temporarily elevated while databases warmed their caches and Zabbix began applying shorter retention.

Settled follow-up sample:

- Zabbix HTTP response: status 200 in 84 ms.
- `zbx_cnt_web`: 66.7 MiB; `zbx_cnt_server`: 152 MiB; `zbx_cnt_mysql`: 473.3 MiB.
- ALINA MySQL: 159.9 MiB; BDB MySQL: 152.8 MiB.
- Ten-second `vmstat` samples showed 0–6% I/O wait after settling, apart from the lifetime-average first row; before tuning, repeated live samples reached 25–44%.
- Memory PSI: 0% over 10 seconds.
- I/O PSI: `some avg10=4.19`, `full avg10=2.35`, down from pre-change readings of approximately 22–31 and 17–24 respectively.
- Swap-in/out was effectively zero during the sample; the remaining 2 GiB is inactive rather than active swap thrashing.

Rollback:

1. Restore each `*.before-performance-20260914-163300` Compose file over its active counterpart.
2. Validate the same Compose file sets with `docker compose config -q`.
3. Recreate `alina_mysql`, `bdb_mysql`, and `zbx_srv_mysql`, then `zbx_srv_server` and `zbx_srv_web`.
4. To restore the complete prior Zabbix `config` row, review and import `/home/qqq/_A001/rep/zbx/zabbix-config.before-performance-20260914-163300.sql`. Importing it replaces the current configuration row and should only be done intentionally.

## Case memory for future sessions

### What the user reported

The Kubuntu/KDE Wayland workstation felt heavily loaded during normal development work. The user authorized host-wide diagnostics and later approved performance-oriented changes across Zabbix, ALINA, and BDB. MySQL speed and desktop responsiveness were prioritized over maximum transaction durability, but persistent-volume safety and corruption protection remained important.

### How the cause was isolated

The first process listing ran inside the Codex filesystem/process sandbox and therefore showed only the diagnostic shell. Host-level measurements still exposed high swap usage and I/O wait, so subsequent probes were deliberately run in the host namespace with sudo.

The useful diagnostic sequence was:

1. Establish capacity and pressure with `uptime`, `free`, `swapon`, `vmstat`, and `/proc/pressure/{cpu,memory,io}`.
2. Identify process and cgroup consumers with host-level `ps`, `pidstat`, `systemd-cgtop`, and `docker stats`.
3. Map I/O to physical storage with `iostat`, `lsblk`, `findmnt`, Docker's root directory, and container bind mounts.
4. Distinguish hardware failure from workload latency with SMART attributes and kernel logs.
5. Inspect PHP-FPM worker RSS and MySQL live/configured settings before proposing changes.
6. Validate candidate Compose models and MySQL flags before restarting any service.
7. Recreate one dependency group at a time, wait for health, then compare the same pressure metrics.

### Root cause and contributing factors

The primary root cause was the combined Zabbix workload on a rotational HDD, amplified by memory overcommit:

- Docker storage was under `/osa/dockersys/docker` on the HDD, while the Zabbix database bind mount was under `/home` on the same HDD.
- Zabbix MySQL generated continuous small writes; modest throughput produced high latency and system-wide I/O stalls.
- The Zabbix web image spawned eleven unusually large PHP-FPM workers, consuming about 3.8 GiB.
- Three MySQL instances reserved oversized buffer pools for a 16-GiB workstation and retained optional instrumentation/logging overhead.
- Four GiB of swapped pages increased the cost of foreground desktop activity.

Intel `i915` hotplug/workqueue warnings and a display atomic-update failure were also observed. They may explain occasional graphics stutter, but measurements did not support them as the main source of the sustained system load.

### Decisions and rationale

- Limit PHP concurrency rather than merely increasing swap or accepting the web container's memory growth.
- Right-size each database rather than applying the same 1-GiB buffer pool to all workloads.
- Disable binary logging, Performance Schema, and unused slow-query logging to reduce background work.
- Use transaction flush mode 2 and `sync_binlog=0` because this is a local workstation workload and the user explicitly accepts reduced crash durability for speed.
- Keep `innodb_doublewrite` enabled: it is corruption protection, not a fancy authentication/security feature.
- Enforce global Zabbix history/trend retention so item-level defaults cannot silently preserve excessive data.
- Do not force `swapoff`: after the container restarts, the remaining swapped pages were inactive and produced essentially no swap-in/out. Forcing them resident would create avoidable HDD traffic without improving the measured bottleneck.
- Do not move databases between disks during this intervention; migration remains a separate higher-impact option if HDD pressure returns.

### Operational lessons

- A successful Compose parse does not prove that `mysqld` accepts its flags. Validate the exact options against the installed image using `mysqld --validate-config` and bypass the image entrypoint when necessary.
- Nested SQL passed through multiple shells is fragile. Use a reviewed SQL file over standard input instead of complex quote escaping.
- Long Docker operations may have their displayed output truncated. Confirm actual container timestamps, status, and logs before treating truncated output as a deployment failure.
- A post-restart sample can be misleading because databases are warming caches and housekeeping may immediately process newly shortened retention. Take both immediate and settled samples.
- Never put passwords, `.env` contents, or other credentials in this journal. Record only sanitized commands, paths, settings, and outcomes.

### Future regression checklist

If the workstation becomes slow again, compare against this case in the following order:

1. Check `free -h`, `swapon --show`, `vmstat 1 10`, and memory/I/O PSI.
2. Check `docker stats --no-stream`, especially `zbx_cnt_web`, `zbx_cnt_mysql`, and their PIDs/block-I/O counters.
3. Confirm Zabbix PHP-FPM has no more than four pool workers and remains under its 2-GiB limit.
4. Confirm all MySQL containers retain their intended buffer pools, disabled Performance Schema/slow logging, relaxed flush settings, and memory limits.
5. Check whether Zabbix housekeeping is actively deleting old data after a retention or monitoring-volume change.
6. Inspect `iostat -xz 1 10`; sustained HDD latency/utilization with low throughput again points to small random writes rather than CPU saturation.
7. Review new kernel `i915`, storage, OOM, and filesystem errors separately from database pressure.
8. If the optimized workload still saturates the HDD, plan a controlled move of Docker and Zabbix database storage to SSD rather than weakening corruption safeguards further.
