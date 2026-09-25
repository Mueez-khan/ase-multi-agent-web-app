from crewai import Task
from crew.tasks.frontEndTask import frontendTask
from crew.tasks.architecture import architecture_task
from crew.agents.backendAgent import backendAgent

backendTask = Task(


      description = """
        Implement the backend based on the system design provided by the architecture
        agent and the API/data expectations from the frontend agent. Your responsibilities:
 
        1. Follow the architecture agent's system design (folder structure, tech stack,
        data flow, service boundaries) — do not deviate without strong reason.
        2. Implement API endpoints that match the frontend agent's expected request/
        response contracts exactly (naming, shape, status codes).
        3. Implement authentication and authorization where required (JWT/session-based).
        4. Structure code using clean architecture (routes, controllers, services,
        models/repositories) — no business logic in route handlers.
        5. Add input validation and proper error handling for every endpoint.
        6. Write efficient, scalable database queries/schemas.
        7. Add meaningful comments for non-obvious logic only.
        8. Handle edge cases: empty inputs, invalid tokens, race conditions,
        duplicate requests, rate limiting on sensitive routes.
        9. If the frontend's expected contract conflicts with the architecture design,
        flag the conflict clearly in your output instead of silently picking one.
        10. Write maintaible and readable code that humans can read it.
        11. Write code in seprate file.
 
        CRITICAL FILE FORMAT — this MUST match the frontend agent's format exactly,
        with no deviation. Do NOT use "**File: `path`**" or any other style — use
        ONLY this format for every single file, including config/json files:
 
        ### FILE: <relative/path/to/file.ext>
        ```<language>
        <full file content here>
        ```
 
        Structural rules — follow exactly, these are common mistakes:
 
        1. You MUST output a complete `### FILE: package.json` (at the project root,
           e.g. "### FILE: package.json" — NOT "### FILE: backend/package.json")
           listing every dependency and devDependency actually used in your code
           (express, your ORM/driver, jsonwebtoken, bcrypt, zod or your validation
           library, etc.), plus "scripts" for at least "dev", "build", "start".
        2. All source paths should be relative to the backend project root — i.e.
           write "### FILE: src/app.ts", NOT "### FILE: backend/src/app.ts". Do not
           prefix every path with "backend/"; the backend/ folder is the project
           root itself once extracted, so double-prefixing creates broken nested
           paths like backend/backend/src/app.ts.
        3. Include a `.env.example` at the project root listing every environment
           variable your code reads via process.env, with placeholder values.
        4. If using an ORM with a schema file (e.g. Prisma), include it at its
           conventional path (e.g. "### FILE: prisma/schema.prisma").
 
        Every file must be complete enough to run with minimal setup:
        `npm i` followed by the documented run command should work with zero
        manual file moves or path corrections.
 
            """,
 
    expected_output="""
    A complete, working backend implementation including:
    - Folder/file structure matching the architecture design, using ONLY the
      '### FILE: <path>' + fenced code block format (same convention as frontendTask)
    - A working package.json at the project root (mandatory)
    - Full source code for each file, ready to run
    - API reference (endpoint, method, path, request body, response shape, status codes)
    - Setup instructions (env variables, dependencies, run commands)
    - Any flagged conflicts between architecture design and frontend expectations
    """,
    agent = backendAgent,
    context = [architecture_task , frontendTask]


)