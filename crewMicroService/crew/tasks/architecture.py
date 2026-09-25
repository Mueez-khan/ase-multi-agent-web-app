from crewai import Task
from crew.agents.architect import architect


architecture_task = Task(
    description = """

                        Analyze this software requirement:

                        {user_request}

                        Create a detailed software architecture.

                        Include:

                        1. Functional requirements
                        2. Non-functional requirements
                        3. Frontend technology
                        4. Backend technology
                        5. Database
                        6. API architecture
                        7. Authentication strategy if required
                        8. Project structure
                        9. Testing strategy
                        10. Deployment strategy
                        11. Security considerations
                        12. Production cost considerations

                        Explain why each major technology was selected.


            """,

            expected_output="""
                A detailed software architecture document containing
                requirements, technology choices, project structure,
                API design, database design, testing strategy and
                deployment strategy .
            """,

            agent=architect
)