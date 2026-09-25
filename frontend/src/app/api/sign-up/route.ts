import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";


export async function POST(request : Request){


        try{

            const body = await request.json();


            const {name , email , password} = body;

            if(!name || !email || !password){
                return Response.json(
                { message: "All fields are required" },
                { status: 400 }
                );
            }

            const existingUser  = await prisma.users.findUnique({
                where: {
                    email
                }
            })
            if(existingUser){
                 return Response.json(
                    { message: "User already exists" },
                    { status: 409 }
                );
            }

            const hashedPassword = await bcrypt.hash(password , 10);
            
            const user = await prisma.users.create({
                data : {
                    name , 
                    email ,
                    password : hashedPassword,
                }
            } 
        )

        return Response.json({
            message : "User registered successfully",
            name : user.name,
            email : user.email,
            
        } , {status : 201}
    )

        }catch(err){
            console.log("Error while user registering ERROR => ", err)
            return Response.json({
                success :  false,
                message : "There is error while registering user"
            })
        }



}