import generateDocument from "@/functions/campus/generateDocument";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Extract CSRF token from the request headers
        const csrfTokenFromHeader = req.headers['csrf-token'];
        let { url } = req.body;  // Extract URL from the body

        // Validate the CSRF token
        if (!csrfTokenFromHeader) {
            return res.status(403).json({ error: 'CSRF token missing' });
        }

        // Perform your logic here, based on the URL
        if (!url) {
            return res.status(400).json({ error: 'Invalid request data' });
        }

        // Validate the URL
        try {
            url = new URL(url);
        } catch (_) {
            return res.status(400).json({ error: 'Invalid URL' });
        }

        url = new URL(url); // Parse the URL

        // Simulate handling different URL types
        if (url.hostname === 'documentservice.cet.ac.il' && url.pathname.startsWith('/api/documentsRevisions/')) {
            // Handle documentservice URLs

            const response = await generateDocument(url.href)
            return res.status(200).json({ pages: response })
        }

        if (url.hostnamae === "classe.world") {
            return alert("עדיין לא עובד")
        }

        return res.status(400).json({ error: 'Invalid URL prefix' });

    } catch (error) {
        console.error('Error validating data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
