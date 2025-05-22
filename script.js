// Array d'episodis
const episodis = [
  {
    titol: "IA i Corporacions. Progrés o Control?",
    resum: "Debatem com les grans empreses integren la intel·ligència artificial entre innovació i dominació.",
    participants: "Sofía, Karen, Aleix",
    data: "20/04/2025",
    arxiu: "audio/1_Sofia.mp3"
  },
  {
    titol: "Realitat Virtual:<br> Promesa o Perill?",
    resum: "Els riscos socials i els avenços tecnològics de la realitat virtual, cara a cara.",
    participants: "Laura, Jin, Noa",
    data: "10/04/2025",
    arxiu: "audio/2_Laura.mp3"
  },
  {
    titol: "La IA.<br>Progrés o dependència?",
    resum: "Una conversa sobre els beneficis i els riscos psicològics, socials i laborals de la IA.",
    participants: "Rocío, Dariel, Aitana",
    data: "10/05/2025",
    arxiu: "audio/3_Rocio.mp3"
  },
  {
    titol: "Art i IA.<br> Creativitat en Joc",
    resum: "Dues visions oposades sobre com la intel·ligència artificial impacta en la creació artística.",
    participants: "Juanita, David, Ariadna",
    data: "20/05/2025",
    arxiu: "audio/4_Juanita.mp3"
  },
  {
    titol: "Disseny.<br> Digital VS Artesanal",
    resum: "Confrontem tècniques i valors entre el disseny digital i l'artesania contemporània.",
    participants: "Guiomar, Clara, Eva",
    data: "10/06/2025",
    arxiu: "audio/5_Guiomar.mp3"
  },
  {
    titol: "El Grafiti.<br> Art Urbà o Vandalisme?",
    resum: " Límits legals, simbologia i expressió: el debat sobre l’art als carrers.",
    participants: "Arlet, Edgar, Lucía",
    data: "20/06/2025",
    arxiu: "audio/6_Edgar.mp3"
  },
  {
    titol: "L’Autor<br> en l’Era Digital",
    resum: "Reflexionem sobre autoria i sostenibilitat en un món d’il·lustració automatitzada.",
    participants: "Bruna, Charly, Leyre",
    data: "20/03/2025",
    arxiu: "audio/7_Bruna.mp3"
  },
  {
    titol: "Minimalisme <br>VS Maximalisme",
    resum: "Un cara a cara entre dues filosofies visuals del disseny actual.",
    participants: "Paula, Ester, Andrea",
    data: "10/03/2025",
    arxiu: "audio/8_Paula.mp3"
  },
  
];

// Referència al contenidor i variables globals
const llista = document.getElementById("llista-episodis");
let audioActiu = null;

const colors = [
  "bg-verde",   // 1
  "bg-azul",    // 2
  "bg-verde",   // 3
  "bg-amarillo",// 4
  "bg-rosa",    // 5
  "bg-amarillo",// 6
  "bg-azul",    // 7
  "bg-rosa"     // 8
];

// Generació dels elements
episodis.forEach((epi, i) => {
  const div = document.createElement("div");
  div.className = "episodi " + colors[i];
  div.innerHTML = `
    <div class="portada">
      <img class="portada-img pixel-img" src="IMG/${i + 1}.gif" alt="Portada episodi ${i + 1}">
      <h2>${epi.titol}</h2>
      <p class="resum">${epi.resum}</p>
    </div>
    <div class="info">
      <p><strong>Participants</strong></br> ${epi.participants}</p>
      <audio src="${epi.arxiu}"></audio>
      <div class="audio-custom">
        <div class="play-btn">
          <svg class="play-icon" viewBox="0 0 24 24"><polygon points="6,4 20,12 6,20"/></svg>
          <svg class="pause-icon" viewBox="0 0 24 24" style="display:none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-bg"></div>
          <div class="progress-bar" style="width:0%"></div>
          <div class="progress-knob" style="left:0%"></div>
        </div>
        <span class="time">0:00</span>
      </div>
      <span class="data-podcast">${epi.data}</span>
    </div>
  `;
  const portada = div.querySelector(".portada");
  const info = div.querySelector(".info");
  const audio = div.querySelector("audio");
  const audioCustom = div.querySelector('.audio-custom');
  const playBtn = audioCustom.querySelector('.play-btn');
  const playIcon = audioCustom.querySelector('.play-icon');
  const pauseIcon = audioCustom.querySelector('.pause-icon');
  const progressBar = audioCustom.querySelector('.progress-bar');
  const progressKnob = audioCustom.querySelector('.progress-knob');
  const progressBarContainer = audioCustom.querySelector('.progress-bar-container');
  const time = audioCustom.querySelector('.time');

  // Mostrar info al clicar la portada
  portada.addEventListener("click", e => {
    div.classList.add("mostra-info");
  });

  // Permitir volver a la portada solo si se hace click fuera del reproductor y controles
  info.addEventListener("click", e => {
    // Solo cerrar si el click es directamente sobre el fondo de .info, no sobre sus hijos
    if (e.target === info) {
      div.classList.remove("mostra-info");
      // No pausamos el audio aquí, así el audio sigue sonando si estaba en marcha
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && div.classList.contains("mostra-info")) {
      div.classList.remove("mostra-info");
      audio.pause();
    }
  });

  // --- Audio Custom Controls ---
  let dragging = false;

  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', () => {
    playIcon.style.display = 'none';
    pauseIcon.style.display = '';
    if (window.audioActiu && window.audioActiu !== audio) {
      window.audioActiu.pause();
    }
    window.audioActiu = audio;
    document.querySelectorAll(".episodi").forEach(el => el.classList.remove("actiu"));
    div.classList.add("actiu");
  });

  audio.addEventListener('pause', () => {
    playIcon.style.display = '';
    pauseIcon.style.display = 'none';
    if (window.audioActiu === audio) {
      div.classList.remove("actiu");
      window.audioActiu = null;
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (!dragging) {
      const percent = (audio.currentTime / audio.duration) * 100 || 0;
      progressBar.style.width = percent + '%';
      progressKnob.style.left = percent + '%';
      // Mostrar tiempo restante en vez de transcurrido
      time.textContent = formatTime(audio.duration - audio.currentTime);
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    // Mostrar duración total al cargar
    time.textContent = formatTime(audio.duration);
  });

  progressBarContainer.addEventListener('mousedown', function(e) {
    dragging = true;
    moveKnob(e);
    document.addEventListener('mousemove', moveKnob);
    document.addEventListener('mouseup', stopDrag);
  });

  function moveKnob(e) {
    const rect = progressBarContainer.getBoundingClientRect();
    let x = e.clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percent = x / rect.width;
    progressBar.style.width = (percent * 100) + '%';
    progressKnob.style.left = (percent * 100) + '%';
    time.textContent = formatTime(percent * audio.duration);
    if (dragging) {
      audio.currentTime = percent * audio.duration;
    }
  }

  function stopDrag() {
    dragging = false;
    document.removeEventListener('mousemove', moveKnob);
    document.removeEventListener('mouseup', stopDrag);
  }

  function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    sec = Math.floor(sec);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  llista.appendChild(div);
});

// Navegació amb el botó CTA
document.getElementById("cta").addEventListener("click", () => {
  llista.scrollIntoView({ behavior: "smooth" });
});

// Animación de entrada y flotación para los iconos de la hero (ahora en .hero-floating-layer)
window.addEventListener('DOMContentLoaded', () => {
  // Entrada con scale
  gsap.fromTo('.emoji-robot', {scale:0, y:100, opacity:0}, {scale:1, y:0, opacity:1, duration:1, delay:0.2, ease:"back.out(1.7)"});
  gsap.fromTo('.emoji-pantone', {scale:0, y:70, opacity:0}, {scale:1, y:0, opacity:1, duration:1, delay:0.4, ease:"back.out(1.7)"});
  gsap.fromTo('.emoji-converses', {scale:0, y:40, opacity:0}, {scale:1, y:0, opacity:1, duration:1, delay:0.6, ease:"back.out(1.7)"});
  gsap.fromTo('.emoji-clippy', {scale:0, y:-40, opacity:0}, {scale:1.25, y:0, opacity:1, duration:1.2, delay:0.1, ease:"back.out(1.7)"});
  gsap.fromTo('.emoji-microfon', {scale:0, y:30, opacity:0}, {scale:1, y:0, opacity:1, duration:1, delay:0.5, ease:"back.out(1.7)"});
  gsap.fromTo('.emoji-manocorazon', {scale:0, y:30, opacity:0}, {scale:1, y:0, opacity:1, duration:1, delay:0.7, ease:"back.out(1.7)"});
  gsap.fromTo('.emoji-pincel', {scale:0, y:30, opacity:0}, {scale:1, y:0, opacity:1, duration:1, delay:0.9, ease:"back.out(1.7)"});

  // Flotación suave
  gsap.to('.emoji-robot', {y: "+=12", repeat: -1, yoyo: true, duration: 2.2, ease: "sine.inOut"});
  gsap.to('.emoji-pantone', {y: "-=10", repeat: -1, yoyo: true, duration: 2.6, ease: "sine.inOut"});
  gsap.to('.emoji-converses', {y: "+=8", repeat: -1, yoyo: true, duration: 2.1, ease: "sine.inOut"});
  gsap.to('.emoji-clippy', {y: "-=18", repeat: -1, yoyo: true, duration: 2.8, ease: "sine.inOut"});
  gsap.to('.emoji-microfon', {y: "+=9", repeat: -1, yoyo: true, duration: 2.3, ease: "sine.inOut"});
  gsap.to('.emoji-manocorazon', {y: "-=7", repeat: -1, yoyo: true, duration: 2.4, ease: "sine.inOut"});
  gsap.to('.emoji-pincel', {y: "+=6", repeat: -1, yoyo: true, duration: 2.2, ease: "sine.inOut"});

  // ...resto de animaciones existentes...
});
