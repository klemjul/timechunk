import { useState } from 'react';
import { toast } from 'sonner';
import { TimeChunkInitializer } from './components/TimeChunkInitializer/TimeChunkInitializer';
import { TimeChunkViewer } from './components/TimeChunkViewer/TimeChunkViewer';
import type { TimeChunk } from './models';
import { timeChunkToJSON, timeChunkFromJSON } from './lib/timechunk';
import { downloadFile } from './lib/file';
import { FileUploaderDialog } from './components/FileUploaderDialog/FileUploaderDialog';

function App() {
  const [timeChunk, setTimeChunk] = useState<TimeChunk | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const handleTimeChunkExport = (timeChunk: TimeChunk) => {
    const jsonData = timeChunkToJSON(timeChunk);
    const filename = `${timeChunk.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_timechunk.json`;
    downloadFile(jsonData, filename);
  };

  const handleFileUpload = (content: string, file: File) => {
    try {
      const importedTimeChunk = timeChunkFromJSON(content);
      setTimeChunk(importedTimeChunk);
      setShowImportDialog(false);
      toast.success(`Successfully imported "${importedTimeChunk.name}"`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Invalid file format';
      toast.error(`Failed to import ${file.name}: ${errorMessage}`);
    }
  };

  const handleImportError = (error: string) => {
    toast.error(error);
  };

  const handleTimeChunkImport = () => {
    setShowImportDialog(true);
  };

  return (
    <>
      {timeChunk ? (
        <TimeChunkViewer
          timeChunk={timeChunk}
          onTimeChunkExport={handleTimeChunkExport}
          onTimeChunkImport={handleTimeChunkImport}
          onTimeChunkUpdate={setTimeChunk}
        />
      ) : (
        <TimeChunkInitializer
          onTimeChunkCreate={setTimeChunk}
          onTimeChunkImport={handleTimeChunkImport}
        />
      )}

      <FileUploaderDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        title="Import Time Chunk"
        description="Select a JSON file to import your time chunk"
        acceptedFileTypes=".json"
        onFileUpload={handleFileUpload}
        onError={handleImportError}
      />
    </>
  );
}

export default App;
