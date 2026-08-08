import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultSkillsPath = path.resolve(__dirname, '../skills.md');

const mappedSkillActions = {
  'code-implementer': 'coding-agent',
  'code-reviewer': 'review-agent',
  'test-runner': 'test-agent',
  'playwright-browser-automator': 'playwright-agent',
};

function resolveSkillsPath() {
  return process.env.SKILLS_MD_PATH || defaultSkillsPath;
}

let catalogState = {
  path: resolveSkillsPath(),
  loadedAt: null,
  skills: [],
  warning: null,
};

function normalizeField(value = '') {
  return value.trim();
}

function parseInputs(value = '') {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSkillsMarkdown(content) {
  const lines = content.split('\n');
  const skills = [];
  let currentSkill = null;

  for (const line of lines) {
    const skillHeading = line.match(/^##\s+Skill:\s+(.+)$/);

    if (skillHeading) {
      if (currentSkill?.id) {
        skills.push(currentSkill);
      }

      currentSkill = {
        name: normalizeField(skillHeading[1]),
        id: '',
        what: '',
        inputs: [],
        output: '',
        safety: '',
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

    const inputsMatch = line.match(/^- Inputs:\s+(.+)$/);
    if (inputsMatch) {
      currentSkill.inputs = parseInputs(inputsMatch[1]);
      continue;
    }

    const outputMatch = line.match(/^- Output:\s+(.+)$/);
    if (outputMatch) {
      currentSkill.output = normalizeField(outputMatch[1]);
      continue;
    }

    const safetyMatch = line.match(/^- Safety:\s+(.+)$/);
    if (safetyMatch) {
      currentSkill.safety = normalizeField(safetyMatch[1]);
    }
  }

  if (currentSkill?.id) {
    skills.push(currentSkill);
  }

  return skills;
}

export function initializeSkillsCatalog() {
  const skillsPath = resolveSkillsPath();

  catalogState = {
    ...catalogState,
    path: skillsPath,
    loadedAt: null,
    skills: [],
    warning: null,
  };

  try {
    const markdown = fs.readFileSync(skillsPath, 'utf8');
    catalogState.skills = parseSkillsMarkdown(markdown);
    catalogState.loadedAt = new Date().toISOString();
  } catch (error) {
    catalogState.skills = [];
    const reason = error?.code || 'UNKNOWN_ERROR';
    catalogState.warning = `Unable to load skills catalog (${reason}).`;
  }

  return catalogState;
}

export function getSkillsCatalog() {
  return catalogState;
}

function findSkill(skillId) {
  return catalogState.skills.find((skill) => skill.id === skillId);
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
      error: `Missing required inputs: ${missingInputs.join(', ')}`,
      requiredInputs: skill.inputs,
    };
  }

  return {
    ok: true,
    action: mappedSkillActions[skillId] || 'general-agent',
    skillId: skill.id,
    skillName: skill.name,
    expectedOutput: skill.output,
    promptTemplate: {
      objective: skill.what,
      constraints: skill.safety,
      inputs: payload,
    },
  };
}
