import { TimeChunkInitializer } from './components/TimeChunkInitializer/TimeChunkInitializer';

export function Home() {
  return (
    <div className="w-full h-screen overflow-hidden">
      <TimeChunkInitializer
        onComplete={(d) => {
          console.log(d);
        }}
      />
    </div>
  );
}
