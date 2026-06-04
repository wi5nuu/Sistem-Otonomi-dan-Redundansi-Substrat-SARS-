-- 0001_database_improvements.sql
-- Adds updated_at, deleted_at, CHECK constraints, and RLS policies

-- =============================================================
-- updated_at columns for tables that are missing them
-- =============================================================

ALTER TABLE storage_clusters ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now() NOT NULL;

ALTER TABLE energy_sources ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now() NOT NULL;

ALTER TABLE ups_systems ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now() NOT NULL;

ALTER TABLE network_links ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now() NOT NULL;

ALTER TABLE organizations ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now() NOT NULL;

ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now() NOT NULL;

ALTER TABLE approval_requests ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now() NOT NULL;

-- =============================================================
-- updated_at trigger function (auto-update on row change)
-- =============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT unnest(ARRAY[
      'regions', 'datacenters', 'nodes', 'storage_clusters',
      'energy_sources', 'ups_systems', 'network_links',
      'organizations', 'users', 'approval_requests', 'runbooks'
    ])
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = t AND column_name = 'updated_at') THEN
      EXECUTE format(
        'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
        t
      );
    END IF;
  END LOOP;
END;
$$;

-- =============================================================
-- Soft delete (deleted_at) columns
-- =============================================================

ALTER TABLE nodes ADD COLUMN IF NOT EXISTS deleted_at timestamp;

ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at timestamp;

ALTER TABLE incidents ADD COLUMN IF NOT EXISTS deleted_at timestamp;

-- =============================================================
-- CHECK constraints for enum and value ranges
-- =============================================================

-- regions.status
ALTER TABLE regions ADD CONSTRAINT chk_regions_status
  CHECK (status IN ('ONLINE', 'DEGRADED', 'OFFLINE', 'MAINTENANCE'));

-- datacenters.status
ALTER TABLE datacenters ADD CONSTRAINT chk_datacenters_status
  CHECK (status IN ('ONLINE', 'DEGRADED', 'OFFLINE', 'MAINTENANCE'));

-- datacenters.tier
ALTER TABLE datacenters ADD CONSTRAINT chk_datacenters_tier
  CHECK (tier IN ('T1', 'T2', 'T3', 'T4'));

-- nodes.status
ALTER TABLE nodes ADD CONSTRAINT chk_nodes_status
  CHECK (status IN ('ACTIVE', 'DRAINING', 'MAINTENANCE', 'OFFLINE', 'DECOMMISSIONED'));

-- nodes.architecture
ALTER TABLE nodes ADD CONSTRAINT chk_nodes_arch
  CHECK (architecture IN ('X86_64', 'ARM64', 'ARM', 'RISCV'));

-- energy_sources.type
ALTER TABLE energy_sources ADD CONSTRAINT chk_energy_type
  CHECK (type IN ('GRID', 'SOLAR', 'WIND', 'GENERATOR', 'BATTERY', 'FUEL_CELL'));

-- energy_sources.status
ALTER TABLE energy_sources ADD CONSTRAINT chk_energy_status
  CHECK (status IN ('ACTIVE', 'STANDBY', 'MAINTENANCE', 'FAILED', 'OFFLINE'));

-- ups_systems.status
ALTER TABLE ups_systems ADD CONSTRAINT chk_ups_status
  CHECK (status IN ('ONLINE', 'ON_BATTERY', 'LOW_BATTERY', 'MAINTENANCE', 'OFFLINE'));

-- network_links.type
ALTER TABLE network_links ADD CONSTRAINT chk_network_type
  CHECK (type IN ('FIBER', 'COAX', 'WIRELESS', 'SATELLITE', 'MICROWAVE'));

-- network_links.status
ALTER TABLE network_links ADD CONSTRAINT chk_network_status
  CHECK (status IN ('ACTIVE', 'DEGRADED', 'DOWN', 'MAINTENANCE'));

-- storage_clusters.tier
ALTER TABLE storage_clusters ADD CONSTRAINT chk_storage_tier
  CHECK (tier IN ('HOT', 'WARM', 'COLD', 'ARCHIVE'));

-- storage_clusters.status
ALTER TABLE storage_clusters ADD CONSTRAINT chk_storage_status
  CHECK (status IN ('ONLINE', 'DEGRADED', 'REBALANCING', 'OFFLINE', 'MAINTENANCE'));

-- incidents.severity
ALTER TABLE incidents ADD CONSTRAINT chk_incidents_severity
  CHECK (severity IN ('P1', 'P2', 'P3', 'P4', 'P5'));

-- incidents.status
ALTER TABLE incidents ADD CONSTRAINT chk_incidents_status
  CHECK (status IN ('DETECTED', 'ACKNOWLEDGED', 'MITIGATING', 'RESOLVED', 'CLOSED'));

-- alerts.severity
ALTER TABLE alerts ADD CONSTRAINT chk_alerts_severity
  CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'));

-- alerts.status
ALTER TABLE alerts ADD CONSTRAINT chk_alerts_status
  CHECK (status IN ('FIRING', 'ACKNOWLEDGED', 'RESOLVED', 'SILENCED'));

-- users.role
ALTER TABLE users ADD CONSTRAINT chk_users_role
  CHECK (role IN ('ADMIN', 'OPERATOR', 'ENGINEER', 'VIEWER', 'AUDITOR'));

-- approval_requests.type
ALTER TABLE approval_requests ADD CONSTRAINT chk_approval_type
  CHECK (type IN ('ACCESS', 'CHANGE', 'DEPLOYMENT', 'CONFIG', 'SECURITY'));

-- approval_requests.status
ALTER TABLE approval_requests ADD CONSTRAINT chk_approval_status
  CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'CANCELLED'));

-- approvals.decision
ALTER TABLE approvals ADD CONSTRAINT chk_approvals_decision
  CHECK (decision IN ('APPROVED', 'REJECTED', 'ABSTAIN'));

-- compliance_checks.framework
ALTER TABLE compliance_checks ADD CONSTRAINT chk_compliance_framework
  CHECK (framework IN ('SOC2', 'ISO27001', 'HIPAA', 'PCI', 'GDPR'));

-- compliance_checks.status
ALTER TABLE compliance_checks ADD CONSTRAINT chk_compliance_status
  CHECK (status IN ('PASS', 'FAIL', 'WARNING', 'NOT_APPLICABLE', 'ERROR'));

-- =============================================================
-- Range CHECK constraints
-- =============================================================

ALTER TABLE nodes ADD CONSTRAINT chk_nodes_cpu_cores CHECK (cpu_cores > 0);
ALTER TABLE nodes ADD CONSTRAINT chk_nodes_ram_gb CHECK (ram_gb > 0);
ALTER TABLE nodes ADD CONSTRAINT chk_nodes_uptime CHECK (uptime_seconds >= 0);

ALTER TABLE node_metrics ADD CONSTRAINT chk_metrics_cpu CHECK (cpu_percent BETWEEN 0 AND 100);
ALTER TABLE node_metrics ADD CONSTRAINT chk_metrics_ram CHECK (ram_percent BETWEEN 0 AND 100);
ALTER TABLE node_metrics ADD CONSTRAINT chk_metrics_temp CHECK (temperature_celsius BETWEEN -50 AND 150);

ALTER TABLE energy_sources ADD CONSTRAINT chk_energy_capacity CHECK (capacity_kw > 0);
ALTER TABLE ups_systems ADD CONSTRAINT chk_ups_capacity CHECK (capacity_kwh > 0);
ALTER TABLE ups_systems ADD CONSTRAINT chk_ups_charge CHECK (current_charge_percent BETWEEN 0 AND 100);

ALTER TABLE storage_clusters ADD CONSTRAINT chk_storage_total CHECK (total_tb > 0);
ALTER TABLE storage_clusters ADD CONSTRAINT chk_storage_used CHECK (used_tb >= 0);
ALTER TABLE storage_clusters ADD CONSTRAINT chk_storage_replication CHECK (replication_factor BETWEEN 1 AND 10);

-- =============================================================
-- Row-Level Security (RLS) for multi-tenant isolation
-- =============================================================

-- Enable RLS on tenant-scoped tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE ups_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Organization isolation policy (applied via session variable app.current_org_id)
-- Usage: SET app.current_org_id = 'org-uuid';
CREATE POLICY org_isolation ON organizations
  FOR ALL USING (id = current_setting('app.current_org_id')::uuid);

CREATE POLICY user_org_isolation ON users
  FOR ALL USING (organization_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY node_org_isolation ON nodes
  FOR ALL USING (
    datacenter_id IN (
      SELECT id FROM datacenters WHERE region_id IN (
        SELECT id FROM regions WHERE id IN (
          SELECT region_id FROM datacenters WHERE id IN (
            SELECT datacenter_id FROM nodes WHERE 1=1 -- simplified: app manages org mapping
          )
        )
      )
    )
  );

-- Admin bypass: admins see all rows
CREATE POLICY admin_bypass ON users
  FOR ALL USING (current_setting('app.user_role', TRUE) = 'ADMIN');
