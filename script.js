async function getSong() {
    let a = await fetch("http://127.0.0.1:5501/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

const playaudio = (track) => {
    let audio = new Audio("songs/" + track); // no leading slash
    audio.play().catch(err => console.log("Playback error:", err));
    
}

async function main() {
    let songs = await getSong();
    console.log(songs);
    let songul = document.querySelector(".songlist ul");

    for (const song of songs) {
        songul.innerHTML += `
            <li>
                <div class="songcard">
                    <img src="images/music-note-03-Stroke-Rounded.png" alt="">
                    <img src="images/previous-Stroke-Rounded.png" alt="">
                    <img src="images/play-Stroke-Rounded.png" alt="">
                    <img src="images/next-Stroke-Rounded.png" alt="">
                </div>
                ${song.replaceAll("%20", " ")}
            </li>`;
    }
    let currentAudio=null
    function playaudio(track) {
        if (currentAudio) currentAudio.pause();
        currentAudio = new Audio("songs/" + track);
        currentTrack = track;

        // Update song name
        document.querySelector(".songinfo").textContent = track.replaceAll("%20", " ");

        // Update total duration when ready
        currentAudio.addEventListener("loadedmetadata", () => {
            const duration = formatTime(currentAudio.duration);
            document.querySelector(".time").textContent = `00:00 / ${duration}`;
        });

        // Update current time during playback
        currentAudio.addEventListener("timeupdate", () => {
            const current = formatTime(currentAudio.currentTime);
            const total = formatTime(currentAudio.duration);
            document.querySelector(".time").textContent = `${current} / ${total}`;
        });

        currentAudio.play();
    }

    Array.from(songul.getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", () => {
            let track = e.innerText.trim();
            console.log("Playing:", track);
            playaudio(track);
        });
    });
    const playBtn=document.querySelector(".play img");
    if(playBtn){
        playBtn.addEventListener("click",()=>{
            if (!currentAudio) {
                // play the first song if nothing has started
                if (songs.length > 0) playAudio(songs[0]);
                return;}
            if(currentAudio.paused){
                currentAudio.play();
                playBtn.src="images/Pause.png"

            }
            else{
                currentAudio.pause();
                 playBtn.src="images/play-Stroke-Rounded.png"
                
            }
        })
    }
}

main();
// function formatTime(seconds) {
//     if (isNaN(seconds) || seconds < 0) return "00:00";
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
// }

// async function getSong() {
//     let a = await fetch("http://127.0.0.1:5501/songs/");
//     let response = await a.text();
//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let as = div.getElementsByTagName("a");
//     let songs = [];
//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         if (element.href.endsWith(".mp3")) {
//             songs.push(element.href.split("/songs/")[1]);
//         }
//     }
//     return songs;
// }

// async function main() {
//     let songs = await getSong();
//     playaudio(songs[0],true)
//     console.log("Songs:", songs);
//     let songul = document.querySelector(".songlist ul");

//     // Populate song list
//     for (const song of songs) {
//         songul.innerHTML += `
//             <li>
//                 <div class="songcard">
//                     <img src="images/music-note-03-Stroke-Rounded.png" alt="">
//                     <img src="images/previous-Stroke-Rounded.png" alt="">
//                     <img src="images/play-Stroke-Rounded.png" alt="">
//                     <img src="images/next-Stroke-Rounded.png" alt="">
//                 </div>
//                 ${song.replaceAll("%20", " ")}
//             </li>`;
//     }

//     let currentAudio = null;
//     let currentTrack = null;

//     // Format time helper
//     function formatTime(seconds) {
//         if (isNaN(seconds)) return "00:00";
//         const mins = Math.floor(seconds / 60);
//         const secs = Math.floor(seconds % 60);
//         return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
//     }

//     function playaudio(track) {
//         if (currentAudio) currentAudio.pause();
//         currentAudio = new Audio("songs/" + track);
//         currentTrack = track;

//         // Update song name
//         document.querySelector(".songinfo").textContent = track.replaceAll("%20", " ");

//         // Update total duration when ready
//         currentAudio.addEventListener("loadedmetadata", () => {
//             const duration = formatTime(currentAudio.duration);
//             document.querySelector(".time").textContent = `00:00 / ${duration}`;
//         });

//         // Update current time during playback
//         currentAudio.addEventListener("timeupdate", () => {
//             const current = formatTime(currentAudio.currentTime);
//             const total = formatTime(currentAudio.duration);
//             document.querySelector(".time").textContent = `${current} / ${total}`;
//             console.log(currentAudio.currentTime,currentAudio.duration)
            
//         });

//         currentAudio.play();
//     }

//     // Play when clicking a song
//     Array.from(songul.getElementsByTagName("li")).forEach((e) => {
//         e.addEventListener("click", () => {
//             let track = e.innerText.trim();
//             console.log("Playing:", track);
//             playaudio(track);
//         });
//     });

//     // Play/pause main button
//     const playBtn = document.querySelector(".play img");
//     if (playBtn) {
//         playBtn.addEventListener("click", () => {
//             if (!currentAudio) {
//                 if (songs.length > 0) playaudio(songs[0]);
//                 return;
//             }

//             if (currentAudio.paused) {
//                 playBtn.src = "images/Pause.png";
//                 currentAudio.play();
//             } else {
//                 currentAudio.pause();
//                 playBtn.src = "images/play-Stroke-Rounded.png";
//             }
//         });
//     }
  
// }

// main();
