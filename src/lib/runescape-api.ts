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

// Skill ID to name mapping based on RuneScape 3 API documentation
export const RS3_SKILL_NAMES: { [key: number]: string } = {
  0: 'Attack',
  1: 'Defence',
  2: 'Strength',
  3: 'Constitution',
  4: 'Ranged',
  5: 'Prayer',
  6: 'Magic',
  7: 'Cooking',
  8: 'Woodcutting',
  9: 'Fletching',
  10: 'Fishing',
  11: 'Firemaking',
  12: 'Crafting',
  13: 'Smithing',
  14: 'Mining',
  15: 'Herblore',
  16: 'Agility',
  17: 'Thieving',
  18: 'Slayer',
  19: 'Farming',
  20: 'Runecrafting',
  21: 'Hunter',
  22: 'Construction',
  23: 'Summoning',
  24: 'Dungeoneering',
  25: 'Divination',
  26: 'Invention',
  27: 'Archaeology',
  28: 'Necromancy'
};

export async function fetchRS3Stats(username: string): Promise<RS3Stats> {
  try {
    // Use a CORS proxy service to bypass CORS restrictions
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
      `https://apps.runescape.com/runemetrics/profile/profile?user=${encodeURIComponent(username)}&activities=20`
    )}`;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch RS3 stats`);
    }
    
    const data = await response.json();
    
    // Check if the proxy returned an error
    if (data.status && data.status.http_code && data.status.http_code !== 200) {
      throw new Error(`RuneScape API returned HTTP ${data.status.http_code}`);
    }
    
    if (!data.contents) {
      throw new Error('No data returned from RuneScape API');
    }
    
    const stats = JSON.parse(data.contents);
    
    // Handle the case where the profile doesn't exist or has an error
    if (stats.error) {
      throw new Error(`Profile not found: ${stats.error}`);
    }
    
    // Validate that we have the expected data structure
    if (!stats.name || !stats.skillvalues) {
      throw new Error('Invalid data structure returned from API');
    }
    
    return stats;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON response from RuneScape API');
    }
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