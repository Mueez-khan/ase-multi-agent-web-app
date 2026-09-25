from fastapi import FastAPI , Request , Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from crew import run_crew
from dotenv import load_dotenv
from file_extractor_zip import extract_to_zip_bytes

load_dotenv()

app = FastAPI()

origins = {
    "http://localhost:3000",
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TakeInput(BaseModel):
    query : str

@app.get('/')
def read_root():
    return  {"status": "success", "message": "FastAPI is running on Conda!"}


@app.get('/info')
def information():
    return {
        "success" : True,
        "message " :  "This is information of the page is "
    }

@app.post("/run-agent")
async def run_agent(request : TakeInput):

    
    try:
        result = await run_crew(request.query)
        # output = {
        #     "architecture": result.tasks_output[0].raw,
        #     "frontend": result.tasks_output[1].raw,
        #     "backend": result.tasks_output[2].raw,
        # }
        # zip_bytes = extract_to_zip_bytes(output)
        # with open("debug_output.zip", "wb") as f:
        #     f.write(zip_bytes)
        # output = {
        #     "architecture": result.tasks_output[0].raw,
        #     "frontend": result.tasks_output[1].raw,
        #     "backend": result.tasks_output[2].raw,
        # }

        # print('The llm response' , output)

        return {
            "success": True,
            "result": result
        }
    except Exception as e:
        import traceback
        traceback.print_exc()  # full traceback in your terminal
        raise


   
    # return {"success": True, "result": result}



@app.post('/task')
async def task(request : TakeInput):

    text = request.text

    return {
        "success" : True,
        "message " :  text
    }