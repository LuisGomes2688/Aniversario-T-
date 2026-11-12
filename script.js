// =========================================================================
// LÓGICA DO SITE - NORMALMENTE NÃO PRECISA MEXER AQUI
// =========================================================================
// As configurações (conteúdo) ficam no arquivo "config.js".
// Este arquivo apenas transforma essas configurações em páginas na tela.

document.addEventListener('DOMContentLoaded', () => {
    applyConfigData();
    initIntro();
    initCounter();
    renderTimeline();
    renderGallery();
    initAudioPlayer();
    renderVideos();
    renderThingsILove();
    initLetterAndSurprise();
    initScrollEffects();
    initNavigation();
});

function applyConfigData() {
    document.getElementById('intro-name').textContent = `${CONFIG.nomeDela} ❤️`;
    document.getElementById('intro-phrase').textContent = CONFIG.fraseInicial;

    const pCover = document.getElementById('intro-bg');
    pCover.src = "assets/fotos/capa.jpg";
}

function initIntro() {
    const btnEnter = document.getElementById('btn-enter');
    const introScreen = document.getElementById('intro-screen');
    const mainContent = document.getElementById('main-content');
    const nav = document.getElementById('main-nav');
    const bgToggle = document.getElementById('bg-music-toggle');

    btnEnter.addEventListener('click', () => {
        introScreen.style.opacity = '0';

        setTimeout(() => {
            introScreen.style.display = 'none';
            mainContent.classList.remove('hidden');

            setTimeout(() => {
                mainContent.style.opacity = '1';
                nav.style.opacity = '1';
                nav.style.pointerEvents = 'auto';
                bgToggle.style.opacity = '1';
                bgToggle.style.pointerEvents = 'auto';

                tryPlayBgMusic();

                setTimeout(() => window.dispatchEvent(new Event('scroll')), 100);
            }, 100);
        }, 1000);
    });
}

function initCounter() {
    const startDate = new Date(CONFIG.dataInicio);

    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    document.getElementById('counter-start-date').textContent = startDate.toLocaleDateString('pt-BR', options);

    const now = new Date();
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    if (months < 0) {
        years--;
        months += 12;
    }

    document.getElementById('anniversary-badge').textContent = 'FELIZZZ 18 ANOS MINHA PRINCESA';

    function updateCounter() {
        const currentDate = new Date();
        const diffMs = currentDate - startDate;

        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        document.getElementById('total-days').textContent = totalDays;

        let dYears = currentDate.getFullYear() - startDate.getFullYear();
        let dMonths = currentDate.getMonth() - startDate.getMonth();
        let dDays = currentDate.getDate() - startDate.getDate();

        if (dDays < 0) {
            dMonths--;
            const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            dDays += previousMonth.getDate();
        }
        if (dMonths < 0) {
            dYears--;
            dMonths += 12;
        }

        const dHours = currentDate.getHours();
        const dMinutes = currentDate.getMinutes();
        const dSeconds = currentDate.getSeconds();

        const timeUnits = [
            { label: 'Anos', value: dYears },
            { label: 'Meses', value: dMonths },
            { label: 'Dias', value: dDays },
            { label: 'Horas', value: dHours },
            { label: 'Min', value: dMinutes },
            { label: 'Seg', value: dSeconds }
        ];

        const container = document.getElementById('counter-container');
        container.innerHTML = timeUnits.map(unit => `
            <div class="flex flex-col">
                <span class="text-3xl md:text-4xl font-serif text-rose-200">${String(unit.value).padStart(2, '0')}</span>
                <span class="text-xs text-zinc-400 uppercase tracking-wider mt-1">${unit.label}</span>
            </div>
        `).join('');
    }

    updateCounter();
    setInterval(updateCounter, 1000);
    initCountdown();
}

function initCountdown() {
    const targetDate = new Date(2027, 5, 26, 0, 0, 0);

    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    document.getElementById('countdown-target-date').textContent = targetDate.toLocaleDateString('pt-BR', options);

    function updateCountdown() {
        const now = new Date();
        let diffMs = targetDate - now;

        if (diffMs <= 0) {
            diffMs = 0;
        }

        const totalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        document.getElementById('countdown-total-days').textContent = totalDays;

        let dYears = targetDate.getFullYear() - now.getFullYear();
        let dMonths = targetDate.getMonth() - now.getMonth();
        let dDays = targetDate.getDate() - now.getDate();

        if (dDays < 0) {
            dMonths--;
            const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            dDays += previousMonth.getDate();
        }
        if (dMonths < 0) {
            dYears--;
            dMonths += 12;
        }

        let remainMs = diffMs;
        const daysInMs = Math.floor(remainMs / (1000 * 60 * 60 * 24));
        remainMs -= daysInMs * (1000 * 60 * 60 * 24);
        const dHours = Math.floor(remainMs / (1000 * 60 * 60));
        remainMs -= dHours * (1000 * 60 * 60);
        const dMinutes = Math.floor(remainMs / (1000 * 60));
        remainMs -= dMinutes * (1000 * 60);
        const dSeconds = Math.floor(remainMs / 1000);

        const timeUnits = [
            { label: 'Anos', value: Math.max(dYears, 0) },
            { label: 'Meses', value: Math.max(dMonths, 0) },
            { label: 'Dias', value: Math.max(dDays, 0) },
            { label: 'Horas', value: dHours },
            { label: 'Min', value: dMinutes },
            { label: 'Seg', value: dSeconds }
        ];

        const container = document.getElementById('countdown-container');
        container.innerHTML = timeUnits.map(unit => `
            <div class="flex flex-col">
                <span class="text-3xl md:text-4xl font-serif text-rose-200">${String(unit.value).padStart(2, '0')}</span>
                <span class="text-xs text-zinc-400 uppercase tracking-wider mt-1">${unit.label}</span>
            </div>
        `).join('');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function renderTimeline() {
    const container = document.getElementById('timeline-container');
    let html = '';

    CONFIG.timeline.forEach((item, index) => {
        const isLeft = index % 2 === 0;

        const fallbackUrl = `https://placehold.co/400x300/1a1016/5C1A2E?text=Momento+${index+1}`;

        html += `
        <div class="relative w-full md:w-1/2 md:${isLeft ? 'pr-12' : 'pl-12 ml-auto'} mb-16 reveal-on-scroll group">
            <div class="absolute top-0 ${isLeft ? 'left-[14px] md:-right-3 md:left-auto' : 'left-[14px] md:-left-3'} w-4 h-4 rounded-full bg-wine-700 border-2 border-black z-10 group-hover:bg-rose-400 group-hover:shadow-[0_0_15px_rgba(251,113,133,0.5)] transition-all duration-300 transform md:translate-x-0 -translate-x-[2px]"></div>

            <div class="pl-12 md:pl-0">
                <div class="text-rose-400 font-mono text-sm tracking-wider mb-2">${item.data}</div>
                <div class="glass-panel rounded-2xl p-6 hover:border-wine-700/50 transition-colors duration-300">
                    <h3 class="font-serif text-2xl text-rose-50 mb-3">${item.titulo}</h3>
                    <div class="rounded-xl overflow-hidden mb-4 shadow-lg h-48 sm:h-64 relative bg-black/40">
                        <img src="${item.imagem}" onerror="this.src='${fallbackUrl}'" alt="${item.titulo}" class="w-full h-full object-contain">
                    </div>
                    <p class="text-zinc-300 font-light text-sm md:text-base leading-relaxed whitespace-pre-line">${item.descricao}</p>
                </div>
            </div>
        </div>
        `;
    });

    container.innerHTML = html;
}

function renderGallery() {
    const container = document.getElementById('gallery-container');
    let html = '';

    CONFIG.photos.forEach((photo, index) => {
        const fallbackUrl = `https://placehold.co/${index % 2 === 0 ? '400x500' : '500x400'}/1a1016/5C1A2E?text=Foto+${index+1}`;

        html += `
        <div class="break-inside-avoid mb-4 reveal-on-scroll group cursor-pointer" onclick="openGallery(${index})">
            <div class="relative overflow-hidden rounded-xl">
                <img src="${photo.src}" onerror="this.src='${fallbackUrl}'" alt="Nossa foto" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700">
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <svg class="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                </div>
            </div>
        </div>
        `;
    });
    container.innerHTML = html;

    document.getElementById('btn-close-gallery').addEventListener('click', closeGallery);
    document.getElementById('btn-next-photo').addEventListener('click', nextGalleryPhoto);
    document.getElementById('btn-prev-photo').addEventListener('click', prevGalleryPhoto);

    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('gallery-modal');
        if (modal.style.opacity === '1') {
            if (e.key === 'Escape') closeGallery();
            if (e.key === 'ArrowRight') nextGalleryPhoto();
            if (e.key === 'ArrowLeft') prevGalleryPhoto();
        }
    });
}

let currentGalleryIndex = 0;

function openGallery(index) {
    currentGalleryIndex = index;
    updateGalleryModal();
    const modal = document.getElementById('gallery-modal');
    modal.style.pointerEvents = 'auto';
    modal.style.opacity = '1';
    document.body.style.overflow = 'hidden';
}

function closeGallery() {
    const modal = document.getElementById('gallery-modal');
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    document.body.style.overflow = 'auto';
}

function updateGalleryModal() {
    const photo = CONFIG.photos[currentGalleryIndex];
    const img = document.getElementById('gallery-modal-img');
    const caption = document.getElementById('gallery-modal-caption');
    const counter = document.getElementById('gallery-counter');

    img.style.opacity = '0';
    setTimeout(() => {
        const fallbackUrl = `https://placehold.co/800x600/1a1016/5C1A2E?text=Foto+${currentGalleryIndex+1}`;
        img.src = photo.src;
        img.onerror = () => { img.src = fallbackUrl; };
        caption.textContent = photo.legenda;
        counter.textContent = `${currentGalleryIndex + 1} / ${CONFIG.photos.length}`;
        img.style.opacity = '1';
    }, 150);
}

function nextGalleryPhoto() {
    currentGalleryIndex = (currentGalleryIndex + 1) % CONFIG.photos.length;
    updateGalleryModal();
}

function prevGalleryPhoto() {
    currentGalleryIndex = (currentGalleryIndex - 1 + CONFIG.photos.length) % CONFIG.photos.length;
    updateGalleryModal();
}

let currentSongIndex = 0;
let scMode = false;            // true quando a faixa atual é do SoundCloud
let scPlaying = false;         // estado de reprodução do widget SoundCloud
let currentWidget = null;      // instância SC.Widget
let scIframe = null;           // iframe oculto do SoundCloud
let scDuration = 0;            // duração (ms) da faixa SoundCloud
let scWantPlay = false;        // quer tocar automaticamente após carregar
let scApiLoading = null;       // promise de carregamento da API
let isBgPlaying = false;       // estado do botão 🎵 de fundo
const mainAudio = document.getElementById('main-audio');
const bgAudio = document.getElementById('bg-audio');

function isSoundCloud(url) {
    return typeof url === 'string' && url.includes('soundcloud.com');
}

function getScEmbedUrl(url) {
    let clean = url;
    const q = clean.indexOf('?');
    if (q !== -1) clean = clean.substring(0, q);
    return 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(clean) +
        '&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false';
}

function ensureScApi() {
    if (window.SC && window.SC.Widget) return Promise.resolve(window.SC);
    if (scApiLoading) return scApiLoading;
    scApiLoading = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://w.soundcloud.com/player/api.js';
        s.onload = () => resolve(window.SC);
        s.onerror = () => reject(new Error('Falha ao carregar a API do SoundCloud'));
        document.head.appendChild(s);
    });
    return scApiLoading;
}

function updateBgToggleUI(playing) {
    const bgToggle = document.getElementById('bg-music-toggle');
    if (playing) {
        bgToggle.classList.add('bg-wine-800/50', 'text-white');
        bgToggle.classList.remove('text-rose-200');
        bgToggle.innerHTML = '<span class="animate-pulse">🎵</span>';
    } else {
        bgToggle.classList.remove('bg-wine-800/50', 'text-white');
        bgToggle.classList.add('text-rose-200');
        bgToggle.innerHTML = '🎵';
    }
}

function initAudioPlayer() {
    bgAudio.src = CONFIG.musicaFundo;
    const bgToggle = document.getElementById('bg-music-toggle');

    bgToggle.addEventListener('click', () => {
        if (isBgPlaying) {
            if (scMode && currentWidget) currentWidget.pause();
            else if (!mainAudio.paused) mainAudio.pause();
            else if (!bgAudio.paused) bgAudio.pause();
            isBgPlaying = false;
        } else {
            if (currentSongIndex !== 0) {
                playSong(0);
            } else if (scMode) {
                if (currentWidget) currentWidget.play();
                updatePlayPauseUI(true);
            } else {
                mainAudio.play().catch(e => console.log("Audio play failed:", e));
                updatePlayPauseUI(true);
            }
            isBgPlaying = true;
        }
        updateBgToggleUI(isBgPlaying);
    });

    const playlistContainer = document.getElementById('playlist-container');
    let html = '';

    CONFIG.songs.forEach((song, index) => {
        html += `
        <li class="playlist-item p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-4 group" onclick="playSong(${index})">
            <span class="text-zinc-600 font-mono text-sm w-4">${index + 1}</span>
            <div class="flex-1">
                <h4 class="text-zinc-200 group-hover:text-rose-200 transition-colors ${index === 0 ? 'text-rose-200' : ''}">${song.title}</h4>
                <p class="text-zinc-500 text-xs">${song.artist}</p>
            </div>
            <svg class="w-5 h-5 text-wine-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </li>
        `;
    });
    playlistContainer.innerHTML = html;

    document.getElementById('player-play-pause').addEventListener('click', togglePlayPause);
    document.getElementById('player-next').addEventListener('click', () => playSong((currentSongIndex + 1) % CONFIG.songs.length));
    document.getElementById('player-prev').addEventListener('click', () => playSong((currentSongIndex - 1 + CONFIG.songs.length) % CONFIG.songs.length));

    const volControl = document.getElementById('player-volume');
    if (volControl) {
        volControl.addEventListener('input', (e) => {
            mainAudio.volume = e.target.value / 100;
            if (scMode && currentWidget) currentWidget.setVolume(e.target.value / 100);
        });
    }

    mainAudio.addEventListener('timeupdate', updateProgress);
    const progressBar = document.getElementById('player-progress');
    progressBar.addEventListener('input', (e) => {
        if (scMode && currentWidget) {
            currentWidget.getDuration((d) => {
                currentWidget.seekTo((e.target.value / 100) * d);
            });
        } else {
            const time = (e.target.value / 100) * mainAudio.duration;
            mainAudio.currentTime = time;
        }
    });

    mainAudio.addEventListener('ended', () => {
        playSong((currentSongIndex + 1) % CONFIG.songs.length);
    });

    loadSongInfo(0);
}

function tryPlayBgMusic() {
    // Tenta tocar apenas se o navegador permitir (interação prévia ocorreu).
}

function loadSongInfo(index) {
    const song = CONFIG.songs[index];
    document.getElementById('player-title').textContent = song.title;
    document.getElementById('player-artist').textContent = song.artist;
    document.getElementById('player-message').textContent = `"${song.message}"`;

    const cover = document.getElementById('player-cover');
    const fallbackCover = `https://placehold.co/400x400/1a1016/5C1A2E?text=Capa+${index+1}`;
    cover.src = song.cover;
    cover.onerror = () => { cover.src = fallbackCover; };

    if (isSoundCloud(song.src)) {
        scMode = true;
        scPlaying = false;
        mainAudio.pause();
        mainAudio.removeAttribute('src');
        mainAudio.load();
        ensureScApi().then(SC => {
            const embedUrl = getScEmbedUrl(song.src);
            if (!scIframe) {
                scIframe = document.createElement('iframe');
                scIframe.setAttribute('allow', 'autoplay; encrypted-media');
                scIframe.style.cssText = 'position:absolute;width:0;height:0;opacity:0;pointer-events:none;border:0;';
                scIframe.src = embedUrl;
                document.getElementById('music').appendChild(scIframe);
                currentWidget = SC.Widget(scIframe);
                currentWidget.bind(SC.Widget.Events.READY, () => {
                    currentWidget.getDuration(d => { scDuration = d; });
                    if (scWantPlay) {
                        scWantPlay = false;
                        currentWidget.play();
                    }
                });
                currentWidget.bind(SC.Widget.Events.PLAY, () => {
                    scPlaying = true;
                    updatePlayPauseUI(true);
                });
                currentWidget.bind(SC.Widget.Events.PAUSE, () => {
                    scPlaying = false;
                    updatePlayPauseUI(false);
                });
                currentWidget.bind(SC.Widget.Events.FINISH, () => {
                    playSong((currentSongIndex + 1) % CONFIG.songs.length);
                });
                currentWidget.bind(SC.Widget.Events.PLAY_PROGRESS, (e) => {
                    const pos = (e && typeof e.currentPosition !== 'undefined') ? e.currentPosition : 0;
                    const dur = scDuration || 0;
                    const pct = dur ? (pos / dur) * 100 : 0;
                    document.getElementById('player-progress').value = pct;
                    document.getElementById('player-time-current').textContent = formatTime(pos / 1000);
                    document.getElementById('player-time-total').textContent = formatTime(dur / 1000);
                });
            } else {
                currentWidget.load(embedUrl, { auto_play: scWantPlay });
                scWantPlay = false;
            }
        }).catch(e => console.log('SoundCloud API falhou:', e));
    } else {
        scMode = false;
        scPlaying = false;
        if (currentWidget) { try { currentWidget.pause(); } catch (e) {} }
        mainAudio.src = song.src;
    }

    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        const title = item.querySelector('h4');
        if (i === index) {
            item.classList.add('bg-white/10');
            title.classList.add('text-rose-200');
            title.classList.remove('text-zinc-200');
        } else {
            item.classList.remove('bg-white/10');
            title.classList.remove('text-rose-200');
            title.classList.add('text-zinc-200');
        }
    });
}

function playSong(index) {
    if (index !== currentSongIndex) {
        currentSongIndex = index;
        scWantPlay = true;
        loadSongInfo(index);
    }

    if (scMode) {
        if (currentWidget) currentWidget.play();
        updatePlayPauseUI(true);
    } else {
        if (!bgAudio.paused) document.getElementById('bg-music-toggle').click();
        mainAudio.play().then(() => {
            updatePlayPauseUI(true);
        }).catch(e => {
            console.log("Audio play prevented:", e);
        });
    }

    isBgPlaying = false;
    updateBgToggleUI(false);
}

function togglePlayPause() {
    if (scMode) {
        if (currentWidget) {
            if (scPlaying) {
                currentWidget.pause();
                scPlaying = false;
            } else {
                currentWidget.play();
                scPlaying = true;
            }
        }
    } else {
        if (mainAudio.paused) {
            if (!bgAudio.paused) document.getElementById('bg-music-toggle').click();
            mainAudio.play().then(() => updatePlayPauseUI(true))
                .catch(e => console.log("Play falhou", e));
        } else {
            mainAudio.pause();
            updatePlayPauseUI(false);
        }
    }
    isBgPlaying = false;
    updateBgToggleUI(false);
}

function updatePlayPauseUI(isPlaying) {
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');
    const indicator = document.getElementById('player-playing-indicator');
    const cover = document.getElementById('player-cover');

    if (isPlaying) {
        iconPlay.classList.add('hidden');
        iconPause.classList.remove('hidden');
        indicator.style.opacity = '1';
        cover.classList.add('scale-110');
    } else {
        iconPlay.classList.remove('hidden');
        iconPause.classList.add('hidden');
        indicator.style.opacity = '0';
        cover.classList.remove('scale-110');
    }
}

function updateProgress() {
    if (scMode) return;
    if (isNaN(mainAudio.duration)) return;

    const progress = (mainAudio.currentTime / mainAudio.duration) * 100;
    document.getElementById('player-progress').value = progress;

    document.getElementById('player-time-current').textContent = formatTime(mainAudio.currentTime);
    document.getElementById('player-time-total').textContent = formatTime(mainAudio.duration);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function renderVideos() {
    const container = document.getElementById('video-container');
    let html = '';

    CONFIG.videos.forEach((video, index) => {
        const fallbackThumb = `https://placehold.co/600x338/1a1016/5C1A2E?text=Video+${index+1}`;

        html += `
        <div class="glass-panel rounded-2xl overflow-hidden group cursor-pointer reveal-on-scroll flex flex-col h-full" onclick="openVideo(${index})">
            <div class="relative h-48 md:h-56 overflow-hidden">
                <img src="${video.thumbnail}" onerror="this.src='${fallbackThumb}'" alt="${video.title}" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700">
                <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div class="w-14 h-14 rounded-full bg-wine-700/80 backdrop-blur flex items-center justify-center text-white transform group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(114,47,55,0.8)]">
                        <svg class="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                </div>
            </div>
            <div class="p-5 flex-1 flex flex-col">
                <span class="text-rose-400 text-xs font-mono mb-2">${video.date}</span>
                <h3 class="font-serif text-xl text-zinc-100 mb-2">${video.title}</h3>
                <p class="text-zinc-400 text-sm font-light mt-auto">${video.description}</p>
            </div>
        </div>
        `;
    });
    container.innerHTML = html;

    document.getElementById('btn-close-video').addEventListener('click', closeVideo);
}

let currentVideoIndex = null;
const videoPlayer = document.getElementById('modal-video-player');

function openVideo(index) {
    const video = CONFIG.videos[index];

    if (!mainAudio.paused) togglePlayPause();
    if (!bgAudio.paused) document.getElementById('bg-music-toggle').click();

    videoPlayer.src = video.src;
    document.getElementById('video-modal-title').textContent = video.title;
    document.getElementById('video-modal-desc').textContent = video.description;

    const modal = document.getElementById('video-modal');
    modal.style.pointerEvents = 'auto';
    modal.style.opacity = '1';
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        videoPlayer.play().catch(e => console.log("Video play prevented: ", e));
    }, 300);
}

function closeVideo() {
    videoPlayer.pause();
    videoPlayer.src = "";

    const modal = document.getElementById('video-modal');
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    document.body.style.overflow = 'auto';
}

function renderThingsILove() {
    const container = document.getElementById('reasons-container');
    let html = '';

    CONFIG.thingsILove.forEach((thing, index) => {
        html += `
        <div class="flip-card w-full h-32 md:h-40 cursor-pointer reveal-on-scroll" onclick="this.classList.toggle('flipped')">
            <div class="flip-card-inner w-full h-full relative rounded-2xl shadow-lg">

                <div class="flip-card-front absolute w-full h-full glass-panel flex flex-col items-center justify-center rounded-2xl text-rose-200 border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                    <span class="text-2xl mb-2">❤️</span>
                    <span class="text-sm font-medium uppercase tracking-wider text-zinc-400">Abra-me</span>
                </div>

                <div class="flip-card-back absolute w-full h-full bg-wine-800/90 backdrop-blur border border-rose-900/50 rounded-2xl flex items-center justify-center p-4 text-center shadow-[0_0_20px_rgba(114,47,55,0.4)]">
                    <p class="text-rose-50 text-sm md:text-base font-serif leading-tight">"${thing}"</p>
                </div>

            </div>
        </div>
        `;
    });
    container.innerHTML = html;
}

function initLetterAndSurprise() {
    document.getElementById('btn-open-letter').addEventListener('click', () => {
        document.getElementById('letter-text').textContent = CONFIG.carta;
        document.getElementById('letter-name-footer').textContent = CONFIG.nomeDela;

        const modal = document.getElementById('letter-modal');
        const box = document.getElementById('letter-content-box');
        modal.style.pointerEvents = 'auto';
        modal.style.opacity = '1';

        setTimeout(() => {
            box.classList.remove('scale-95');
            box.classList.add('scale-100');
        }, 50);

        document.body.style.overflow = 'hidden';
    });

    document.getElementById('btn-close-letter').addEventListener('click', closeLetter);

    document.getElementById('btn-surprise').addEventListener('click', () => {
        const sModal = document.getElementById('surprise-modal');
        const sBox = document.getElementById('surprise-content-box');
        document.getElementById('surprise-text').innerHTML = CONFIG.surpresaFinal;

        sModal.style.pointerEvents = 'auto';
        sModal.style.opacity = '1';

        setTimeout(() => {
            sBox.classList.remove('scale-90');
            sBox.classList.add('scale-100');
        }, 100);
    });

    document.getElementById('btn-close-surprise').addEventListener('click', () => {
        const sModal = document.getElementById('surprise-modal');
        const sBox = document.getElementById('surprise-content-box');
        sModal.style.opacity = '0';
        sModal.style.pointerEvents = 'none';
        sBox.classList.remove('scale-100');
        sBox.classList.add('scale-90');
    });
}

function closeLetter() {
    const modal = document.getElementById('letter-modal');
    const box = document.getElementById('letter-content-box');
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    box.classList.remove('scale-100');
    box.classList.add('scale-95');
    document.body.style.overflow = 'auto';
}

function initScrollEffects() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

function initNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuItems = document.getElementById('menu-items');
    const closeMenuBtn = document.getElementById('close-menu');
    const navLinks = menuItems.querySelectorAll('a');

    function toggleMenu() {
        menuItems.classList.toggle('hidden');
        menuItems.classList.toggle('flex');
        if (!menuItems.classList.contains('hidden')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    menuToggle.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth < 768) {
                toggleMenu();
            }

            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    window.scrollTo({
                        top: targetEl.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('bg-black/95', 'shadow-md', 'backdrop-blur-sm');
            nav.classList.remove('bg-gradient-to-b', 'from-black/80', 'to-transparent');
        } else {
            nav.classList.remove('bg-black/95', 'shadow-md', 'backdrop-blur-sm');
            nav.classList.add('bg-gradient-to-b', 'from-black/80', 'to-transparent');
        }
    });
}