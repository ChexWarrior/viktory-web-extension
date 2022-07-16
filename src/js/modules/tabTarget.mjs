/**
 * Abstract class which provides method for hiding/showing
 * another classes HTML content in response to TabDisplay
 * events
 */
class TabTarget {
  /**
   * @param {HTMLElement} container
   * @param {PubSub} pubSub
   */
  constructor(container, pubSub) {
    this.container = container;
    this.tabBody = container.dataset.tabBody;

    pubSub.subscribe('tab-change', this.handleTabChange, this);
  }

  handleTabChange(tabInfo) {
    let [index] = tabInfo;
    console.log('hello');
    if (index === this.tabBody) {
      this.container.classList.remove('is-hidden');
    } else {
      this.container.classList.add('is-hidden');
    }
  }
}

export { TabTarget };
