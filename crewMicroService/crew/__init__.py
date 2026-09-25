from crew.softwareCrew import run__task


async def run_crew(user_request : str):

    crew = run__task()

    result = await crew.kickoff_async(
        inputs={
            "user_request": user_request
        }
    )

    architecture_res = result.tasks_output[0].raw
    frontend_res = result.tasks_output[1].raw
    backend_res = result.tasks_output[2].raw
    return {
        "architechture :" : architecture_res,
        "frontend :" : frontend_res,
        "backend : " : backend_res
    }