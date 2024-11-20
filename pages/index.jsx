"use client"

import React, { useState, useEffect } from "react"
import axios from 'axios'
import Tutorial from "@/public/campus/Tutorial"

export default function HomePage() {
    const [showTutorial, setShowTutorial] = useState(false)
    const [showInitialPage, setShowInitialPage] = useState(false)
    const [csrfToken, setCsrfToken] = useState('')
    const [url, setUrl] = useState('')
    const [pages, setPages] = useState([])
    const [currentPageIndex, setCurrentPageIndex] = useState(0)
    const [response, setResponse] = useState('')

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const { data } = await axios.get('/api/generateCsrfToken')
                setCsrfToken(data.csrfToken)
            } catch (error) {
                console.error('Error fetching CSRF token:', error)
            }
        }
        fetchCsrfToken()
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!csrfToken || !url) {
            setResponse('Error: CSRF Token or URL missing')
            return
        }

        try {
            const { data } = await axios.post('/api/validateData', { url }, {
                headers: {
                    'CSRF-Token': csrfToken,  // Include CSRF token in the headers
                },
            })

            setPages(data.pages)  // Set the pages from the server response
            setCurrentPageIndex(0)  // Reset to the first page
        } catch (error) {
            setResponse(`Error: ${error.response?.data?.error || 'Failed to fetch data'}`)
        }
    }

    const handlePageBack = () => {
        setCurrentPageIndex((prevIndex) => Math.max(prevIndex - 1, 0))
    }

    const handlePageForward = () => {
        setCurrentPageIndex((prevIndex) => Math.min(prevIndex + 1, pages.length - 1))
    }

    const renderPageContent = (pageContent) => {
        return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
    };

    const handleCloseTutorial = () => {
        setShowTutorial(false);
        setShowInitialPage(false);
    };

    const handleKeyDown = (event) => {
        const urlInput = document.getElementById('object-box');
        if (document.activeElement === urlInput) {
            return;
        }

        if (event.key === 'Escape') {
            handleCloseTutorial();
        } else if (event.key === 'e' || event.key === 'E') {
            setShowInitialPage(true);
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleCampusClick = () => {
        setShowTutorial(true);
        setShowInitialPage(false);
    };

    const handleClassEClick = () => {
        // Handle Class-E button click
        alert("Class-E tutorial not yet implemented.");
    };

    return (
        <div style={{ width: "100%" }}>
            <div id="objectContainer" style={{ fontFamily: "sans-serif", fontWeight: 600, textAlign: "center" }}>
                <form id="objectForm" style={{ marginTop: 5 }} onSubmit={handleSubmit}>
                    <p
                        id="title"
                        style={{
                            fontSize: "32px",
                            color: "white",
                            fontWeight: 600,
                            textAlign: "center",
                            margin: "0 auto",
                        }}
                    >
                        Enter קמפוס or Class-E URL:
                    </p>
                    <input
                        id="object-box"
                        type="text"
                        onChange={(e) => setUrl(e.target.value)}
                        style={{
                            marginTop: 10,
                            fontFamily: "sans-serif",
                            fontWeight: 600,
                            fontSize: "125%",
                            color: "#333",
                            backgroundColor: "#f5f5f5",
                            borderStyle: "none",
                            borderRadius: "4px",
                            padding: "6px",
                            width: "35vw",
                            boxSizing: "border-box",
                        }}
                    />
                    <br />
                    <button
                        id="submit"
                        style={{
                            color: "white",
                            backgroundColor: "#4CAF50",
                            fontSize: 24,
                            padding: "12px 24px",
                            transition: "background-color 0.3s ease",
                            marginTop: 15,
                        }}
                    >
                        Submit
                    </button>
                </form>
            </div>

            {/* Conditionally render outputContainer based on pages */}
            {pages.length > 0 && (
                <div
                    id="outputContainer"
                    style={{
                        position: "relative",
                        top: 35,
                        maxWidth: "80vw",      // Ensure it's 80% of the viewport width
                        margin: "0 auto"
                    }}
                >
                    <div id="buttonContainer" style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                        <button
                            id="pageBack"
                            onClick={handlePageBack}
                            disabled={currentPageIndex === 0}
                            style={{
                                backgroundColor: currentPageIndex === 0 ? '#d3d3d3' : '',
                                cursor: currentPageIndex === 0 ? 'default' : 'pointer'
                            }}
                        >
                            ⏪
                        </button>
                        <button
                            id="pageForward"
                            onClick={handlePageForward}
                            disabled={currentPageIndex === pages.length - 1}
                            style={{
                                backgroundColor: currentPageIndex === pages.length - 1 ? '#d3d3d3' : '',
                                cursor: currentPageIndex === pages.length - 1 ? 'default' : 'pointer'
                            }}
                        >
                            ⏩
                        </button>
                    </div>
                    <div
                        id="output"
                        style={{
                            alignSelf: "flex-start",
                            direction: "rtl",
                            position: "relative",
                            top: "12.5px",
                            margin: "0 auto",
                            padding: "20px",
                            boxSizing: "border-box",
                            textAlign: "right",
                            color: "white",
                            fontFamily: "sans-serif",
                            maxWidth: "80vw",
                            width: "80vw",
                            background: "rgba(0, 0, 0, 0.5)",
                            borderRadius: "8px",
                            wordWrap: "break-word"
                        }}
                    >
                        {renderPageContent(pages[currentPageIndex])}
                    </div>
                </div>
            )}

            <button
                id="tutorialButton"
                onClick={() => setShowInitialPage(true)}
                style={{ position: "absolute", top: 6, right: 6, fontSize: 20, padding: 8 }}
            >
                Tutorial
            </button>

            {showInitialPage && (
                <section
                    id="initialPage"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <div style={{
                        textAlign: "center",
                        position: "relative",
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        width: "25%",
                        height: "25%",
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'  // Add a gray shadow
                    }}>
                        <button onClick={handleCloseTutorial} style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            width: '40px',
                            height: '40px',
                            fontSize: '24px',
                            background: 'white',
                            color: 'black',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'  // Add a gray shadow
                        }}>X</button>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                        }}>
                            <button onClick={handleCampusClick} style={{
                                margin: "10px",
                                padding: "10px 20px",
                                fontSize: "18px",
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'  // Add a gray shadow
                            }}>קמפוס</button>
                            <button onClick={handleClassEClick} style={{
                                margin: "10px",
                                padding: "10px 20px",
                                fontSize: "18px",
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'  // Add a gray shadow
                            }}>Class-E</button>
                        </div>
                    </div>
                </section>
            )}

            {showTutorial && (
                <section
                    id="tutorial"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <article
                        style={{
                            height: "80vh",
                            overflow: "auto",
                            maxWidth: "80%",
                            padding: 20,
                            backgroundColor: "white",
                            borderRadius: 8,
                            position: "relative",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            fontFamily: "sans-serif",
                            fontSize: 16,
                        }}
                    >
                        <button onClick={handleCloseTutorial} style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            width: '40px',
                            height: '40px',
                            fontSize: '24px',
                            background: 'white',
                            color: 'black',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'  // Add a gray shadow
                        }}>X</button>
                        {Tutorial()}
                    </article>
                </section>
            )}
        </div>
    );
}