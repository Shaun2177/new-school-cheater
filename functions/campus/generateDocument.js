import { getCache, setCache } from './cache';
import decode from './decode';
import templateTypeStrategies from './templateTypeStrategies';

export default async function generateDocument(url) {
    try {
        const startTime = performance.now();
        let json;

        // Check if the URL is already in the cache
        const cachedJson = await new Promise((resolve) => getCache(url, resolve));
        if (cachedJson) {
            json = cachedJson;
        } else {
            const response = await fetch(url);
            const text = await response.text();
            json = decode(text);
            setCache(url, json);
        }

        // Extract elementIds from the JSON objects and store them in a Map
        const elementIds = new Map(json.questions.map(({ elementId, questionIndex }) => [elementId, `${Number(questionIndex) + 1}`]));
        let questions = [];
        let pagesHTML = [];

        // Extract the valid questions from the JSON objects and store them in an array
        for (let pageIndex = 0; pageIndex < json.documentModel.e_questionnaire.e_page.length; pageIndex++) {
            const page = json.documentModel.e_questionnaire.e_page[pageIndex];
            let pageQuestions = [];

            for (const section of Object.values(page)) {
                if (Array.isArray(section)) {
                    for (const question of section) {
                        // Don't add openquestions or questions with only TextFields
                        if (question.templateType === "openquestion") continue;
                        // If the question is a clozequestion and has a TextField, but no other fields, skip it
                        if (question.templateType === "clozequestion" && question.e_cloze.e_textField != null) {
                            const { e_multiChoice, e_singleChoice, e_application, e_dropdownField } = question.e_cloze;
                            if ((!e_multiChoice || e_multiChoice.length === 0) &&
                                (!e_singleChoice || e_singleChoice.length === 0) &&
                                (!e_application || e_application.length === 0) &&
                                (!e_dropdownField || e_dropdownField.length === 0)) {
                                continue;
                            }
                        }
                        if (elementIds.has(question.elementId)) {
                            question.questionIndex = elementIds.get(question.elementId);
                            question.outputHTML = `<br><div style="font-weight: 600; font-size: 155%;">שאלה ${question.questionIndex}</div><br>`; // Initialize outputHTML for each question
                            pageQuestions.push(question);
                        }
                    }
                }
            }
            
            // Only add non-empty pages
            if (pageQuestions.length > 0) {
                questions.push({ page, pageQuestions });
            }
        }

        // Generate outputHTML for each non-empty page and its questions
        for (const { page, pageQuestions } of questions) {
            if (pageQuestions.length > 0) {
                let outputHTML = `<div style="font-size: 32px; color: #FFFFFF; font-weight: 600; text-align: center; margin: 0 auto;">עמוד ${page.localId.replace("page_", "")}${page.pageTitle ? ` - ${page.pageTitle}` : ""}</div>`;

                for (const question of pageQuestions) {
                    const handler = templateTypeStrategies[question.templateType];
                    if (handler) {
                        handler(question);
                    } else {
                        question.outputHTML += question.templateType
                        console.log(question.questionIndex, question.templateType);
                    }
                }

                // Create a new string with each page's valid questions HTML
                const pageHTML = pageQuestions.reduce((html, question) => html + question.outputHTML, outputHTML);
                // Add each page's valid questions HTML in a new index
                pagesHTML.push(pageHTML);
            }
        }

        console.log((performance.now() - startTime).toFixed(3) + "ms");
        return pagesHTML;
    } catch (error) {
        console.error(error);
    }
}
