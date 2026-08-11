/**
 * Readiness channel for the Limo Anywhere (LQC) embed.
 *
 * The embed is a cross-origin iframe injected by a third-party script, so the
 * only trustworthy "the form has painted" signal is the resize `postMessage`
 * it sends to the parent (`{"height":"NNNpx"}`). The preloader that gates the
 * first screen lives in a different branch of the tree than the widget, and
 * the signal can land before either of them mounts, so it travels through this
 * module-level channel instead of props or context.
 */

type Listener = () => void;

let ready = false;
const listeners = new Set<Listener>();

export function isEmbedReady() {
  return ready;
}

export function markEmbedReady() {
  if (ready) return;
  ready = true;
  // Copy before iterating: a listener may unsubscribe itself.
  for (const listener of [...listeners]) listener();
  listeners.clear();
}

/** Fires immediately when the embed is already up. Returns an unsubscribe. */
export function onEmbedReady(listener: Listener): () => void {
  if (ready) {
    listener();
    return () => {};
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
