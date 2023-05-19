function routeFactory({ widget }) {
  function setState(state) {
    if (widget.state.speakable) {
      widget.setState({
        speakable: {
          ...widget.state.speakable,
          ...state,
        },
      });
    } else {
      widget.$in.speakable.state.speakable = {
        ...widget.$in.speakable.state.speakable,
        ...state,
      };
    }
  }

  function sliceByCursor(str, cursor) {
    return {
      left: str?.slice(0, cursor) ?? '',
      right: str?.slice(cursor, str.length) ?? str,
    };
  }

  return {
    view: () => {
      const { onPrevious, onNext, onPlay, onPause, onCancel, onParse } =
        widget.router.getCurrentRoute();
      const { error, texts, textIndex, cursor } = widget.state.speakable;

      const defaultButton = {
        width: '40px',
        height: '40px',
        fontSize: '22px',
        margin: '0px 4px',
      };
      const cursorStyle = {
        backgroundColor: 'lightblue',
      };

      const listStyle = {
        listStyle: 'none',
        padding: 0,
      };

      const listItemStyle = {
        fontSize: '14px',
        margin: '8px 4px',
      };

      return (
        <>
          <div>{error && <strong>{error.message}</strong>}</div>
          <button style={{ ...defaultButton }} onClick={onParse}>
            {'+'}
          </button>
          <button style={{ ...defaultButton }} onClick={onPrevious}>
            {'<<'}
          </button>
          <button style={{ ...defaultButton }} onClick={onPlay}>
            {'>'}
          </button>
          <button style={{ ...defaultButton }} onClick={onPause}>
            {'||'}
          </button>
          <button style={{ ...defaultButton }} onClick={onNext}>
            {'>>'}
          </button>
          <button style={{ ...defaultButton }} onClick={onCancel}>
            {'X'}
          </button>
          <div>
            <ul style={{ ...listStyle }}>
              {texts.map((text, index) => {
                let readText = {};
                if (index < textIndex) {
                  readText = sliceByCursor(text, text.length);
                }

                if (index === textIndex) {
                  readText = sliceByCursor(text, cursor);
                }

                if (index > textIndex) {
                  readText = sliceByCursor(text, 0);
                }

                return (
                  <li key={index} style={{ ...listItemStyle }}>
                    <span style={{ ...cursorStyle }}>{readText.left}</span>
                    {readText.right}
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      );
    },
    onPrevious() {
      window.speechSynthesis.cancel();
      const { playing } = widget.state.speakable;
      setState({
        cursor: 0,
        playing: false,
        paused: false,
        textIndex: Math.max(0, widget.state.speakable.textIndex - 1),
      });
      if (playing) {
        widget.router.getCurrentRoute().onPlay();
      }
    },
    onNext() {
      window.speechSynthesis.cancel();
      const { playing } = widget.state.speakable;
      setState({
        cursor: 0,
        playing: false,
        paused: false,
        textIndex: Math.min(
          widget.state.speakable.texts.length - 1,
          widget.state.speakable.textIndex + 1
        ),
      });
      if (playing) {
        widget.router.getCurrentRoute().onPlay();
      }
    },
    onParse() {
      setState({
        texts: [
          ...widget.state.speakable.texts,
          ...Array.from(document.querySelectorAll('.speakable')).map(
            (element) => element.textContent
          ),
        ],
        textIndex: 0,
      });
    },
    onPlay() {
      let { texts, playing, paused } = widget.state.speakable;
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

      const { speakable } = widget.state;

      widget.$in.speakable.speech.text = speakable.texts[speakable.textIndex];
      window.speechSynthesis.speak(widget.$in.speakable.speech);
    },
    onCancel() {
      window.speechSynthesis.cancel();
      setState({
        cursor: 0,
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
      const { speech } = widget.$in.speakable;

      if (!widget.$in.initialized) {
        widget.$in.initialized = true;

        speech.addEventListener('end', () => {
          if (
            widget.state.speakable.textIndex + 1 <
            widget.state.speakable.texts.length
          ) {
            widget.router.getCurrentRoute().onNext();
          } else {
            widget.router.getCurrentRoute().onCancel();
          }
        });

        speech.addEventListener('start', () => {
          setState({ playing: true, paused: false });
        });
        speech.addEventListener('resume', () => {
          setState({ playing: true, paused: false });
        });
        speech.addEventListener('pause', () => {
          setState({ playing: false, paused: true });
        });
        speech.addEventListener('error', (error) => {
          setState({ playing: false, paused: false, error });
        });
        speech.addEventListener('boundary', (data) => {
          setState({ cursor: data.charIndex + data.charLength });
        });
      }
    },
    load() {
      return { ...widget.$in.speakable.state };
    },
    destroy() {
      widget.router.getCurrentRoute().onPause();
      widget.$in.speakable.state.speakable = { ...widget.state.speakable };
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
      speech.lang =
        document.querySelector('html')?.getAttribute('lang') ?? 'en';
      speech.pitch = 1;
      speech.rate = 1;
      widget.$in.speakable = {
        speech,
        initialized: false,
        state: {
          speakable: {
            cursor: 0,
            records: [],
            texts: [],
            textIndex: 0,
            playing: false,
            paused: false,
            error: null,
          },
        },
      };
      window.speechSynthesis.cancel();

      return widget;
    },
    async create(widget) {
      return widget;
    },
  };
}
