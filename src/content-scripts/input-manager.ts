enum Modifier {
  Tmux,
  Ctrl,
  None
}

enum TmuxEvent {
  Activate = 'activate',
  Next = 'next',
  Previous = 'previous',
  Create = 'create',
  None = 'none',
}

class KeyEvent {
  constructor(public key: string,
    public modifier?: Modifier,
    public tmuxEvent?: TmuxEvent,
    public preventDefault?: boolean) { }

  private kvToModifier(kv: KeyboardEvent, tmuxActivated: boolean): Modifier {
    if (tmuxActivated) {
      return Modifier.Tmux;
    } else if (kv.ctrlKey) {
      return Modifier.Ctrl;
    }
    return Modifier.None;
  }

  public equals(kv: KeyboardEvent, tmuxActivated: boolean): boolean {
    return (this.kvToModifier(kv, tmuxActivated) == this.modifier) && this.key == kv.key;
  }
}

class KeyboardEventHandler {
  keyEvents: KeyEvent[] = [
    new KeyEvent('n', Modifier.Tmux, TmuxEvent.Next, true),
    new KeyEvent('p', Modifier.Tmux, TmuxEvent.Previous, true),
    new KeyEvent('c', Modifier.Tmux, TmuxEvent.Create, true),
    new KeyEvent('b', Modifier.Ctrl, TmuxEvent.Activate, true),
    new KeyEvent('n', Modifier.Ctrl, TmuxEvent.None, true),
    new KeyEvent('p', Modifier.Ctrl, TmuxEvent.None, true),
    new KeyEvent('b', Modifier.None, TmuxEvent.None, true),
  ]
  tmuxActivated = false;

  listen() {
    window.addEventListener('keydown', (kv) => this.handleKeyDown(kv));
  }

  handleKeyDown(kv: KeyboardEvent): void {
    for (const k of this.keyEvents) {
      if (k.equals(kv, this.tmuxActivated)) {
        if (k.preventDefault) {
          kv.preventDefault();
        }
        if (k.tmuxEvent == TmuxEvent.Activate) {
          this.tmuxActivated = true;
        } else if (this.tmuxActivated) {
          this.tmuxActivated = false;
          browser.runtime.sendMessage(k.tmuxEvent.toString());
        }
      }
    }
  }
}
let kbHandler = new KeyboardEventHandler();
kbHandler.listen();