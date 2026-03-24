const API_KEY = "AIzaSyCQEwQmMocqsXCtwZDHrKeLtzZtIIkgnBM";

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

const chatMessage = document.getElementById("chat-message");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

async function generateResponse(prompt) {
  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: "post",
    header: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to generate response");
  }
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
function cleanMarkdown(text) {
  return text
    .replace(/#{1,6}\s?/g, "")
    .replace(/\*\*/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function addMessage(message, isUser) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  messageElement.classList.add(isUser ? "user-messag" : "bot-message");

  const profileImage = document.createElement("img");
  profileImage.classList.add("profileImage");

  profileImage.src = isUser ? "user.jpg" : "bot.jpg";

  profileImage.alt = isUser ? "user" : "bot";

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");

  messageContent.textContent = message;

  messageElement.appendChild(profileImage);
  messageElement.appendChild(messageContent);
  chatMessage.appendChild(messageElement);
  chatMessage.scrollTop = chatMessage.scrollHeight;
}

async function handelUserInput() {
  const userMessage = userInput.value.trim();
  if (userMessage) {
    addMessage(userMessage, true);
    userInput.value = "";
    sendButton.disabled = true;
    userInput.disabled = true;
  }

  try {
    const botMessage = await generateResponse(userMessage);
    userMessage;
    addMessage(cleanMarkdown(botMessage), false);
  } catch (error) {
    console.error(error);
    addMessage("Sorry I am unable to give response, please try again later");
  } finally {
    sendButton.disabled = false;
    userInput.disabled = false;
    userInput.focus();
  }
}

sendButton.addEventListener("click", handelUserInput);

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();

    handelUserInput();
  }
});
