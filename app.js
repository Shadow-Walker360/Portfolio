// Music Player Application Core
class MusicPlayer {
    constructor() {
        this.songs = [];
        this.currentSongIndex = 0;
        this.audioContext = null;
        this.analyser = null;
        this.isPlaying = false;
        this.volume = 0.7;
        this.audio = new Audio();
        this.audio.crossOrigin = "anonymous";
        
        // Initialize visualizers
        this.waveCanvas = document.getElementById('waveCanvas');
        this.barCanvas = document.getElementById('barCanvas');
        this.waveCtx = this.waveCanvas.getContext('2d');
        this.barCtx = this.barCanvas.getContext('2d');
        
        // Mock data for demonstration
        this.songs = [
            {
                id: 1,
                title: "Summer Vibes",
                artist: "Chill Wave",
                genre: "Electronic",
                duration: "3:45",
                file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                cover: "https://source.unsplash.com/random/300x300/?music,electronic"
            },
            {
                id: 2,
                title: "Urban Dreams",
                artist: "Hip Hop Collective",
                genre: "Hip Hop",
                duration: "4:12",
                file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                cover: "https://source.unsplash.com/random/300x300/?music,hiphop"
            }
        ];

        this.initAudioContext();
        this.setupEventListeners();
        this.renderSongList();
        this.initVisualizers();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            
            const source = this.audioContext.createMediaElementSource(this.audio);
            source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
        } catch (e) {
            console.error('Web Audio API not supported', e);
        }
    }

    setupEventListeners() {
        // Play/Pause button
        document.getElementById('playBtn').addEventListener('click', () => this.togglePlay());
        
        // Previous/Next buttons
        document.getElementById('prevBtn').addEventListener('click', () => this.prevSong());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextSong());
        
        // Progress bar
        document.getElementById('progress').addEventListener('input', (e) => {
            this.audio.currentTime = (e.target.value / 100) * this.audio.duration;
        });
        
        // Volume control
        document.getElementById('volume').addEventListener('input', (e) => {
            this.volume = e.target.value;
            this.audio.volume = this.volume;
        });
        
        // Song list clicks
        document.getElementById('songList').addEventListener('click', (e) => {
            const songElement = e.target.closest('.song-item');
            if (songElement) {
                const songId = parseInt(songElement.dataset.id);
                this.playSongById(songId);
            }
        });
    }

    renderSongList() {
        const songList = document.getElementById('songList');
        songList.innerHTML = this.songs.map(song => `
            <div class="song-item flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer" data-id="${song.id}">
                <img src="${song.cover}" class="w-10 h-10 rounded mr-3" alt="${song.title}">
                <div class="flex-1">
                    <div class="font-medium">${song.title}</div>
                    <div class="text-sm text-gray-400">${song.artist}</div>
                </div>
                <div class="text-sm text-gray-400">${song.duration}</div>
            </div>
        `).join('');
    }

    playSongById(id) {
        const index = this.songs.findIndex(song => song.id === id);
        if (index !== -1) {
            this.currentSongIndex = index;
            this.playCurrentSong();
        }
    }

    playCurrentSong() {
        const song = this.songs[this.currentSongIndex];
        this.audio.src = song.file;
        this.audio.play()
            .then(() => {
                this.isPlaying = true;
                document.getElementById('playBtn').innerHTML = '<i class="fas fa-pause text-2xl"></i>';
                document.getElementById('nowPlaying').textContent = song.title;
                document.getElementById('nowArtist').textContent = song.artist;
                this.updateProgressBar();
            })
            .catch(e => console.error('Playback failed:', e));
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            document.getElementById('playBtn').innerHTML = '<i class="fas fa-play text-2xl"></i>';
        } else {
            if (this.audio.src) {
                this.audio.play();
            } else {
                this.playCurrentSong();
            }
            document.getElementById('playBtn').innerHTML = '<i class="fas fa-pause text-2xl"></i>';
        }
        this.isPlaying = !this.isPlaying;
    }

    prevSong() {
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.playCurrentSong();
    }

    nextSong() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        this.playCurrentSong();
    }

    updateProgressBar() {
        const progress = document.getElementById('progress');
        const currentTime = document.getElementById('currentTime');
        const duration = document.getElementById('duration');
        
        const update = () => {
            if (this.audio.duration) {
                progress.value = (this.audio.currentTime / this.audio.duration) * 100;
                currentTime.textContent = this.formatTime(this.audio.currentTime);
                duration.textContent = this.formatTime(this.audio.duration);
            }
            
            if (this.isPlaying) {
                requestAnimationFrame(update);
            }
        };
        
        update();
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    initVisualizers() {
        if (!this.analyser) return;
        
        const visualize = () => {
            this.analyser.getByteTimeDomainData(this.dataArray);
            
            // Waveform visualization
            this.waveCtx.fillStyle = 'rgb(20, 20, 30)';
            this.waveCtx.fillRect(0, 0, this.waveCanvas.width, this.waveCanvas.height);
            this.waveCtx.lineWidth = 2;
            this.waveCtx.strokeStyle = 'rgb(200, 50, 200)';
            this.waveCtx.beginPath();
            
            const sliceWidth = this.waveCanvas.width / this.analyser.frequencyBinCount;
            let x = 0;
            
            for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
                const v = this.dataArray[i] / 128.0;
                const y = v * this.waveCanvas.height / 2;
                
                if (i === 0) {
                    this.waveCtx.moveTo(x, y);
                } else {
                    this.waveCtx.lineTo(x, y);
                }
                
                x += sliceWidth;
            }
            
            this.waveCtx.lineTo(this.waveCanvas.width, this.waveCanvas.height / 2);
            this.waveCtx.stroke();
            
            // Bar visualization
            this.analyser.getByteFrequencyData(this.dataArray);
            this.barCtx.fillStyle = 'rgb(20, 20, 30)';
            this.barCtx.fillRect(0, 0, this.barCanvas.width, this.barCanvas.height);
            
            const barWidth = (this.barCanvas.width / this.analyser.frequencyBinCount) * 2.5;
            let barX = 0;
            
            for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
                const barHeight = (this.dataArray[i] / 255) * this.barCanvas.height;
                const hue = i * 2;
                this.barCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                this.barCtx.fillRect(barX, this.barCanvas.height - barHeight, barWidth, barHeight);
                barX += barWidth + 1;
            }
            
            requestAnimationFrame(visualize);
        };
        
        visualize();
    }
}

// Initialize the player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const player = new MusicPlayer();
});