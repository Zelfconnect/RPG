# Application Flow Document: Personal Growth OS

## User Journey Map

### 1. Discovery & Onboarding
```
Landing Page → Sign Up → Current State Assessment → Future Self Snapshot → Character Summary → Dashboard Introduction → Progressive Character Development
```

### 2. Monthly Cycle
```
Daily Tracking → Deep Reflection Sessions (Enhanced on Larger Screens) → AI Transformation → Real-world Execution → End-of-Month Review → Level Up & Rewards
```

### 3. Ongoing Engagement
```
Dashboard Check-ins → Quest Management → Deep Reflection Sessions → Skill Development → Character Evolution
```

## Screen Inventory

1. **Marketing & Entry**
   - Landing Page
   - Sign Up / Login Page
   - Welcome Introduction

2. **Character Creation**
   - Current State Assessment (Essential Tier)
   - Future Self Snapshot (Essential Tier)
   - Deep Reflection Interface (Enhanced on Larger Screens)
   - Character Development Quests (Progressive Tier)
   - Monthly Reflection Deepening (Ongoing Tier)
   - Character Summary

3. **Core Application**
   - Dashboard (Responsive)
   - Quest Journal
   - Skill Tree
   - Character Profile
   - Monthly Review
   - Monthly Planning

4. **Support Screens**
   - Settings
   - Help Center
   - Account Management

## Screen Descriptions

### Landing Page
- **Layout Structure**: Hero section with animation, feature highlights, testimonials, call-to-action
- **Key UI Components**: 
  - Animated hero showing character progression
  - Feature cards with RPG-styled icons
  - Testimonial carousel
  - "Begin Your Journey" prominent CTA button
- **User Interactions**: Click CTA to sign up, scroll for more information
- **State Transitions**: Transitions to sign-up flow

### Sign Up / Login
- **Layout Structure**: Clean, centered card with tabs for sign-up and login
- **Key UI Components**:
  - Email/password fields
  - Social login options
  - Toggle between sign-up and login
- **User Interactions**: Form submission, tab switching
- **State Transitions**: Leads to onboarding for new users or dashboard for returning users

### Deep Reflection Interface
- **Layout Structure**: Clean, distraction-free writing interface that adapts to screen size
- **Key UI Components**:
  - Rich text editor with formatting options (enhanced on larger screens)
  - Guided prompts based on exercise type
  - AI suggestion panel for writing assistance (more prominent on larger screens)
  - Word count and estimated completion time
  - "Transform My Story" button to process writing
- **User Interactions**: Writing, responding to prompts, utilizing AI suggestions
- **State Transitions**: After submission, processes content and updates character profile
- **Responsive Behavior**: 
  - On mobile: Simplified interface with core functionality
  - On larger screens: Enhanced editing tools, side-by-side prompts, AI assistance

### Character Creation: Current State Assessment
- **Layout Structure**: Reflective assessment interface with focused prompts
- **Key UI Components**:
  - Current state description text area
  - Strengths selection fields
  - Challenges identification section
  - Self-rating scales for key attributes (0-10)
  - Activity frequency selection
  - Progress indicator
  - "Continue to Future Vision" button
- **User Interactions**: Text input, rating selection, frequency selection
- **State Transitions**: Leads to Future Self Snapshot after completion
- **Responsive Behavior**:
  - On mobile: Focus on essential inputs
  - On larger screens: Enhanced writing space and guidance

### Character Creation: Future Self Snapshot
- **Layout Structure**: Immersive full-screen with inspirational visuals and focused input areas
- **Key UI Components**:
  - Future self visualization prompt
  - Key habit selection (3 max)
  - Major achievement vision
  - Time estimate indicator (5-7 minutes)
  - Progress indicator
  - "Begin Your Journey" button
  - Screen size adaptation notice (enhanced experience on larger screens)
- **User Interactions**: Text input, habit selection, navigation
- **State Transitions**: Leads to dashboard after completion
- **Responsive Behavior**:
  - On mobile: Focus on essential inputs
  - On larger screens: Enhanced writing space and guidance

### Character Development Quests
- **Layout Structure**: Quest-style interface with narrative framing
- **Key UI Components**:
  - Quest cards for deeper character development
  - XP rewards display
  - Time estimate per quest
  - Quest completion tracking
- **User Interactions**: Quest selection, form completion, quest submission
- **State Transitions**: Return to dashboard with updated character profile

### Monthly Reflection Deepening
- **Layout Structure**: Reflective journal interface tied to monthly review
- **Key UI Components**:
  - Monthly theme visualization
  - Guided reflection prompts
  - Character evolution visualization
  - Timeline of growth
  - Screen size adaptation for enhanced writing experience
- **User Interactions**: Responsive interface adapts to current device for optimal reflection experience
- **State Transitions**: Updates character profile with deeper insights

### Character Summary
- **Layout Structure**: Character sheet style layout with sections for different attributes
- **Key UI Components**:
  - Character avatar/representation
  - Stats visualization
  - Skill affinities
  - Narrative summary of character
  - Development quest progress
- **User Interactions**: Review information, access character development quests
- **State Transitions**: Links to dashboard and character development areas

### Dashboard (Responsive)
- **Layout Structure**: Central hub with card-based layout and sidebar navigation
- **Key UI Components**:
  - Chapter narrative card (current story)
  - Active quests summary
  - Character stats snapshot
  - Level and XP progress bar
  - Quick action buttons
- **User Interactions**: Navigate to different sections, quick actions for common tasks
- **State Transitions**: Central hub that connects to all other screens

### Quest Journal
- **Layout Structure**: Main quest area with filtering sidebar and quest details panel
- **Key UI Components**:
  - Quest cards with progress indicators
  - Quest type filters
  - Detailed view for selected quest
  - Add/Edit quest buttons
- **User Interactions**: View quests, filter by type, mark progress, add new quests
- **State Transitions**: Can lead to quest creation/editing flows

### Skill Tree
- **Layout Structure**: Interactive visualization with detail panel
- **Key UI Components**:
  - Visual skill tree with connected nodes
  - Skill detail panel for selected skills
  - Progress and level indicators
  - Category filters
- **User Interactions**: Navigate through tree, zoom, select skills to view details
- **State Transitions**: Can lead to related quests or learning resources

### Character Profile
- **Layout Structure**: Character sheet with tabs for different aspects
- **Key UI Components**:
  - Character visualization/avatar
  - Stat bars and growth charts
  - Narrative history timeline
  - Achievements and milestones
- **User Interactions**: Tab switching, reviewing progress history
- **State Transitions**: Links to related areas like skill tree or quests

### Monthly Review
- **Layout Structure**: Guided flow with progress screens
- **Key UI Components**:
  - Quest completion checklist
  - Reflection prompt cards
  - XP distribution interface
  - Month summary generator
- **User Interactions**: Mark quest completion, answer reflection prompts, allocate XP
- **State Transitions**: Leads to level up ceremony if applicable, then to monthly planning

### Monthly Planning
- **Layout Structure**: Multi-step process with narrative framing
- **Key UI Components**:
  - Chapter introduction narrative
  - Quest selection interface
  - Focus area selector
  - Calendar integration options
- **User Interactions**: Select quests, determine focus, set reminders
- **State Transitions**: Returns to dashboard with new active quests

## Navigation Pattern

### Primary Navigation
The application uses a combination of sidebar navigation and contextual links:

- **Persistent Sidebar**: Always accessible with links to:
  - Dashboard (home)
  - Character Profile
  - Quest Journal
  - Skill Tree
  - Monthly Planning/Review (contextual)
  - Settings

- **Contextual Breadcrumbs**: Show path and allow backward navigation

- **Process Flows**: Multi-step processes (like monthly review) use a linear progression with clear next/back options

### Secondary Navigation
- **Dashboard Cards**: Link directly to relevant sections
- **Related Content Links**: Connect related elements (e.g., skills to quests)
- **Quick Actions**: Floating action button for common tasks

## Wireframe Descriptions

### Dashboard Wireframe
The dashboard serves as the central hub of the application and follows a card-based layout:

- **Header**: Contains user avatar, level indicator, and quick settings access
- **Chapter Banner**: Prominently displayed card at top with current narrative chapter
- **Stats Summary**: Card displaying core attributes with visual bars
- **Active Quests**: Scrollable horizontal list of current quest cards
- **Recent Activity**: Timeline of latest achievements and updates
- **Quick Actions**: Floating action button for common tasks (add quest, log achievement)
- **Progress Summary**: Visual chart showing growth across key dimensions

Each card uses a slightly inset design with subtle shadows and borders consistent with the RPG theme. Interactive elements have subtle hover effects with a gentle glow. Color coding is used to distinguish different types of quests and skill categories.

### Skill Tree Wireframe
The skill tree provides a visual representation of the user's developing capabilities:

- **Main Visualization**: Central area with interconnected nodes representing skills
- **Branches**: Six main branches extending from center (Mind, Body, Heart, Spirit, Craft, Influence)
- **Nodes**: Skills represented as circular nodes with:
  - Size indicating importance/impact
  - Color indicating category
  - Fill level showing progress/mastery
  - Glow effect for recently improved skills
- **Connections**: Lines between nodes showing prerequisites and relationships
- **Detail Panel**: Right sidebar showing details of selected skill:
  - Current level and progress
  - Description and benefits
  - Related quests
  - Improvement history
- **Controls**: Zoom, pan, and filter controls in bottom right
- **Legend**: Collapsible legend explaining visual elements

The visualization uses a force-directed graph layout with subtle animation as nodes arrange themselves. Nodes are interactive with hover and selection states.

## Interaction Details

### Transitions
- **Page Transitions**: Fade transitions between major screens (300ms)
- **Card Expansions**: Cards expand smoothly when selected for detail view
- **Process Steps**: Slide transitions for multi-step processes, with direction indicating forward/backward movement

### Micro-interactions
- **Button Feedback**: Subtle scaling and glow effects on buttons
- **Form Fields**: Smooth label animations on focus
- **Progress Updates**: Animated filling of progress bars when values change
- **Notifications**: Gentle slide-in for notification messages
- **Quest Completion**: Confetti effect and sound on quest completion

### Level Up Ceremony
A special interaction sequence that occurs when the user gains a level:

1. Notification appears with subtle sound effect
2. Dashboard transitions to full-screen celebration view
3. Character visualization shows progression with particle effects
4. New abilities and stats are revealed sequentially
5. Narrative context is provided for this milestone
6. User confirms to return to dashboard with updated status

### Quest Management
The process of creating and managing quests involves several key interactions:

1. **Quest Creation**:
   - Multi-step modal with narrative context first
   - Interactive difficulty and reward setting
   - Connection to relevant skills
   - Preview of how quest fits into overall journey

2. **Progress Tracking**:
   - Incremental progress updates with visual feedback
   - Milestone celebrations for partial completions
   - Option to add notes or reflection at any point

3. **Quest Completion**:
   - Completion animation and sound
   - XP award visualization
   - Prompt for brief reflection
   - Impact shown on related skills and attributes

### Skill Development Visualization
When a skill advances, the following interaction sequence occurs:

1. Skill node pulses to draw attention
2. Progress bar fills with animated effect
3. If level threshold reached, node expands slightly
4. Connected skills highlight to show relationships
5. Detail panel updates with new capabilities
6. If new skills unlocked, they appear with special effect

These interactions reinforce the sense of growth and progression that is central to the application's experience.