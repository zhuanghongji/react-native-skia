import type { Animation, AnimationCallback, AnimationState } from "./Scheduler";

const VELOCITY_EPS = 1;
const SLOPE_FACTOR = 0.1;

interface DecayConfig {
  from: number;
  deceleration?: number;
  velocityFactor?: number;
  clamp?: number[];
  velocity?: number;
}

interface DefaultDecayConfig {
  from: number;
  deceleration: number;
  velocityFactor: number;
  clamp?: number[];
  velocity: number;
}

interface DecayState extends AnimationState {
  lastTimestamp: number;
  startTimestamp: number;
  initialVelocity: number;
  velocity: number;
}

const decay = (
  now: number,
  state: DecayState,
  config: DefaultDecayConfig
): DecayState => {
  const { lastTimestamp, startTimestamp, initialVelocity, current, velocity } =
    state;
  const animation = { ...state };
  const deltaTime = Math.min(now - lastTimestamp, 64);
  const v =
    velocity *
    Math.exp(
      -(1 - config.deceleration) * (now - startTimestamp) * SLOPE_FACTOR
    );
  animation.current = current + (v * config.velocityFactor * deltaTime) / 1000; // /1000 because time is in ms not in s
  animation.velocity = v;
  animation.lastTimestamp = now;

  if (config.clamp) {
    if (initialVelocity < 0 && animation.current <= config.clamp[0]) {
      animation.current = config.clamp[0];
      animation.finished = true;
    } else if (initialVelocity > 0 && animation.current >= config.clamp[1]) {
      animation.current = config.clamp[1];
      animation.finished = true;
    }
  }
  animation.finished = Math.abs(v) < VELOCITY_EPS;
  return animation;
};

export const withDecay =
  (
    userConfig: DecayConfig,
    callback?: AnimationCallback
  ): Animation<DecayState> =>
  (timestamp, state?) => {
    const config: DefaultDecayConfig = {
      deceleration: 0.998,
      velocityFactor: 1,
      velocity: 0,
      ...userConfig,
    };
    if (!state) {
      return {
        current: config.from,
        finished: false,
        lastTimestamp: timestamp,
        startTimestamp: timestamp,
        initialVelocity: config.velocity,
        velocity: config.velocity,
      };
    }
    const newState = decay(timestamp, state, config);
    console.log({ newState });
    if (newState.finished && callback) {
      callback(newState.current);
    }
    return newState;
  };
