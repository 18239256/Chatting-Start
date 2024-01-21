export default async function(config) {
    // Get robot name
    const RobotNameAPIUrl = config.apiHost + "/api/robot/robotinfor";
    const RobotAnswerAPIUrl = config.apiHost + "/api/embed";
    const response = await fetch(RobotNameAPIUrl, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      body: JSON.stringify({robotId: config.robotId}),
    });
    const robotData = await response.json();
    const robotName = robotData.name;
    
    document.head.insertAdjacentHTML('beforeend', '<link href="./tailwind.min.css" rel="stylesheet">');
    // Inject the CSS
    const style = document.createElement('style');
    style.innerHTML = `
    .hidden {
      display: none;
    }
    #chat-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      flex-direction: column;
    }
    #chat-popup {
      height: 70vh;
      max-height: 70vh;
      transition: all 0.3s;
      overflow: hidden;
    }
    @media (max-width: 768px) {
      #chat-popup {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        max-height: 100%;
        border-radius: 0;
      }
    }
    `;
  
    document.head.appendChild(style);
  
    // Create chat widget container
    const chatWidgetContainer = document.createElement('div');
    chatWidgetContainer.id = 'chat-widget-container';
    document.body.appendChild(chatWidgetContainer);
    
    // Inject the HTML
    chatWidgetContainer.innerHTML = `
      <div id="chat-bubble" class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer text-3xl">
        <svg viewBox="0 0 1280 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1680" width="36" height="36">
            <path d="M0 512v256c0 35.4 28.6 64 64 64h64V448H64c-35.4 0-64 28.6-64 64zM928 192H704V64c0-35.4-28.6-64-64-64s-64 28.6-64 64v128H352c-88.4 0-160 71.6-160 160v544c0 70.6 57.4 128 128 128h640c70.6 0 128-57.4 128-128V352c0-88.4-71.6-160-160-160zM512 832h-128v-64h128v64z m-64-240c-44.2 0-80-35.8-80-80s35.8-80 80-80 80 35.8 80 80-35.8 80-80 80z m256 240h-128v-64h128v64z m192 0h-128v-64h128v64z m-64-240c-44.2 0-80-35.8-80-80s35.8-80 80-80 80 35.8 80 80-35.8 80-80 80z m384-144h-64v384h64c35.4 0 64-28.6 64-64V512c0-35.4-28.6-64-64-64z"  fill="#ffffff">
            </path>
        </svg>
        </div>
      <div id="chat-popup" class="hidden absolute bottom-20 right-0 w-96 bg-white rounded-md shadow-md flex flex-col transition-all text-sm">
        <div id="chat-header" class="flex justify-between items-center p-4 bg-blue-600 text-white rounded-t-md">
          <h3 class="m-0 text-lg">${robotName}</h3>
          <button id="close-popup" class="bg-transparent border-none text-white cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div id="chat-messages" class="flex-1 p-4 overflow-y-auto"></div>
        <div id="chat-input-container" class="p-4 border-t border-gray-200">
          <div class="flex space-x-4 items-center">
            <input type="text" id="chat-input" class="flex-1 border border-gray-300 rounded-md px-4 py-2 outline-none w-3/4" placeholder="请输入您的问题...">
            <button id="chat-submit" class="bg-blue-600 text-white rounded-md px-4 py-2 cursor-pointer">提交</button>
          </div>
          <div class="flex text-center text-xs pt-4">
            <span class="flex-1">Prompted by <a href="/robots" target="_blank" class="text-indigo-600">@John</a></span>
          </div>
        </div>
      </div>
    `;
  
    // Add event listeners
    const chatInput = document.getElementById('chat-input');
    const chatSubmit = document.getElementById('chat-submit');
    const chatMessages = document.getElementById('chat-messages');
    const chatBubble = document.getElementById('chat-bubble');
    const chatPopup = document.getElementById('chat-popup');
    const closePopup = document.getElementById('close-popup');
  
    chatSubmit.addEventListener('click', function() {
      
      const message = chatInput.value.trim();
      if (!message) return;
      
      chatMessages.scrollTop = chatMessages.scrollHeight;
  
      chatInput.value = '';
  
      onUserRequest(message);
  
    });
  
    chatInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        chatSubmit.click();
      }
    });
  
    chatBubble.addEventListener('click', function() {
      togglePopup();
    });
  
    closePopup.addEventListener('click', function() {
      togglePopup();
    });
  
    function togglePopup() {
      const chatPopup = document.getElementById('chat-popup');
      chatPopup.classList.toggle('hidden');
      if (!chatPopup.classList.contains('hidden')) {
        document.getElementById('chat-input').focus();
      }
    }  
  
    function onUserRequest(message) {
      // Handle user request here
      console.log('User request:', message);
    
      // Display user message
      const messageElement = document.createElement('div');
      messageElement.className = 'flex justify-end mb-3';
      messageElement.innerHTML = `
        <div class="bg-blue-600 text-white rounded-lg py-2 px-4 max-w-[70%]">
          ${message}
        </div>
      `;
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    
      chatInput.value = '';

      // Call robot for answer
      fetch(RobotAnswerAPIUrl, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify({robot:robotData,message:message}),
      }).then(response => response.json()).then(data => reply(data.answer)); // Reply to the user
    }
    
    function reply(message) {
      const chatMessages = document.getElementById('chat-messages');
      const replyElement = document.createElement('div');
      replyElement.className = 'flex mb-3';
      replyElement.innerHTML = `
        <div class="bg-gray-200 text-black rounded-lg py-2 px-4 max-w-[70%]">
          ${message}
        </div>
      `;
      chatMessages.appendChild(replyElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
  };