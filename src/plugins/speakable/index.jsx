
function routeFactory({ widget }) {
  function setState(state) {
    widget.setState({
      speakable: {
        ...widget.state.speakable,
        ...state,
      }
    })
  }

  return {
    view: () => {
      const { onPrevious, onNext, onPlay, onPause, onCancel, onParse } = widget.router.getCurrentRoute();

      const defaultButton = {
        width: '40px',
        height: '40px',
        fontSize: '22px',
        margin: '0px 4px',
      }

      return (
      <>
          {widget.state.speakable.error && <strong>{widget.state.speakable.error.message}</strong>}
          <button style={{ ...defaultButton }} onClick={onParse}>{'+'}</button>
          <button style={{...defaultButton}} onClick={onPrevious}>{'<<'}</button>
          <button style={{ ...defaultButton }} onClick={onPlay}>{'>'}</button>
          <button style={{ ...defaultButton }} onClick={onPause}>{'||'}</button>
          <button style={{ ...defaultButton }} onClick={onNext}>{'>>'}</button>
          <button style={{ ...defaultButton }} onClick={onCancel}>{'X'}</button>
      </>)
    },
    onPrevious() {
      window.speechSynthesis.cancel();
      const { playing } = widget.state.speakable;
      setState({ playing: false, paused: false, textIndex: Math.max(0, widget.state.speakable.textIndex - 1) });
      if (playing) {
        widget.router.getCurrentRoute().onPlay();
      }
    },
    onNext() {
      window.speechSynthesis.cancel();
      const { playing } = widget.state.speakable;
      setState({ playing: false, paused: false, textIndex: Math.min(widget.state.speakable.texts.length - 1, widget.state.speakable.textIndex + 1) });
      if (playing) {
        widget.router.getCurrentRoute().onPlay();
      }
    },
    onParse() {
      setState({ texts: [...widget.state.speakable.texts, ...Array.from(document.querySelectorAll('.speakable')).map(element => element.textContent)], textIndex: 0 });
    },
    onPlay() {
      let { texts, playing, paused } = widget.state.speakable
      if (playing) {
        return;
      }
      if (paused) {
        window.speechSynthesis.resume();
        return;
      }

      // parse content from page
      if (texts.length === 0) {
        widget.router.getCurrentRoute().onParse();
      }
    
      const { speakable } = widget.state 
      
      widget.$in.speakable.speech.text = speakable.texts[speakable.textIndex];
      window.speechSynthesis.speak(widget.$in.speakable.speech);

    },
    onCancel() {
      window.speechSynthesis.cancel();
      setState({
        textIndex: 0,
        texts: [],
        playing: false,
        paused: false,
      });
    },
    onPause() {
      window.speechSynthesis.pause();
    },
    init() {
      if (!widget.$in.initialized) {
        widget.$in.initialized = true;

        widget.$in.speakable.speech.addEventListener('end', () => {
          if (widget.state.speakable.textIndex + 1 < widget.state.speakable.texts.length) {
            setState({
              textIndex: widget.state.speakable.textIndex + 1,
              playing: false,
              paused: false,
            })
            widget.router.getCurrentRoute().onPlay();
          }
        });
        widget.$in.speakable.speech.addEventListener('start', () => {
          setState({ playing: true, paused: false });
        });
        widget.$in.speakable.speech.addEventListener('resume', () => {
          setState({ playing: true, paused: false });
        });
        widget.$in.speakable.speech.addEventListener('pause', () => {
          setState({ playing: false, paused: true });
        });
        widget.$in.speakable.speech.addEventListener('error', (error) => {
          setState({ playing: false, paused: false, error });
        });

      }
      widget.$in.speakable.speech.addEventListener('end', () => {
        if (widget.state.speakable.textIndex + 1 < widget.state.speakable.texts.length) {
          setState({
            textIndex: widget.state.speakable.textIndex + 1,
            playing: false,
            paused: false,
          })
          widget.router.getCurrentRoute().onPlay();
        } else {
          setState({
            textIndex: 0,
            texts: [],
            playing: false,
            paused: false,
          });
        }
      })
    },
    load() {
      return { ...widget.$in.speakable.state };
    },
    destroy() {
      widget.$in.speakable.state.speakable = {...widget.state.speakable};
    },
  };
}



export function speakablePlugin() {
  return {
    async setup(widget) {
      widget.$external.routes.push({
        name: 'speakable',
        path: '/speakable',
        action: (args) => {
          return { ...args.route, ...routeFactory(args) };
        },
      });

      const speech = new SpeechSynthesisUtterance();
      speech.lang = document.querySelector('html')?.getAttribute('lang') ?? 'en';
      speech.pitch = 1;
      speech.rate = 1;
      widget.$in.speakable = {
        speech,
        initialized: false,
        state: {
          speakable: {
            texts:[],
            textIndex: 0,
            playing: false,
            paused: false,
            error: null,
          }
        }
      };
      window.speechSynthesis.cancel();

      return widget;
    },
    async create(widget) {
      return widget;
    },
  };
}
