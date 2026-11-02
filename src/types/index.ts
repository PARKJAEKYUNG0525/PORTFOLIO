// Re-export project types for convenience
export type { KV, PipelineStep, Pipeline, Task, Trouble, Project } from '../data/projects';

export interface Competency {
  no: string;
  title: string;
  desc: string;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface JourneyItem {
  period: string;
  type: 'EDUCATION' | 'WORK' | 'DEGREE';
  title: string;
  desc: string;
}

export interface Cert {
  name: string;
  date: string;
  org: string;
}

export interface Contact {
  label: string;
  value: string;
  href: string;
  external: boolean;
}

export interface Metric {
  tag: string;
  value: string;
  label: string;
}
