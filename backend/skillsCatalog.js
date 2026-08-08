import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultSkillsPath = path.resolve(__dirname, '../skills.md');

const mappedSkillActions = {
  'chief-architect': 'architecture-agent',
  'program-manager': 'planning-agent',
  'devops-sre-agent': 'devops-agent',
  'frontend-lead': 'frontend-agent',
  'backend-lead': 'backend-agent',
  'code-implementer': 'coding-agent',
  'code-reviewer': 'review-agent',
  'qa-test-agent': 'test-agent',
  'security-agent': 'security-agent',
  'docs-agent': 'docs-agent',
  'legal-compliance-agent': 'compliance-agent',
  'analytics-agent': 'analytics-agent',
  'monetization-agent': 'monetization-agent',
  'admin-ops-agent': 'admin-ops-agent',
  'playwright-browser-automator': 'playwright-agent',
};

function resolveSkillsPath() {
  return process.env.SKILLS_MD_PATH || defaultSkillsPath;
}

let catalogState = {
  path: resolveSkillsPath(),
  loadedAt: null,
  skills: [],
  gates: [],
  warning: null,
};

function normalizeField(value = '') {
  return value.trim();
}

function parseList(value = '') {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseRules(value = '') {
  return value
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseApprovalGatesMarkdown(content) {
  const lines = content.split('\n');
  const gates = [];
  let currentGate = null;
  let inApprovalGatesSection = false;

  for (const line of lines) {
    if (line.match(/^##\s+Approval Gates$/)) {
      inApprovalGatesSection = true;
      continue;
    }

    if (line.match(/^##\s+Skill:\s+/)) {
      if (currentGate?.id) {
        gates.push(currentGate);
        currentGate = null;
      }
      inApprovalGatesSection = false;
    }

    if (!inApprovalGatesSection) {
      continue;
    }

    const gateHeading = line.match(/^###\s+Gate:\s+(.+)$/);

    if (gateHeading) {
      if (currentGate?.id) {
        gates.push(currentGate);
      }

      currentGate = {
        name: normalizeField(gateHeading[1]),
        id: '',
        approvers: [],
        requiredStatus: 'approved',
        rule: '',
      };
      continue;
    }

    if (!currentGate) {
      continue;
    }

    const idMatch = line.match(/^- ID:\s+(.+)$/);
    if (idMatch) {
      currentGate.id = normalizeField(idMatch[1]);
      continue;
    }

    const approversMatch = line.match(/^- Approvers:\s+(.+)$/);
    if (approversMatch) {
      currentGate.approvers = parseList(approversMatch[1]);
      continue;
    }

    const requiredStatusMatch = line.match(/^- Required Status:\s+(.+)$/);
    if (requiredStatusMatch) {
      currentGate.requiredStatus = normalizeField(requiredStatusMatch[1]).toLowerCase();
      continue;
    }

    const ruleMatch = line.match(/^- Rule:\s+(.+)$/);
    if (ruleMatch) {
      currentGate.rule = normalizeField(ruleMatch[1]);
    }
  }

  if (currentGate?.id) {
    gates.push(currentGate);
  }

  return gates;
}

function parseSkillsMarkdown(content) {
  const lines = content.split('\n');
  const skills = [];
  let currentSkill = null;

  for (const line of lines) {
    const skillHeading = line.match(/^##\s+Skill:\s+(.+)$/);

    if (skillHeading) {
      if (currentSkill?.id) {
        if (currentSkill.refusalRules.length === 0 && currentSkill.legacySafety) {
          currentSkill.refusalRules = parseRules(currentSkill.legacySafety);
        }
        delete currentSkill.legacySafety;
        skills.push(currentSkill);
      }

      currentSkill = {
        name: normalizeField(skillHeading[1]),
        id: '',
        role: '',
        what: '',
        inputs: [],
        output: '',
        dependencies: [],
        requiredGate: '',
        qualityBar: '',
        refusalRules: [],
        legacySafety: '',
      };
      continue;
    }

    if (!currentSkill) {
      continue;
    }

    const idMatch = line.match(/^- ID:\s+(.+)$/);
    if (idMatch) {
      currentSkill.id = normalizeField(idMatch[1]);
      continue;
    }

    const whatMatch = line.match(/^- What:\s+(.+)$/);
    if (whatMatch) {
      currentSkill.what = normalizeField(whatMatch[1]);
      continue;
    }

    const roleMatch = line.match(/^- Role:\s+(.+)$/);
    if (roleMatch) {
      currentSkill.role = normalizeField(roleMatch[1]);
      continue;
    }

    const inputsMatch = line.match(/^- Inputs:\s+(.+)$/);
    if (inputsMatch) {
      currentSkill.inputs = parseList(inputsMatch[1]);
      continue;
    }

    const outputMatch = line.match(/^- Output:\s+(.+)$/);
    if (outputMatch) {
      currentSkill.output = normalizeField(outputMatch[1]);
      continue;
    }

    const dependenciesMatch = line.match(/^- Dependencies:\s*(.*)$/);
    if (dependenciesMatch) {
      currentSkill.dependencies = parseList(dependenciesMatch[1]);
      continue;
    }

    const requiredGateMatch = line.match(/^- Required Gate:\s+(.+)$/);
    if (requiredGateMatch) {
      currentSkill.requiredGate = normalizeField(requiredGateMatch[1]);
      continue;
    }

    const qualityBarMatch = line.match(/^- Quality Bar:\s+(.+)$/);
    if (qualityBarMatch) {
      currentSkill.qualityBar = normalizeField(qualityBarMatch[1]);
      continue;
    }

    const refusalRulesMatch = line.match(/^- Refusal Rules:\s+(.+)$/);
    if (refusalRulesMatch) {
      currentSkill.refusalRules = parseRules(refusalRulesMatch[1]);
      continue;
    }

    const safetyMatch = line.match(/^- Safety:\s+(.+)$/);
    if (safetyMatch) {
      // Backward compatibility for older catalogs that used `Safety` instead of `Refusal Rules`.
      currentSkill.legacySafety = normalizeField(safetyMatch[1]);
      continue;
    }
  }

  if (currentSkill?.id) {
    if (currentSkill.refusalRules.length === 0 && currentSkill.legacySafety) {
      currentSkill.refusalRules = parseRules(currentSkill.legacySafety);
    }
    delete currentSkill.legacySafety;
    skills.push(currentSkill);
  }

  return skills;
}

export function initializeSkillsCatalog() {
  const skillsPath = resolveSkillsPath();
  let nextState = {
    path: skillsPath,
    loadedAt: null,
    skills: [],
    gates: [],
    warning: null,
  };

  try {
    const markdown = fs.readFileSync(skillsPath, 'utf8');
    nextState = {
      ...nextState,
      gates: parseApprovalGatesMarkdown(markdown),
      skills: parseSkillsMarkdown(markdown),
      loadedAt: new Date().toISOString(),
    };
  } catch (error) {
    const reason = error?.code || 'UNKNOWN_ERROR';
    nextState = {
      ...nextState,
      warning: `Unable to load skills catalog (${reason}).`,
    };
  }

  catalogState = nextState;
  return catalogState;
}

export function getSkillsCatalog() {
  return catalogState;
}

function findSkill(skillId) {
  return catalogState.skills.find((skill) => skill.id === skillId);
}

function findGate(gateId) {
  return catalogState.gates.find((gate) => gate.id === gateId);
}

function hasUsableValue(value) {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.some((item) => hasUsableValue(item));
  }

  return true;
}

function readGateStatus(payload, gateId) {
  if (!payload || !gateId) {
    return '';
  }

  if (payload.approvalGates && typeof payload.approvalGates === 'object') {
    return normalizeField(payload.approvalGates[gateId] || '').toLowerCase();
  }

  return '';
}

export function invokeSkill(skillId, payload = {}) {
  const skill = findSkill(skillId);

  if (!skill) {
    return {
      ok: false,
      error: `Unknown skill: ${skillId}`,
    };
  }

  const missingInputs = skill.inputs.filter((inputName) => !hasUsableValue(payload[inputName]));
  if (missingInputs.length > 0) {
    return {
      ok: false,
      statusCode: 400,
      code: 'MISSING_INPUTS',
      error: `Missing required inputs: ${missingInputs.join(', ')}`,
      requiredInputs: skill.inputs,
    };
  }

  const completedSkills = Array.isArray(payload.completedSkills) ? payload.completedSkills : [];
  const missingDependencies = skill.dependencies.filter(
    (dependencyId) => !completedSkills.includes(dependencyId),
  );

  if (missingDependencies.length > 0) {
    return {
      ok: false,
      statusCode: 409,
      code: 'DEPENDENCIES_NOT_MET',
      error: `Missing required dependencies: ${missingDependencies.join(', ')}`,
      requiredDependencies: skill.dependencies,
    };
  }

  if (skill.requiredGate) {
    const gate = findGate(skill.requiredGate);
    const requiredStatus = gate?.requiredStatus || 'approved';
    const currentGateStatus = readGateStatus(payload, skill.requiredGate);

    if (currentGateStatus !== requiredStatus) {
      return {
        ok: false,
        statusCode: 403,
        code: 'APPROVAL_GATE_NOT_APPROVED',
        error: `Required gate '${skill.requiredGate}' is not approved.`,
        requiredGate: skill.requiredGate,
        requiredStatus,
        currentStatus: currentGateStatus || 'missing',
      };
    }
  }

  return {
    ok: true,
    action: mappedSkillActions[skillId] || 'general-agent',
    skillId: skill.id,
    skillName: skill.name,
    role: skill.role,
    expectedOutput: skill.output,
    requiredGate: skill.requiredGate,
    dependencies: skill.dependencies,
    promptTemplate: {
      role: skill.role,
      objective: skill.what,
      qualityBar: skill.qualityBar,
      refusalRules: skill.refusalRules,
      inputs: payload,
    },
  };
}
