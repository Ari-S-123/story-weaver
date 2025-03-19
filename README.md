# StoryWeaver

StoryWeaver is a pioneering collaborative fiction platform that harnesses real-time multi-user editing, AI-powered narrative generation, and interactive story-branching. Designed for writers who thrive on collaboration and readers seeking immersive storytelling, StoryWeaver seamlessly blends community creativity with structured authorial control. Empowering users with intuitive co-authoring tools, AI-driven creative assistance, and reader-influenced story evolution, StoryWeaver provides a vibrant and dynamic environment for crafting, exploring, and personalizing narratives, making it the ultimate destination for casual and dedicated storytellers alike.

## TODO

- Implement live autosaving or simple PUT request
- Make title editable
- Implement live collaboration with LiveBlocks
- Implement AI features
- Implement notifications
- Implement social features
- Improve CSS
- Update Documentation

## Setup

1. Clone the repository.

2. Make sure you set up Prisma, NeonDB Postgres, and Clerk.

3. Make sure you are using the latest Node LTS version at the time of the last commit [v22.x].

4. Run `npm i -g pnpm@latest-10` to install pnpm.

5. Run `pnpm i` to install the dependencies.

## Building

To create a production version of the app:

1. Run `pnpm build` to create an optimized production build of the app.

2. You can preview the production build with `pnpm start` and click the localhost link in the console to open the app in a new browser tab.

## Developing

1. Run `pnpm dev` to start the development server and click the localhost link in the console to open the app in a new browser tab.

## Linting

1. Run `pnpm lint` to run prettier and eslint.

2. Run `pnpm format` to format with prettier.
