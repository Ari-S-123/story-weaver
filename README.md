# StoryWeaver

StoryWeaver is a pioneering collaborative fiction platform that harnesses real-time multi-user editing, AI-powered narrative generation. Designed for writers who thrive on collaboration and readers seeking immersive storytelling, StoryWeaver seamlessly blends community creativity with structured authorial control. Empowering users with intuitive co-authoring tools, AI-driven creative assistance, StoryWeaver provides a vibrant and dynamic environment for crafting, exploring, and personalizing narratives, making it the ultimate destination for casual and dedicated storytellers alike.

Production Deployment: https://storyweaver-next.vercel.app/

## Note

- Not in any way affiliated with "story-weaver.ai"
- Clerk is stuck in development mode because you can't create a production instance without paying for and owning a domain.

## MVP TODO

- [x] Implement live autosaving
- [x] Make title editable
- [x] Add search functionality
- [x] Implement live collaboration with LiveBlocks
- [x] Implement permissions system
- [x] Implement visibility, like, and favorite features
- [x] Implement AI features
- [x] Update Documentation
- [x] Finish videos

## Features that could be implemented in the future

- Clean up some styling, add disclaimer for mobile users
- Notifications (have to rethink component tree for this)
- Fix bug with comment usernames only being anonymous
- Have some indication of story visibility without having to enter the editor
- Friends/Followers system
- Changing story ownership
- Markdown support for AI responses
- AI autocomplete
- Agentic AI inline story editing
- Story branching
- Story thumbnails

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

## Project Proposal

Refer to the [Project Proposal](./StoryWeaver%20Spec%20Sheet%20-%20Aritra%20Saharay.pdf) document for more information on the project.

## Module Diagram

Refer to the [Project Proposal](./StoryWeaver%20Spec%20Sheet%20-%20Aritra%20Saharay.pdf) document for the module diagram.

## UI Mockups (Deprecated)

These are deprecated because a lot of changes had to be made in terms of what features could make it into the MVP. Please refer to the project proposal pdf for a rough visualization of the react component heirarchy of the production MVP.

[UI Mockups](https://www.figma.com/design/uZip7FlNtQV3nyaxM7FftU/StoryWeaver-UI-Mockups?node-id=2001-2&t=lGQhdfoNlmG3TxBS-1)

## FP Usage

Refer to the [FP Usage](./FP-Usage.md) document for more information on the FP principles used in this project.

## FP Usage Video

Refer to this [video](https://youtu.be/MQ1NkBGruWE) for a walkthrough of the FP principles used in this project.

## Demo Video

Refer to this [video](https://youtu.be/tAFyj4L_CkY) for a demo of the project.

## AI Usage

I used Cursor in Agent mode with `claude-3.7-sonnet-thinking` and also Tab Autocomplete to help me with various aspects of this project:

1. **Type/Model Definitions**: AI helped design and implement well-structured TypeScript type and Prisma model definitions for the application.

2. **Code Refactoring**: AI provided suggestions for refactoring code to better adhere to functional programming principles.

3. **Bug Detection**: AI identified potential logical issues and type mismatches that were fixed during development.

4. **UI Generation**: AI helped a lot with building lots of frontend components quickly.

Some prompts I used:

- Help me fix the bugs with autosaving.
- Why is the next build throwing an error?
- What is the difference between useRouter and next/navigation?
- Use shadcn-ui to implement a text input and relevant buttons for the ai-drawer.
- Move story card data into its own component and create buttons with appropriate tailwind styling for liking and favoriting.
- Help me move the AI text generation code which needs the gemini api key to a backend endpoint.
- Generate counterexamples that show the opposite/broken principles for the examples of good functional programming principles present in @FP-Usage.md.
- Can you update @README.md and @FP-Usage.md to reflect all the changes we've made to the codebase together today?

Everything generated by the Agent was manually verified and/or edited by me to ensure it was correct and working as expected.
