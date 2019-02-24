class KeyboardEventHandler {
  keyToEventMap: Map<string, string> = new Map(
    [
      ['n', 'next'],
      ['p', 'previous'],
      ['c', 'create'],
      ['b', 'back']
    ]
  );
  keysToDisable: string[] = ['n', 'p', 'b'];
  tmuxKey = 'b';
  tmuxKeyActivated = false;

  listen() {
    document.addEventListener('keydown', (kv) => this.handleKeyDown(kv));
  }

  handleKeyDown(kv: KeyboardEvent): void {
    if (kv.ctrlKey && this.keysToDisable.includes(kv.key)) { kv.preventDefault() };
    if (kv.ctrlKey && kv.key == this.tmuxKey) { this.tmuxKeyActivated = true };

    if (this.tmuxKeyActivated && kv.key != this.tmuxKey) {
      this.tmuxKeyActivated = false;
      browser.runtime.sendMessage(this.keyToEventMap.get(kv.key));
    }
  }
}
let kbHandler = new KeyboardEventHandler();
kbHandler.listen();