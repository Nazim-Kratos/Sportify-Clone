async function getSong() {
    let a = await fetch("./songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(element.href.split("/songs/")[1]));
        }
    }
    return songs;
}

function formatTime(sec) {
    if (isNaN(sec)) return "00:00";
    let m = Math.floor(sec / 60);
    let s = Math.floor(sec % 60);
    return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
}
async function main() {
    let songs = await getSong();
    let currentIndex = 0;
    let currentAudio = null;
    const songul = document.querySelector(".songlist ul");
    const searchBar = document.querySelector(".searchbar");
    const songInfo = document.querySelector(".songinfo");
    const playBtn = document.querySelector(".play img");
    const prevBtn = document.querySelector(".prev img");
    const nextBtn = document.querySelector(".next img");
    const timeDisplay = document.querySelector(".time");
    const seekBar = document.querySelector(".seekbar");
    const circle = document.querySelector(".circle");
    let isDragging = false;

    function renderSongs(songList) {
        songul.innerHTML = "";
        for (const song of songList) {
            songul.innerHTML += `
                <li data-song="${song}">
                    <div class="songcard">
                        <img src="images/music-note-03-Stroke-Rounded.png" class="song-image" alt="${song}" style="width:25px;cursor:pointer;margin-right:10px;">
                        ${song}
                    </div>
                </li>`;
        }
        Array.from(songul.getElementsByTagName("li")).forEach((li) => {
            li.addEventListener("click", () => {
                currentIndex = songs.indexOf(li.dataset.song);
                playAudio(songs[currentIndex]);
            });
        });
    }

    renderSongs(songs);

    function playAudio(track) {
        if (currentAudio) currentAudio.pause();
        currentAudio = new Audio("songs/" + track);
        songInfo.textContent = track;
        currentAudio.play();
        playBtn.src = "images/Pause.png";
        currentAudio.addEventListener("loadedmetadata", () => {
            timeDisplay.textContent = `00:00 / ${formatTime(currentAudio.duration)}`;
        });
        currentAudio.addEventListener("timeupdate", () => {
            if (!isDragging) {
                const current = currentAudio.currentTime;
                const total = currentAudio.duration;
                timeDisplay.textContent = `${formatTime(current)} / ${formatTime(total)}`;
                const progressPercent = (current / total) * 100;
                circle.style.left = `${progressPercent}%`;
            }
        });
        currentAudio.addEventListener("ended", () => {
            nextSong();
        });
    }

    function nextSong() {
        currentIndex = (currentIndex + 1) % songs.length;
        playAudio(songs[currentIndex]);
    }

    function prevSong() {
        currentIndex = (currentIndex - 1 + songs.length) % songs.length;
        playAudio(songs[currentIndex]);
    }

    playBtn.addEventListener("click", () => {
        if (!currentAudio) {
            playAudio(songs[currentIndex]);
            return;
        }
        if (currentAudio.paused) {
            currentAudio.play();
            playBtn.src = "images/Pause.png";
        } else {
            currentAudio.pause();
            playBtn.src = "images/play-Stroke-Rounded.png";
        }
    });

    nextBtn.addEventListener("click", nextSong);
    prevBtn.addEventListener("click", prevSong);

    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase().trim();
        if (query === "") {
            renderSongs(songs);
            return;
        }
        const matched = songs.filter(song => song.toLowerCase().includes(query));
        const unmatched = songs.filter(song => !song.toLowerCase().includes(query));
        renderSongs([...matched, ...unmatched]);
    });

    const cards = document.querySelectorAll(".card, .card1, .card2, .card3");
    cards.forEach(card => {
        const playIcon = card.querySelector(".play-button");
        const titleElement = card.querySelector(".songTitle");
        if (playIcon && titleElement) {
            playIcon.addEventListener("click", () => {
                const cardTitle = titleElement.innerText.toLowerCase().trim();
                const found = songs.find(song =>
                    song.toLowerCase().includes(cardTitle.split("(")[0].trim())
                );
                if (found) {
                    currentIndex = songs.indexOf(found);
                    playAudio(found);
                } else {
                    alert("This song is not available in your library!");
                }
            });
        }
    });

    seekBar.addEventListener("click", (e) => {
        if (!currentAudio) return;
        const rect = seekBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percent = Math.min(Math.max(clickX / width, 0), 1);
        currentAudio.currentTime = percent * currentAudio.duration;
    });

    circle.addEventListener("mousedown", (e) => {
        if (!currentAudio) return;
        isDragging = true;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging || !currentAudio) return;
        const rect = seekBar.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percent = Math.min(Math.max(offsetX / rect.width, 0), 1);
        circle.style.left = `${percent * 100}%`;
    });

    document.addEventListener("mouseup", (e) => {
        if (isDragging && currentAudio) {
            const rect = seekBar.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const percent = Math.min(Math.max(offsetX / rect.width, 0), 1);
            currentAudio.currentTime = percent * currentAudio.duration;
        }
        isDragging = false;
    });
   

}

main();
