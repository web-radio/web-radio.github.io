import { ref } from 'vue';
import type { Ref } from 'vue';

export default class AudioService {
  public audio: HTMLAudioElement;
  public volume: Ref<number>;
  public paused: Ref<boolean>;
  public error: Ref<MediaError | null>;
  public waiting: Ref<boolean>;
  public duration: Ref<number>;
  public currentTime: Ref<number>;

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'metadata';

    this.volume = ref(this.audio.volume);
    this.audio.onvolumechange = () => {
      this.volume.value = this.audio.volume;
    };

    this.waiting = ref(this.audio.readyState >= 2);
    this.audio.onwaiting = () => {
      this.waiting.value = true;
    };
    this.audio.oncanplaythrough = () => {
      this.waiting.value = false;
    };

    this.paused = ref(this.audio.paused);
    this.audio.onpause = () => {
      this.paused.value = true;
    };
    this.audio.onplaying = () => {
      this.paused.value = false;
      this.waiting.value = false;
    };

    this.error = ref(this.audio.error);
    this.audio.onerror = () => {
      this.error.value = this.audio.error;
    };
    this.audio.onplay = () => {
      this.error.value = null;
    };

    this.duration = ref(0);
    this.audio.onprogress = () => {
      this.duration.value = this.audio.buffered.end(0);
    };

    this.currentTime = ref(this.audio.currentTime);
    this.audio.ontimeupdate = () => {
      this.currentTime.value = this.audio.currentTime;
    };
  }

  public setSource(newValue: string) {
    this.audio.src = newValue;
  }

  public play() {
    this.audio.play();
  }

  public pause() {
    this.audio.pause();
  }

  public load() {
    this.audio.load();
  }

  public setVolume(newValue: number) {
    this.audio.volume = newValue;
  }

  public changeCurrentTime(change: number) {
    this.audio.currentTime += change;
  }
}
