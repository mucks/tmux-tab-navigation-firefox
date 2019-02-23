let tmuxActive = false;

const handleKeyDown = (kv: KeyboardEvent) => {
  if (kv.key == 'n' && kv.ctrlKey) {
    kv.preventDefault()
  }
  if (kv.key == 'b' && kv.ctrlKey) {
    kv.preventDefault()
    console.log('tmux activated');
    tmuxActive = true;
  }

  if (kv.key == 'n' && tmuxActive) {
    kv.preventDefault()
    tmuxActive = false;
    sendTmuxEvent('next');
  }
  
  if (kv.key == 'p' && tmuxActive) {
    kv.preventDefault()
    tmuxActive = false;
    sendTmuxEvent('previous');
  }

  if (kv.key == 'c' && tmuxActive) {
    kv.preventDefault()
    tmuxActive = false;
    sendTmuxEvent('new');
  }
};

function sendTmuxEvent(event: string) {
  browser.runtime.sendMessage(event).then(msg => {
  });
}


document.addEventListener('keydown', handleKeyDown);