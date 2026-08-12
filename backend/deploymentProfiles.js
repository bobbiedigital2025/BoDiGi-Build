const DEFAULT_PROFILE_ID = 'vercel-docker-n8n';
const DEFAULT_PROFILE_MODE = 'user-preferred';
const DEFAULT_MCP_VERSION = process.env.MCP_PROTOCOL_VERSION || '2';

const deploymentProfiles = [
  {
    id: 'vercel-docker-n8n',
    name: 'Vercel + Docker + n8n',
    description: 'Preferred profile for Vercel-first deployments with Dockerized services and n8n automation.',
    mcpVersion: DEFAULT_MCP_VERSION,
    advancedTech: [
      'MCP-2 skill orchestration and context validation',
      'A2A token-gated agent invocation',
      'Automated rollback orchestration via n8n',
      'Continuous dependency update automation',
    ],
    templates: {
      singleServerCompose: {
        name: 'single-server-docker-compose',
        includes: ['app', 'reverse-proxy', 'database', 'backup-runner', 'n8n'],
        purpose: 'Fast production baseline for single-server runtime with secure defaults.',
      },
      multiServiceSplit: {
        name: 'multi-service-growth-split',
        includes: ['frontend-on-vercel', 'api-services', 'database', 'worker-jobs', 'n8n-automation'],
        purpose: 'Optional scale-out template when traffic and operational complexity grow.',
      },
    },
    hooks: {
      buildDeployTrigger: 'n8n workflow starts CI artifact promote/deploy execution.',
      healthCheckAlert: 'n8n workflow pings health endpoints and sends alert on failure.',
      rollbackTrigger: 'n8n workflow triggers previous stable release rollback on failed verification.',
      maintenanceSchedule: 'n8n cron workflow runs backups and dependency update jobs.',
    },
    hardening: [
      'MCP-2 contract validation for deployment orchestration payloads.',
      'TLS/HTTPS enforced for all public endpoints.',
      'Firewall defaults deny inbound except required ports.',
      'Secrets loaded from environment or secure secret stores only.',
      'Least-privilege runtime users for containers and services.',
      'Service isolation for public, internal, and data-plane components.',
    ],
    preDeployValidation: [
      'Lint/build/test checks pass.',
      'Security checks pass (dependency and code scanning).',
      'Required deployment config is present for Docker and n8n workflows.',
    ],
    postDeployVerification: [
      'Smoke tests for core user flows pass.',
      'Uptime/health checks are green.',
      'API contract checks are successful.',
      'Automated rollback is ready and executable.',
    ],
  },
  {
    id: 'vercel-managed',
    name: 'Vercel Managed',
    description: 'Vercel-first profile using managed platform features with optional n8n automations.',
    mcpVersion: DEFAULT_MCP_VERSION,
    advancedTech: [
      'MCP-2 skill orchestration and context validation',
      'A2A token-gated deployment operations',
      'Policy-aware automation hooks with n8n',
      'Automated release health monitoring',
    ],
    templates: {
      singleServerCompose: {
        name: 'managed-minimal-compose',
        includes: ['optional-api-worker', 'optional-n8n'],
        purpose: 'Minimal auxiliary service template when Vercel hosts most runtime concerns.',
      },
      multiServiceSplit: {
        name: 'managed-growth-split',
        includes: ['frontend-on-vercel', 'managed-db', 'background-workers', 'n8n-automation'],
        purpose: 'Scale plan for managed-first operations with automation integrations.',
      },
    },
    hooks: {
      buildDeployTrigger: 'n8n triggers deployment workflows after quality gates.',
      healthCheckAlert: 'n8n notifies channels on synthetic check failures.',
      rollbackTrigger: 'n8n orchestrates rollback to previous deployment target.',
      maintenanceSchedule: 'n8n schedules backups and maintenance tasks.',
    },
    hardening: [
      'MCP-2 contract validation for deployment control payloads.',
      'TLS/HTTPS required and enforced.',
      'Strict secrets management and no plaintext credentials.',
      'Least-privilege service and token permissions.',
      'Network access boundaries for internal services.',
    ],
    preDeployValidation: [
      'Lint/build/test checks pass.',
      'Security checks pass.',
      'Deployment profile variables are complete.',
    ],
    postDeployVerification: [
      'Smoke tests pass.',
      'Uptime checks pass.',
      'API checks pass.',
      'Rollback path is validated.',
    ],
  },
];

function normalizeText(value = '') {
  return String(value).trim().toLowerCase();
}

function getDeploymentProfileMode() {
  return process.env.DEPLOYMENT_PROFILE_MODE || DEFAULT_PROFILE_MODE;
}

function getDefaultDeploymentProfileId() {
  return process.env.DEFAULT_DEPLOYMENT_PROFILE || DEFAULT_PROFILE_ID;
}

export function getDeploymentProfiles() {
  return deploymentProfiles;
}

export function resolvePreferredDeploymentProfile(requestedProfileId = '') {
  const mode = getDeploymentProfileMode();
  const normalizedRequestedId = normalizeText(requestedProfileId);
  const defaultProfileId = normalizeText(getDefaultDeploymentProfileId());
  const allowRequestOverride = mode !== 'locked-default';

  const requested = allowRequestOverride
    ? deploymentProfiles.find((profile) => normalizeText(profile.id) === normalizedRequestedId)
    : null;
  if (requested) {
    return {
      mode,
      source: 'request',
      defaultProfileId,
      profile: requested,
    };
  }

  const configuredDefault = deploymentProfiles.find((profile) => normalizeText(profile.id) === defaultProfileId);
  if (configuredDefault) {
    return {
      mode,
      source: 'default',
      defaultProfileId,
      profile: configuredDefault,
    };
  }

  const fallbackProfile = deploymentProfiles[0] || {
    id: DEFAULT_PROFILE_ID,
    name: 'Default Deployment Profile',
    description: 'Fallback deployment profile.',
    mcpVersion: DEFAULT_MCP_VERSION,
  };

  return {
    mode,
    source: 'fallback',
    defaultProfileId: deploymentProfiles[0]?.id || DEFAULT_PROFILE_ID,
    profile: fallbackProfile,
  };
}
