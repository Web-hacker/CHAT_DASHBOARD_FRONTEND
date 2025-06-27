
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, FileText, Github } from 'lucide-react';
import { UploadedFile, GitHubLink } from '../types/chat';

interface UploadedItemsPanelProps {
  uploadedFiles: UploadedFile[];
  githubLinks: GitHubLink[];
  onDeleteFile: (fileId: string) => void;
  onDeleteGithubLink: (linkId: string) => void;
}

const UploadedItemsPanel: React.FC<UploadedItemsPanelProps> = ({
  uploadedFiles,
  githubLinks,
  onDeleteFile,
  onDeleteGithubLink,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const extractRepoName = (url: string) => {
    try {
      const match = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
      return match ? match[1] : url;
    } catch {
      return url;
    }
  };

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-3 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {/* Uploaded Files */}
          {uploadedFiles.map((file) => (
            <Badge
              key={file.id}
              variant="secondary"
              className="flex items-center space-x-2 px-2 sm:px-3 py-1 sm:py-2 bg-blue-50 border-blue-200 text-blue-800 text-xs sm:text-sm max-w-full"
            >
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 min-w-0">
                <span className="truncate max-w-24 sm:max-w-32 md:max-w-48" title={file.name}>
                  {file.name}
                </span>
                <span className="text-xs text-blue-600 hidden sm:inline">
                  ({formatFileSize(file.size)})
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-red-100 text-red-600 shrink-0"
                onClick={() => onDeleteFile(file.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}

          {/* GitHub Links */}
          {githubLinks.map((link) => (
            <Badge
              key={link.id}
              variant="secondary"
              className="flex items-center space-x-2 px-2 sm:px-3 py-1 sm:py-2 bg-green-50 border-green-200 text-green-800 text-xs sm:text-sm max-w-full"
            >
              <Github className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate max-w-32 sm:max-w-48 md:max-w-64" title={link.url}>
                {extractRepoName(link.url)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-red-100 text-red-600 shrink-0"
                onClick={() => onDeleteGithubLink(link.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadedItemsPanel;
