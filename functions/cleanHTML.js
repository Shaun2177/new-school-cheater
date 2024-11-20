const cleanHTML = (input) => {
    // Use a regular expression to remove all XML/HTML tags
    const textOnly = input.replace(/<[^>]*>/g, ''); 
    
    // Decode HTML entities (e.g., `&nbsp;` to space)
    const htmlEntities = {
        '&nbsp;': ' ',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'"
    };
    const decodedText = textOnly.replace(/&[a-zA-Z0-9#]+;/g, (entity) => htmlEntities[entity] || entity);

    // Split the text into sentences using period, question mark, or exclamation mark
    const sentences = decodedText.split(/[.!?]\s*/).filter(Boolean).map(s => s.trim());

    return sentences;
};

export default cleanHTML;