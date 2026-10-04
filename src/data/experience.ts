// Only facts supplied by Omkar. Add `points` (responsibilities) when you want bullet details under a role.
export interface Role { track: 'data' | 'other'; company: string; role: string; dates: string; current?: boolean; type: string; points: string[]; tech: string[] }
export const experience: Role[] = [
  { track: 'data', company: 'Autoline Industries Ltd', role: 'Data Analyst', dates: 'June 2026 – Present', current: true, type: 'Full-time',
    points: ['Data Analyst role working with live sensor data collected from physical industrial grinding machines.'], tech: [] },
  { track: 'data', company: 'Lumax Cornaglia Auto Technologies Pvt Ltd', role: 'Project Management Internship', dates: 'Jan 2026 – Feb 2026', type: 'Internship', points: [], tech: [] },
  { track: 'other', company: 'Drushya Digital India Pvt Ltd', role: 'Full Stack Development Internship', dates: 'Sept 2025 – Nov 2025', type: 'Internship', points: [], tech: [] },
]

export const dataExperience = experience.filter(e => e.track === 'data')
export const otherExperience = experience.filter(e => e.track === 'other')
