"use client"

import React, { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import InkFlowField from "../components/Component"
import { useRouter } from 'next/navigation'
const COLORS = {
    bgDeep: "#0A0E27",
    bgDeep2: "#12173A",
    amber: "#F5A623",
    amberSoft: "rgba(245, 166, 35, 0.35)",
    violet: "#6D5DFC",
    violetSoft: "rgba(109, 93, 252, 0.35)",
    textPrimary: "#F7F8FC",
    textMuted: "#8C93B8",
    border: "rgba(148, 163, 196, 0.18)",
}

const PROMPTS = [
    "a RAG chatbot for customer support",
    "a CSV analytics dashboard",
    "an AI mock interview app",
    "a fake-review detection classifier",
    "a voice assistant with live transcription",
]

function useTypewriter(
    words: string[],
    typingMs = 55,
    pauseMs = 1400,
    deletingMs = 30
) {
    const [text, setText] = useState("")
    const [wordIndex, setWordIndex] = useState(0)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const current = words[wordIndex % words.length]

        let timeout: NodeJS.Timeout

        if (!deleting && text === current) {
            timeout = setTimeout(() => {
                setDeleting(true)
            }, pauseMs)
        } else if (deleting && text === "") {
            setDeleting(false)

            setWordIndex((i) => i + 1)
        } else {
            timeout = setTimeout(() => {
                setText((t) =>
                    deleting
                        ? current.slice(0, t.length - 1)
                        : current.slice(0, t.length + 1)
                )
            }, deleting ? deletingMs : typingMs)
        }

        return () => clearTimeout(timeout)
    }, [
        text,
        deleting,
        wordIndex,
        words,
        typingMs,
        pauseMs,
        deletingMs,
    ])

    return text
}

export default function HeroSection() {
    const placeholder = useTypewriter(PROMPTS)

    const [focused, setFocused] = useState(false)
    const [query , setQuery  ] = useState("")

    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

   
    const  handleSubmit  = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log(query)
        inputRef.current?.focus()

        const uuid = window.crypto.randomUUID();

        console.log("The generated uuid " , uuid);

        
        const res = await fetch(`api/app-build-req/${uuid}` , {
          method : 'POST',
          headers : {
            "Content-Type": "application/json"
          },
          body : JSON.stringify({
            query : query
          })
        })

        const data = await res.json();
        // if(data.success)
       router.push(`/conversation/${uuid}`)
     
        
        console.log("The data of query Herosection" , data )

        setQuery("")


    }

    return (
        <section
            className="relative w-full min-h-screen overflow-hidden"
            style={{
                background: COLORS.bgDeep,
                fontFamily: "'Inter', system-ui, sans-serif",
            }}
        >

            {/* ========================================= */}
            {/* INK FLOW BACKGROUND */}
            {/* ========================================= */}

            <div
                className="absolute inset-0"
                style={{
                    zIndex: 0,
                }}
            >
                <InkFlowField
                    background={COLORS.bgDeep}
                    colors={[
                        "#4E5BF2",
                        "#6D5DFC",
                        "#F5A623",
                        "#00D3B8",
                    ]}
                    speed={50}
                    dissipation={35}
                    swirl={40}
                    drift={8}
                    cursor={{
                        force: 90,
                        reach: 45,
                    }}
                />
            </div>


            {/* ========================================= */}
            {/* DARK OVERLAY */}
            {/* ========================================= */}

            <div
                className="absolute inset-0"
                style={{
                    zIndex: 1,

                    background:
                        "linear-gradient(180deg, rgba(10,14,39,0.15) 0%, rgba(10,14,39,0.65) 100%)",

                    pointerEvents: "none",
                }}
            />


            {/* ========================================= */}
            {/* CONTENT */}
            {/* ========================================= */}

            <div
                className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 py-24"
            >

                <div className="flex flex-col items-center text-center max-w-3xl w-full">

                    {/* TITLE */}

                    <h1
                        className="font-bold leading-tight mb-5"
                        style={{
                            color: COLORS.textPrimary,

                            fontFamily:
                                "'Space Grotesk', 'Inter', sans-serif",

                            fontSize:
                                "clamp(36px, 6vw, 64px)",

                            textShadow:
                                "0 4px 30px rgba(0,0,0,0.35)",
                        }}
                    >
                        What are you building today?
                    </h1>


                    {/* SUBTITLE */}

                    <p
                        className="font-medium mb-10"
                        style={{
                            color: COLORS.textMuted,

                            fontSize:
                                "clamp(16px, 2vw, 20px)",

                            textShadow:
                                "0 2px 20px rgba(0,0,0,0.4)",
                        }}
                    >
                        Describe the software in your head.
                        Watch it take shape.
                    </p>


                    {/* ================================= */}
                    {/* INPUT */}
                    {/* ================================= */}

                    <form
                        onSubmit={handleSubmit}
                        className="w-full flex justify-center"
                    >
                        <div
                            style={{
                                display: "flex",

                                alignItems: "center",

                                width: "100%",

                                maxWidth: 560,

                                background:
                                    "rgba(10,14,39,0.55)",

                                border:
                                    `1px solid ${
                                        focused
                                            ? COLORS.amber
                                            : COLORS.border
                                    }`,

                                borderRadius: 18,

                                padding:
                                    "6px 6px 6px 20px",

                                backdropFilter:
                                    "blur(12px)",

                                WebkitBackdropFilter:
                                    "blur(12px)",

                                boxShadow:
                                    "0 10px 40px rgba(0,0,0,0.25)",

                                transition:
                                    "border-color 0.25s ease",
                            }}
                        >

                            {/* PREFIX */}

                            <span
                                style={{
                                    color: COLORS.textMuted,

                                    fontFamily:
                                        "monospace",

                                    marginRight: 10,
                                }}
                            >
                                &gt;
                            </span>


                            {/* INPUT AREA */}

                            <div
                                style={{
                                    position: "relative",

                                    flex: 1,

                                    textAlign: "left",
                                }}
                            >

                                <input
                                    ref={inputRef}
                                    value={query}
                                    type="text"
                                    onChange={(e) => setQuery(e.target.value)}
                                    onFocus={() =>
                                        setFocused(true)
                                    }

                                    onBlur={() =>
                                        setFocused(false)
                                    }

                                    className="w-full bg-transparent outline-none"

                                    style={{
                                        color:
                                            COLORS.textPrimary,

                                        fontFamily:
                                            "monospace",

                                        fontSize: 15,

                                        height: 44,
                                    }}
                                />


                                {/* TYPEWRITER */}

                                {!focused && (
                                    <div
                                        aria-hidden="true"
                                        style={{
                                            position:
                                                "absolute",

                                            top: 0,

                                            left: 0,

                                            height: 44,

                                            display: "flex",

                                            alignItems:
                                                "center",

                                            color:
                                                COLORS.textMuted,

                                            fontFamily:
                                                "monospace",

                                            fontSize: 15,

                                            pointerEvents:
                                                "none",
                                        }}
                                    >
                                        Build&nbsp;
                                        {placeholder}

                                        <span
                                            style={{
                                                marginLeft: 2,

                                                color:
                                                    COLORS.amber,

                                                animation:
                                                    "blink 1s step-end infinite",
                                            }}
                                        >
                                            |
                                        </span>
                                    </div>
                                )}

                            </div>


                            {/* BUILD BUTTON */}

                            <button
                                type="submit"
                                style={{
                                    display: "flex",

                                    alignItems: "center",

                                    gap: 8,

                                    background:
                                        COLORS.amber,

                                    color:
                                        COLORS.bgDeep,

                                    fontWeight: 600,

                                    fontSize: 14,

                                    border: "none",

                                    borderRadius: 14,

                                    padding:
                                        "11px 20px",

                                    cursor:
                                        "pointer",

                                    whiteSpace:
                                        "nowrap",
                                }}
                            >
                                Build

                                <ArrowRight
                                    size={16}
                                />
                            </button>

                        </div>
                    </form>

                </div>
            </div>


            {/* ========================================= */}
            {/* ANIMATION */}
            {/* ========================================= */}

            <style jsx>{`
                @keyframes blink {
                    0%,
                    45% {
                        opacity: 1;
                    }

                    50%,
                    100% {
                        opacity: 0;
                    }
                }
            `}</style>

        </section>
    )
}