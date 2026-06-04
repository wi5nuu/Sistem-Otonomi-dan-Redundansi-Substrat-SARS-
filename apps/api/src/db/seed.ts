import { db } from './index.js';
import {
  organizations, users, regions, datacenters,
  nodes, nodeMetrics,
  storageClusters, storageMetrics,
  energySources, upsSystems,
  networkLinks,
  securityEvents, certificates,
  incidents, incidentTimeline,
  runbooks,
  approvalRequests,
  auditLogs, complianceChecks,
  alerts,
} from '@sars/schemas';

async function seed() {
  console.log('🌱 Seeding SARS database...');

  const [orgOperator] = await db.insert(organizations).values({
    name: 'SARS Operations', slug: 'sars-operations', type: 'OPERATOR',
  }).returning();

  const [orgAuditor] = await db.insert(organizations).values({
    name: 'External Audit Corp', slug: 'external-audit', type: 'AUDITOR',
  }).returning();

  const [orgBoard] = await db.insert(organizations).values({
    name: 'Governance Board', slug: 'governance-board', type: 'GOVERNANCE_BOARD',
  }).returning();

  const usersData = [
    { email: 'superadmin@sars.io', name: 'Super Admin', role: 'SUPER_ADMIN', orgId: orgOperator!.id },
    { email: 'admin@sars.io', name: 'Admin User', role: 'ADMIN', orgId: orgOperator!.id },
    { email: 'operator@sars.io', name: 'Operator User', role: 'OPERATOR', orgId: orgOperator!.id },
    { email: 'auditor@sars.io', name: 'Auditor User', role: 'AUDITOR', orgId: orgAuditor!.id },
    { email: 'viewer@sars.io', name: 'Viewer User', role: 'VIEWER', orgId: orgBoard!.id },
  ];

  const createdUsers = [];
  for (const u of usersData) {
    const [user] = await db.insert(users).values({
      email: u.email, name: u.name, role: u.role,
      organizationId: u.orgId, isActive: true,
    }).returning();
    createdUsers.push(user);
  }

  const regionsData = [
    { code: 'AMERICAS', name: 'Americas', timezone: 'America/New_York', lat: 40.7128, lng: -74.006 },
    { code: 'EUROPE', name: 'Europe', timezone: 'Europe/London', lat: 51.5074, lng: -0.1278 },
    { code: 'APAC', name: 'Asia Pacific', timezone: 'Asia/Tokyo', lat: 35.6762, lng: 139.6503 },
    { code: 'AFRICA', name: 'Africa', timezone: 'Africa/Johannesburg', lat: -26.2041, lng: 28.0473 },
    { code: 'ARCTIC', name: 'Arctic', timezone: 'Arctic/Longyearbyen', lat: 78.2232, lng: 15.6267 },
  ];

  const createdRegions = [];
  for (const r of regionsData) {
    const [region] = await db.insert(regions).values(r).returning();
    createdRegions.push(region);
  }

  const dcNamesByRegion = [
    ['NYC-1', 'NYC-2', 'SFO-1'],
    ['LON-1', 'FRA-1', 'STO-1'],
    ['TYO-1', 'SGP-1', 'SYD-1'],
    ['CPT-1', 'NBO-1', 'LAG-1'],
    ['LRS-1', 'SVL-1', 'TRO-1'],
  ];

  const createdDcs = [];
  for (let ri = 0; ri < createdRegions.length; ri++) {
    const region = createdRegions[ri]!;
    for (let dci = 0; dci < 3; dci++) {
      const name = `${region.code}-${dcNamesByRegion[ri]![dci]!}`;
      const [dc] = await db.insert(datacenters).values({
        regionId: region.id, name,
        slug: name.toLowerCase(),
        address: `${dcNamesByRegion[ri]![dci]!}, ${region.name}`,
        lat: region.lat + (dci - 1) * 0.5,
        lng: region.lng + (dci - 1) * 0.5,
        tier: ['T1', 'T2', 'T3'][dci]!,
        powerCapacityKw: 5000 + Math.floor(Math.random() * 10000),
        coolingType: (['LIQUID', 'HYBRID', 'AIR'][dci]!),
      }).returning();
      createdDcs.push(dc);
    }
  }

  const vendors = ['Dell', 'HP', 'Supermicro', 'Cisco', 'Huawei'];
  const models = ['PowerEdge R750', 'ProLiant DL380', 'SuperServer 420GP', 'UCS C220', 'TaiShan 200'];
  const archs: Array<'X86_64' | 'ARM64' | 'RISC_V'>[] = [['X86_64', 'X86_64', 'ARM64', 'X86_64', 'ARM64', 'X86_64', 'X86_64', 'ARM64', 'RISC_V', 'X86_64']];

  const createdNodes = [];
  for (const dc of createdDcs) {
    for (let ni = 0; ni < 10; ni++) {
      const vi = Math.floor(Math.random() * vendors.length);
      const a = archs[0]![ni % 10]!;
      const statuses: Array<'ACTIVE' | 'ACTIVE' | 'ACTIVE' | 'DEGRADED'> = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'DEGRADED'];
      const [node] = await db.insert(nodes).values({
        datacenterId: dc!.id,
        hostname: `node-${dc!.slug}-${String(ni + 1).padStart(3, '0')}`,
        ipAddress: `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${ni + 1}`,
        architecture: a,
        vendor: vendors[vi]!,
        model: models[vi]!,
        cpuCores: [32, 64, 96, 128][Math.floor(Math.random() * 4)]!,
        ramGb: [128, 256, 512, 1024][Math.floor(Math.random() * 4)]!,
        status: statuses[Math.floor(Math.random() * statuses.length)]!,
        uptimeSeconds: Math.floor(Math.random() * 86400 * 30),
      }).returning();
      createdNodes.push(node);
    }
  }

  for (const node of createdNodes.slice(0, 20)) {
    for (let d = 0; d < 90; d++) {
      const ts = new Date(Date.now() - d * 86400000);
      for (let h = 0; h < 24; h += 4) {
        ts.setHours(h);
        await db.insert(nodeMetrics).values({
          nodeId: node!.id, timestamp: new Date(ts),
          cpuPercent: 20 + Math.random() * 60,
          ramPercent: 30 + Math.random() * 50,
          networkInMbps: 100 + Math.random() * 900,
          networkOutMbps: 50 + Math.random() * 500,
          temperatureCelsius: 35 + Math.random() * 30,
          powerWatts: 200 + Math.random() * 400,
        });
      }
    }
  }

  for (const dc of createdDcs) {
    const types: Array<'SOLAR' | 'GRID' | 'HYDRO' | 'WIND' | 'DIESEL' | 'HYDROGEN'>[] = [
      ['SOLAR', 'GRID', 'WIND', 'DIESEL'],
      ['GRID', 'HYDRO', 'WIND', 'HYDROGEN'],
      ['SOLAR', 'GRID', 'HYDRO', 'DIESEL'],
      ['SOLAR', 'WIND', 'DIESEL', 'HYDROGEN'],
      ['GRID', 'DIESEL', 'HYDROGEN', 'SOLAR'],
    ];
    for (const et of types[Math.floor(Math.random() * types.length)]!) {
      await db.insert(energySources).values({
        datacenterId: dc!.id, type: et, provider: `${et} Energy Co`,
        capacityKw: 1000 + Math.floor(Math.random() * 4000),
        currentOutputKw: 500 + Math.floor(Math.random() * 2000), status: 'ACTIVE',
      });
    }
    await db.insert(upsSystems).values({
      datacenterId: dc!.id, name: `${dc!.name}-UPS-1`,
      capacityKwh: 500 + Math.floor(Math.random() * 1500),
      currentChargePercent: 60 + Math.random() * 40,
      estimatedRuntimeMinutes: 15 + Math.floor(Math.random() * 60),
      status: 'ONLINE', lastTestedAt: new Date(),
    });
  }

  const linkTypes: ('DARK_FIBER' | 'LEASED_LINE' | 'SATELLITE' | 'INTERNET')[] = ['DARK_FIBER', 'LEASED_LINE', 'SATELLITE', 'INTERNET'];
  for (let i = 0; i < 50; i++) {
    const si = Math.floor(Math.random() * createdDcs.length);
    let ti = Math.floor(Math.random() * createdDcs.length);
    while (ti === si) ti = Math.floor(Math.random() * createdDcs.length);
    await db.insert(networkLinks).values({
      sourceDcId: createdDcs[si]!.id, targetDcId: createdDcs[ti]!.id,
      type: linkTypes[Math.floor(Math.random() * linkTypes.length)]!,
      bandwidthGbps: 10 + Math.floor(Math.random() * 400),
      latencyMs: 1 + Math.random() * 200,
      provider: ['Equinix', 'Lumen', 'AT&T', 'Telia', 'China Telecom'][Math.floor(Math.random() * 5)]!,
      status: 'ACTIVE', redundancyLevel: 1 + Math.floor(Math.random() * 3),
    });
  }

  const secData = [
    { severity: 'CRITICAL' as const, category: 'INTRUSION' as const, title: 'Unauthorized SSH access attempt', description: 'Multiple failed SSH attempts from 185.220.101.x' },
    { severity: 'HIGH' as const, category: 'AUTH' as const, title: 'Suspicious admin login', description: 'Admin login from unusual geographic location' },
    { severity: 'MEDIUM' as const, category: 'ANOMALY' as const, title: 'Unusual network traffic pattern', description: 'Outbound traffic spike to unknown destinations' },
    { severity: 'LOW' as const, category: 'COMPLIANCE' as const, title: 'Password rotation overdue', description: '15 users have passwords older than 90 days' },
    { severity: 'HIGH' as const, category: 'INTEGRITY' as const, title: 'File integrity alert', description: 'Binary hash mismatch on node-ams-004' },
    { severity: 'CRITICAL' as const, category: 'INTRUSION' as const, title: 'DDoS attack detected', description: 'Traffic amplification attack targeting DNS servers' },
    { severity: 'MEDIUM' as const, category: 'ANOMALY' as const, title: 'Anomalous API call pattern', description: 'High frequency of DELETE requests on audit endpoint' },
    { severity: 'INFO' as const, category: 'COMPLIANCE' as const, title: 'SOC2 audit initiated', description: 'External audit commencing next week' },
    { severity: 'HIGH' as const, category: 'AUTH' as const, title: 'MFA bypass attempt', description: 'TOTP replay attack detected and blocked' },
    { severity: 'LOW' as const, category: 'INTEGRITY' as const, title: 'Certificate renewal completed', description: '*.sars.io certificate renewed successfully' },
  ];

  for (const ev of secData) {
    await db.insert(securityEvents).values({
      ...ev,
      datacenterId: createdDcs[Math.floor(Math.random() * createdDcs.length)]!.id,
      rawPayload: { source: 'seed', version: 1 },
    });
  }

  const certData = [
    { domain: '*.sars.io', days: 45 },
    { domain: 'api.sars.io', days: 15 },
    { domain: 'admin.sars.io', days: 7 },
    { domain: 'sars.internal', days: 90 },
    { domain: 'cdn.sars.io', days: 120 },
  ];
  for (const c of certData) {
    const now = new Date();
    const validUntil = new Date(now.getTime() + c.days * 86400000);
    const validFrom = new Date(now.getTime() - 180 * 86400000);
    await db.insert(certificates).values({
      domain: c.domain, issuer: 'Let\'s Encrypt', algorithm: 'RSA-4096',
      validFrom, validUntil, autoRenew: true,
      status: c.days <= 30 ? 'EXPIRING' : 'VALID',
    });
  }

  const [inc1] = await db.insert(incidents).values({
    title: 'Global DNS resolution failure', severity: 'P1', status: 'IN_PROGRESS',
    affectedRegions: ['AMERICAS', 'EUROPE', 'APAC'], affectedDatacenters: [1, 2, 3],
    detectedAt: new Date(Date.now() - 7200000), createdBy: createdUsers[2]!.id,
  }).returning();

  const [inc2] = await db.insert(incidents).values({
    title: 'Storage cluster performance degradation', severity: 'P2', status: 'TRIAGED',
    affectedRegions: ['AMERICAS'], affectedDatacenters: [1],
    detectedAt: new Date(Date.now() - 3600000), createdBy: createdUsers[2]!.id,
  }).returning();

  const [inc3] = await db.insert(incidents).values({
    title: 'UPS maintenance in Frankfurt', severity: 'P3', status: 'DETECTED',
    affectedRegions: ['EUROPE'], affectedDatacenters: [4],
    detectedAt: new Date(Date.now() - 1800000), createdBy: createdUsers[1]!.id,
  }).returning();

  const timelineData: Array<{ iid: string; action: string; at: 'SYSTEM' | 'HUMAN'; aid?: string }> = [
    { iid: inc1!.id, action: 'Incident detected by monitoring system', at: 'SYSTEM' },
    { iid: inc1!.id, action: 'PagerDuty notification sent', at: 'SYSTEM' },
    { iid: inc1!.id, action: 'Incident acknowledged by operator', at: 'HUMAN', aid: createdUsers[2]!.id },
    { iid: inc1!.id, action: 'DNS failover initiated', at: 'SYSTEM' },
    { iid: inc2!.id, action: 'Storage latency threshold exceeded', at: 'SYSTEM' },
    { iid: inc2!.id, action: 'Auto-scaling triggered', at: 'SYSTEM' },
    { iid: inc3!.id, action: 'UPS test cycle initiated', at: 'SYSTEM' },
    { iid: inc3!.id, action: 'Battery level below 30%', at: 'SYSTEM' },
  ];
  for (const t of timelineData) {
    await db.insert(incidentTimeline).values({
      incidentId: t.iid, action: t.action, actorType: t.at,
      actorId: t.aid ?? null,
    });
  }

  const runbookContent = `# Node Failure Response\n\n## Steps\n1. Verify node status\n2. Attempt remote restart\n3. If failed, trigger failover\n4. Notify on-call team`;
  await db.insert(runbooks).values({
    title: 'Node Failure Response', slug: 'node-failure-response',
    category: 'Compute', content: runbookContent, automatable: true,
    createdBy: createdUsers[2]!.id, lastReviewedAt: new Date(),
  });

  const reqData = [
    { title: 'Decommission node 10.0.1.45', type: 'NODE_DEACTIVATION' as const, req: 3 },
    { title: 'Update firewall rules for APAC', type: 'CONFIG_CHANGE' as const, req: 3 },
    { title: 'Failover AMERICAS compute to EUROPE', type: 'REGION_FAILOVER' as const, req: 3 },
    { title: 'Emergency shutdown of FRA-1', type: 'EMERGENCY_SHUTDOWN' as const, req: 5 },
    { title: 'Change backup retention policy', type: 'POLICY_CHANGE' as const, req: 3 },
  ];
  for (const r of reqData) {
    const exp = new Date(Date.now() + 7 * 86400000);
    await db.insert(approvalRequests).values({
      requestedBy: createdUsers[2]!.id, title: r.title,
      description: `Request to ${r.title.toLowerCase()}`, type: r.type,
      payload: { reason: 'Maintenance', impact: 'Low' },
      requiredApprovers: r.req, currentApprovals: 0, status: 'PENDING', expiresAt: exp,
    });
  }

  let prevHash = '0'.repeat(96);
  for (let batch = 0; batch < 50; batch++) {
    const entries = [];
    const actions = ['user.login', 'node.update', 'alert.acknowledge', 'incident.create', 'config.change', 'approval.create', 'runbook.execute'];
    const resources = ['users', 'nodes', 'alerts', 'incidents', 'config', 'approvals', 'runbooks'];
    for (let i = 0; i < 200; i++) {
      const base = {
        userId: Math.random() > 0.3 ? createdUsers[Math.floor(Math.random() * createdUsers.length)]!.id : null,
        systemActor: Math.random() > 0.7 ? 'system-cron' : null,
        action: actions[Math.floor(Math.random() * actions.length)]!,
        resource: resources[Math.floor(Math.random() * resources.length)]!,
        resourceId: crypto.randomUUID(),
        before: null, after: { status: 'completed' },
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        userAgent: 'SARS-Agent', sessionId: crypto.randomUUID(),
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 30),
      };
      const content = JSON.stringify({ ...base, previousHash: prevHash });
      const hb = await crypto.subtle.digest('SHA-384', new TextEncoder().encode(content));
      prevHash = Array.from(new Uint8Array(hb)).map((b) => b.toString(16).padStart(2, '0')).join('');
      entries.push({ ...base, immutableHash: prevHash });
    }
    await db.insert(auditLogs).values(entries);
    console.log(`  ✓ Created ${(batch + 1) * 200} audit log entries`);
  }

  const frameworks = ['GDPR', 'ISO27001', 'NIST_800_53', 'SOC2', 'LOCAL'];
  const statuses = ['PASS', 'PASS', 'PASS', 'FAIL', 'WARNING', 'PASS'];
  for (const region of createdRegions) {
    for (const framework of frameworks) {
      const s = statuses[Math.floor(Math.random() * statuses.length)]!;
      const next = new Date(Date.now() + (30 + Math.floor(Math.random() * 60)) * 86400000);
      await db.insert(complianceChecks).values({
        checkName: `${framework} - ${region!.code}`, framework: framework,
        regionCode: region!.code, status: s,
        details: s === 'PASS' ? `All ${framework} controls compliant` : `Control #42 failed`,
        checkedAt: new Date(), nextCheckAt: next,
      });
    }
  }

  for (const dc of createdDcs.slice(0, 5)) {
    const tiers: Array<'HOT' | 'WARM' | 'COLD'> = ['HOT', 'WARM', 'COLD'];
    for (const tier of tiers) {
      const totalTb = tier === 'HOT' ? 500 + Math.floor(Math.random() * 500) : tier === 'WARM' ? 1000 + Math.floor(Math.random() * 1000) : 2000 + Math.floor(Math.random() * 3000);
      const [cluster] = await db.insert(storageClusters).values({
        datacenterId: dc!.id, name: `${dc!.name}-${tier}`, tier: tier,
        totalTb, usedTb: totalTb * (0.3 + Math.random() * 0.5),
        replicationFactor: tier === 'HOT' ? 3 : 2,
        erasureCodingScheme: tier === 'HOT' ? 'RS-4+2' : 'RS-6+3',
        status: 'ONLINE', lastIntegrityCheckAt: new Date(),
      }).returning();
      for (let h = 0; h < 72; h++) {
        await db.insert(storageMetrics).values({
          clusterId: cluster!.id, timestamp: new Date(Date.now() - h * 3600000),
          readIops: 1000 + Math.random() * 9000, writeIops: 500 + Math.random() * 4500,
          readLatencyMs: 0.5 + Math.random() * 4, writeLatencyMs: 1 + Math.random() * 6,
          throughputMbps: 200 + Math.random() * 800,
        });
      }
    }
  }

  const alertData = [
    { severity: 'CRITICAL' as const, title: 'Node 10.0.1.45 offline', message: 'No heartbeat for 5 min', affectedResource: 'node:10.0.1.45', status: 'FIRING' as const },
    { severity: 'HIGH' as const, title: 'Storage capacity 82%', message: 'HOT-01 cluster near full', affectedResource: 'cluster:HOT-01', status: 'FIRING' as const },
    { severity: 'HIGH' as const, title: 'Certificate expiring', message: '*.sars.io in 7 days', affectedResource: 'cert:*.sars.io', status: 'ACKNOWLEDGED' as const },
    { severity: 'MEDIUM' as const, title: 'Latency > 150ms', message: 'Transatlantic link degraded', affectedResource: 'link:transatlantic', status: 'FIRING' as const },
    { severity: 'LOW' as const, title: 'UPS test overdue', message: 'Not tested in 30 days', affectedResource: 'ups:unknown', status: 'RESOLVED' as const },
  ];
  for (const a of alertData) {
    await db.insert(alerts).values(a);
  }

  console.log('✅ Seeding complete!');
  console.log(`  Regions: ${createdRegions.length}, DCs: ${createdDcs.length}, Nodes: ${createdNodes.length}, Users: ${createdUsers.length}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
