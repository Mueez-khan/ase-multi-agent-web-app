from crewai import Task
from crew.agents.FrontendAgent import frontendAgent
from crew.tasks.architecture import architecture_task

# You are a senior frontend enginner who is spicialed in creating a frontend for the user which are user friendly , responsive , and also very
#             performance optimized and you also take care of security and testing 



frontendTask = Task(
  description="""
        You are a senior frontend engineer. Based on the software architecture
        provided in your context, WRITE THE ACTUAL FRONTEND CODE for the application.
 
        Do NOT describe what you would build — output real, complete, runnable code.
 
        CRITICAL FILE FORMAT — every file you output MUST use exactly this format,
        with no deviation, no matter the file type (code, config, json, html):
 
        ### FILE: <relative/path/to/file.ext>
        ```<language>
        <full file content here>
        ```
 
        This is a Vite + React + TypeScript project. Follow these structural rules
        exactly — these are common mistakes, do not make them:
 
        1. `index.html` MUST be at the PROJECT ROOT (### FILE: index.html), NOT inside
           `public/`. Vite requires index.html at root as its entry point; putting it
           in public/ breaks the dev server (404 on load). The `public/` folder, if
           used at all, is ONLY for static assets copied as-is (favicons, images) —
           never for index.html.
        2. You MUST output a complete `### FILE: package.json` listing:
           - every dependency actually imported anywhere in your code (react,
             react-dom, react-router-dom, your state library, your data-fetching
             library, your form/validation libraries, etc.)
           - every devDependency needed to build/run this project (vite, the vite
             react plugin, typescript, tailwindcss + postcss + autoprefixer if you
             use Tailwind classes, testing libraries if you write tests)
           - "scripts": at minimum "dev", "build", "preview", and "test" if tests
             are included
           Do not omit this file. A project without package.json cannot run `npm i`.
        3. All source files live under `### FILE: src/...` — never put .tsx/.ts
           source files at the project root.
        4. Config files (`vite.config.ts`, `tailwind.config.js`, `postcss.config.js`,
           `tsconfig.json`) belong at the PROJECT ROOT, same level as package.json —
           not inside src/.
 
        Cover:
        1. All pages (routing included)
        2. All components (with props typed, no placeholders)
        3. State management setup (stores/hooks, fully implemented)
        4. API integration layer (axios instance + interceptors + endpoint functions)
        5. Form validation (schemas + wired into forms)
        6. Error handling (error boundary, toast, interceptor-level)
        7. Tailwind classes for responsive design directly in JSX
        8. At least 2-3 example test files (unit/integration)
        9. package.json (see rule 2 above — mandatory)
        10. index.html at project root (see rule 1 above — mandatory)
 
        Every file must be complete enough to run with minimal setup:
        `npm i && npm run dev` should work with zero manual file moves or
        manual package.json edits. No "// ... implement this" or
        "// rest of component" placeholders — write full logic.
 
    """,
 
    expected_output="""
        A set of complete code files, each clearly delimited with
        '### FILE: <path>' followed by a fenced code block containing
        the full file content — including a working package.json and a
        root-level index.html. No prose-only descriptions — every
        component, page, store, config file, and utility must be actual
        working code, structured so `npm i && npm run dev` works immediately
        after extraction with no manual fixes.
    """,

    agent=frontendAgent,

    context=[architecture_task]
)