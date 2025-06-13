const { RequestService } = require("../services/RequestService");
const Contact = require("../models/contact"); 

const postContact = async (req, res) => {
    const { name, message } = req.body;
    console.log('Contact form received:', { name, message });

    try {
        // Save contact info to MongoDB
        const newContact = new Contact({ name, message });
        await newContact.save();

        const isJson = req.query.format === 'json';
        if (isJson) {
            return res.json({
                success: true,
                message: 'Thank you for reaching out!',
            });
        }

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Thank You Page</title>
                <link rel="stylesheet" href="/css/styles.css">
            </head>
            <body>
                <header>
                    <h1>Thank You for Reaching Out!!</h1>
                </header>
                <main>
                    <p>We have received your message and will get back to you shortly.</p>
                    <p><a href="/">Go back to the homepage</a></p>
                </main>
                <footer>
                    &copy; 2025 Kawaljeet
                </footer>
            </body>
            </html>
        `);

    } catch (err) {
        console.error("Failed to save contact message:", err);
        res.status(500).send("Something went wrong. Please try again later.");
    }
};

const getContact = async (req, res) => {
    const isJson = req.query.format === 'json';
    if (isJson) {
        return res.json({ success: true, message: 'Contact Form Displayed' });
    }
    res.render('contact', { title: "Contact" });
};

module.exports = { getContact, postContact };
