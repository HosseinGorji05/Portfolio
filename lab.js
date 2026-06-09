(function () {
  function focusConcierge() {
    var labSection = document.getElementById("lab");
    if (labSection) {
      labSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setTimeout(function () {
      var input = document.querySelector(".chat-compose input");
      if (input) input.focus();
    }, 420);
  }

  function showChatNudge() {
    var key = "portfolio-chat-nudge-v1-session-dismissed";
    try {
      if (sessionStorage.getItem(key) === "true") return;
    } catch (e) {}

    var nudge = document.createElement("div");
    nudge.className = "chat-nudge";
    nudge.setAttribute("role", "status");
    nudge.innerHTML =
      '<div class="chat-nudge-title">Quick Tip</div>' +
      '<div class="chat-nudge-text">Try the AI Concierge in the Lab section. Ask about projects, stack, or how to contact me.</div>' +
      '<div class="chat-nudge-actions">' +
      '<button type="button" class="chat-nudge-btn primary" data-nudge="open">Talk to Concierge</button>' +
      '<button type="button" class="chat-nudge-btn" data-nudge="dismiss">Dismiss</button>' +
      "</div>";
    document.body.appendChild(nudge);

    function dismiss(markSeen) {
      nudge.classList.remove("show");
      setTimeout(function () {
        if (nudge.parentNode) nudge.parentNode.removeChild(nudge);
      }, 220);
      if (markSeen) {
        try {
          sessionStorage.setItem(key, "true");
        } catch (e) {}
      }
    }

    nudge.addEventListener("click", function (event) {
      var target = event.target;
      if (!(target instanceof HTMLElement)) return;
      var action = target.getAttribute("data-nudge");
      if (action === "open") {
        dismiss(true);
        focusConcierge();
      } else if (action === "dismiss") {
        dismiss(true);
      }
    });

    setTimeout(function () {
      nudge.classList.add("show");
    }, 900);
  }

  function composeConciergeReply(prompt) {
    var text = prompt.toLowerCase().trim();
    if (!text) return "Type a question and I will answer from this portfolio.";

    var intents = [
      {
        keys: ["kolbeh", "restaurant", "production", "deploy", "deployed", "real user", "live app", "freelance", "qr"],
        answer:
          "Kolbeh is my production restaurant platform (May 2025–Present) for a family business in Iran, used via QR-code menu scanning. It uses Node.js, Express, SQLite3, bcrypt auth, role-based access, favorites, and secured REST APIs with parameterized queries and CORS.",
      },
      {
        keys: ["delatio", "nvidia", "edge", "geopandas", "gis", "spark"],
        answer:
          "At NVIDIA Spark Hack Toronto (May 2026), I co-developed Delatio — a local-first edge-compute urban risk intelligence platform on a Grace Blackwell GB100 node with dual AI loops, GeoPandas spatial queries under 20 ms, and zero cloud dependencies.",
      },
      {
        keys: ["potluck", "hackathon", "firebase", "ui", "ux", "team", "lead"],
        answer:
          "At CTRL+HACK+DEL (Feb 2026), I was Lead UI/UX Developer and Git specialist on Potluckio — a real-time group meal-planning app with live item-claiming via Firebase Firestore. I owned frontend design and Git workflow for a two-person team.",
      },
      {
        keys: ["stack", "tech", "technologies", "tools", "backend", "frontend", "database"],
        answer:
          "Core stack: JavaScript, Python, Node.js, Express, REST APIs, SQLite3/MySQL, Firebase Firestore, React, GeoPandas/GIS, Docker, Git/GitHub, and Linux. I work across full-stack and data-driven projects.",
      },
      {
        keys: ["project", "projects", "built", "build", "portfolio", "work"],
        answer:
          "Three highlighted projects: Delatio (NVIDIA edge-compute hackathon, May 2026), Potluckio (real-time meal planning, Feb 2026), and Kolbeh (production restaurant platform, May 2025–Present).",
      },
      {
        keys: ["intern", "internship", "co-op", "coop", "hire", "hiring", "available", "opportunity"],
        answer:
          "I am seeking a Winter 2027 software development internship and can contribute across frontend, backend, debugging, and team collaboration in the Greater Toronto Area.",
      },
      {
        keys: ["contact", "email", "linkedin", "reach", "call", "phone", "message"],
        answer:
          "Contact me at hoseingorji1383@gmail.com, +1 416 662 4071, or linkedin.com/in/hossein-gorji-745488281.",
      },
      {
        keys: ["hello", "hi", "hey", "who are you", "introduce", "about you"],
        answer:
          "I am Hossein's AI concierge. I can summarize projects, stack, experience, and hiring availability.",
      },
    ];

    var best = null;
    intents.forEach(function (intent) {
      var score = intent.keys.reduce(function (total, keyword) {
        return total + (text.includes(keyword) ? 1 : 0);
      }, 0);
      if (!best || score > best.score) {
        best = { score: score, intent: intent };
      }
    });

    if (best && best.score > 0) return best.intent.answer;

    return (
      "I can help with projects, tech stack, deployment details, internships, or contact info. " +
      "Try: 'How can I contact you?'"
    );
  }

  function bootLab() {
    var mount = document.getElementById("innovation-lab-root");
    if (!mount || !window.React || !window.ReactDOM || mount.dataset.mounted === "true") return;
    mount.dataset.mounted = "true";

    var h = React.createElement;
    var useState = React.useState;
    var QUICK_PROMPTS = [
      "What did you deploy in production?",
      "What is your stack?",
      "Are you available for internships?",
      "How can I contact you?",
    ];

    function LabApp() {
      var _useState = useState([
          {
            role: "assistant",
            text: "Hi, I am Hossein's AI Concierge. Ask about projects, stack, internships, or contact details.",
          },
        ]),
        messages = _useState[0],
        setMessages = _useState[1];
      var _useState2 = useState(""),
        input = _useState2[0],
        setInput = _useState2[1];

      function sendPrompt(promptText) {
        var trimmed = promptText.trim();
        if (!trimmed) return;
        var reply = composeConciergeReply(trimmed);
        setMessages(function (prev) {
          return prev
            .concat([{ role: "user", text: trimmed }, { role: "assistant", text: reply }])
            .slice(-10);
        });
      }

      function sendMessage() {
        var trimmed = input.trim();
        if (!trimmed) return;
        sendPrompt(trimmed);
        setInput("");
      }

      return h(
        "div",
        { className: "lab-grid lab-grid-single" },
        h(
          "div",
          { className: "lab-card" },
          h("h3", null, "AI Concierge"),
          h(
            "p",
            { className: "lab-subtitle" },
            "Ask about projects, stack, internships, and how to contact Hossein.",
          ),
          h(
            "div",
            { className: "quick-prompts" },
            QUICK_PROMPTS.map(function (promptText, idx) {
              return h(
                "button",
                {
                  key: idx,
                  type: "button",
                  className: "quick-prompt-btn",
                  onClick: function () {
                    sendPrompt(promptText);
                  },
                },
                promptText,
              );
            }),
          ),
          h(
            "div",
            { className: "chat-thread" },
            messages.map(function (message, idx) {
              return h("div", { key: idx, className: "chat-msg " + message.role }, message.text);
            }),
          ),
          h(
            "div",
            { className: "chat-compose" },
            h("input", {
              value: input,
              placeholder: "Ask: What did you deploy? How can I contact you?",
              onChange: function (event) {
                setInput(event.target.value);
              },
              onKeyDown: function (event) {
                if (event.key === "Enter") sendMessage();
              },
            }),
            h("button", { type: "button", onClick: sendMessage }, "Send"),
          ),
        ),
      );
    }

    var root = ReactDOM.createRoot(mount);
    root.render(h(LabApp));
    showChatNudge();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootLab);
  } else {
    bootLab();
  }
})();
