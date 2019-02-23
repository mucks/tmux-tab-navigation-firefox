function focusTab(windowId: number, indexChange: number) {
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

function getCurrentWindowId(callback: { (id: number): void }): void {
  browser.windows.getCurrent().then((window: browser.windows.Window) => {
    callback(window.id);
  });
}

const newTabUrl = 'https://www.google.com';

function handleTmuxEvent(request: any) {
  getCurrentWindowId(id => {
    switch (request) {
      case 'next':
        focusTab(id, 1);
        break;
      case 'previous':
        focusTab(id, -1);
        break;
      case 'new':
        browser.tabs.create({url: newTabUrl});
        break;
    }
  });
}

browser.runtime.onMessage.addListener(handleTmuxEvent);