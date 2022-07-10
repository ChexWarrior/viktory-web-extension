class PubSub {

  constructor() {
    this.topics = new Map();
  }

  subscribe(topic, listener, that = null) {
    // Create topic if we don't already have it
    if (!this.topics.has(topic)) {
      this.topics.set(topic, []);
    }

    const currentListeners = this.topics.get(topic);
    const index = currentListeners.push({listener, that}) - 1;
    this.topics.set(topic, currentListeners);

    // Return index so calling code can remove topic
    return index;
  }

  removeListener(topic, index) {
    if (index < 0 || !this.topics.has(topic)) {
      return false;
    }

    let currentListeners = this.topics.get(topic);

    if (index >= currentListeners.length) {
      return false;
    }

    currentListeners = currentListeners.splice(index, 1);

    return true;
  }

  removeTopic(topic) {
    if (!this.topics.has(topic)) {
      return false;
    }

    return this.topics.delete(topic);
  }

  publish(topic, info = {}) {
    if (!this.topics.has(topic)) return;

    this.topics.get(topic).forEach(function(listenerInfo) {
      let { listener, that } = listenerInfo;
      listener.apply(that, [info]);
    });
  }
}

export { PubSub };