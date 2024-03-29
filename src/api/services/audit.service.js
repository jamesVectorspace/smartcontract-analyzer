const logger = require("../logger");
const { getPrompt } = require("../utils/generatePrompt");
const axios = require("axios");
require("dotenv").config();

const handleAuditContract = async (contractCode) => {
  try {
    const promptContent = getPrompt(contractCode);
    const messages = [{ role: "user", content: promptContent }];

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: messages,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let rawResponse = response.data.choices[0].message.content.trim();

    rawResponse = rawResponse.replace("```", "");
    rawResponse = rawResponse.replace("```", "");

    logger.debug(`Raw Response: ${rawResponse}`);

    return {
      status: true,
      message: JSON.parse(rawResponse),
    };
  } catch (err) {
    logger.error(`AuditContract error : ${err.message}`);
    return {
      status: false,
      message: err.message,
    };
  }
};

const handleCostEstimation = (contractCode) => {
  try {
    const promptContent = getPrompt("");

    // Calculate the estimated cost
    const estimatedCostTokensFromFile = (contractCode.length / 1000) * 0.002;
    const estimatedCostTokensFromPrompt = (promptContent.length / 1000) * 0.002;
    const totalEstimatedCostTokens =
      estimatedCostTokensFromFile + estimatedCostTokensFromPrompt;

    return {
      status: true,
      message: {
        estimationCost: totalEstimatedCostTokens,
      },
    };
  } catch (err) {
    return {
      status: false,
      message: err.message,
    };
  }
};

module.exports = { handleAuditContract, handleCostEstimation };
