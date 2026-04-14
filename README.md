# Talking Bear

Expo (React Native) app with a voice-driven flow: listen for speech above a loudness threshold, record a clip, play it back with optional trim from the detected speech start, then return to listening.

## Domain logic: State pattern

The audio behavior is modeled as explicit **phases** (`AudioPhase` in `src/audio/use-audio-store.ts`). The store holds the current phase plus data the phases need (`recordedUri`, `speechStartOffsetMs`). Hooks (`useAudioPermissions`, `useVoiceRecognition`, `useAudioSpeaker`) react to phase and update it—this is a **state-machine / State-style** design: behavior is chosen by the current phase, not scattered flags.

Phases:

| Phase | Meaning |
|--------|--------|
| `AskPermissions` | Microphone access is missing or blocked. |
| `Monitoring` | Always recording in the background; watching input level. |
| `Recording` | Speech crossed the loudness threshold; capturing the take. |
| `Playing` | Playback of the last recording; microphone capture is turned off for the session. |

---

### 1. Permissions (`AskPermissions`)

- **When it runs:** On app load, whenever the app becomes **active** again (e.g. returning from iOS Settings), and the hook resets an internal “settings alert” guard when the app goes to **background** so the next foreground can prompt again if needed.
- **Default:** Initial phase is **`AskPermissions`** until the OS reports microphone access granted, then the phase moves to **`Monitoring`**.
- **While `AskPermissions`:** The voice pipeline does not start recording (`useVoiceRecognition` only arms recording when phase is **`Monitoring`**), so **no capture or playback** from the main audio flow until permission is resolved.

---

### 2. Monitoring

- **Behavior:** Start (or keep) **recording** and poll **metering** (input level in decibels).
- **Rule:** If the level **stays at or below** the configured threshold, stay in **`Monitoring`** and keep listening.
- **Transition:** If the level **goes above** the threshold, move to **`Recording`** and store **`speechStartOffsetMs`** (position in the current take when speech was detected) so playback can skip silence at the beginning.

---

### 3. Recording

- **Behavior:** Continue reading metering while recording.
- **While loud enough:** Remain in **`Recording`** (and keep the speech-start offset meaningful for the current segment).
- **When level drops below the threshold:** **Stop** the recorder, publish **`recordedUri`** to the store, and leave phase as **`Recording`** until the speaker hook picks up the file (the next step is driven by `recordedUri` + phase, not a separate “Saving” phase in the store).

---

### 4. Playing

- **Entering:** When there is a **`recordedUri`** and phase is not already **`Playing`**, the speaker hook turns **off** microphone recording for playback (`switchAudioRecording({ enable: false })`), sets phase to **`Playing`**, loads the file, optionally **seeks** using **`speechStartOffsetMs`**, and plays.
- **Exiting:** **Only after playback finishes** (`didJustFinish`), the store is reset for that cycle (**`recordedUri`** cleared, phase set back to **`Monitoring`**). Then monitoring-style recording can run again.

---

## Run the project

Install dependencies and start the dev server:

```bash
npm install
npx expo start
```

Use the Expo CLI to open an iOS simulator, Android emulator, or a development build on a device.

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
