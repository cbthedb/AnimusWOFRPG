# Overview

This is a text-based role-playing game inspired by the Wings of Fire book series, where players control an animus dragon (a dragon with magical powers) attending Jade Mountain Academy. The core gameplay revolves around making choices that affect the character's soul integrity - using animus magic corrupts the dragon's soul, creating a compelling risk-reward mechanic. Players must balance using their powerful magical abilities with preserving their humanity and moral compass.

The application is built as a full-stack web game with a React frontend and Express backend, featuring character generation, scenario-based storytelling, and persistent game state management.

# User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes
- **Character Customization System** (January 2025): Added comprehensive character creator allowing players to choose tribe, powers, attributes, and animus status, plus randomization options.
- **Local Storage Migration** (January 2025): Completely converted from PostgreSQL database to local browser storage. Game now runs without any database dependencies or Replit Core requirements.
- **Enhanced Romance & Family System** (January 2025): Added comprehensive romance mechanics, mating system, dragonet inheritance, and multi-generational family tracking.
- **Expanded Achievement System** (January 2025): Added 25+ achievements across categories including magic, relationships, survival, and family legacy.
- **Multiple Game Endings** (January 2025): Implemented 12+ different endings based on player choices, including victory, tragic, neutral, and legendary outcomes.
- **Enhanced Magic Variety** (January 2025): Expanded animus spell system with 6+ spell types including enchantment, combat, healing, weather control, curses, and summoning.
- **Hybrid Dragon Support** (January 2025): Enhanced hybrid dragon generation with mixed tribal abilities and inheritance mechanics.
- **Comprehensive Animus Filtering System** (January 2025): Fixed persistent issue where animus magic prompts appeared for non-animus dragons. Implemented thorough filtering across all AI generation systems.
- **Enhanced Storyline Progression** (January 2025): Fixed custom actions, tribal powers, and special abilities to actually advance the story rather than just showing static results. Powers now generate new scenarios based on their effects.
- **Contextual Tribal Powers** (January 2025): Made tribal powers more relevant to current situations and properly integrated with the storyline progression system.
- **Location-Based Migration System** (January 2025): Added comprehensive travel system with 15+ locations across Pyrrhia and Pantala continents, featuring location-specific scenarios, tribal relationships, migration animations, and Wings of Fire lore integration.
- **Special Events System** (January 2025): Implemented rare, time-gated special events including animus artifact discoveries, mindreading scenarios, and prophecy events. These complement existing gameplay with 5-minute cooldowns and dragon-type requirements.
- **Animus Artifact System** (January 2025): Added 5 unique collectible animus artifacts with complex moral choices, soul corruption mechanics, and location-based discovery system. Maximum 3 artifacts per playthrough.
- **Enhanced Outcome Display** (January 2025): Integrated continue button system that displays story outcomes before proceeding to next scenario, improving narrative flow and player engagement.
- **Comprehensive Custom Action System** (January 2025): Enhanced custom action responses to work with ALL scenario types, providing contextual, immersive responses that integrate with Wings of Fire lore and character abilities.
- **Improved Aging and Event Timing** (January 2025): Changed aging to 1 year per turn and special event timing to every 10 turns with higher success rates (15% for artifacts, 12% for special powers).
- **Fixed Special Events System** (January 2025): Corrected special event triggering to ensure events occur every 10 turns as intended. Updated max artifacts per game to 3 for better game balance. Added persistent event state tracking and comprehensive debug logging.
- **Enhanced Artifact Discovery System** (January 2025): Made animus artifacts discoverable at any location with guaranteed discovery on every 10th turn. Fixed location filtering issues that prevented artifact discovery.
- **Expanded Scenario Database** (January 2025): Added 200+ new scenarios from attached file including friendship offers, battle tactics, feast invitations, Darkstalker encounters, and immortality requests. Integrated scenarios properly with character ability requirements.
- **Location-Based Special Events** (January 2025): Added rare location-specific scenarios like NightWing-RainWing village architecture disputes and Ice Kingdom diplomatic crises. Limited to 3 special events every 10 minutes for rarity.
- **Rarer Artifact System** (January 2025): Reduced artifact discovery chance from 15% to 5% per turn to make artifacts more precious and meaningful. Artifacts now distribute across all game locations with at least one per location.
- **Year and Season Progression System** (January 2025): Removed "Day X" display and implemented proper time progression where years advance by 0.5 per turn and seasons change every turn (Spring→Summer→Fall→Winter). Time display now shows current season and character's total age.
- **Enhanced Social Relationship System** (January 2025): Implemented comprehensive social interaction mechanics with 12+ social event types, dynamic relationship tracking (friends/rivals/enemies), and multi-tribal social groups. Dragons can now form meaningful friendships, rivalries, and alliances that affect gameplay.
- **Advanced Dragonet & Family System** (January 2025): Added complete dragonet lifecycle management with 7 developmental stages (birth to independence), inherited traits system, hybrid offspring mechanics, and multi-generational family tracking. Dragonets develop unique personalities and abilities over time.
- **Comprehensive Animus Artifact Distribution** (January 2025): Created 25+ unique animus artifacts distributed across ALL game locations including the newly added Scorpion Den. Each artifact features moral dilemmas, soul corruption risks, and location-specific discovery requirements with enhanced rarity balancing.
- **Enhanced Scenario Diversity System** (January 2025): Developed 13+ scenario template categories (Social, Academic, Adventure, Mystery, Cultural, Nature, Political, Personal Growth, Romance, Family, Achievement, Crisis, Discovery) with anti-repetition tracking and contextual variable generation to eliminate repetitive scenarios.
- **Integrated Enhanced Game Systems** (January 2025): Seamlessly integrated all new social, family, and artifact systems into the existing game engine with proper consequence processing, relationship management, and story progression. Enhanced scenarios now contribute meaningfully to character development and world building.
- **Fixed Random Animus Object Spawning** (January 2025): Disabled automatic artifact discovery in the special events system. Animus objects now only appear in specific discovery scenarios where players actively choose to search or investigate, eliminating unwanted random spawning.
- **Enhanced Soundtrack System** (January 2025): Fixed audio overlapping issues by implementing audio lock mechanisms, proper track cleanup, and debounced transitions. Improved soul threshold music switching and AI control track handling for smoother audio experience.
- **FIXED: Complete Animus Artifact System Overhaul** (December 2024): Resolved all critical issues preventing artifact discovery:
  - Fixed invalid location mappings (Deep Ocean → Sea Kingdom, Ancient Ruins → Old Night Kingdom, etc.)  
  - Corrected maximum artifact limit from 10 to proper 3 per playthrough limit
  - Resolved TypeScript LSP errors in enhanced game engine
  - Added 25+ unique artifacts distributed across ALL game locations with proper coverage
  - **FINAL FIX**: Fixed artifact scenario display bug where scenarios were generated but not shown to players
  - Fixed special event choice processing to properly handle artifact collection into inventory
  - Implemented special events system reset for new games to ensure fresh artifact discovery
  - Restored original discovery rates (5% chance, 2 turn cooldown, every 10th turn)

# System Architecture

## Frontend Architecture
The client is built with **React 18** using **TypeScript** and **Vite** as the build tool. The UI leverages **shadcn/ui** components built on **Radix UI** primitives, styled with **TailwindCSS** for a modern, accessible interface. State management is handled through **TanStack Query** for server state and React hooks for local state.

The routing system uses **Wouter** for lightweight client-side navigation. The application follows a component-based architecture with clear separation between game logic (housed in utility classes) and presentation components.

## Backend Architecture  
The server runs on **Express.js** with TypeScript, following a simple REST API pattern. The architecture includes:

- **Route handlers** in `/server/routes.ts` for game state CRUD operations
- **Storage abstraction layer** with an in-memory implementation (`MemStorage`) for development
- **Middleware** for request logging and error handling
- **Schema validation** using Zod for type-safe data handling

The backend is designed to be database-agnostic through the `IStorage` interface, making it easy to swap storage implementations.

## Game Engine Design
The core game logic is centralized in a `GameEngine` class that processes player choices and updates game state. Key design decisions include:

- **Immutable state updates** - all game state changes return new objects
- **Scenario-based progression** - the game generates contextual scenarios based on character state and history
- **Soul corruption system** - the central mechanic where magic use gradually corrupts the character
- **Deterministic randomness** - random elements are controlled to ensure fair gameplay

## Data Storage Solutions
Now uses **local browser storage (localStorage)** for all game data persistence, eliminating database dependencies entirely. The storage system includes:

- **LocalGameStorage** class handling all data persistence in browser localStorage
- **Game states** stored as structured JSON including character data, relationships, dragonets, and life events
- **Save/Load system** with multiple game slot support and save game management
- **Import/Export functionality** allowing players to backup and share their game data
- **Type-safe schemas** maintained for data consistency using Zod validation

## Development Environment
The project is configured for **Replit** deployment with:
- **Hot module replacement** in development
- **ESBuild** for production bundling  
- **Integrated development tools** including error overlays and debugging support
- **Path aliases** for clean imports (`@/` for client, `@shared/` for shared code)

# External Dependencies

## Database Integration
- **Drizzle ORM** with PostgreSQL dialect for database operations
- **@neondatabase/serverless** for cloud database connectivity
- **connect-pg-simple** for session management (prepared for future authentication)

## UI and Styling
- **Radix UI** component library for accessible, unstyled primitives
- **TailwindCSS** for utility-first styling with custom design system
- **Lucide React** for consistent iconography
- **class-variance-authority** for component variant management

## State Management and Data Fetching
- **TanStack React Query** for server state management, caching, and synchronization
- **React Hook Form** with **Hookform Resolvers** for form validation
- **Zod** for runtime type validation and schema generation

## Development and Build Tools
- **Vite** for fast development server and optimized production builds
- **TypeScript** for type safety across the entire application
- **ESBuild** for fast JavaScript bundling in production
- **Replit-specific plugins** for enhanced development experience on the platform

## Utility Libraries
- **date-fns** for date manipulation and formatting
- **clsx** and **tailwind-merge** for conditional CSS class handling
- **nanoid** for generating unique identifiers
- **cmdk** for command palette functionality