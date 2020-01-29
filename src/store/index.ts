import { createStore } from 'easy-peasy';
import model from '../model';
import * as githubService from '../services/github-service';

export interface Injections {
  githubService: typeof githubService;
}

const store = createStore(model, {
  injections: {
    githubService
  }
});

// Wrapping dev only code like this normally gets stripped out by bundlers
// such as Webpack when creating a production build.
if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept('../model', () => {
      store.reconfigure(model); // 👈 Here is the magic
    });
  }
}

export default store;
