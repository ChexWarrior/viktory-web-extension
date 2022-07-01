import { PubSub } from "../src/js/modules/pubSub";

test('subscribing once to a new topic returns 1', () => {
  const pubSub = new PubSub();
  let index = pubSub.subscribe('event', () => 3);

  expect(index).toBe(1);
});
