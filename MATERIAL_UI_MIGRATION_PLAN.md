# Material-UI v0.20.0 → MUI v5+ Migration Plan

## Overview
This document outlines the systematic migration from legacy Material-UI v0.20.0 (2017) to MUI v5+ (2024).

**Current Status:**
- ✅ React 18.2.0 stable
- ✅ @mui/material v7.3.0 installed  
- ✅ @material-ui/core v4 → @mui/material migration completed (29 components)
- ⚠️  192 legacy material-ui v0.20.0 imports remaining

## Component Migration Priority

### Phase 1: High-Impact Components (21-15 usages)
**Target: Core UI components used extensively**

1. **MenuItem** (21 uses) → `@mui/material/MenuItem`
   - Files: Modals, dropdowns, select components
   - Complexity: LOW - Direct replacement
   - Breaking changes: API mostly compatible

2. **FlatButton** (20 uses) → `@mui/material/Button` variant="text"
   - Files: All dialog actions, form buttons
   - Complexity: MEDIUM - Props renamed
   - Breaking changes: `label` prop → `children`, `primary`/`secondary` → `color`

3. **SelectField** (15 uses) → `@mui/material/Select` + `FormControl`
   - Files: Form inputs, filters
   - Complexity: HIGH - Structure change required
   - Breaking changes: Complete API redesign, requires `FormControl` wrapper

### Phase 2: Dialog & Form Components (14-12 usages)
**Target: Modal and form infrastructure**

4. **Dialog** (14 uses) → `@mui/material/Dialog`
   - Files: All modal components
   - Complexity: MEDIUM - Props structure changed
   - Breaking changes: `actions`, `title` props → separate components

5. **TextField** (13 uses) → `@mui/material/TextField`
   - Files: All form inputs
   - Complexity: LOW - Mostly compatible
   - Breaking changes: Minor prop changes

6. **IconButton** (12 uses) → `@mui/material/IconButton`
   - Files: Action buttons throughout app
   - Complexity: LOW - Direct replacement

### Phase 3: Icons & Actions (12-7 usages)
**Target: Icons and action components**

7. **SVG Icons** (50+ individual icons) → `@mui/icons-material/*`
   - Most common: add (12), remove (8), delete (7), edit (6)
   - Complexity: MEDIUM - Import path changes
   - Breaking changes: Different component names and structure

### Phase 4: Specialized Components (7-1 usages)
**Target: Remaining UI components**

8. **Checkbox, Popover, FloatingActionButton, etc.**
   - Lower usage but still important for functionality
   - Mixed complexity levels

## Migration Strategy

### 1. Component Mapping Table

| Legacy Component | MUI v5 Replacement | Complexity | Notes |
|------------------|-------------------|------------|-------|
| `FlatButton` | `Button variant="text"` | Medium | Props: `label` → `children` |
| `RaisedButton` | `Button variant="contained"` | Medium | Props: `label` → `children` |
| `SelectField` | `FormControl` + `Select` | High | Complete restructure |
| `Dialog` | `Dialog` + sub-components | Medium | Actions/title separate |
| `TextField` | `TextField` | Low | Minor prop changes |
| `MenuItem` | `MenuItem` | Low | Direct replacement |
| `IconButton` | `IconButton` | Low | Direct replacement |
| `Checkbox` | `Checkbox` | Low | Direct replacement |
| `DatePicker` | `@mui/x-date-pickers` | High | Separate package required |
| `AutoComplete` | `Autocomplete` | Medium | API changes |
| `FloatingActionButton` | `Fab` | Medium | Renamed component |
| Icons | `@mui/icons-material` | Medium | Import path changes |

### 2. Migration Phases

#### Phase 1A: Button Components (2-3 days)
- Replace `FlatButton` → `Button variant="text"`
- Replace `RaisedButton` → `Button variant="contained"`
- Update all button props and styling

#### Phase 1B: Form Controls (3-4 days)  
- Replace `TextField` → `TextField` (easier)
- Replace `SelectField` → `FormControl` + `Select` (complex)
- Update form validation and styling

#### Phase 2: Dialog System (2-3 days)
- Replace `Dialog` → `Dialog` with proper sub-components
- Update all modal components
- Test dialog functionality

#### Phase 3: Icons Migration (2-3 days)
- Install required icon components
- Replace all SVG icon imports
- Update icon usage patterns

#### Phase 4: Remaining Components (3-4 days)
- Handle specialized components
- Clean up theme integration
- Final testing and polish

### 3. Migration Guidelines

#### Before Starting Each Component:
1. **Identify all usages** with `grep -r "ComponentName" src/`
2. **Read MUI v5 docs** for the replacement component
3. **Create a test migration** in one file first
4. **Document breaking changes** encountered

#### During Migration:
1. **One component type at a time** - don't mix
2. **Update imports first**, then fix props
3. **Test immediately** after each file
4. **Commit frequently** with descriptive messages

#### Component-Specific Notes:

**FlatButton → Button:**
```jsx
// Before
<FlatButton label="Click me" primary={true} onClick={handleClick} />

// After  
<Button variant="text" color="primary" onClick={handleClick}>
  Click me
</Button>
```

**SelectField → Select:**
```jsx
// Before
<SelectField value={value} onChange={handleChange}>
  <MenuItem value={1} primaryText="Option 1" />
</SelectField>

// After
<FormControl>
  <Select value={value} onChange={handleChange}>
    <MenuItem value={1}>Option 1</MenuItem>
  </Select>
</FormControl>
```

**Icons:**
```jsx
// Before
import MdAdd from 'material-ui/svg-icons/content/add';

// After
import AddIcon from '@mui/icons-material/Add';
```

### 4. Testing Strategy
- **Component-level testing** after each migration
- **Integration testing** after each phase
- **Visual regression testing** for UI consistency
- **Accessibility testing** for any changes

### 5. Risk Mitigation
- **Feature flags** for component rollouts if needed
- **Parallel branches** for large changes
- **Rollback plan** if critical issues arise
- **Staging environment** testing before production

## Estimated Timeline
- **Phase 1A (Buttons):** 2-3 days
- **Phase 1B (Forms):** 3-4 days  
- **Phase 2 (Dialogs):** 2-3 days
- **Phase 3 (Icons):** 2-3 days
- **Phase 4 (Remaining):** 3-4 days
- **Testing & Polish:** 2-3 days

**Total: 14-20 development days**

## Parallel Development Strategy (Git Worktrees)

### Overview
Use git worktrees to enable multiple Claude Code instances to work on different migration phases simultaneously.

### Setup Commands
```bash
# Create worktrees for each migration phase
git worktree add ../ninkasi-migration-buttons migration/phase1-buttons
git worktree add ../ninkasi-migration-forms migration/phase1-forms  
git worktree add ../ninkasi-migration-dialogs migration/phase2-dialogs
git worktree add ../ninkasi-migration-icons migration/phase3-icons
git worktree add ../ninkasi-migration-cleanup migration/phase4-cleanup
```

### Delegation Strategy

#### Claude Instance #1: Button Components (Phase 1A)
**Worktree**: `../ninkasi-migration-buttons`
**Task**: Migrate FlatButton (20×) and RaisedButton (5×) to MUI Button
**Files to modify**: ~15-20 files
**Estimated time**: 2-3 days

#### Claude Instance #2: Form Components (Phase 1B)  
**Worktree**: `../ninkasi-migration-forms`
**Task**: Migrate TextField (13×) and SelectField (15×)
**Files to modify**: ~20-25 files  
**Estimated time**: 3-4 days

#### Claude Instance #3: Dialog System (Phase 2)
**Worktree**: `../ninkasi-migration-dialogs` 
**Task**: Migrate Dialog (14×) components and modal system
**Files to modify**: ~12-15 files
**Estimated time**: 2-3 days

#### Claude Instance #4: Icons Migration (Phase 3)
**Worktree**: `../ninkasi-migration-icons`
**Task**: Migrate all SVG icons (50+) to @mui/icons-material  
**Files to modify**: ~30-40 files
**Estimated time**: 2-3 days

#### Claude Instance #5: Integration & Cleanup (Phase 4)
**Worktree**: `../ninkasi-migration-cleanup`
**Task**: Remaining components, theme cleanup, testing
**Files to modify**: ~10-15 files
**Estimated time**: 3-4 days

### Coordination Protocol

#### Each Claude Instance Should:
1. **Start with branch creation**: `git checkout -b migration/phaseX-componentName`
2. **Follow the specific component guidelines** in this document
3. **Test changes locally**: `npm start` and `npm run build`
4. **Commit frequently** with descriptive messages
5. **Create PR when phase complete** with detailed testing notes

#### Branch Naming Convention:
- `migration/phase1a-buttons` - Button component migration
- `migration/phase1b-forms` - Form component migration  
- `migration/phase2-dialogs` - Dialog system migration
- `migration/phase3-icons` - Icons migration
- `migration/phase4-cleanup` - Final cleanup and integration

#### Merge Strategy:
1. **Sequential merging**: Phase 1A → 1B → 2 → 3 → 4
2. **Integration testing** after each merge
3. **Conflict resolution** by coordination lead
4. **Final validation** before master merge

### Task Coordination Templates

#### For Button Migration Claude Instance:
```
TASK: Migrate FlatButton and RaisedButton components to MUI Button

SCOPE:
- Replace all 20 FlatButton usages → Button variant="text" 
- Replace all 5 RaisedButton usages → Button variant="contained"
- Update props: label → children, primary/secondary → color
- Test all button functionality

DELIVERABLES:
- All button components migrated
- No material-ui button imports remaining  
- Functionality preserved and tested
- PR ready for review
```

#### For Forms Migration Claude Instance:
```
TASK: Migrate TextField and SelectField components to MUI equivalents

SCOPE:  
- Replace all 13 TextField usages (easier migration)
- Replace all 15 SelectField usages → FormControl + Select (complex)
- Update form validation and styling
- Test all form functionality

DELIVERABLES:
- All form components migrated
- Form validation working
- Styling consistent
- PR ready for review
```

### Benefits of This Approach:
- **Parallel development** - 5x faster completion
- **Specialized focus** - Each instance becomes expert in their component type
- **Reduced conflicts** - Clear separation of concerns
- **Independent testing** - Each phase can be validated separately
- **Easier rollback** - Issues isolated to specific branches

## Success Criteria
- ✅ Zero legacy material-ui v0.20.0 imports remaining
- ✅ All functionality preserved
- ✅ UI consistency maintained
- ✅ Performance not degraded
- ✅ Bundle size improvement achieved
- ✅ Ready for React 19 upgrade post-migration