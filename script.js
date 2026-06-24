const songs = [
    {
    title: "Dilwa Ke Chor",
    artist: "Swati Mishra",
    src: "Dilwa_ke_Chor___Bhojpuri_Song___Swati_Mishra(128k).mp3",
    cover: "Dilwa ke chor.png"
},
  {
    title: "Tohre Me Base Raja",
    artist: "Swati Mishra",
    src: "Tohre_Me_Base_Raja_Humro_Paranwa_Ho____Swati_Mishra_Bhojpuri(128k).mp3",
    cover: "Tohre me base raja.png"
},{
    title: "Love ke Ghoont",
    artist: "Swati Mishra",
    src: "Love_ke_Ghoont__Official_Bhojpuri_Song___Swati_Mishra___Mohit_Musik(128k).mp3",
    cover: "Love Ghoot.png"
},
{
    title: "KAUN_TUJHE",
    artist: "Sushant Singh Rajput, Disha Patani",
    src: "KAUN_TUJHE__Lyrical___M.S._DHONI_-THE_UNTOLD_STORY___Amaal_Mallik_Palak___Sushant_Singh_Disha_Patani(128k).mp3",
    cover: "Kaun Tujhe.png"
},
{
    title: "kahe_tose_sajna_2.0",
    artist: "Swati Mishra",
    src: "kahe_Tose_Sajna_2.0____Swati_Mishra(128k).mp3",
    cover: "Kahe to se sajna 2.0.png"
},
{
    title: "E_julmi_jamana",
    artist: "Pawan Singh",
    src: "E_julmi_jamana_sitam_ketno_dhai_Na_kbhu_e_duniya_se_mohbbat_orai,(128k) - Copy.mp3",
    cover: "E_julmi_jamana_sitam.jpg"
},
{
    title: "Hum Tumko Nigahon Mein",
    artist: "Udit Narayan, Alka Yagnik",
    src: "Hum_Tumko_Nigahon_mein_👀❤️‍🩹(128k).mp3",
    cover: "hum tumko nigahon me.png"
},
{
    title: "Kabo kabo pyar me",
    artist: "Pawan Singh",
    src: "Kabo_Kabo_Pyar_Me.mp3",
    cover: "kabo kabo pyar me.png"
},
{
    title: "Hamaro umar lg jaye",
    artist: "Pawan Singh",
    src: "Hamaro_umar_lg_jaye.mp3",
    cover: "hamrao umar lg jaye.png"
},
{
    title: "Hamar dulhaniya",
    artist: "Ankush Raja",
    src: "Hamar_dulhaniya.mp3",
    cover: "hamar dulhaniya.png"
},
{
    title: "Senura Lagawe aa ja",
    artist: "Pawan Singh",
    src: "Senura_Lagawe_Aa_Ja.mp3",
    cover: "senura lagawe.png"
},
];

let currentSong = 0;

const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
const volumePercent = document.getElementById('volume-percent');
const volumeFill = document.querySelector('.volume-fill');
const muteBtn = document.getElementById('mute-btn');
const bassBoost = document.getElementById('bass-boost');
const themeToggle = document.getElementById('theme-toggle');
const equalizer = document.getElementById('equalizer');

const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const playlistElement = document.getElementById('playlist');
const currentLabel = document.getElementById('current');
const durationLabel = document.getElementById('duration');

let previousVolume = 1;
let isMuted = false;
let isBassBoostActive = false;

function loadSong(index) {
    const song = songs[index];
    title.textContent = song.title;
    artist.textContent = song.artist;
    // Encode the src to handle special characters (#, spaces, emojis) in filenames
    audio.src = encodeURI(song.src);
    // Ensure the audio element updates its internal state
    try { audio.load(); } catch (e) { /* ignore */ }
    cover.src = song.cover;
    setActivePlaylistItem();
}

// If an audio file fails to load (bad filename or missing file), skip to the next track
audio.addEventListener('error', (e) => {
    console.error('Audio failed to load:', audio.src, e);
    // mark the current playlist item visually (optional)
    const item = playlistElement && playlistElement.querySelector(`.playlist-item[data-index="${currentSong}"]`);
    if (item) item.classList.add('load-error');
    // advance to next track after a short delay so user sees the change
    setTimeout(() => nextSong(), 300);
});

function renderPlaylist() {
    if (!playlistElement) return;
    playlistElement.innerHTML = songs.map((song, index) => `
        <li class="playlist-item${index === currentSong ? ' active' : ''}" data-index="${index}">
            <img class="playlist-thumb" src="${song.cover}" alt="${song.title} cover">
            <div class="playlist-meta">
                <span class="playlist-title">${song.title}</span>
                <span class="playlist-artist">${song.artist}</span>
            </div>
            <span class="playlist-tag">${formatTime(0)}</span>
        </li>
    `).join('');
}

function setActivePlaylistItem() {
    if (!playlistElement) return;
    playlistElement.querySelectorAll('.playlist-item').forEach((item) => {
        const index = Number(item.dataset.index);
        item.classList.toggle('active', index === currentSong);
    });

    // Scroll the active playlist item into view so the user can see it
    const activeItem = playlistElement.querySelector('.playlist-item.active');
    if (activeItem && typeof activeItem.scrollIntoView === 'function') {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
}

function updatePlayButton(isPlaying) {
    playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    playBtn.classList.toggle('playing', isPlaying);
    equalizer.classList.toggle('active', isPlaying);
}

function playSong() {
    audio.play();
}

function pauseSong() {
    audio.pause();
}

function togglePlay() {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
}

function nextSong() {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
    playSong();
}

function prevSong() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
    playSong();
}

function setTheme(theme) {
    document.body.classList.toggle('light', theme === 'light');
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('musicPlayerTheme', theme);
}

function toggleTheme() {
    const nextTheme = document.body.classList.contains('light') ? 'dark' : 'light';
    setTheme(nextTheme);
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('musicPlayerTheme');
    if (savedTheme) {
        setTheme(savedTheme);
        return;
    }
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    setTheme(prefersLight ? 'light' : 'dark');
}

function updateVolume(value) {
    const volumeValue = Number(value);
    audio.volume = volumeValue;
    volumePercent.textContent = Math.round(volumeValue * 100) + '%';
    volumeFill.style.width = (volumeValue * 100) + '%';
    
    if (volumeValue > 0 && isMuted) {
        isMuted = false;
        muteBtn.classList.remove('active');
        muteBtn.innerHTML = '<i class="fas fa-volume-high"></i>';
    }
}

function toggleMute() {
    if (isMuted) {
        audio.volume = previousVolume;
        volume.value = previousVolume;
        updateVolume(previousVolume);
        muteBtn.classList.remove('active');
        muteBtn.innerHTML = '<i class="fas fa-volume-high"></i>';
        isMuted = false;
    } else {
        previousVolume = audio.volume;
        audio.volume = 0;
        volume.value = 0;
        updateVolume(0);
        muteBtn.classList.add('active');
        muteBtn.innerHTML = '<i class="fas fa-volume-xmark"></i>';
        isMuted = true;
    }
}

function toggleBassBoost() {
    isBassBoostActive = !isBassBoostActive;
    bassBoost.classList.toggle('active', isBassBoostActive);
    
    if (isBassBoostActive) {
        console.log('Bass Boost: ON');
    } else {
        console.log('Bass Boost: OFF');
    }
}

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
themeToggle.addEventListener('click', toggleTheme);
muteBtn.addEventListener('click', toggleMute);
bassBoost.addEventListener('click', toggleBassBoost);

audio.addEventListener('play', () => {
    updatePlayButton(true);
    cover.classList.add('playing');
});

audio.addEventListener('pause', () => {
    updatePlayButton(false);
    cover.classList.remove('playing');
});

if (playlistElement) {
    playlistElement.addEventListener('click', (event) => {
        const item = event.target.closest('.playlist-item');
        if (!item) return;
        const index = Number(item.dataset.index);
        if (index === currentSong) return;
        currentSong = index;
        loadSong(currentSong);
        playSong();
    });
}

audio.addEventListener('loadedmetadata', () => {
    progress.max = Math.floor(audio.duration);
    durationLabel.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
    progress.value = Math.floor(audio.currentTime);
    currentLabel.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('ended', nextSong);

progress.addEventListener('input', () => {
    audio.currentTime = progress.value;
});

volume.addEventListener('input', (event) => {
    updateVolume(event.target.value);
});

// initialize player
renderPlaylist();
loadSong(currentSong);
audio.volume = Number(volume.value);
updateVolume(volume.value);
updatePlayButton(false);
initializeTheme();