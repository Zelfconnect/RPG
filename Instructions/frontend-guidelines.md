# Frontend Development Guidelines: Personal Growth OS

## Component Structure

### Component Hierarchy Approach

We'll organize our components in a hierarchy that promotes reusability and maintainability:

1. **Atom Components** - Smallest UI elements
   - Buttons, inputs, icons, text displays
   - Highly reusable across the entire application
   - No business logic, only presentation and basic interaction

2. **Molecule Components** - Combinations of atoms
   - Form groups, card templates, stat displays
   - Reusable within multiple features
   - Minimal business logic

3. **Organism Components** - Functional sections
   - Quest cards, skill tree nodes, character stat panels
   - Feature-specific but potentially reusable
   - Contains feature-specific logic

4. **Template Components** - Page layouts
   - Dashboard layout, character sheet layout
   - Define structure for pages
   - Handle responsive behavior

5. **Page Components** - Complete screens
   - Dashboard, Quest Journal, Skill Tree
   - Combine organisms and templates
   - Handle data fetching and state management

### Component Naming Conventions

Use clear, consistent naming that reflects the component's purpose:

- **Prefix by type**: Button, Card, Form, etc.
- **Clear purpose**: QuestCard, SkillTreeNode, StatDisplay
- **Consistent casing**: PascalCase for component names

Example naming structure:
```
Button.jsx           // Atom
FormInput.jsx        // Atom
QuestCard.jsx        // Organism
SkillTreeNode.jsx    // Organism
DashboardPage.jsx    // Page
```

### Reusable Component Principles

1. **Single Responsibility**: Each component should do one thing well
2. **Configurable**: Use props to make components adaptable
3. **Self-contained**: Minimize dependencies on external state
4. **Documented**: Include comments explaining usage
5. **Testable**: Design with testing in mind

## Styling Methodology

### CSS Approach: Tailwind CSS

We'll use Tailwind CSS as our primary styling approach because it's beginner-friendly while allowing for sophisticated designs:

```jsx
// Example of a styled button using Tailwind
function PrimaryButton({ children, onClick }) {
  return (
    <button 
      className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 
                 transition-colors duration-200 focus:outline-none focus:ring-2 
                 focus:ring-purple-500 focus:ring-opacity-50"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### Theme Management

We'll implement a simple theme system using Tailwind's configuration:

1. **Custom Colors**: Define our color palette in tailwind.config.js
   ```js
   // tailwind.config.js
   module.exports = {
     theme: {
       extend: {
         colors: {
           primary: {
             DEFAULT: '#5E35B1', // Deep purple
             light: '#7E57C2',
             dark: '#4527A0'
           },
           secondary: {
             DEFAULT: '#2E7D32', // Emerald green
             light: '#43A047',
             dark: '#1B5E20'
           },
           accent: {
             DEFAULT: '#FFB300', // Gold
             light: '#FFCA28',
             dark: '#FF8F00'
           },
           // Add more custom colors as needed
         }
       }
     }
   }
   ```

2. **Theme Toggling**: Implement light/dark theme with Tailwind's dark mode
   ```jsx
   // Application wrapper with theme support
   function App() {
     const [darkMode, setDarkMode] = useState(false);
     
     return (
       <div className={`${darkMode ? 'dark' : ''}`}>
         <div className="min-h-screen bg-gray-100 dark:bg-gray-900 
                       text-gray-900 dark:text-gray-100">
           {/* App content */}
         </div>
       </div>
     );
   }
   ```

### Responsive Design Principles

1. **Mobile-First Approach**: Design for mobile first, then enhance for larger screens
   ```jsx
   <div className="p-2 md:p-4 lg:p-6">
     {/* Content that has different padding at different breakpoints */}
   </div>
   ```

2. **Flexible Layouts**: Use Flexbox and Grid for responsive layouts
   ```jsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     {/* Cards that arrange differently based on screen size */}
   </div>
   ```

3. **Responsive Typography**: Scale text appropriately
   ```jsx
   <h1 className="text-xl md:text-2xl lg:text-3xl">Page Title</h1>
   ```

4. **Component Adaptation**: Allow components to adapt to different contexts
   ```jsx
   <StatDisplay compact={useMediaQuery('(max-width: 640px)')} />
   ```

## State Management

### State Organization

We'll use a combination of React's built-in state management tools:

1. **Local Component State**: For UI-specific state
   ```jsx
   function QuestCard({ quest }) {
     const [expanded, setExpanded] = useState(false);
     // Component-specific UI state
   }
   ```

2. **Context API**: For shared state across components
   ```jsx
   // CharacterContext.js
   const CharacterContext = createContext();
   
   export function CharacterProvider({ children }) {
     const [character, setCharacter] = useState(null);
     // Character data and update functions
     
     return (
       <CharacterContext.Provider value={{ character, setCharacter }}>
         {children}
       </CharacterContext.Provider>
     );
   }
   ```

3. **useReducer**: For complex state logic
   ```jsx
   function questReducer(state, action) {
     switch (action.type) {
       case 'ADD_QUEST':
         return [...state, action.payload];
       case 'UPDATE_PROGRESS':
         return state.map(quest => 
           quest.id === action.payload.id 
             ? { ...quest, progress: action.payload.progress }
             : quest
         );
       // Other cases
     }
   }
   
   function QuestJournal() {
     const [quests, dispatch] = useReducer(questReducer, []);
     // Use dispatch to update quests
   }
   ```

### Data Fetching Patterns

We'll use a custom hook pattern for Firebase interactions:

```jsx
// hooks/useFirestore.js
function useFirestore(collection) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = db.collection(collection)
      .onSnapshot(
        snapshot => {
          const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setDocuments(docs);
          setLoading(false);
        },
        err => {
          setError(err);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [collection]);

  return { documents, loading, error };
}

// Usage in component
function QuestList() {
  const { documents: quests, loading, error } = useFirestore('quests');
  
  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;
  
  return (
    <div>
      {quests.map(quest => (
        <QuestCard key={quest.id} quest={quest} />
      ))}
    </div>
  );
}
```

### Form Handling

We'll use a simple approach to form handling:

```jsx
function QuestForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 1,
    type: 'main'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input 
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      {/* Other form fields */}
      <Button type="submit">Create Quest</Button>
    </form>
  );
}
```

## Code Standards

### File/Folder Organization

We'll organize our project files with a feature-based structure:

```
src/
├── assets/            # Images, fonts, etc.
├── components/        # Shared components
│   ├── atoms/         # Basic UI components
│   ├── molecules/     # Composite components
│   └── organisms/     # Feature-specific components
├── context/           # React Context providers
├── features/          # Feature modules
│   ├── authentication/
│   ├── character/
│   ├── quests/
│   ├── skills/
│   └── monthly-cycle/
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # Firebase and other services
├── styles/            # Global styles, tailwind config
└── utils/             # Utility functions
```

### Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
- **Functions**: camelCase with descriptive names
- **Variables**: camelCase with meaningful names
- **Constants**: UPPER_SNAKE_CASE for true constants

### Documentation Requirements

1. **Component Documentation**: Include a brief comment at the top of each component
   ```jsx
   /**
    * QuestCard - Displays a quest with progress and actions
    * 
    * @param {Object} quest - Quest data object
    * @param {Function} onUpdate - Callback when progress is updated
    * @param {boolean} compact - Whether to show compact view
    */
   function QuestCard({ quest, onUpdate, compact = false }) {
     // Component implementation
   }
   ```

2. **Function Documentation**: Document non-trivial functions
   ```jsx
   /**
    * Calculates XP required for the next level based on current level
    * Uses a progressive scale with diminishing returns
    * 
    * @param {number} currentLevel - The character's current level
    * @return {number} XP required for next level
    */
   function calculateNextLevelXP(currentLevel) {
     return Math.floor(100 * Math.pow(1.5, currentLevel - 1));
   }
   ```

3. **Code Comments**: Include comments for complex logic
   ```jsx
   // Apply diminishing returns to stat increases beyond level 10
   const statIncrease = baseIncrease * (level > 10 ? 0.9 : 1);
   ```

## Performance Optimization

### Loading Strategies

1. **Lazy Loading**: Use React.lazy for code splitting
   ```jsx
   const SkillTree = React.lazy(() => import('./features/skills/SkillTreePage'));
   
   function App() {
     return (
       <Routes>
         <Route 
           path="/skills" 
           element={
             <Suspense fallback={<Loading />}>
               <SkillTree />
             </Suspense>
           } 
         />
       </Routes>
     );
   }
   ```

2. **Progressive Loading**: Show placeholders while content loads
   ```jsx
   function QuestList() {
     const { documents: quests, loading } = useFirestore('quests');
     
     return (
       <div>
         {loading ? (
           // Show skeleton loaders
           Array(3).fill().map((_, i) => <QuestCardSkeleton key={i} />)
         ) : (
           // Show actual content
           quests.map(quest => <QuestCard key={quest.id} quest={quest} />)
         )}
       </div>
     );
   }
   ```

### Rendering Optimization

1. **List Optimization**: Use keys and virtualization for long lists
   ```jsx
   import { FixedSizeList } from 'react-window';
   
   function QuestHistory({ quests }) {
     return (
       <FixedSizeList
         height={400}
         width="100%"
         itemCount={quests.length}
         itemSize={80}
       >
         {({ index, style }) => (
           <div style={style}>
             <QuestHistoryItem quest={quests[index]} />
           </div>
         )}
       </FixedSizeList>
     );
   }
   ```

2. **Memoization**: Use React.memo, useMemo, and useCallback
   ```jsx
   const MemoizedQuestCard = React.memo(QuestCard);
   
   function QuestList({ quests }) {
     const sortedQuests = useMemo(() => {
       return [...quests].sort((a, b) => b.priority - a.priority);
     }, [quests]);
     
     const handleUpdate = useCallback((id, progress) => {
       // Update quest progress
     }, []);
     
     return sortedQuests.map(quest => (
       <MemoizedQuestCard 
         key={quest.id} 
         quest={quest} 
         onUpdate={handleUpdate} 
       />
     ));
   }
   ```

### Asset Management

1. **Image Optimization**: Use appropriate formats and sizes
   ```jsx
   function Avatar({ user, size = 'md' }) {
     const sizeMap = {
       sm: 32,
       md: 48,
       lg: 64
     };
     
     return (
       <img 
         src={user.avatarUrl} 
         width={sizeMap[size]} 
         height={sizeMap[size]}
         alt={`${user.name}'s avatar`}
         loading="lazy"
       />
     );
   }
   ```

2. **Font Loading**: Use font-display for text rendering
   ```css
   /* In your CSS */
   @font-face {
     font-family: 'Cinzel';
     src: url('/fonts/Cinzel-Regular.woff2') format('woff2');
     font-weight: normal;
     font-style: normal;
     font-display: swap;
   }
   ```

## Accessibility Requirements

### WCAG Compliance Level

We'll aim for WCAG 2.1 AA compliance, focusing on:

1. **Perceivable**: Information must be presentable to users in ways they can perceive
2. **Operable**: User interface components must be operable
3. **Understandable**: Information and operation must be understandable
4. **Robust**: Content must be robust enough to be interpreted by various user agents

### Specific Focus Areas

1. **Keyboard Navigation**: Ensure all interactive elements are accessible via keyboard
   ```jsx
   function ActionButton({ label, onClick }) {
     return (
       <button 
         onClick={onClick}
         className="focus:outline-none focus:ring-2 focus:ring-purple-500"
         aria-label={label}
       >
         {label}
       </button>
     );
   }
   ```

2. **Screen Reader Support**: Use semantic HTML and ARIA attributes
   ```jsx
   function ProgressBar({ value, max, label }) {
     const percentage = (value / max) * 100;
     
     return (
       <div 
         role="progressbar" 
         aria-valuenow={value}
         aria-valuemin="0"
         aria-valuemax={max}
         aria-label={label}
       >
         <div 
           className="bg-primary h-2 rounded-full" 
           style={{ width: `${percentage}%` }}
         />
       </div>
     );
   }
   ```

3. **Color Contrast**: Ensure sufficient contrast for text and UI elements
   ```jsx
   // Use Tailwind's text-gray-900 on bg-white for good contrast
   <div className="bg-white text-gray-900">Content with good contrast</div>
   ```

4. **Focus Indicators**: Make focus states clearly visible
   ```jsx
   <button className="focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
     Click Me
   </button>
   ```

5. **Responsive Text**: Ensure text remains readable at different zoom levels
   ```jsx
   <p className="text-base max-w-prose">
     Content that remains readable when zoomed
   </p>
   ```

## Component Examples

### Button Component (Atom)

```jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button - Reusable button component with different variants
 */
function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '',
  type = 'button'
}) {
  // Map of variant styles
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark',
    accent: 'bg-accent text-gray-900 hover:bg-accent-dark',
    outline: 'bg-transparent border border-primary text-primary hover:bg-primary-light hover:bg-opacity-10'
  };
  
  // Map of size styles
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  const baseStyles = 'rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export default Button;
```

### QuestCard Component (Organism)

```jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../atoms/Button';
import ProgressBar from '../atoms/ProgressBar';
import { formatDate } from '../../utils/dateUtils';

/**
 * QuestCard - Displays quest information with progress tracking
 */
function QuestCard({ quest, onUpdate, onComplete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(quest.progress || 0);
  
  const handleProgressChange = (newProgress) => {
    setProgress(newProgress);
    onUpdate(quest.id, newProgress);
  };
  
  const handleComplete = () => {
    onComplete(quest.id);
  };
  
  const difficultyBadge = () => {
    const colors = {
      1: 'bg-green-100 text-green-800',
      2: 'bg-blue-100 text-blue-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-orange-100 text-orange-800',
      5: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`text-xs px-2 py-1 rounded ${colors[quest.difficulty]}`}>
        {['Easy', 'Normal', 'Challenging', 'Hard', 'Epic'][quest.difficulty - 1]}
      </span>
    );
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div 
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="font-semibold text-lg">{quest.title}</h3>
          <div className="flex space-x-2 mt-1">
            <span className="text-xs bg-primary bg-opacity-20 text-primary px-2 py-1 rounded">
              {quest.type}
            </span>
            {difficultyBadge()}
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Due: {formatDate(quest.endDate)}
        </div>
      </div>
      
      <div className="px-4 pb-2">
        <ProgressBar 
          value={progress} 
          max={100} 
          label={`${quest.title} progress`} 
        />
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {quest.description}
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Update Progress:
            </label>
            <input 
              type="range" 
              min="0" 
              max="100"
              value={progress}
              onChange={(e) => handleProgressChange(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-right text-sm">{progress}%</div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              className="mr-2"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
            >
              Close
            </Button>
            
            <Button 
              variant="primary" 
              size="sm"
              disabled={progress < 100}
              onClick={(e) => {
                e.stopPropagation();
                handleComplete();
              }}
            >
              Complete Quest
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

QuestCard.propTypes = {
  quest: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    difficulty: PropTypes.number.isRequired,
    progress: PropTypes.number,
    endDate: PropTypes.instanceOf(Date)
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired
};

export default QuestCard;
```