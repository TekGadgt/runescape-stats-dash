import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { MagnifyingGlass, ArrowClockwise, User } from '@phosphor-icons/react';
import { fetchRS3Stats, fetchOSRSStats, type RS3Stats, type OSRSStats, RS3_SKILL_NAMES, SKILL_NAMES } from '@/lib/runescape-api';
import { toast } from 'sonner';

type GameMode = 'rs3' | 'osrs';

function App() {
  const [activeGame, setActiveGame] = useKV<GameMode>('active-game', 'rs3');
  const [username, setUsername] = useKV('username', 'tekgadgt');
  const [inputUsername, setInputUsername] = useState('');
  const [rs3Stats, setRS3Stats] = useKV<RS3Stats | null>('rs3-stats', null);
  const [osrsStats, setOSRSStats] = useKV<OSRSStats | null>('osrs-stats', null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchUsername?: string) => {
    const targetUsername = searchUsername || inputUsername || username;
    if (!targetUsername.trim()) {
      toast.error('Please enter a username');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const promises = [];
      
      if (activeGame === 'rs3') {
        promises.push(fetchRS3Stats(targetUsername));
      } else {
        promises.push(fetchOSRSStats(targetUsername));
      }

      const [stats] = await Promise.all(promises);

      if (activeGame === 'rs3') {
        setRS3Stats(stats as RS3Stats);
      } else {
        setOSRSStats(stats as OSRSStats);
      }

      setUsername(targetUsername);
      setInputUsername('');
      toast.success(`Loaded ${targetUsername}'s ${activeGame.toUpperCase()} stats`);
    } catch (err) {
      setError(`Failed to load stats: ${err instanceof Error ? err.message : 'Unknown error'}`);
      toast.error('Failed to load player stats');
    } finally {
      setLoading(false);
    }
  };

  const getXPProgress = (level: number, xp: number) => {
    if (level >= 99) return 100;
    
    // XP table for levels 1-99 (simplified)
    const xpTable = [0, 83, 174, 276, 388, 512, 650, 801, 969, 1154, 1358, 1584, 1833, 2107, 2411, 2746, 3115, 3523, 3973, 4470, 5018, 5624, 6291, 7028, 7842, 8740, 9730, 10824, 12031, 13363, 14833, 16456, 18247, 20224, 22406, 24815, 27473, 30408, 33648, 37224, 41171, 45529, 50339, 55649, 61512, 67983, 75127, 83014, 91721, 101333, 111945, 123660, 136594, 150872, 166636, 184040, 203254, 224466, 247886, 273742, 302288, 333804, 368599, 407015, 449428, 496254, 547953, 605032, 667983, 737627, 814445, 899257, 992895, 1096278, 1210421, 1336443, 1475581, 1629200, 1798808, 1986068, 2192818, 2421087, 2673114, 2951373, 3258594, 3597792, 3972294, 4385776, 4842295, 5346332, 5902831, 6517253, 7195629, 7944614, 8771558, 9684577, 10692629, 11805606, 13034431];
    
    const currentLevelXP = xpTable[level] || 0;
    const nextLevelXP = xpTable[level + 1] || currentLevelXP;
    const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    
    return Math.min(Math.max(progress, 0), 100);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderRS3Stats = () => {
    if (!rs3Stats) return null;

    return (
      <div className="space-y-6">
        {/* Player Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <User size={32} className="text-secondary" />
              <div>
                <CardTitle className="text-2xl">{rs3Stats.name}</CardTitle>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>Combat Level: {rs3Stats.combatlevel}</span>
                  <span>Total Level: {rs3Stats.totalskill}</span>
                  <span>Total XP: {formatNumber(rs3Stats.totalxp)}</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Combat Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Combat Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{rs3Stats.melee}</div>
                <div className="text-sm text-muted-foreground">Melee</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{rs3Stats.magic}</div>
                <div className="text-sm text-muted-foreground">Magic</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{rs3Stats.ranged}</div>
                <div className="text-sm text-muted-foreground">Ranged</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {rs3Stats.skillvalues.map((skill, index) => {
                const skillName = RS3_SKILL_NAMES[skill.id] || `Skill ${skill.id}`;
                const progress = getXPProgress(skill.level, skill.xp);
                
                return (
                  <div key={skill.id} className="p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">{skillName}</span>
                      <Badge variant="secondary">{skill.level}</Badge>
                    </div>
                    <div className="space-y-1">
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formatNumber(skill.xp)} XP</span>
                        <span>#{formatNumber(skill.rank)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        {rs3Stats.activities && rs3Stats.activities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rs3Stats.activities.map((activity, index) => (
                  <div key={index} className="flex justify-between items-start p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <div className="font-medium">{activity.text}</div>
                      {activity.details && (
                        <div className="text-sm text-muted-foreground mt-1">{activity.details}</div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {formatDate(activity.date)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderOSRSStats = () => {
    if (!osrsStats) return null;

    const overallSkill = osrsStats.skills[0];
    const regularSkills = osrsStats.skills.slice(1);

    return (
      <div className="space-y-6">
        {/* Player Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <User size={32} className="text-secondary" />
              <div>
                <CardTitle className="text-2xl">{username}</CardTitle>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>Total Level: {overallSkill.level}</span>
                  <span>Total XP: {formatNumber(overallSkill.xp)}</span>
                  <span>Rank: #{formatNumber(overallSkill.rank)}</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Skills Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {regularSkills.map((skill, index) => {
                const progress = getXPProgress(skill.level, skill.xp);
                
                return (
                  <div key={index} className="p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">{skill.name}</span>
                      <Badge variant="secondary">{skill.level}</Badge>
                    </div>
                    <div className="space-y-1">
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formatNumber(skill.xp)} XP</span>
                        <span>#{formatNumber(skill.rank)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">RuneScape Stats Tracker</h1>
          <p className="text-muted-foreground">Track your progress across Old School and RuneScape 3</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                placeholder="Enter username..."
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
                id="username-search"
              />
              <Button onClick={() => handleSearch()} disabled={loading}>
                <MagnifyingGlass size={16} className="mr-2" />
                Search
              </Button>
              <Button variant="outline" onClick={() => handleSearch(username)} disabled={loading}>
                <ArrowClockwise size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Game Mode Tabs */}
        <Tabs value={activeGame} onValueChange={(value) => setActiveGame(value as GameMode)} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="rs3">RuneScape 3</TabsTrigger>
            <TabsTrigger value="osrs">Old School</TabsTrigger>
          </TabsList>

          <TabsContent value="rs3" className="mt-6">
            {loading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading RuneScape 3 stats...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {!rs3Stats && username && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <p className="mb-4">No RuneScape 3 stats loaded for {username}</p>
                        <Button onClick={() => handleSearch(username)}>
                          Load Stats
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {renderRS3Stats()}
              </>
            )}
          </TabsContent>

          <TabsContent value="osrs" className="mt-6">
            {loading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading Old School stats...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {!osrsStats && username && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <p className="mb-4">No Old School stats loaded for {username}</p>
                        <Button onClick={() => handleSearch(username)}>
                          Load Stats
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {renderOSRSStats()}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;