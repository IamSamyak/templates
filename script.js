const OWNER = "IamSamyak";
const REPO = "Algorithms";

async function searchFunction() {
  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("results");

  if (!query) {
    alert("Enter a function name");
    return;
  }

  resultsDiv.innerHTML = "Searching...";

  const searchUrl = `https://api.github.com/search/code?q=${query}+repo:${OWNER}/${REPO}+language:java`;

  try {
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    resultsDiv.innerHTML = "";

    if (!searchData.items || searchData.items.length === 0) {
      resultsDiv.innerHTML = "No results found.";
      return;
    }

    for (const item of searchData.items) {
      const fileRes = await fetch(item.url);
      const fileData = await fileRes.json();

      const decodedCode = atob(fileData.content);

      resultsDiv.innerHTML += `
        <div class="file-block">
          <h3>${item.path}</h3>
          <button class="copy-btn" onclick="copyCode(\`${escapeHtml(decodedCode)}\`)">
            Copy Code
          </button>
          <pre>${escapeHtml(decodedCode)}</pre>
        </div>
      `;
    }
  } catch (err) {
    resultsDiv.innerHTML = "Error fetching data.";
    console.error(err);
  }
}

function copyCode(code) {
  navigator.clipboard.writeText(code);
  alert("Code copied!");
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
