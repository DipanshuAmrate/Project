// dashboard.js

const $ = (id) => document.getElementById(id);
let currentApiData = null;

// -------------------------
// Chat Message Bubbles
// -------------------------
function addChatBubble(msg, type = "info") {
    const chat = $("chatMessages");
    const div = document.createElement("div");
    div.className =
        "chat-bubble p-4 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border";

    div.innerHTML = `
        <div class="flex items-start gap-3">
            <span class="text-sm text-gray-700 dark:text-gray-300">${msg}</span>
        </div>
    `;

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

// -------------------------
// Steps UI Update
// -------------------------
function updateStep(step, status) {
    const block = $("step" + step);
    const circle = block.querySelector("div");
    const text = block.querySelector("span");

    if (status === "active") {
        circle.innerHTML = `<div class="spinner"></div>`;
        circle.className =
            "w-8 h-8 rounded-full border-2 border-blue-500 flex items-center justify-center";
        text.className = "text-sm text-blue-400 font-medium";
    }

    if (status === "complete") {
        circle.innerHTML = `
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>`;

        circle.className =
            "w-8 h-8 rounded-full bg-green-600 flex items-center justify-center";
        text.className = "text-sm text-green-400 font-medium";
    }
}

function setStatus(text, progress) {
    $("statusText").textContent = text;
    $("progressFill").style.width = progress + "%";
}

function setLoading(loading) {
    const btn = $("startButton");
    if (loading) {
        btn.innerHTML = `<div class="flex items-center gap-2"><div class="spinner"></div> Scraping...</div>`;
        btn.disabled = true;
    } else {
        btn.innerHTML = "Start Scraping";
        btn.disabled = false;
    }
}

// -------------------------
// Main Scraping Logic
// -------------------------
async function startScraping() {
    const url = $("urlInput").value.trim();
    const query = $("queryInput").value.trim();

    if (!url || !query) return alert("❗ Enter URL & description.");

    $("progressSection").style.display = "block";
    $("chatSection").style.display = "block";
    $("apiSection").style.display = "none";
    $("apiDetailSection").style.display = "none";
    $("chatMessages").innerHTML = "";

    setLoading(true);

    addChatBubble("🚀 Scraping request received");
    addChatBubble("🌐 URL: " + url);
    addChatBubble("📝 Query: " + query);

    updateStep(1, "active");
    await sleep(1000);
    updateStep(1, "complete");

    updateStep(2, "active");
    setStatus("Exploring website…", 30);
    await sleep(1200);
    updateStep(2, "complete");

    updateStep(3, "active");
    setStatus("Generating APIs…", 60);

    // -----------------------------
    // Backend Call
    // -----------------------------
    let res;
    try {
        const res = await fetch("http://localhost:3000/api/generate-apis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, description: query })
        });
    } catch (err) {
        addChatBubble("❌ Server connection failed.", "error");
        setLoading(false);
        return;
    }

    const data = await res.json();
    currentApiData = data;

    // -----------------------------
    // Completed
    // -----------------------------
    updateStep(3, "complete");
    setStatus("Complete!", 100);

    addChatBubble("✅ APIs generated!", "success");
    addChatBubble("📦 " + data.apis.length + " endpoints created");

    displayAPI(data.apis);
    showDetailedApiSchemas(data.apis);

    $("apiSection").style.display = "block";
    $("apiDetailSection").style.display = "block";

    setLoading(false);
}

// -------------------------
// Display API List
// -------------------------
function displayAPI(apis) {
    const box = $("apiEndpoints");
    box.innerHTML = "";

    apis.forEach((api) => {
        box.innerHTML += `
      <div class="api-card">
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2 py-1 text-xs bg-green-800/20 text-green-400 rounded">
            ${api.method}
          </span>
          <code>${api.path}</code>
        </div>
        <p class="text-sm text-gray-400">${api.description}</p>
      </div>
    `;
    });
}

// -------------------------
// Detailed JSON Blocks
// -------------------------
function showDetailedApiSchemas(apis) {
    const container = $("apiDetailSection");
    container.innerHTML = "";
    container.style.display = "block";

    apis.forEach((api, index) => {
        const block = document.createElement("div");
        block.className =
            "bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-6";

        block.innerHTML = `
            <div class="mb-4">
                <h2 class="text-xl font-bold flex items-center gap-2">
                    <span class="text-2xl">${index + 1}.</span>
                    <span class="px-2 py-1 text-xs bg-green-800/20 text-green-400 rounded">${api.method}</span>
                    <span>${api.name}()</span>
                </h2>
                <p class="mt-1 text-gray-600 dark:text-gray-400">${api.description}</p>
            </div>

            <h3 class="font-semibold mb-2">Schema (JSON)</h3>
            <textarea class="w-full p-3 bg-gray-50 dark:bg-dark-bg border rounded-lg text-sm h-32 font-mono">
${JSON.stringify(api.sampleResponse, null, 2)}
            </textarea>

            <h3 class="font-semibold mt-4 mb-2">Sample Value (JSON)</h3>
            <textarea class="w-full p-3 bg-gray-50 dark:bg-dark-bg border rounded-lg text-sm h-32 font-mono">
${JSON.stringify(api.sampleResponse, null, 2)}
            </textarea>
        `;

        container.appendChild(block);
    });
}

// -------------------------
function downloadJSON() {
    const blob = new Blob([JSON.stringify(currentApiData, null, 2)], {
        type: "application/json"
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "api-schema.json";
    link.click();
}

function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

// -------------------------
// Dark Mode FIXED ✔
// -------------------------

document.getElementById("darkModeToggle").addEventListener("click", () => {
    const html = document.documentElement;

    html.classList.toggle("dark");

    // Save mode in localStorage
    localStorage.setItem(
        "darkMode",
        html.classList.contains("dark") ? "enabled" : "disabled"
    );
});

// Load saved theme on page load
if (localStorage.getItem("darkMode") === "enabled") {
    document.documentElement.classList.add("dark");
}
// ----------------------------------------------------
// MERGED: JSON Generator Feature (FIXED & IMPROVED)
// ----------------------------------------------------

function createSlugFromUrl(url) {
    try {
        const u = new URL(url);
        return u.hostname.replace(/^www\./, "");
    } catch (e) {
        return url.replace(/^https?:\/\//, "").split("/")[0] || "api";
    }
}

function generateApiJson(websiteUrl, description) {
    const now = new Date().toISOString();
    const slug = createSlugFromUrl(websiteUrl);

    return {
        meta: {
            name: slug + "-api",
            sourceUrl: websiteUrl,
            description,
            generatedAt: now,
            version: "1.0.0",
        },
        auth: {
            type: "none",
            note: "This is a template. Add real authentication in backend.",
        },
        endpoints: [
            {
                id: "meta",
                method: "GET",
                path: "/meta",
                description: "Returns metadata of the website.",
                responseExample: {
                    title: "Example Title",
                    url: websiteUrl,
                }
            },
            {
                id: "items",
                method: "GET",
                path: "/items",
                description: "Returns a list of items.",
                responseExample: {
                    items: [
                        { id: 1, name: "Example item" }
                    ]
                }
            },
        ],
        notes: "Generated locally using URL & description."
    };
}


// ----------------------------
// Local JSON Generator Handler
// ----------------------------
function generateLocalJson() {
    // ⬅ FIXED: Pull values directly from the visible inputs
    const url = document.getElementById("urlInput").value.trim();
    const desc = document.getElementById("queryInput").value.trim();
    
    const output = document.getElementById("localJsonOutput");
    const box = document.getElementById("localJsonBox");

    if (!url || !desc) {
        alert("Please enter both URL and Description.");
        return;
    }

    const jsonData = generateApiJson(url, desc);
    output.value = JSON.stringify(jsonData, null, 2);

    // Show JSON box
    box.classList.remove("hidden");

    // Enable buttons
    document.getElementById("downloadJsonLocal").disabled = false;
    document.getElementById("copyJsonLocal").disabled = false;
}


// ----------------------------
// Download JSON (Local)
// ----------------------------
function downloadLocalJson() {
    const content = document.getElementById("localJsonOutput").value;
    if (!content) return;

    const blob = new Blob([content], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "generated-api.json";
    link.click();
}


// ----------------------------
// Copy JSON (Local)
// ----------------------------
function copyLocalJson() {
    const content = document.getElementById("localJsonOutput").value;
    if (!content) return;

    navigator.clipboard.writeText(content)
        .then(() => alert("JSON copied to clipboard ✅"))
        .catch(() => alert("Copy failed ❌"));
}
