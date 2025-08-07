# RuneScape Stats Tracker

A comprehensive dashboard to display player statistics and recent activity for both Old School RuneScape and RuneScape 3.

**Experience Qualities**: 
1. **Nostalgic** - Captures the classic MMO feel with medieval-inspired design elements
2. **Professional** - Clean, organized presentation of complex statistical data  
3. **Engaging** - Interactive elements that make exploring stats enjoyable

**Complexity Level**: Light Application (multiple features with basic state)
- Fetches and displays data from two different RuneScape APIs
- Supports switching between game modes
- Persists user preferences and viewing history

## Essential Features

### Dual Game Mode Support
- **Functionality**: Toggle between Old School RuneScape and RuneScape 3 stats
- **Purpose**: Allows players who play both games to track progress in one place
- **Trigger**: Game mode selector buttons in header
- **Progression**: Click game mode → API fetch → Stats display updates → Activity log updates (RS3 only)
- **Success criteria**: Smooth transitions between game modes with distinct visual styling

### Comprehensive Stats Display
- **Functionality**: Show all skills with levels, XP, and rankings in organized grid
- **Purpose**: Quick overview of character progression across all skills
- **Trigger**: Page load or game mode switch
- **Progression**: API call → Parse skill data → Render skill cards with progress indicators
- **Success criteria**: All 23+ skills displayed with accurate data and visual progress bars

### Recent Activity Feed (RS3)
- **Functionality**: Display recent achievements, level-ups, and activities
- **Purpose**: Track recent progress and milestones
- **Trigger**: Automatic with stats fetch
- **Progression**: Fetch activities → Parse activity types → Display chronological feed
- **Success criteria**: Activities show with timestamps, descriptions, and appropriate icons

### Player Search
- **Functionality**: Look up any RuneScape player by username
- **Purpose**: Compare stats with friends or lookup other players
- **Trigger**: Username input and search button
- **Progression**: Enter username → Validate input → API calls → Display results
- **Success criteria**: Successful lookup updates all displays with new player data

## Edge Case Handling
- **Private Profiles**: Display helpful message when player stats are private
- **Invalid Usernames**: Show user-friendly error for non-existent players  
- **API Failures**: Graceful degradation with retry options
- **Missing Data**: Handle skills that may not exist in Old School vs RS3
- **Rate Limiting**: Implement request throttling to respect API limits

## Design Direction
The design should evoke the classic medieval fantasy atmosphere of RuneScape while maintaining a modern, clean interface that prioritizes data readability and quick scanning of statistics.

## Color Selection
Custom palette - Drawing inspiration from RuneScape's iconic color scheme
- **Primary Color**: Deep Medieval Blue (oklch(0.3 0.15 240)) - Represents the classic RuneScape interface
- **Secondary Colors**: Warm Gold (oklch(0.7 0.12 85)) for highlights and achievements
- **Accent Color**: Bright Orange (oklch(0.68 0.18 45)) - Attention-grabbing for level milestones and CTAs
- **Foreground/Background Pairings**: 
  - Background (Deep Blue #1a1a2e): White text (#FFFFFF) - Ratio 12.1:1 ✓
  - Card (Darker Blue #16213e): Light text (#f0f0f0) - Ratio 8.2:1 ✓
  - Primary (Medieval Blue): White text (#FFFFFF) - Ratio 7.8:1 ✓
  - Accent (Bright Orange): Dark text (#1a1a1a) - Ratio 5.2:1 ✓

## Font Selection
Typography should balance readability for dense statistical data with the fantasy game aesthetic, using clean sans-serif fonts that won't compete with skill icons and numbers.

- **Typographic Hierarchy**: 
  - H1 (Page Title): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter SemiBold/24px/normal spacing  
  - H3 (Skill Names): Inter Medium/16px/normal spacing
  - Body (Stats/Numbers): Inter Regular/14px/tabular numbers
  - Caption (Timestamps): Inter Regular/12px/muted color

## Animations
Subtle functionality-focused animations that enhance the gaming experience without overwhelming the statistical data presentation.

- **Purposeful Meaning**: Smooth transitions between game modes reinforce the dual-game concept, while skill card hover effects create engagement
- **Hierarchy of Movement**: Priority on game mode switching, then skill interactions, minimal movement on static data

## Component Selection
- **Components**: Cards for skill display, Tabs for game mode switching, Badge for levels, Progress bars for XP, Separator for sections, Avatar for player profile, Alert for errors
- **Customizations**: Custom skill card component with progress indicators, activity feed items with timestamps, game mode toggle with distinctive styling
- **States**: Hover effects on skill cards, loading states for API calls, active states for selected game mode, disabled states for unavailable features
- **Icon Selection**: Custom RuneScape skill icons where possible, Phosphor icons for UI elements (Search, Refresh, Settings)
- **Spacing**: Consistent 4/6/8 unit spacing using Tailwind scale, generous padding around stat blocks
- **Mobile**: Responsive grid that collapses to single column, collapsible sections for mobile, touch-friendly button sizing