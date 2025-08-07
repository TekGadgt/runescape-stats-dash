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
  try {
    // Use a CORS proxy service to bypass CORS restrictions
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
      `https://apps.runescape.com/runemetrics/profile/profile?user=${encodeURIComponent(username)}&activities=20`
    )}`;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch RS3 stats');
    }
    
    const data = await response.json();
    const stats = JSON.parse(data.contents);
    
    // Handle the case where the profile doesn't exist or has an error
    if (stats.error) {
      throw new Error(stats.error);
    }
    
    return stats;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`RS3 API Error: ${error.message}`);
    }
    throw new Error('Unknown error fetching RS3 stats');
  }
}

export async function fetchOSRSStats(username: string): Promise<OSRSStats> {
  try {
    // Use a CORS proxy service to bypass CORS restrictions
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
      `https://secure.runescape.com/m=hiscore_oldschool/index_lite.json?player=${encodeURIComponent(username)}`
    )}`;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch OSRS stats');
    }
    
    const proxyData = await response.json();
    const data = JSON.parse(proxyData.contents);
    
    // Convert the array format to our skill structure
    const skills = data.skills.map((skill: any, index: number) => ({
      name: SKILL_NAMES[index] || `Skill ${index}`,
      rank: skill.rank,
      level: skill.level,
      xp: skill.xp
    }));
    
    return { skills };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`OSRS API Error: ${error.message}`);
    }
    throw new Error('Unknown error fetching OSRS stats');
  }
}