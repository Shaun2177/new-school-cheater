import cleanHTML from "../cleanHTML";

const templateTypeStrategies = {
    "multiplechoice": function (question) {
        if (question.e_singleChoice) {
            question.e_singleChoice.e_option.forEach(option => {
                if (option.correct) {
                    question.outputHTML += `<div>${option.labelHtml}</div>`;
                }
            })
        } else if (question.e_multiChoice) {
            question.e_multiChoice.e_option.forEach(option => {
                if (option.correct) {
                    question.outputHTML += `<div>${option.labelHtml}</div>`;
                }
            })
        }
    },
    "clozequestion": function (question) {
        const dropdownField = question.e_cloze.e_dropdownField;
        if (dropdownField.length > 0) {
            dropdownField.forEach(dropDown => {
                const correctOption = dropDown.option[dropDown.correctOptionValue];
                if (correctOption && correctOption.title) {
                    question.outputHTML += `<div>${correctOption.title}</div>`;
                } else {
                    const currentDateTime = new Date().toLocaleString();
                    console.log(`[${currentDateTime}] DropDown without title:`, dropDown);
                }
            });
        }

        const multiChoice = question.e_cloze.e_multiChoice;
        if (multiChoice.length > 0) {
            multiChoice.forEach(choiceObject => {
                choiceObject.e_option.forEach(option => {
                    if (option.correct) {
                        question.outputHTML += `<div>${option.labelHtml}</div>`;
                    }
                });
            });
        }
    },
    "veryclozequestion": function (question) {
        const dropdownField = question.e_cloze.e_dropdownField;
        if (dropdownField.length > 0) {
            dropdownField.forEach(dropDown => {
                question.outputHTML += `<div>${dropDown.option[dropDown.correctOptionValue].title}</div>`;
            });
        }

        const multiChoice = question.e_cloze.e_multiChoice;
        if (multiChoice.length > 0) {
            multiChoice.forEach(choiceObject => {
                choiceObject.e_option.forEach(option => {
                    if (option.correct) {
                        question.outputHTML += `<div>${option.labelHtml}</div>`;
                    }
                });
            });
        }
    },
    "ordering": function (question) {
        const preset = question.e_application.appOptions.preset;
        const decoded = decodeURIComponent(preset);
        // Remove all HTML tags and convert sentences to array
        const cleanedHTML = cleanHTML(decoded);

        cleanedHTML.forEach(sentence => {
            question.outputHTML += `<div>${sentence}</div>`;
        })
    },
    "dragndrop": function (question) {
        const preset = question.e_application.appOptions.preset;
        const decoded = JSON.parse(decodeURIComponent(preset));

        // Add the background image
        question.outputHTML += `<div style="position: relative; width: 65%; height: 100%;">`;
        question.outputHTML += `<img src=${decoded.backgroundImage} style="width: 100%; height: 100%;">`;

        // Show the baskets
        decoded.baskets.forEach(basket => {
            if (basket.text.trim() === "") {
                question.outputHTML += `<div style="position: absolute; top: ${basket.top}%; left: ${basket.left}%; width: ${basket.width}%; height: ${basket.height}%;"><img src="${basket.image}" style="width: 100%; height: auto;"></div>`;
            } else {
                question.outputHTML += `<div style="position: absolute; top: ${basket.top}%; left: ${basket.left}%; width: ${basket.width}%; height: ${basket.height}%; color: ${basket.color}; overflow-wrap: break-word; word-wrap: break-word; text-align: center; display: flex; justify-content: center; align-items: center;">${basket.text}</div>`;
            }
        });

        // Close the background image div
        question.outputHTML += `</div>`;
    },
    "dragndrop-without-groups": function (question) {
        const preset = question.e_application.appOptions.preset;
        const decoded = JSON.parse(decodeURIComponent(preset));

        // Add the background image
        question.outputHTML += `<div style="position: relative; width: 65%; height: 100%;">`;
        question.outputHTML += `<img src=${decoded.backgroundImage} style="width: 100%; height: 100%;">`;

        // Show the baskets
        decoded.baskets.forEach(basket => {
            if (basket.text.trim() === "") {
                question.outputHTML += `<div style="position: absolute; top: ${basket.top}%; left: ${basket.left}%; width: ${basket.width}%; height: ${basket.height}%;"><img src="${basket.image}" style="width: 100%; height: auto;"></div>`;
            } else {
                question.outputHTML += `<div style="position: absolute; top: ${basket.top}%; left: ${basket.left}%; width: ${basket.width}%; height: ${basket.height}%; color: ${basket.color}; overflow-wrap: break-word; word-wrap: break-word; text-align: center; display: flex; justify-content: center; align-items: center;">${basket.text}</div>`;
            }
        });

        // Close the background image div
        question.outputHTML += `</div>`;
    },
    "dot2dot": function (question) {
        const preset = question.e_application.appOptions.preset;
        const decoded = JSON.parse(decodeURIComponent(preset));

        console.log(decoded);

        decoded.pairs.forEach((pair, index) => {
            const leftMember = pair.leftMember;
            const rightMember = pair.rightMember;
            question.outputHTML += `<div>${index + 1}. ימין: ${rightMember.data} |||| שמאל: ${leftMember.data}</div>`
        });
    },
}

export default templateTypeStrategies;