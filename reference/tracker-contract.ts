/**
 * Reference TypeScript contracts — read/edit into the generated app's `src/domain/`.
 * This is a specification aid, NOT a complete app or runtime implementation.
 * IDs are opaque stable strings. Never reindex them or generate keys from labels.
 */

export type Level = 'L1' | 'L2' | 'L3';
export type SkillStatus = 'not_started' | 'learning' | 'practiced' | 'mastered';
export type WorkStatus = 'not_started' | 'active' | 'blocked' | 'completed';
export type AssessmentStatus = 'not_started' | 'attempted' | 'passed' | 'needs_review';

export interface Skill { id: string; name: string; status_default: 'not_started' }
export interface LabStep { id: string; instruction: string }
export interface Lab { id: string; title: string; steps: LabStep[]; expected_evidence: string }
export interface Assessment { id: string; challenge: string; rubric: string[]; required_evidence: string[] }
export interface LearningUnit {
  id: string;
  level: Level;
  outcome: string;
  learning_mode: string;
  skills: Skill[];
  lab: Lab;
  assessment: Assessment;
  resource_ids: string[];
  estimated_focus: string;
  prerequisite_unit_ids: string[];
}
export interface Track {
  id: string;
  title: string;
  why_it_matters: string;
  prerequisite_unit_ids: string[];
  resource_ids: string[];
  levels: LearningUnit[];
}
export interface Discipline {
  id: string;
  title: string;
  goal: string;
  priority: 'now' | 'later';
  tracks: Track[];
}
export interface ProjectTask { id: string; title: string }
export interface Project {
  id: string;
  title: string;
  description: string;
  stage: string;
  related_unit_ids: string[];
  tasks: ProjectTask[];
  required_evidence: string[];
  status_default: 'not_started';
  completion_rule: string;
}
export interface Resource {
  id: string;
  title: string;
  source_type: string;
  url: string;
  purpose: string;
}
export interface SprintWeek {
  id: string;
  index: number;
  focus: string;
  suggested_unit_ids: string[];
  project_ids: string[];
  evidence_goal: string;
}
export interface StarterDay {
  id: string;
  day: number;
  mission: string;
  deliverable: string;
  related_unit_ids: string[];
}
export interface Curriculum {
  schema_version: string;
  dataset_id: string;
  curriculum: Discipline[];
  projects: Project[];
  resources: Resource[];
  study_plan: { weeks: SprintWeek[]; parallel_routines: unknown[] };
  python_seven_day_starter: { days: StarterDay[]; goal: string };
  // Other top-level fields are advisory/reference content.
  [key: string]: unknown;
}

export interface SkillProgress {
  status: SkillStatus;
  updatedAt: string;
  notes?: string;
  reviewDue?: string | null; // YYYY-MM-DD in local calendar
  lastReviewedAt?: string | null;
}
export interface BooleanProgress { done: boolean; updatedAt: string }
export interface AssessmentProgress { status: AssessmentStatus; updatedAt: string; evidence?: string }
export interface ProjectProgress { status: WorkStatus; updatedAt: string; notes?: string }
export interface EvidenceProgress { notes?: string; links?: string[]; updatedAt: string }
export interface TrackerState {
  version: 1;
  updatedAt: string | null;
  profile: { preferredHoursPerWeek?: number; sprintStartDate?: string | null; currentUnitId?: string | null; theme?: 'system' | 'light' | 'dark' };
  skills: Record<string, SkillProgress>;
  labSteps: Record<string, BooleanProgress>;
  assessments: Record<string, AssessmentProgress>;
  projects: Record<string, ProjectProgress>;
  projectTasks: Record<string, BooleanProgress>;
  evidence: Record<string, EvidenceProgress>;
  dayChecks: Record<string, boolean>;
  weekChecks: Record<string, boolean>;
  customReviews: Record<string, string>;
}

export interface MasteryDiagnostic {
  ready: boolean;
  missingSkillIds: string[];
  missingLabStepIds: string[];
  missingAssessmentPass: boolean;
  missingEvidence: boolean;
}

// Pure functions to implement and thoroughly unit-test:
export declare function diagnoseUnitMastery(unit: LearningUnit, state: TrackerState): MasteryDiagnostic;
export declare function overallSkillCounts(data: Curriculum, state: TrackerState): {
  total: number;
  notStarted: number;
  learning: number;
  practiced: number;
  mastered: number;
};
export declare function isValidProgressBackup(value: unknown, curriculum: Curriculum): boolean;
export declare function makeBackup(progress: TrackerState, datasetId: string): {
  format: 'engineering-mastery-progress';
  version: 1;
  curriculumDatasetId: string;
  exportedAt: string;
  progress: TrackerState;
};
