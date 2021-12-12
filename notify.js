let currentSong = 0;
let audio = null;
const songs = [
  {
    name: "RHM",
    artist: "Paris Texas",
    album: "Red Hand Akimbo",
    artwork: [{ src: 'album.jpg',   sizes: '544x544',   type: 'image/jpg' }],
  },
  {
    name: "BULLSEYE",
    artist: "Paris Texas",
    album: "Red Hand Akimbo",
    artwork: [{ src: 'album.jpg',   sizes: '544x544',   type: 'image/jpg' }],
  },
  {
    name: "Epilogue",
    artist: "Paris Texas",
    album: "Red Hand Akimbo",
    artwork: [{ src: 'album.jpg',   sizes: '544x544',   type: 'image/jpg' }],
  },
];


const getSong = () => songs[currentSong];
const setNotif = () => {
  const song = getSong();
  if (song && (!navigator.mediaSession.metadata || song.Name !== navigator.mediaSession.metadata.title)) {
    navigator.mediaSession.metadata = new MediaMetadata(song);
  }
};

document.querySelector('#play').addEventListener('click', (e) => {
  if (!audio) {
    audio = document.createElement("audio");
    document.body.appendChild(audio);
    audio.src = "https://raw.githubusercontent.com/anars/blank-audio/master/10-seconds-of-silence.mp3";
    audio.loop = true;
  }
  audio.play();

  if (audio && navigator.mediaSession) {
    setNotif();
    navigator.mediaSession.playbackState = 'playing';
    navigator.mediaSession.setActionHandler("previoustrack", () => {
      if (currentSong - 1 > 0) {
        currentSong -= 1;
      } else {
        currentSong = songs.length - 1;
      }
      setNotif();
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => {
      if (currentSong + 1 < songs.length) {
        currentSong += 1;
      } else {
        currentSong = 0;
      }
      setNotif();
    });
    navigator.mediaSession.setActionHandler("play", () => {
      audio.play();
      navigator.mediaSession.playbackState = 'playing';
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      audio.pause();
      navigator.mediaSession.playbackState = 'paused';
    });
  }
});
