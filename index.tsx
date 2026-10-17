import './index.css';
import {createRoot} from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root')!);

root.render(
  <div
    style={{
      position: 'relative',
      width: '100vw',
      height: '100dvh',
      overflow: 'hidden',
    }}>
    <App />
  </div>,
);
