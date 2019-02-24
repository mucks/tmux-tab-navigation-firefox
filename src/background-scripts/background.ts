class BackgroundService {
  private readonly newTabUrl = 'https://www.google.com';

  listen() {
    browser.runtime.onMessage.addListener((msg: any) => this.onMessage(msg));
  }

  onMessage(msg: string) {
    this.getCurrentWindowId(id => {
      let choices: { [event: string]: { (): void } } = {
        'previous': () => { this.focusTab(id, -1) },
        'next': () => { this.focusTab(id, 1) },
        'create': () => { browser.tabs.create({ url: this.newTabUrl }) }
      };

      choices[msg]();
    })
  }

  focusTab(windowId: number, indexChange: number) {
    browser.tabs.query({}).then((tabs: browser.tabs.Tab[]) => {
      const currentWindowTabs = tabs.filter(tab => tab.windowId == windowId);
      const activeTab = currentWindowTabs.filter(tab => tab.active)[0];

      if (activeTab) {
        const newTab = currentWindowTabs
          .filter(tab => tab.index == activeTab.index + indexChange)[0];

        if (newTab) {
          browser.tabs.update(newTab.id, { active: true });
        }
      }
    });
  }

  getCurrentWindowId(callback: { (id: number): void }): void {
    browser.windows.getCurrent().then((window: browser.windows.Window) => {
      callback(window.id);
    });
  }
}

const backgroundService = new BackgroundService();
backgroundService.listen();