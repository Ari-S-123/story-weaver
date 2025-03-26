# Functional Programming Usage in StoryWeaver

This document demonstrates the application of functional programming principles and patterns in the StoryWeaver codebase, alongside examples of what to avoid.

## Functional Programming Principles

### 1. Pure Functions

Pure functions always produce the same output for the same input and have no side effects.

#### Good Example (from the codebase)

```tsx
/**
 * Get the relative time
 * @param date - The date to display
 * @returns The relative time
 */
const getTimeAgo = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000); // years
  if (interval >= 1) {
    return interval === 1 ? "1 year ago" : `${interval} years ago`;
  }

  interval = Math.floor(seconds / 2592000); // months
  if (interval >= 1) {
    return interval === 1 ? "1 month ago" : `${interval} months ago`;
  }

  interval = Math.floor(seconds / 86400); // days
  if (interval >= 1) {
    return interval === 1 ? "1 day ago" : `${interval} days ago`;
  }

  interval = Math.floor(seconds / 3600); // hours
  if (interval >= 1) {
    return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
  }

  interval = Math.floor(seconds / 60); // minutes
  if (interval >= 1) {
    return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
  }

  return seconds <= 5 ? "just now" : `${seconds} seconds ago`;
};
```

Source: `src/app/story/[storyId]/editor.tsx`

This function is pure because:

- It always returns the same output for the same input date
- It doesn't modify any external state
- It doesn't have any side effects

#### Bad Example (hypothetical)

```tsx
let lastAccessTime = new Date();

const getTimeAgo = (date: Date): string => {
  // Side effect: modifying external state
  lastAccessTime = new Date();

  // Using external global state that could change
  const seconds = Math.floor((lastAccessTime.getTime() - date.getTime()) / 1000);

  // Rest of the function...

  // Side effect: logging
  console.log(`Time calculation performed at ${lastAccessTime}`);

  return seconds <= 5 ? "just now" : `${seconds} seconds ago`;
};
```

This version breaks purity because:

- It modifies external state (`lastAccessTime`)
- It uses an external variable that could change (`lastAccessTime`)
- It has side effects (console logging)

### 2. Immutability

Immutability means never modifying data once it's created, but instead creating new data structures with the changes.

#### Good Example (from the codebase)

```tsx
// Add like counts to stories
const storiesWithLikes = stories.map((story) => ({
  ...story,
  likeCount: likeCountMap.get(story.id) || 0
}));
```

Source: `src/app/api/feed/route.ts`

This example demonstrates immutability by:

- Creating a new array with `map()` instead of modifying the original
- Using the spread operator (`...story`) to create a new object for each story
- Adding the new property to the copied object rather than modifying the original

#### Bad Example (hypothetical)

```tsx
// Modifying the original array (mutable approach)
for (let i = 0; i < stories.length; i++) {
  // Directly mutating each object in the array
  stories[i].likeCount = likeCountMap.get(stories[i].id) || 0;
}
```

This approach breaks immutability because:

- It directly modifies the original `stories` array
- It mutates each story object in-place instead of creating new objects

### 3. First-Class Functions

In functional programming, functions are first-class citizens, meaning they can be assigned to variables, passed as arguments, and returned from other functions.

#### Good Example (from the codebase)

```tsx
import { create } from "zustand";
import { type Editor } from "@tiptap/react";

type EditorState = {
  editor: Editor | undefined;
  setEditor: (editor: Editor | undefined) => void;
};

const useEditorStore = create<EditorState>((set) => ({
  editor: undefined,
  setEditor: (editor) => set({ editor })
}));

export default useEditorStore;
```

Source: `src/store/use-editor-store.ts`

This example demonstrates first-class functions by:

- Passing a function as an argument to `create`
- Defining `setEditor` as a function value within an object
- Using a lambda function to define the implementation of `setEditor`

#### Bad Example (hypothetical)

```tsx
// Global state managed with variables and methods
let editorInstance = undefined;

function setEditorGlobal(editor) {
  editorInstance = editor;
}

function getEditorGlobal() {
  return editorInstance;
}

// Using global functions and state instead of a cohesive store with first-class functions
```

This breaks the first-class functions principle because:

- It uses global state and functions instead of treating functions as values
- It doesn't leverage functions as arguments or return values
- It doesn't encapsulate behavior in a functional way

### 4. Higher-Order Functions

Higher-order functions are functions that take other functions as arguments and/or return functions.

#### Good Example (from the codebase)

```tsx
const useSearchParam = (key: string) => {
  return useQueryState(key, parseAsString.withDefault("").withOptions({ clearOnDefault: true }));
};
```

Source: `src/hooks/use-search-param.ts`

This example demonstrates higher-order functions by:

- Defining a custom hook that returns the result of another function
- Using function composition with `withDefault` and `withOptions` to customize behavior
- Creating a function that encapsulates and extends other functions

#### Bad Example (hypothetical)

```tsx
// Not using higher-order functions
function getSearchParam(key) {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(key) || "";
  return value;
}

function setSearchParam(key, value) {
  const url = new URL(window.location.href);
  if (value === "") {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
  window.history.pushState({}, "", url);
}
```

This breaks the higher-order function principle because:

- It uses separate functions instead of a function that returns state and a setter
- It doesn't compose or customize behavior through function composition
- It uses imperative code instead of abstracting behavior in a functional way

### 5. Declarative Over Imperative

Declarative programming focuses on what should be accomplished rather than how it should be accomplished.

#### Good Example (from the codebase)

```tsx
<div className="flex items-center gap-x-0.5">
  {sections[0].map((item) => (
    <ToolbarButton key={item.label} {...item} />
  ))}
</div>
```

Source: `src/components/toolbar.tsx`

This example demonstrates declarative programming by:

- Describing what UI elements should appear based on data
- Using `map` to declaratively transform data into components
- Focusing on the "what" (rendering buttons for each item) rather than the "how" (looping mechanics)

#### Bad Example (hypothetical)

```tsx
// Imperative approach
const buttonContainer = document.createElement("div");
buttonContainer.className = "flex items-center gap-x-0.5";

for (let i = 0; i < sections[0].length; i++) {
  const item = sections[0][i];
  const button = document.createElement("button");
  button.className = "toolbar-button";
  button.textContent = item.label;
  button.onclick = item.onClick;

  // Add icon
  const icon = document.createElement("span");
  icon.className = "icon";
  // Set icon properties...
  button.appendChild(icon);

  buttonContainer.appendChild(button);
}

container.appendChild(buttonContainer);
```

This breaks the declarative programming principle because:

- It focuses on step-by-step instructions (how) instead of describing the result (what)
- It manually manipulates the DOM instead of declaring desired structure
- It uses imperative loops and conditionals instead of functional transformations

## Array Functional Programming Methods

### Example 1: Map for Data Transformation

#### Good Example (from the codebase)

```tsx
// Get likes count for each story
const storyIds = stories.map((story) => story.id);

// Add like counts to stories
const storiesWithLikes = stories.map((story) => ({
  ...story,
  likeCount: likeCountMap.get(story.id) || 0
}));
```

Source: `src/app/api/feed/route.ts`

This example uses `map` to:

- Extract IDs from story objects in a functional way
- Transform each story object by adding a likeCount property
- Create new objects instead of mutating existing ones

#### Bad Example (hypothetical)

```tsx
// Imperative approach using loops
const storyIds = [];
for (let i = 0; i < stories.length; i++) {
  storyIds.push(stories[i].id);
}

// Adding properties by mutation
for (let i = 0; i < stories.length; i++) {
  stories[i].likeCount = likeCountMap.get(stories[i].id) || 0;
}
```

### Example 2: Filter for Data Selection

#### Good Example (from the codebase)

```tsx
// Filter users by name
filteredUsers = users.filter((user) => user.name.toLowerCase().includes(text.toLowerCase()));
```

Source: `src/app/story/[storyId]/room.tsx`

This example uses `filter` to:

- Declaratively select users whose names include the search text
- Create a new array without modifying the original
- Express the filtering logic concisely

#### Bad Example (hypothetical)

```tsx
// Imperative filtering with loops
const filteredUsers = [];
for (let i = 0; i < users.length; i++) {
  if (users[i].name.toLowerCase().includes(text.toLowerCase())) {
    filteredUsers.push(users[i]);
  }
}
```

### Example 3: Sort for Ordering Data

#### Good Example (from the codebase)

```tsx
// Sort stories by like count in descending order
storiesWithLikes.sort((a, b) => b.likeCount - a.likeCount);
```

Source: `src/app/api/feed/route.ts`

This example uses a comparison function with `sort` to:

- Declaratively define the sorting criteria
- Sort complex objects based on a specific property
- Express the sorting logic concisely

#### Bad Example (hypothetical)

```tsx
// Imperative sorting with a loop
for (let i = 0; i < storiesWithLikes.length; i++) {
  for (let j = i + 1; j < storiesWithLikes.length; j++) {
    if (storiesWithLikes[i].likeCount < storiesWithLikes[j].likeCount) {
      // Swap elements
      const temp = storiesWithLikes[i];
      storiesWithLikes[i] = storiesWithLikes[j];
      storiesWithLikes[j] = temp;
    }
  }
}
```

## Design Patterns

### Example 1: Factory Pattern with Higher-Order Component

#### Good Example (from the codebase)

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
```

Source: `src/components/ui/button.tsx`

This demonstrates the Factory Pattern by:

- Creating a configurable button component that can produce different variants of buttons
- Using a function (`buttonVariants`) to generate the appropriate classes based on configuration
- Providing a factory function (`Button`) that creates specific button instances with the correct properties

#### Bad Example (hypothetical)

```tsx
function PrimaryButton(props) {
  return (
    <button className="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2" {...props} />
  );
}

function SecondaryButton(props) {
  return (
    <button
      className="bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 h-9 px-4 py-2"
      {...props}
    />
  );
}

function DestructiveButton(props) {
  return <button className="bg-destructive text-white shadow-xs hover:bg-destructive/90 h-9 px-4 py-2" {...props} />;
}

// Multiple different button components with duplicated code
```

### Example 2: Observer Pattern with Store

#### Good Example (from the codebase)

```tsx
import { create } from "zustand";
import { type Editor } from "@tiptap/react";

type EditorState = {
  editor: Editor | undefined;
  setEditor: (editor: Editor | undefined) => void;
};

const useEditorStore = create<EditorState>((set) => ({
  editor: undefined,
  setEditor: (editor) => set({ editor })
}));

export default useEditorStore;
```

Source: `src/store/use-editor-store.ts`

This demonstrates the Observer Pattern by:

- Creating a central store that components can subscribe to
- Providing a way to update state that automatically notifies subscribers
- Using a functional approach to state management

#### Bad Example (hypothetical)

```tsx
// Global variable for state
let editor = undefined;
const subscribers = [];

// Manual subscription management
function subscribeToEditor(callback) {
  subscribers.push(callback);
  return () => {
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  };
}

// Manual notification
function setEditor(newEditor) {
  editor = newEditor;
  subscribers.forEach((callback) => callback(editor));
}

// Manual consumption in components
function MyComponent() {
  const [localEditor, setLocalEditor] = useState(editor);

  useEffect(() => {
    const unsubscribe = subscribeToEditor(setLocalEditor);
    return unsubscribe;
  }, []);

  // Component logic...
}
```

### Example 3: Adapter Pattern with Utility Function

#### Good Example (from the codebase)

```tsx
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Source: `src/lib/utils.ts`

This demonstrates the Adapter Pattern by:

- Creating a function that adapts multiple libraries (clsx and tailwind-merge) into a unified interface
- Simplifying the usage by hiding complex implementation details
- Providing a functional interface for class name generation

#### Bad Example (hypothetical)

```tsx
// Directly using multiple libraries with different APIs
function getClassName(base, conditionals, additionalClasses) {
  // Manually handling class combinations
  let result = base;

  // Handle conditional classes
  for (const [condition, classes] of Object.entries(conditionals)) {
    if (condition) {
      result += " " + classes;
    }
  }

  // Add additional classes
  if (additionalClasses) {
    result += " " + additionalClasses;
  }

  // Handle Tailwind conflicts manually
  // ... complex logic to merge and deduplicate classes

  return result;
}
```

## Conclusion

The StoryWeaver codebase demonstrates effective use of functional programming principles and design patterns. By following these patterns and avoiding the bad examples, the code remains cleaner, more maintainable, and less prone to bugs.
