# StoryWeaver

StoryWeaver is a pioneering collaborative fiction platform that harnesses real-time multi-user editing, AI-powered narrative generation. Designed for writers who thrive on collaboration and readers seeking immersive storytelling, StoryWeaver seamlessly blends community creativity with structured authorial control. Empowering users with intuitive co-authoring tools, AI-driven creative assistance, StoryWeaver provides a vibrant and dynamic environment for crafting, exploring, and personalizing narratives, making it the ultimate destination for casual and dedicated storytellers alike.

## TODO

- [x] Implement live autosaving
- [x] Make title editable
- [x] Add search functionality
- [x] Implement live collaboration with LiveBlocks
- [x] Implement permissions system
- [ ] Implement notifications
- [ ] Implement AI features
- [ ] Implement social features
- [ ] Update Documentation

## Features that could be implemented in the future

- Story branching

## Setup

1. Clone the repository.

2. Make sure you are using the latest Node LTS version at the time of the last commit [v22.x].

3. Run `npm i -g pnpm@latest-10` to install pnpm.

4. Run `pnpm i` to install the dependencies.

5. Ignore the next step if you are a grader, please use the `.env` and `.env.local` files included on Canvas which have the development keys.

6. Set up a project on Clerk, NeonDB, and Liveblocks and include all the relevant API keys in your `.env` and `.env.local`.

7. Run `pnpx prisma generate` to generate the prisma client.

## Building

To create a production version of the app:

1. Run `pnpm build` to create an optimized production build of the app.

2. You can preview the production build with `pnpm start` and click the localhost link in the console to open the app in a new browser tab.

## Developing

1. Run `pnpm dev` to start the development server and click the localhost link in the console to open the app in a new browser tab.

## Linting

1. Run `pnpm lint` to run prettier and eslint.

2. Run `pnpm format` to format with prettier.
