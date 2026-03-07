let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") {
    return null;
  }

  const AudioContextConstructor = window.AudioContext;

  if (!AudioContextConstructor) {
    return null;
  }

  if (audioContext === null) {
    audioContext = new AudioContextConstructor();
  }

  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }

  return audioContext;
}

function playToneSequence(
  tones: Array<{ frequency: number; duration: number; type: OscillatorType }>,
  gainValue: number
): void {
  const context = getAudioContext();

  if (context === null) {
    return;
  }

  let startTime = context.currentTime;

  for (const tone of tones) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = tone.type;
    oscillator.frequency.setValueAtTime(tone.frequency, startTime);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(gainValue, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + tone.duration);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + tone.duration);

    startTime += tone.duration + 0.03;
  }
}

export function playCorrectSound(): void {
  playToneSequence(
    [
      { frequency: 659.25, duration: 0.12, type: "triangle" },
      { frequency: 880, duration: 0.18, type: "triangle" }
    ],
    0.06
  );
}

export function playWrongSound(): void {
  playToneSequence(
    [
      { frequency: 392, duration: 0.14, type: "sine" },
      { frequency: 311.13, duration: 0.2, type: "sine" }
    ],
    0.05
  );
}
