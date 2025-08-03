import { UploadIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { formatFileSize, readFileAsText } from '@/lib/file';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';

interface FileUploaderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  acceptedFileTypes?: string;
  maxFileSize?: number;
  onFileUpload?: (content: string, file: File) => void;
  onError?: (error: string) => void;
}

function FileUploaderDialog({
  open,
  onOpenChange,
  title = 'Upload File',
  description = 'Select a file to upload',
  acceptedFileTypes = '.json,.txt,.csv',
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  onFileUpload,
  onError,
}: FileUploaderDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.size > maxFileSize) {
      onError?.(`File size exceeds ${formatFileSize(maxFileSize)} limit`);
      return;
    }

    if (acceptedFileTypes) {
      const allowedTypes = acceptedFileTypes
        .split(',')
        .map((type) => type.trim().toLowerCase());

      const mimeValid =
        file.type && allowedTypes.includes(file.type.toLowerCase());
      const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const extValid = allowedTypes.includes(ext);

      if (!mimeValid && !extValid) {
        onError?.(`Unsupported file type: ${file.type || ext}`);
        return;
      }
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    } else if (event.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !onFileUpload) return;

    setIsUploading(true);
    try {
      const content = await readFileAsText(selectedFile);
      onFileUpload(content, selectedFile);
      onOpenChange(false);
      setSelectedFile(null);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Failed to read file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    onOpenChange(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50',
              selectedFile && 'border-primary bg-primary/5'
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Input
              ref={fileInputRef}
              type="file"
              accept={acceptedFileTypes}
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="space-y-2">
              <UploadIcon className="mx-auto h-8 w-8 text-muted-foreground" />
              {selectedFile ? (
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Accepted formats:{' '}
                    {acceptedFileTypes.replace(/\./g, '').toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Max size: {(maxFileSize / (1024 * 1024)).toFixed(1)}MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { FileUploaderDialog };
