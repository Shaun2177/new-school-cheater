import { v4 as uuidv4 } from 'uuid';  // To generate a unique CSRF token

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const csrfToken = uuidv4();  // Generate a new CSRF token
        return res.status(200).json({ csrfToken });  // Return the CSRF token in the response body
    } catch (error) {
        console.error('Error generating CSRF token:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
