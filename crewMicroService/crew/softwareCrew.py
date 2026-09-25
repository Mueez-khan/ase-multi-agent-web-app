from crewai import Agent, Task, Crew , LLM , Process
from crew.tasks.architecture import architecture_task
from crew.tasks.frontEndTask import frontendTask
from crew.tasks.backendTask import backendTask

def run__task():

    crew = Crew(

            agents=[
                architecture_task.agent,
                frontendTask.agent,
                backendTask.agent

                ],
            tasks=[
                architecture_task,
                frontendTask,
                backendTask


                ],

            process=Process.sequential,
            
            verbose=True,
            
                
        )

   

    

    return crew