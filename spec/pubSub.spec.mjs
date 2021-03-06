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

  it('Publishing a topic runs all listeners', function() {
    const pubSub = new PubSub();
    let count = 0;
    pubSub.subscribe('event', () => count += 1);
    pubSub.subscribe('event', () => count += 2);
    pubSub.publish('event');

    expect(count).toBe(3);
  });

  it('Correctly removes listener for topic by index', function() {
    const pubSub = new PubSub();
    let count = 0;
    let index = pubSub.subscribe('event', () => count += 2);
    pubSub.subscribe('event', () => count += 1);
    pubSub.removeListener('event', index);
    pubSub.publish('event');

    expect(count).toBe(1);
  });

  it('Correctly removes all listeners for topic', function() {
    const pubSub = new PubSub();
    let count = 0;
    pubSub.subscribe('event', () => count += 1);
    pubSub.subscribe('event', () => count += 1);
    pubSub.subscribe('event', () => count += 1);
    pubSub.subscribe('event', () => count += 1);
    pubSub.removeTopic('event');
    pubSub.publish('event');

    expect(count).toBe(0);
  });
});
