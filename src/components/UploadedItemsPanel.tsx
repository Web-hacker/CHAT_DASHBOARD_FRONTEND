
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Upload, Github } from 'lucide-react';
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
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const formatGithubUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2) {
        return `${pathParts[0]}/${pathParts[1]}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  return (
    <div className="border-b border-gray-200 bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="space-y-3">
          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents</h3>
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((file) => (
                  <Badge
                    key={file.id}
                    variant="secondary"
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    <Upload className="w-3 h-3" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-blue-500">
                      ({formatFileSize(file.size)})
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-red-100 ml-1"
                      onClick={() => onDeleteFile(file.id)}
                    >
                      <X className="w-3 h-3 text-red-500" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* GitHub Links */}
          {githubLinks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">GitHub Repositories</h3>
              <div className="flex flex-wrap gap-2">
                {githubLinks.map((link) => (
                  <Badge
                    key={link.id}
                    variant="secondary"
                    className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-700 border border-green-200"
                  >
                    <Github className="w-3 h-3" />
                    <span className="text-sm">{formatGithubUrl(link.url)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-red-100 ml-1"
                      onClick={() => onDeleteGithubLink(link.id)}
                    >
                      <X className="w-3 h-3 text-red-500" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadedItemsPanel;
