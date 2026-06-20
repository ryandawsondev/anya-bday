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
  try {
    const c = ctx()
    const now = c.currentTime

    // Low rumble — engine spool
    const o1 = c.createOscillator(); const g1 = c.createGain()
    o1.connect(g1); g1.connect(c.destination)
    o1.type = 'sine'
    o1.frequency.setValueAtTime(55, now)
    o1.frequency.exponentialRampToValueAtTime(120, now + 1.0)
    g1.gain.setValueAtTime(0, now)
    g1.gain.linearRampToValueAtTime(0.14, now + 0.08)
    g1.gain.exponentialRampToValueAtTime(0.0001, now + 1.0)
    o1.start(now); o1.stop(now + 1.0)

    // Mid sweep — launch rush
    const o2 = c.createOscillator(); const g2 = c.createGain()
    o2.connect(g2); g2.connect(c.destination)
    o2.type = 'sine'
    o2.frequency.setValueAtTime(200, now + 0.08)
    o2.frequency.exponentialRampToValueAtTime(900, now + 0.75)
    g2.gain.setValueAtTime(0, now + 0.08)
    g2.gain.linearRampToValueAtTime(0.08, now + 0.18)
    g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.75)
    o2.start(now + 0.08); o2.stop(now + 0.75)

    // High shimmer — hyperspace sparkle
    const o3 = c.createOscillator(); const g3 = c.createGain()
    o3.connect(g3); g3.connect(c.destination)
    o3.type = 'sine'
    o3.frequency.setValueAtTime(1100, now + 0.05)
    o3.frequency.exponentialRampToValueAtTime(2600, now + 0.45)
    g3.gain.setValueAtTime(0, now + 0.05)
    g3.gain.linearRampToValueAtTime(0.045, now + 0.12)
    g3.gain.exponentialRampToValueAtTime(0.0001, now + 0.45)
    o3.start(now + 0.05); o3.stop(now + 0.45)
  } catch {}
}
