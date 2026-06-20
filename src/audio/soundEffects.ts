let audioCtx: AudioContext | null = null

function ctx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function tone(freq: number, type: OscillatorType, gain: number, duration: number, freqEnd?: number) {
  try {
    const c = ctx()
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.connect(g)
    g.connect(c.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, c.currentTime)
    if (freqEnd !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(freqEnd, c.currentTime + duration)
    }
    g.gain.setValueAtTime(gain, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + duration)
  } catch {}
}

export function playStarHover() {
  tone(1400, 'sine', 0.035, 0.2)
}

export function playStarClick() {
  tone(880, 'sine', 0.07, 0.45)
  tone(1320, 'sine', 0.04, 0.45)
}

export function playWarpStart() {
  tone(90, 'sawtooth', 0.1, 0.9, 500)
}
