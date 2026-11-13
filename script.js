// Web3Forms access key (sends the pick to your email)
const EMAIL_KEY = "a3052bc4-2d64-4023-a58c-14e9df4d884d";

const cards = document.querySelectorAll(".dress");
const size = document.getElementById("size");
const note = document.getElementById("note");
const send = document.getElementById("send");
const chosen = document.getElementById("chosen");
const msg = document.getElementById("msg");
let pick = null;
let sent = false;

function update() {
  cards.forEach(c => c.setAttribute("aria-pressed", c === pick ? "true" : "false"));
  if (pick) {
    chosen.innerHTML = "Ooh, <strong></strong>. Great taste (obviously).";
    chosen.querySelector("strong").textContent = pick.querySelector(".name").textContent;
  } else {
    chosen.textContent = "Nothing picked yet. Take your time, it's your day.";
  }
  send.disabled = !(pick && size.value);
}

cards.forEach(card => {
  card.addEventListener("click", () => {
    pick = card;
    if (!sent) msg.textContent = "";
    update();
  });
});
size.addEventListener("change", update);

document.getElementById("form").addEventListener("submit", async e => {
  e.preventDefault();
  if (!pick || !size.value) return;

  send.disabled = true;
  send.textContent = "Sending...";
  msg.className = "msg";
  msg.textContent = "";

  try {
    const dress = pick.dataset.colour + " " + pick.dataset.name;
    const noteText = note ? note.value.trim() : "";
    let text = "Abby picked the " + dress + ", size " + size.value + ".";
    if (noteText) text += "\n\nHer note: " + noteText;

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        access_key: EMAIL_KEY,
        subject: "Abby picked her birthday dress! 🎂",
        from_name: "For Abby",
        dress: dress,
        size: size.value,
        message: text
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Status " + res.status);

    sent = true;
    send.textContent = "Locked in ♥";
    msg.textContent = "Locked in! Can't wait to see you in it!";
    msg.className = "msg ok";
    return;
  } catch (err) {
    console.error("Email failed:", err);
    send.textContent = "Try again ♥";
    msg.textContent = "Hmm, that didn't go through. Check your signal and tap Try again. (" + err.message + ")";
  }
  send.disabled = false;
});

update();
