const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const usersList = document.getElementById("users");

const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

socket.on("message", (message) => {
  outMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Foydalanuvchilar ro'yxatini yangilash
socket.on("usersList", (users) => {
  updateUsersList(users);
});

// Foydalanuvchini qo'shilishi
socket.emit("join", { username });

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  // Xabarni serverga jo'natish
  socket.emit("chatMessage", msg);

  // Inputni tozalash
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>
  `;
  document.querySelector(".chat-messages").appendChild(div);
}
function updateUsersList(users) {
  usersList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user.username;
    usersList.appendChild(li);
  });
}
