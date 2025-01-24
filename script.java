const API_URL = 'http://localhost:3000/api';

document.getElementById('createChat').addEventListener('click', async () => {
  try {
    const response = await fetch(`${API_URL}/chats`, { method: 'POST' });
    const { chatId } = await response.json();
    
    const link = `${window.location.origin}/chat.html?chatId=${chatId}`;
    document.getElementById('generatedLink').innerHTML = `
      <p>انسخ الرابط وأرسله:</p>
      <input type="text" value="${link}" readonly>
    `;
  } catch (error) {
    console.error('Error creating chat:', error);
  }
});

window.sendMessage = async () => {
  try {
    const urlParams = new URL(window.location.href).searchParams;
    const chatId = urlParams.get('chatId');
    const messageInput = document.getElementById('messageInput');
    
    await fetch(`${API_URL}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: messageInput.value })
    });

    messageInput.value = '';
    await loadMessages();
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

async function loadMessages() {
  try {
    const urlParams = new URL(window.location.href).searchParams;
    const chatId = urlParams.get('chatId');
    const chatMessages = document.getElementById('chatMessages');

    const response = await fetch(`${API_URL}/chats/${chatId}/messages`);
    const messages = await response.json();

    chatMessages.innerHTML = messages.map(msg => `
      <div class="message">
        <p>${msg.message}</p>
        <small>${new Date(msg.timestamp).toLocaleString()}</small>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

if (window.location.pathname.endsWith('chat.html')) {
  loadMessages();
  setInterval(loadMessages, 3000);
}