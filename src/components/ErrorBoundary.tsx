import React from 'react';

interface State {
  error: Error | null;
}

const RELOAD_KEY = 'flappyhop.chunk-reload';

/**
 * Catches rendering errors so a problem shows a message instead of a blank page.
 * After a new deploy, an open tab can ask for page files that no longer exist;
 * in that case it reloads once to pick up the new version.
 */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode; resetKey?: string }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    const staleChunk = /dynamically imported module|Importing a module script failed|Failed to fetch|ChunkLoadError/i.test(error.message);
    try {
      if (staleChunk && !sessionStorage.getItem(RELOAD_KEY)) {
        sessionStorage.setItem(RELOAD_KEY, '1');
        window.location.reload();
      }
    } catch {
      // storage blocked: fall through to the message
    }
  }

  componentDidUpdate(prev: { resetKey?: string }) {
    // Navigating to another page clears the error.
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-ink-2">Sorry about that. Reloading the page usually fixes it, and your progress is safe.</p>
        <button type="button" className="btn btn-glow mt-6" onClick={() => window.location.reload()}>
          Reload the page
        </button>
      </div>
    );
  }
}
