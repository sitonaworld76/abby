// 1. Get a free access key at web3forms.com (just enter your email). Paste it here.
const EMAIL_KEY = "a3052bc4-2d64-4023-a58c-14e9df4d884d";
// 2. Backup: your WhatsApp number, country code first, no + or spaces (e.g. 447123456789)
const MY_NUMBER = "447766746105";

const cards = document.querySelectorAll(".dress");
const size = document.getElementById("size");
const note = document.getElementById("note");
const send = document.getElementById("send");
const chosen = document.getElementById("chosen");
const msg = document.getElementById("msg");
let pick = null;

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
    msg.textContent = "";
    update();
  });
});
size.addEventListener("change", update);

function summary() {
  let text = "Abby picked the " + pick.dataset.colour + " " + pick.dataset.name + ", size " + size.value + ".";
  if (note.value.trim()) text += "\n\nHer note: " + note.value.trim();
  return text;
}

function openWhatsApp() {
  const text = "Hey! I picked the " + pick.dataset.colour + " " + pick.dataset.name + ", size " + size.value + " ✨" +
    (note.value.trim() ? "\n\n" + note.value.trim() : "");
  window.location.href = "https://wa.me/" + MY_NUMBER + "?text=" + encodeURIComponent(text);
}

document.getElementById("form").addEventListener("submit", async e => {
  e.preventDefault();
  if (!pick || !size.value) return;

  send.disabled = true;
  msg.className = "msg";
  msg.textContent = "Sending...";

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        access_key: EMAIL_KEY,
        subject: "Abby picked her birthday dress! 🎂",
        from_name: "For Abby",
        dress: pick.dataset.colour + " " + pick.dataset.name,
        size: size.value,
        message: summary()
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    msg.textContent = "Locked in! Can't wait to see you in it, birthday girl ✨";
    msg.className = "msg ok";
  } catch (err) {
    console.error("Email failed:", err);
    msg.textContent = "Opening WhatsApp instead... just hit send ♥";
    msg.className = "msg ok";
    openWhatsApp();
  }
  send.disabled = false;
});

update();
