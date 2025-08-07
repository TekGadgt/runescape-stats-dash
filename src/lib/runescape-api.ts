export interface RS3Stats {
  name: string;
  combatlevel: number;
  totalskill: number;
  totalxp: number;
  rank: string;
  melee: number;
  magic: number;
  ranged: number;
  questsstarted: number;
  questscomplete: number;
  questsnotstarted: number;
  activities: Activity[];
  skillvalues: SkillValue[];
}

export interface Activity {
  date: string;
  details: string;
  text: string;
}

export interface SkillValue {
  level: number;
  xp: number;
  rank: number;
  id: number;
}

export interface OSRSStats {
  skills: OSRSSkill[];
}

export interface OSRSSkill {
  name: string;
  rank: number;
  level: number;
  xp: number;
}

export const SKILL_NAMES = [
  'Overall',
  'Attack',
  'Defence',
  'Strength',
  'Hitpoints',
  'Ranged',
  'Prayer',
  'Magic',
  'Cooking',
  'Woodcutting',
  'Fletching',
  'Fishing',
  'Firemaking',
  'Crafting',
  'Smithing',
  'Mining',
  'Herblore',
  'Agility',
  'Thieving',
  'Slayer',
  'Farming',
  'Runecraft',
  'Hunter',
  'Construction'
];

export const RS3_SKILL_NAMES = [
  'Overall',
  'Attack',
  'Defence',
  'Strength',
  'Constitution',
  'Ranged',
  'Prayer',
  'Magic',
  'Cooking',
  'Woodcutting',
  'Fletching',
  'Fishing',
  'Firemaking',
  'Crafting',
  'Smithing',
  'Mining',
  'Herblore',
  'Agility',
  'Thieving',
  'Slayer',
  'Farming',
  'Runecraft',
  'Hunter',
  'Construction',
  'Summoning',
  'Dungeoneering',
  'Divination',
  'Invention',
  'Archaeology',
  'Necromancy'
];

export async function fetchRS3Stats(username: string): Promise<RS3Stats> {
  const response = await fetch(
    `https://apps.runescape.com/runemetrics/profile/profile?user=${encodeURIComponent(username)}&activities=20`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch RS3 stats');
  }
  
  return response.json();
}

export async function fetchOSRSStats(username: string): Promise<OSRSStats> {
  const response = await fetch(
    `https://secure.runescape.com/m=hiscore_oldschool/index_lite.json?player=${encodeURIComponent(username)}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch OSRS stats');
  }
  
  const data = await response.json();
  
  // Convert the array format to our skill structure
  const skills = data.skills.map((skill: any, index: number) => ({
    name: SKILL_NAMES[index] || `Skill ${index}`,
    rank: skill.rank,
    level: skill.level,
    xp: skill.xp
  }));
  
  return { skills };
}