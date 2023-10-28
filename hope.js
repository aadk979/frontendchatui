const socket = io("https://fucking-hell.onrender.com"); // Initialize Socket.io

// Get DOM elements
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const chatMessages = document.getElementById("chat-messages");



// Get the username from local storage
const username = localStorage.getItem("user");
const liveusers = new Set();


if (!username){
    const uu = prompt("username: ");
    localStorage.setItem("user" , uu);
} 


setInterval(function(){
    socket.emit("onuser" , username);
},1000);

socket.on("usern", (t) =>{
    if (!liveusers.has(t)){
        liveusers.add(t);
        const umenu = document.getElementById("user-list");
        const dog = document.createElement("div");
        dog.id = t;
        dog.textContent = t;
        umenu.appendChild(dog);
    };
});

const logout = document.getElementById("logout");

logout.addEventListener("click" , function(){
    socket.emit("out" , username);
    liveusers.delete(username);

    setInterval(() => {
        socket.disconnect();
        window.location.href = "index2.html";
    }, 1000);
});

socket.on("out" , (w) =>{
    const todel = document.getElementById(w);
    todel.parentNode.removeChild(todel);
});

//console.log(username);

// Function to add a new message to the chat
function addMessage(sender, message) {
    // Scroll to the bottom of the chat before adding a new message
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container");

    const messageBubble = document.createElement("div");
    messageBubble.classList.add("message-bubble");
    let n = 6;
    if (sender === username) {
        while (n === 6){
            messageBubble.textContent = "You: " + message;
            n = 500;
        }
        setInterval(function(){
            n = 6;
        },100);
    } else {
        messageBubble.textContent = sender + ":: " + message;
    }

    messageContainer.appendChild(messageBubble);
    chatMessages.appendChild(messageContainer);
}

messageInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        const message = messageInput.value.trim();
        if (message !== "") {
            let xx = 5;
            while (xx === 5){
                addMessage(username, message); // Add "You" for the sender's message
                socket.emit("chat message", { username: username, message: message });
                messageInput.value = "";
                xx = 500;
            }
            setInterval(function(){xx = 5;},100);
        }
    }
});

sendButton.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message !== "") {
        addMessage(username, message); // Add "You" for the sender's message
        socket.emit("chat message", { username: username, message: message });
        messageInput.value = "";
    }
});

// Listen for incoming messages via Socket.io
socket.on("chat message", (data) => {
    let yy = 5;
    while (yy === 5 & data.username !== username){
        addMessage(data.username, data.message);
        yy = 500;
    }
    setInterval(function(){yy = 5;},100);
});

