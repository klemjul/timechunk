import { render } from 'preact';

import { Header } from './components/Header.jsx';
import { Home } from './Home.js';

export function App() {
  return (
    <>
      <Header />
      <main>
        <Home />
      </main>
    </>
  );
}

render(<App />, document.getElementById('app'));
