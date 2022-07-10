class TabDisplay {

  /**
   * @param {*} tabContainer The HTML for the actual tab controls
   */
  constructor(tabContainer, pubSub) {
    this.pubSub;
    this.tabContainer = tabContainer;
    this.tabs = tabContainer.querySelectorAll('li');
    //this.tabBodies = tabBodies;

    /**
     * Clicking a tab makes it active and shows related body
     * while hiding all others
     */
    this.tabContainer.addEventListener('click', (e) => {
      const li = e.target.parentElement;
      const tabControl = li.dataset.tabControl;
      pubSub.publish('tab-change', tabControl);

      if (!li.classList.contains('is-active')) {
        this.tabs.forEach((elem) => elem.classList.remove('is-active'));
        li.classList.add('is-active');
      }
    });
  }
}

export { TabDisplay };
