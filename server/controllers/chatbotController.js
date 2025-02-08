const GoogleGenerativeAI = require('../models/generativeAI');  // Import AI model setup
const CONTEXT = require('../utils/constants'); // Import the context

// The function for processing the chatbot's reply
const getChatbotReply = async (req, res) => {
  const { message } = req.body;

  try {
    const prompt = `${CONTEXT}\nUser: ${message}\nBot:`;

    const result = await GoogleGenerativeAI.generateContent(prompt);
    const botReply = await result.response.text(); // Extracts response text

    console.log(botReply);
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    res.status(500).json({ message: "Error processing your request" });
  }
};

module.exports = {
  getChatbotReply,
};
