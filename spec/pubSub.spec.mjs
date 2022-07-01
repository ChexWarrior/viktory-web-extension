import { PubSub } from "../src/js/modules/pubSub.mjs";

describe('Testing PubSub class', function() {

  it('Subscribing to a new topic returns index 0', function() {
    const pubSub = new PubSub();
    let index = pubSub.subscribe('event', () => 1);

    expect(index).toBe(0);
  });

  it('Subscribing to the same topic twice returns index 1', function() {
    const pubSub = new PubSub();
    pubSub.subscribe('event', () => 1);
    let index = pubSub.subscribe('event', () => 2);

    expect(index).toBe(1);
  });
});
