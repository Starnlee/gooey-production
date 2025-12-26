const API_KEY = "YOUR_API_KEY_HERE";
const CHANNEL_ID = "UC5YlQLZ2Wn6lVevrD-yq0yg"; // example channel ID

// Fallback demo videos
const sampleVideos = [
  { title: "Epic Journey", year: 2024, genre: "Action", img: "https://images.unsplash.com/photo-1502139214987-0f9f0b4f2b3e?q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { title: "City of Lights", year: 2023, genre: "Drama", img: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?q=80", url: "https://www.youtube.com/watch?v=Zi_XLOBDo_Y" }
];

async function fetchVideos() {
  try {
    const resp = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=20`);
    const data = await resp.json();
    return data.items.map(v => ({
      title: v.snippet.title,
      year: new Date(v.snippet.publishedAt).getFullYear(),
      genre: "Uncategorized",
      img: v.snippet.thumbnails.high.url,
      url: `https://www.youtube.com/watch?v=${v.id.videoId}`
    }));
  } catch {
    return sampleVideos;
  }
}

function makeCard(item) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${item.img}" alt="${item.title}">
    <div class="play-overlay">
      <div class="play-btn"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
    </div>
    <div class="info">
      <strong>${item.title}</strong>
      <span class="small">${item.year} • ${item.genre}</span>
    </div>
  `;
  card.onclick = () => window.open(item.url, "_blank");
  return card;
}

async function initPage() {
  const container = document.getElementById("movies-row") || document.getElementById("series-row");
  if (!container) return;
  const videos = await fetchVideos();
  const years = [...new Set(videos.map(v => v.year))].sort((a, b) => b - a);
  const yearSelect = document.getElementById("yearFilter");
  if (yearSelect) years.forEach(y => {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  });

  function render() {
    const year = yearSelect?.value || "";
    const genre = document.getElementById("genreFilter")?.value || "";
    container.innerHTML = "";
    videos
      .filter(v => (!year || v.year == year) && (!genre || v.genre == genre))
      .forEach(v => container.appendChild(makeCard(v)));
  }

  yearSelect?.addEventListener("change", render);
  document.getElementById("genreFilter")?.addEventListener("change", render);
  render();
}

document.addEventListener("DOMContentLoaded", initPage);
