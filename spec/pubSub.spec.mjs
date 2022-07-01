import { PubSub } from "../src/js/modules/pubSub.mjs";

describe('Testing PubSub class', function() {

  it('Subscribing to a new topic returns index 0', function() {
    const pubSub = new PubSub();
    let index = pubSub.subscribe('event', () => 1);
    
    expect(index).toBe(0);
  });
});
