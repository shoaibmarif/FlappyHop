/**
 * Tiny Web Audio synth. Every sound is generated on the fly, so there are no
 * audio files to download and nothing plays until the player taps.
 */
class PondSounds {
  private ctx: AudioContext | null = null;
  private muted = false;

  setMuted(m: boolean) {
    this.muted = m;
  }

  private audio(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return null;
      this.ctx = new Ctx();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    return this.ctx;
  }

  /** One note that slides from `from` to `to` Hz. */
  private tone(from: number, to: number, length: number, volume = 0.15, type: OscillatorType = 'sine', delay = 0) {
    const ctx = this.audio();
    if (!ctx) return;
    try {
      const start = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(from, start);
      osc.frequency.exponentialRampToValueAtTime(to, start + length);
      gain.gain.setValueAtTime(volume, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + length);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + length + 0.02);
    } catch {
      // audio unavailable
    }
  }

  hop() {
    this.tone(260, 420, 0.09, 0.12, 'triangle');
  }
  gate() {
    this.tone(880, 1320, 0.12, 0.08);
  }
  fly(combo: number) {
    // Each firefly in a chain rings a little higher.
    const base = 1046 * Math.pow(2, Math.min(combo - 1, 7) / 12);
    this.tone(base, base * 1.5, 0.1, 0.07);
  }
  pad() {
    this.tone(180, 520, 0.18, 0.16, 'sine');
  }
  glowbug() {
    [784, 988, 1175, 1568].forEach((f, i) => this.tone(f, f * 1.02, 0.12, 0.07, 'sine', i * 0.05));
  }
  shield() {
    this.tone(1400, 500, 0.3, 0.1, 'triangle');
  }
  splash() {
    const ctx = this.audio();
    if (!ctx) return;
    try {
      const len = 0.4;
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * len), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 2;
      const src = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      filter.type = 'lowpass';
      filter.frequency.value = 1200;
      gain.gain.value = 0.25;
      src.buffer = buffer;
      src.connect(filter).connect(gain).connect(ctx.destination);
      src.start();
    } catch {
      // audio unavailable
    }
  }
  bonk() {
    this.tone(220, 70, 0.25, 0.18, 'square');
  }
  best() {
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, f, 0.16, 0.09, 'triangle', i * 0.09));
  }
  click() {
    this.tone(500, 500, 0.04, 0.05);
  }
}

export const sound = new PondSounds();
