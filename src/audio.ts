type SoundName = 'tap' | 'correct' | 'wrong' | 'clear'

class GameAudio {
  private context: AudioContext | null = null
  private master: GainNode | null = null
  private music: GainNode | null = null
  private timer: number | null = null
  private noteIndex = 0
  private muted = false

  async start() {
    if (!this.context) {
      this.context = new AudioContext()
      this.master = this.context.createGain()
      this.music = this.context.createGain()
      this.master.gain.value = this.muted ? 0 : 0.8
      this.music.gain.value = 0.12
      this.music.connect(this.master)
      this.master.connect(this.context.destination)
    }
    if (this.context.state === 'suspended') await this.context.resume()
    if (this.timer === null) {
      this.playMusicNote()
      this.timer = window.setInterval(() => this.playMusicNote(), 620)
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted
    if (this.master && this.context) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.8, this.context.currentTime, 0.03)
    }
  }

  play(name: SoundName) {
    if (!this.context || !this.master || this.muted) return
    const now = this.context.currentTime
    if (name === 'tap') this.tone(520, now, 0.08, 0.09, 'sine')
    if (name === 'wrong') {
      this.tone(260, now, 0.12, 0.08, 'sine')
      this.tone(220, now + 0.1, 0.16, 0.07, 'sine')
    }
    if (name === 'correct') {
      ;[523, 659, 784].forEach((frequency, index) => this.tone(frequency, now + index * 0.1, 0.22, 0.12, 'sine'))
    }
    if (name === 'clear') {
      ;[523, 659, 784, 1047].forEach((frequency, index) => this.tone(frequency, now + index * 0.13, 0.35, 0.14, 'triangle'))
    }
  }

  private playMusicNote() {
    if (!this.context || !this.music || this.muted) return
    const melody = [262, 330, 392, 330, 294, 349, 440, 349]
    const frequency = melody[this.noteIndex % melody.length]
    this.noteIndex += 1
    this.tone(frequency, this.context.currentTime, 0.42, 0.055, 'sine', this.music)
  }

  private tone(frequency: number, start: number, duration: number, volume: number, type: OscillatorType, output = this.master) {
    if (!this.context || !output) return
    const oscillator = this.context.createOscillator()
    const gain = this.context.createGain()
    oscillator.type = type
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.025)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    oscillator.connect(gain)
    gain.connect(output)
    oscillator.start(start)
    oscillator.stop(start + duration + 0.02)
  }
}

export const gameAudio = new GameAudio()
