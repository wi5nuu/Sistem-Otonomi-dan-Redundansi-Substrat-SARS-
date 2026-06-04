CREATE TABLE "alert_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"layer_type" varchar(50) NOT NULL,
	"metric" varchar(100) NOT NULL,
	"operator" varchar(10) NOT NULL,
	"threshold" integer NOT NULL,
	"severity" varchar(10) NOT NULL,
	"cooldown_minutes" integer DEFAULT 5 NOT NULL,
	"channels" text[] DEFAULT '{}' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rule_id" uuid,
	"severity" varchar(10) NOT NULL,
	"title" varchar(500) NOT NULL,
	"message" text NOT NULL,
	"affected_resource" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'FIRING' NOT NULL,
	"fired_at" timestamp DEFAULT now() NOT NULL,
	"acknowledged_at" timestamp,
	"resolved_at" timestamp,
	"acknowledged_by" uuid
);
--> statement-breakpoint
CREATE TABLE "node_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"node_id" uuid NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"cpu_percent" double precision NOT NULL,
	"ram_percent" double precision NOT NULL,
	"network_in_mbps" double precision NOT NULL,
	"network_out_mbps" double precision NOT NULL,
	"temperature_celsius" double precision NOT NULL,
	"power_watts" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"datacenter_id" uuid NOT NULL,
	"hostname" varchar(255) NOT NULL,
	"ip_address" varchar(45) NOT NULL,
	"architecture" varchar(20) DEFAULT 'X86_64' NOT NULL,
	"vendor" varchar(100) NOT NULL,
	"model" varchar(100) NOT NULL,
	"cpu_cores" integer NOT NULL,
	"ram_gb" integer NOT NULL,
	"status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
	"last_heartbeat_at" timestamp DEFAULT now() NOT NULL,
	"uptime_seconds" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "failover_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incident_id" uuid,
	"source_node_id" uuid NOT NULL,
	"target_node_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'PENDING' NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"logs" text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "incident_timeline" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incident_id" uuid NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"actor_id" uuid,
	"actor_type" varchar(10) DEFAULT 'SYSTEM' NOT NULL,
	"action" varchar(255) NOT NULL,
	"details" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "incidents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"severity" varchar(5) NOT NULL,
	"status" varchar(20) DEFAULT 'DETECTED' NOT NULL,
	"affected_regions" text[] DEFAULT '{}' NOT NULL,
	"affected_datacenters" integer[] DEFAULT '{}' NOT NULL,
	"detected_at" timestamp DEFAULT now() NOT NULL,
	"acknowledged_at" timestamp,
	"mitigated_at" timestamp,
	"resolved_at" timestamp,
	"root_cause" text,
	"post_mortem_url" text,
	"created_by" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "runbooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"category" varchar(100) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"content" text NOT NULL,
	"automatable" boolean DEFAULT false NOT NULL,
	"last_reviewed_at" timestamp,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "runbooks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "energy_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"output_kw" double precision NOT NULL,
	"efficiency" double precision NOT NULL,
	"estimated_remaining_hours" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "energy_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"datacenter_id" uuid NOT NULL,
	"type" varchar(20) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"capacity_kw" double precision NOT NULL,
	"current_output_kw" double precision NOT NULL,
	"status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
	"contract_expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ups_systems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"datacenter_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"capacity_kwh" double precision NOT NULL,
	"current_charge_percent" double precision NOT NULL,
	"estimated_runtime_minutes" integer NOT NULL,
	"status" varchar(20) DEFAULT 'ONLINE' NOT NULL,
	"last_tested_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "approval_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requested_by" uuid NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" text NOT NULL,
	"type" varchar(30) NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb,
	"required_approvers" integer DEFAULT 3 NOT NULL,
	"current_approvals" integer DEFAULT 0 NOT NULL,
	"status" varchar(20) DEFAULT 'PENDING' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"approver_id" uuid NOT NULL,
	"decision" varchar(10) NOT NULL,
	"comment" text NOT NULL,
	"signed_at" timestamp DEFAULT now() NOT NULL,
	"crypto_signature" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"system_actor" text,
	"action" varchar(100) NOT NULL,
	"resource" varchar(100) NOT NULL,
	"resource_id" varchar(255) NOT NULL,
	"before" jsonb,
	"after" jsonb,
	"ip_address" varchar(45) NOT NULL,
	"user_agent" text NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"immutable_hash" varchar(128) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "compliance_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"check_name" varchar(255) NOT NULL,
	"framework" varchar(20) NOT NULL,
	"region_code" varchar(20) NOT NULL,
	"status" varchar(20) NOT NULL,
	"details" text DEFAULT '' NOT NULL,
	"checked_at" timestamp DEFAULT now() NOT NULL,
	"next_check_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"type" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(20) DEFAULT 'VIEWER' NOT NULL,
	"mfa_enabled" boolean DEFAULT false NOT NULL,
	"mfa_secret" text,
	"last_login_at" timestamp,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "datacenters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"region_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"address" text NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"tier" varchar(10) DEFAULT 'T2' NOT NULL,
	"status" varchar(20) DEFAULT 'ONLINE' NOT NULL,
	"power_capacity_kw" double precision NOT NULL,
	"cooling_type" varchar(20) DEFAULT 'AIR' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "datacenters_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(20) NOT NULL,
	"name" varchar(255) NOT NULL,
	"timezone" varchar(100) NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"status" varchar(20) DEFAULT 'ONLINE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "regions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "storage_clusters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"datacenter_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"tier" varchar(20) DEFAULT 'HOT' NOT NULL,
	"total_tb" double precision NOT NULL,
	"used_tb" double precision NOT NULL,
	"replication_factor" integer DEFAULT 3 NOT NULL,
	"erasure_coding_scheme" varchar(50) DEFAULT 'RS-4+2',
	"status" varchar(20) DEFAULT 'ONLINE' NOT NULL,
	"last_integrity_check_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "storage_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cluster_id" uuid NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"read_iops" double precision NOT NULL,
	"write_iops" double precision NOT NULL,
	"read_latency_ms" double precision NOT NULL,
	"write_latency_ms" double precision NOT NULL,
	"throughput_mbps" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "network_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_dc_id" uuid NOT NULL,
	"target_dc_id" uuid NOT NULL,
	"type" varchar(20) NOT NULL,
	"bandwidth_gbps" double precision NOT NULL,
	"latency_ms" double precision NOT NULL,
	"provider" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
	"redundancy_level" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "network_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"link_id" uuid NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"utilization_percent" double precision NOT NULL,
	"latency_ms" double precision NOT NULL,
	"packet_loss_percent" double precision NOT NULL,
	"error_rate" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certificates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"domain" varchar(255) NOT NULL,
	"issuer" varchar(255) NOT NULL,
	"algorithm" varchar(50) NOT NULL,
	"valid_from" timestamp NOT NULL,
	"valid_until" timestamp NOT NULL,
	"auto_renew" boolean DEFAULT true NOT NULL,
	"status" varchar(20) DEFAULT 'VALID' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "security_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"node_id" uuid,
	"datacenter_id" uuid,
	"severity" varchar(20) NOT NULL,
	"category" varchar(20) NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" text NOT NULL,
	"raw_payload" jsonb DEFAULT '{}'::jsonb,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "node_metrics" ADD CONSTRAINT "node_metrics_node_id_nodes_id_fk" FOREIGN KEY ("node_id") REFERENCES "public"."nodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_datacenter_id_datacenters_id_fk" FOREIGN KEY ("datacenter_id") REFERENCES "public"."datacenters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "failover_jobs" ADD CONSTRAINT "failover_jobs_source_node_id_nodes_id_fk" FOREIGN KEY ("source_node_id") REFERENCES "public"."nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "failover_jobs" ADD CONSTRAINT "failover_jobs_target_node_id_nodes_id_fk" FOREIGN KEY ("target_node_id") REFERENCES "public"."nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_timeline" ADD CONSTRAINT "incident_timeline_incident_id_incidents_id_fk" FOREIGN KEY ("incident_id") REFERENCES "public"."incidents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "energy_metrics" ADD CONSTRAINT "energy_metrics_source_id_energy_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."energy_sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "energy_sources" ADD CONSTRAINT "energy_sources_datacenter_id_datacenters_id_fk" FOREIGN KEY ("datacenter_id") REFERENCES "public"."datacenters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ups_systems" ADD CONSTRAINT "ups_systems_datacenter_id_datacenters_id_fk" FOREIGN KEY ("datacenter_id") REFERENCES "public"."datacenters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_request_id_approval_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."approval_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_approver_id_users_id_fk" FOREIGN KEY ("approver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "datacenters" ADD CONSTRAINT "datacenters_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storage_clusters" ADD CONSTRAINT "storage_clusters_datacenter_id_datacenters_id_fk" FOREIGN KEY ("datacenter_id") REFERENCES "public"."datacenters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storage_metrics" ADD CONSTRAINT "storage_metrics_cluster_id_storage_clusters_id_fk" FOREIGN KEY ("cluster_id") REFERENCES "public"."storage_clusters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "network_links" ADD CONSTRAINT "network_links_source_dc_id_datacenters_id_fk" FOREIGN KEY ("source_dc_id") REFERENCES "public"."datacenters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "network_links" ADD CONSTRAINT "network_links_target_dc_id_datacenters_id_fk" FOREIGN KEY ("target_dc_id") REFERENCES "public"."datacenters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "network_metrics" ADD CONSTRAINT "network_metrics_link_id_network_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."network_links"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_alert_rules_layer" ON "alert_rules" USING btree ("layer_type");--> statement-breakpoint
CREATE INDEX "idx_alert_rules_active" ON "alert_rules" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_alerts_severity" ON "alerts" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "idx_alerts_status" ON "alerts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_alerts_fired" ON "alerts" USING btree ("fired_at");--> statement-breakpoint
CREATE INDEX "idx_node_metrics_node_ts" ON "node_metrics" USING btree ("node_id","timestamp");--> statement-breakpoint
CREATE INDEX "idx_node_metrics_ts" ON "node_metrics" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "idx_nodes_datacenter" ON "nodes" USING btree ("datacenter_id");--> statement-breakpoint
CREATE INDEX "idx_nodes_hostname" ON "nodes" USING btree ("hostname");--> statement-breakpoint
CREATE INDEX "idx_nodes_status" ON "nodes" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_failover_incident" ON "failover_jobs" USING btree ("incident_id");--> statement-breakpoint
CREATE INDEX "idx_failover_status" ON "failover_jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_timeline_incident" ON "incident_timeline" USING btree ("incident_id");--> statement-breakpoint
CREATE INDEX "idx_incidents_severity" ON "incidents" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "idx_incidents_status" ON "incidents" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_incidents_detected" ON "incidents" USING btree ("detected_at");--> statement-breakpoint
CREATE INDEX "idx_runbooks_slug" ON "runbooks" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_runbooks_category" ON "runbooks" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_energy_metrics_source_ts" ON "energy_metrics" USING btree ("source_id","timestamp");--> statement-breakpoint
CREATE INDEX "idx_energy_dc" ON "energy_sources" USING btree ("datacenter_id");--> statement-breakpoint
CREATE INDEX "idx_ups_dc" ON "ups_systems" USING btree ("datacenter_id");--> statement-breakpoint
CREATE INDEX "idx_approval_req_status" ON "approval_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_approval_req_requester" ON "approval_requests" USING btree ("requested_by");--> statement-breakpoint
CREATE INDEX "idx_approval_req_expires" ON "approval_requests" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_approvals_request" ON "approvals" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "idx_approvals_approver" ON "approvals" USING btree ("approver_id");--> statement-breakpoint
CREATE INDEX "idx_audit_action" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "idx_audit_resource" ON "audit_logs" USING btree ("resource");--> statement-breakpoint
CREATE INDEX "idx_audit_user" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_audit_timestamp" ON "audit_logs" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "idx_audit_hash" ON "audit_logs" USING btree ("immutable_hash");--> statement-breakpoint
CREATE INDEX "idx_compliance_framework" ON "compliance_checks" USING btree ("framework");--> statement-breakpoint
CREATE INDEX "idx_compliance_region" ON "compliance_checks" USING btree ("region_code");--> statement-breakpoint
CREATE INDEX "idx_compliance_status" ON "compliance_checks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_org" ON "users" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_users_role" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "idx_datacenters_region" ON "datacenters" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "idx_datacenters_slug" ON "datacenters" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_storage_dc" ON "storage_clusters" USING btree ("datacenter_id");--> statement-breakpoint
CREATE INDEX "idx_storage_metrics_cluster_ts" ON "storage_metrics" USING btree ("cluster_id","timestamp");--> statement-breakpoint
CREATE INDEX "idx_network_source" ON "network_links" USING btree ("source_dc_id");--> statement-breakpoint
CREATE INDEX "idx_network_target" ON "network_links" USING btree ("target_dc_id");--> statement-breakpoint
CREATE INDEX "idx_network_metrics_link_ts" ON "network_metrics" USING btree ("link_id","timestamp");--> statement-breakpoint
CREATE INDEX "idx_certs_domain" ON "certificates" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "idx_certs_status" ON "certificates" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_certs_valid_until" ON "certificates" USING btree ("valid_until");--> statement-breakpoint
CREATE INDEX "idx_sec_events_severity" ON "security_events" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "idx_sec_events_category" ON "security_events" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_sec_events_created" ON "security_events" USING btree ("created_at");