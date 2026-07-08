/* ------------------------------------------------------------------ *
 * Interactive portfolio terminal — hand-written, no framework.
 * Commands, history (Up/Down), Tab completion.
 * ------------------------------------------------------------------ */
(function () {
  "use strict";

  var PROMPT = "visitor@hossein:~$";

  // --- Content (single source of truth for the terminal) -------------
  var PROJECTS = {
    executo: {
      title: "Executo — self-correcting code agent",
      meta: "Solo · Personal · June 2026",
      body:
        "Self-correcting Python code-generation agent using LangGraph and Llama 3.1 8B\n" +
        "(via Groq). Generates code and unit tests from plain-English prompts, executes\n" +
        "in an isolated Docker sandbox (no network, capped CPU/RAM), iterates up to 4\n" +
        "attempts until AI-generated and HumanEval tests both pass.\n" +
        "80% strict pass rate on 30-task HumanEval sample (~1.5 attempts/solved task).\n" +
        "stack: Python · LangGraph · Docker · Llama 3.1 8B · HumanEval",
      url: "https://github.com/HosseinGorji05/Executo",
    },
    delatio: {
      title: "Delatio — edge-compute urban risk intelligence",
      meta: "GIS & Spatial Systems · NVIDIA Spark Hack Toronto · May 2026",
      body:
        "Owned the GIS data layer for a 5-person team. Local-first platform with dual\n" +
        "proactive/reactive AI loops on a single NVIDIA Grace Blackwell GB10 node — zero\n" +
        "cloud. Transformed Toronto Open Data into in-memory GeoPandas with spatial\n" +
        "queries under 20 ms.\n" +
        "stack: Python · GeoPandas · GIS · Edge Compute",
      url: "https://github.com/AdrianShah/NVIDIA-SparkHacks",
    },
    kolbeh: {
      title: "Kolbeh — live restaurant platform [in production]",
      meta: "Freelance · Client in Iran · May 2025 – Jun 2026",
      body:
        "Fully responsive restaurant site — primary digital storefront for a live family\n" +
        "business in Iran, used via QR-code menu scanning. Node.js + Express on SQLite3\n" +
        "(30+ items), bcrypt auth, role-based access, favorites; REST secured with\n" +
        "parameterized queries, input sanitization, and CORS.\n" +
        "stack: Node.js · Express · SQLite3 · bcrypt · CORS",
      url: "https://hosseingorji05.github.io/restaurant-website/",
    },
    potluckio: {
      title: "Potluckio — real-time group meal planning",
      meta: "UI/UX Lead & Git · CTRL+HACK+DEL · Feb 2026",
      body:
        "Real-time group meal-planning app with live item-claiming via Firebase Firestore\n" +
        "through a shared link. Owned frontend design and Git workflow as one of two\n" +
        "developers — shipped a publicly demo-able product before the deadline.\n" +
        "stack: JavaScript · Firestore · UI/UX · Git",
      url: "https://adrianshah.github.io/CTRL-DEL-HACK-2.0---Potluck-App./index.html",
    },
  };

  var SKILLS = [
    ["Languages", "JavaScript (ES6+), Python, Java, SQL, C, Bash, HTML5, CSS3"],
    ["Frontend", "Tailwind CSS, Responsive Design, CSS Grid/Flexbox, Async JS"],
    ["AI & ML", "LangGraph, LLM Prompt Engineering, Agentic Systems, HumanEval"],
    ["Backend", "Node.js, Express, REST APIs, CRUD, bcrypt, CORS, Input Sanitization"],
    ["Databases", "Supabase, Firebase Firestore, MySQL, SQLite3, Relational Schema Design"],
    ["Infra", "Cursor, Docker, Git/GitHub, GeoPandas, GIS, Linux, npm, VS Code"],
  ];

  var LINKS = {
    email: "mailto:hoseingorji1383@gmail.com",
    github: "https://github.com/HosseinGorji05",
    linkedin: "https://www.linkedin.com/in/hossein-gorji-745488281",
    resume: "hosseinupdated.pdf",
  };

  // --- Tiny DOM helpers ----------------------------------------------
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function boot() {
    var root = document.getElementById("terminal-root");
    if (!root || root.dataset.mounted === "true") return;
    root.dataset.mounted = "true";
    root.innerHTML = "";

    // ---- Window chrome ----
    var win = el("div", "term");
    var bar = el("div", "term-bar");
    var dots = el("div", "term-dots");
    ["r", "y", "g"].forEach(function (c) {
      dots.appendChild(el("span", "term-dot " + c));
    });
    bar.appendChild(dots);
    bar.appendChild(el("span", "term-title", "hossein.gorji — zsh"));
    win.appendChild(bar);

    var screen = el("div", "term-screen");
    win.appendChild(screen);

    // ---- Input line ----
    var line = el("form", "term-line");
    var label = el("span", "term-prompt", PROMPT);
    var input = el("input", "term-input");
    input.setAttribute("type", "text");
    input.setAttribute("autocomplete", "off");
    input.setAttribute("autocapitalize", "off");
    input.setAttribute("autocorrect", "off");
    input.setAttribute("spellcheck", "false");
    input.setAttribute("aria-label", "Terminal input");
    line.appendChild(label);
    line.appendChild(input);
    win.appendChild(line);

    root.appendChild(win);

    var history = [];
    var histIndex = -1;

    function scrollDown() {
      screen.scrollTop = screen.scrollHeight;
    }

    function printEcho(cmd) {
      var row = el("div", "term-row term-echo");
      row.appendChild(el("span", "term-prompt", PROMPT));
      row.appendChild(el("span", "term-cmd", " " + cmd));
      screen.appendChild(row);
    }

    function printBlock(text, cls) {
      var pre = el("pre", "term-out " + (cls || ""));
      pre.textContent = text;
      screen.appendChild(pre);
    }

    function printNode(node) {
      screen.appendChild(node);
    }

    // ---- Commands -----------------------------------------------------
    var COMMANDS = {
      help: function () {
        printBlock(
          "Available commands\n" +
            "  about              who I am, in one paragraph\n" +
            "  projects           list shipped projects\n" +
            "  open <name>        open a project / link in a new tab\n" +
            "  cat <name>         print details (executo, delatio, kolbeh, potluckio)\n" +
            "  skills             technical skills by area\n" +
            "  experience         work history\n" +
            "  education          academic background\n" +
            "  contact            email, phone, socials\n" +
            "  resume             download my résumé\n" +
            "  events             hackathons & events attended\n" +
            "  socials            github / linkedin / email links\n" +
            "  whoami             quick identity line\n" +
            "  clear              clear the screen\n" +
            "\nTip: use ↑ / ↓ for history, Tab to autocomplete."
        );
      },

      about: function () {
        printBlock(
          "Hossein Gorji — full-stack developer, Toronto.\n" +
            "BSc Honours CS @ York University, expected May 2028.\n" +
            "Ships real apps: restaurant platforms, self-correcting AI agents, edge GIS.\n" +
            "3rd of 20+ teams at Cursor Hackathon Toronto (Lens & Love, with Harshita Dhawan).\n" +
            "Recently visited Google Toronto HQ with GDG on Campus @ York.\n" +
            "Seeking co-op/internship 2026–2027."
        );
      },

      whoami: function () {
        printBlock("hossein.gorji · full-stack developer · co-op/internship 2026–2027");
      },

      projects: function () {
        var node = el("div", "term-out");
        Object.keys(PROJECTS).forEach(function (key) {
          var p = PROJECTS[key];
          var item = el("div", "term-listitem");
          var name = el("button", "term-linkbtn", "› " + key);
          name.addEventListener("click", function () {
            run("cat " + key);
          });
          item.appendChild(name);
          item.appendChild(el("span", "term-dim", "  " + p.title));
          node.appendChild(item);
        });
        node.appendChild(el("div", "term-dim", "\nTry: cat kolbeh   ·   open delatio"));
        printNode(node);
      },

      cat: function (args) {
        var key = (args[0] || "").toLowerCase();
        if (!key) return printBlock("usage: cat <executo|delatio|kolbeh|potluckio>", "warn");
        var p = PROJECTS[key];
        if (!p) return printBlock("cat: " + key + ": no such project. Try 'projects'.", "warn");
        var node = el("div", "term-out");
        node.appendChild(el("div", "term-strong", p.title));
        node.appendChild(el("div", "term-dim", p.meta));
        node.appendChild(el("pre", "term-body", p.body));
        var openBtn = el("button", "term-linkbtn", "open " + key + " ↗");
        openBtn.addEventListener("click", function () {
          window.open(p.url, "_blank", "noopener");
        });
        node.appendChild(openBtn);
        printNode(node);
      },

      open: function (args) {
        var key = (args[0] || "").toLowerCase();
        if (!key) return printBlock("usage: open <project|github|linkedin|email|resume>", "warn");
        if (PROJECTS[key]) {
          window.open(PROJECTS[key].url, "_blank", "noopener");
          return printBlock("opening " + key + " ↗");
        }
        if (LINKS[key]) {
          window.open(LINKS[key], key === "email" ? "_self" : "_blank", "noopener");
          return printBlock("opening " + key + " ↗");
        }
        printBlock("open: " + key + ": not found. Try 'projects' or 'socials'.", "warn");
      },

      skills: function () {
        var text = SKILLS.map(function (s) {
          return "  " + (s[0] + ":").padEnd(12) + s[1];
        }).join("\n");
        printBlock(text);
      },

      experience: function () {
        printBlock(
          "Freelance Web Developer — Kolbeh Restaurant (Remote, Iran)\n" +
            "  May 2025 – Jun 2026\n" +
            "  › Deployed a live restaurant site used via QR-code menu scanning.\n" +
            "  › Node.js + Express + SQLite3: 30+ items, bcrypt, RBAC, favorites.\n" +
            "  › Secured REST APIs with parameterized queries, sanitization, CORS.\n" +
            "\n" +
            "Hackathon highlights:\n" +
            "  › 3rd of 20+ teams — Cursor Hackathon Toronto (Lens & Love w/ Harshita Dhawan)\n" +
            "  › Google Toronto HQ visit — GDG on Campus @ York (Jul 2026)\n" +
            "  › GIS layer owner — Delatio, NVIDIA Spark Hack Toronto (May 2026)\n" +
            "  › UI/UX Lead — Potluckio, CTRL+HACK+DEL (Feb 2026)"
        );
      },

      education: function () {
        printBlock(
          "York University — Toronto, ON\n" +
            "  BSc Honours, Computer Science · expected May 2028\n" +
            "  Coursework: OOP (Java), DSA, Computer Architecture,\n" +
            "  Discrete Mathematics, Linear Algebra, Web Development (JS)\n" +
            "  Languages: English (full) · Persian (fluent)"
        );
      },

      contact: function () {
        var node = el("div", "term-out");
        node.appendChild(el("div", null, "email     hoseingorji1383@gmail.com"));
        node.appendChild(el("div", null, "phone     +1 416 662 4071"));
        var row = el("div", null);
        row.appendChild(document.createTextNode("links     "));
        ["github", "linkedin"].forEach(function (k, i) {
          var b = el("button", "term-linkbtn", k);
          b.addEventListener("click", function () {
            window.open(LINKS[k], "_blank", "noopener");
          });
          if (i) row.appendChild(document.createTextNode("  ·  "));
          row.appendChild(b);
        });
        node.appendChild(row);
        printNode(node);
      },

      socials: function () {
        var node = el("div", "term-out");
        [["github", LINKS.github], ["linkedin", LINKS.linkedin], ["email", LINKS.email]].forEach(
          function (pair) {
            var b = el("button", "term-linkbtn", "› " + pair[0]);
            b.addEventListener("click", function () {
              window.open(pair[1], pair[0] === "email" ? "_self" : "_blank", "noopener");
            });
            node.appendChild(b);
            node.appendChild(el("span", "term-dim", "  " + pair[1]));
            node.appendChild(document.createElement("br"));
          }
        );
        printNode(node);
      },

      resume: function () {
        var a = document.createElement("a");
        a.href = LINKS.resume;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        printBlock("downloading résumé… (hosseinupdated.pdf)");
      },

      events: function () {
        var list = window.PORTFOLIO_EVENTS;
        if (!list || !list.length) {
          return printBlock("No events loaded.", "warn");
        }
        var node = el("div", "term-out");
        list.forEach(function (ev) {
          node.appendChild(el("div", "term-strong", ev.title + "  (" + ev.date + ")"));
          node.appendChild(el("div", "term-dim", ev.badge + " · " + ev.meta));
          node.appendChild(el("pre", "term-body", ev.caption));
          node.appendChild(document.createElement("br"));
        });
        node.appendChild(el("div", "term-dim", "Photos: scroll to the Events section on the page."));
        printNode(node);
      },

      clear: function () {
        screen.innerHTML = "";
      },

      ls: function () {
        printBlock("about  projects  skills  experience  education  events  contact  resume");
      },

      sudo: function () {
        printBlock("nice try — you don't have permission to do that. (but I like the ambition)", "warn");
      },

      echo: function (args) {
        printBlock(args.join(" "));
      },
    };

    // command name list for autocomplete
    var NAMES = Object.keys(COMMANDS).concat(["socials"]);

    function run(raw) {
      var cmd = raw.trim();
      printEcho(cmd);
      if (!cmd) {
        scrollDown();
        return;
      }
      history.push(cmd);
      histIndex = history.length;

      var parts = cmd.split(/\s+/);
      var name = parts[0].toLowerCase();
      var args = parts.slice(1);

      if (COMMANDS[name]) {
        COMMANDS[name](args);
      } else {
        printBlock(
          "zsh: command not found: " + name + "\nType 'help' to see what I can do.",
          "warn"
        );
      }
      scrollDown();
    }

    // ---- Events -------------------------------------------------------
    line.addEventListener("submit", function (e) {
      e.preventDefault();
      var value = input.value;
      input.value = "";
      run(value);
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (histIndex > 0) {
          histIndex--;
          input.value = history[histIndex] || "";
          moveCaretEnd(input);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (histIndex < history.length - 1) {
          histIndex++;
          input.value = history[histIndex] || "";
        } else {
          histIndex = history.length;
          input.value = "";
        }
        moveCaretEnd(input);
      } else if (e.key === "Tab") {
        e.preventDefault();
        var frag = input.value.trim().toLowerCase();
        if (!frag) return;
        var matches = NAMES.filter(function (n) {
          return n.indexOf(frag) === 0;
        });
        if (matches.length === 1) {
          input.value = matches[0] + " ";
        } else if (matches.length > 1) {
          printEcho(input.value);
          printBlock(matches.join("   "));
          scrollDown();
        }
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        screen.innerHTML = "";
      }
    });

    // focus input when clicking anywhere in the window
    win.addEventListener("click", function (e) {
      if (window.getSelection && String(window.getSelection())) return;
      if (e.target.tagName !== "BUTTON" && e.target.tagName !== "A") input.focus();
    });

    function moveCaretEnd(node) {
      requestAnimationFrame(function () {
        var len = node.value.length;
        try {
          node.setSelectionRange(len, len);
        } catch (err) {}
      });
    }

    // ---- Boot sequence (typed) ---------------------------------------
    var bootLines = [
      { t: "$ ./hossein --intro", cls: "term-cmd" },
      { t: "booting portfolio shell…", cls: "term-dim" },
      { t: "Hossein Gorji · full-stack developer · Toronto", cls: "term-strong" },
      { t: "3rd @ Cursor Hackathon · Google Toronto visit · co-op 2026–2027", cls: "term-dim" },
      { t: "Type 'help' to explore, or click a suggestion below.", cls: "term-dim" },
    ];
    var i = 0;
    (function typeBoot() {
      if (i >= bootLines.length) {
        addSuggestions();
        return;
      }
      var b = bootLines[i++];
      printBlock(b.t, b.cls);
      scrollDown();
      setTimeout(typeBoot, 260);
    })();

    function addSuggestions() {
      var wrap = el("div", "term-suggest");
      ["help", "projects", "skills", "cat kolbeh", "events", "contact"].forEach(function (s) {
        var b = el("button", "term-chip", s);
        b.addEventListener("click", function () {
          run(s);
          input.focus();
        });
        wrap.appendChild(b);
      });
      printNode(wrap);
      scrollDown();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
