import { useState } from 'react';
import { TimeChunkInitializer } from './components/TimeChunkInitializer/TimeChunkInitializer';
import { TimeChunkViewer } from './components/TimeChunkViewer/TimeChunkViewer';
import type { TimeChunk } from './models';

function App() {
  const [timeChunk, setTimeChunk] = useState<TimeChunk | null>(null);

  if (timeChunk) {
    return <TimeChunkViewer timeChunk={timeChunk} />;
  }

  return (
    <>
      <TimeChunkInitializer
        onComplete={(t) => {
          setTimeChunk(t);
        }}
      />
    </>
  );
}

export default App;
