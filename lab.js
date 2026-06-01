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
    var NUDGE_KEY = "portfolio-chat-nudge-v1-session-dismissed";
    try {
      if (sessionStorage.getItem(NUDGE_KEY) === "true") return;
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
          sessionStorage.setItem(NUDGE_KEY, "true");
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
    }, 950);
  }

  function composeConciergeReply(prompt) {
    var text = prompt.toLowerCase().trim();
    if (!text) return "Type a question and I will answer from this portfolio.";

    var intents = [
      {
        keys: ["incident", "outage", "latency", "error", "queue", "metrics", "status", "simulate"],
        answer:
          "I recently had an incident simulation demo in this lab, but this portfolio is now focused on the AI concierge. I can still walk you through how I debug production issues and prioritize fixes.",
      },
      {
        keys: ["restaurant", "production", "deploy", "deployed", "real user", "live app", "pizza"],
        answer:
          "My strongest project is a restaurant management platform deployed for a local business. It includes authentication, protected API routes, menu rendering, favorites, and persistent data with SQLite3.",
      },
      {
        keys: ["potluck", "hackathon", "firebase", "ui", "ux", "team", "lead"],
        answer:
          "At CTRL+HACK+DEL, I worked as Lead UI/UX Developer and Git specialist on Potluckio. I focused on interface quality, collaboration flow, and real-time item coordination with Firebase.",
      },
      {
        keys: ["stack", "tech", "technologies", "tools", "backend", "frontend", "database"],
        answer:
          "Core stack: JavaScript, Node.js, Express, REST APIs, SQLite/MySQL, Firebase, HTML/CSS, Git, and GitHub workflows. I work across full-stack architecture and delivery.",
      },
      {
        keys: ["project", "projects", "built", "build", "portfolio", "work"],
        answer:
          "I have three highlighted builds: Potluckio (hackathon real-time app), Restaurant Finder (team project with recommendations), and a production restaurant platform used by a local business.",
      },
      {
        keys: ["intern", "internship", "co-op", "coop", "hire", "hiring", "available", "opportunity"],
        answer:
          "I am actively seeking Summer 2026 internships/co-ops in software development, and I can contribute across frontend, backend, debugging, and team collaboration.",
      },
      {
        keys: ["contact", "email", "linkedin", "reach", "call", "phone"],
        answer:
          "Contact me at hoseingorji1383@gmail.com, +1 416 662 4071, or linkedin.com/in/hossein-gorji-745488281.",
      },
      {
        keys: ["hello", "hi", "hey", "who are you", "introduce", "about you"],
        answer:
          "I am Hossein's AI concierge. I can summarize his projects, stack, experience, and hiring availability.",
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

    if (best && best.score > 0) {
      return typeof best.intent.answer === "function"
        ? best.intent.answer()
        : best.intent.answer;
    }

    return (
      "I can help with projects, tech stack, production deployment, internship availability, or contact details. " +
      "Try: 'What did you deploy in production?'"
    );
  }

  function bootLab() {
    var mount = document.getElementById("innovation-lab-root");
    if (!mount || !window.React || !window.ReactDOM || mount.dataset.mounted === "true") {
      return;
    }
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
            text: "Hi, I am Hossein's AI Concierge. Ask me about projects, stack, internships, or how to contact Hossein.",
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
          h("p", { className: "lab-subtitle" }, "Ask about projects, stack, internships, and how to contact Hossein."),
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
              placeholder: "Ask: What did you deploy? How do you debug incidents?",
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
