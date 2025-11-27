import React from "react";
import {
  Download,
  X,
  Calendar,
  User,
  Tag,
  Heart,
  Share2,
  ArrowDown,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { toast } from "sonner";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

interface Gallery {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  publicId: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  category: string;
  tags: string[];
  uploadedBy: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

interface ImagePreviewModalProps {
  open: boolean;
  onClose: () => void;
  gallery: Gallery | null;
  onDownload: (imageUrl: string, title: string) => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  open,
  onClose,
  gallery,
  onDownload,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!gallery) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>
          <div>Gallery view</div>
        </DialogTitle>
        <DialogDescription>
          <div>Gallery view</div>
        </DialogDescription>
      </DialogHeader>
      <DialogContent className="max-w-7xl max-h-[95vh] p-0 bg-white dark:bg-slate-900 border-0 shadow-3xl overflow-hidden rounded-3xl">
        <div className="flex flex-col lg:flex-row h-[95vh]">
          {/* Image Section */}
          <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 relative">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="relative max-w-full max-h-full">
              <img
                src={gallery.imageUrl}
                alt={gallery.title}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:w-96 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="p-8 h-full flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {gallery.title}
                </h1>
                {gallery.description && (
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {gallery.description}
                  </p>
                )}
              </div>

              {/* Download Button */}
              <Button
                onClick={() => onDownload(gallery.imageUrl, gallery.title)}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white py-3 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 mb-8"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Download High Quality
                <ArrowDown className="h-4 w-4 ml-2" />
              </Button>

              {/* Image Details */}
              <div className="space-y-6 flex-1">
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-lg border-b border-slate-200 dark:border-slate-700 pb-2">
                    Image Details
                  </h3>

                  {/* Category */}
                  <div>
                    <Label>Category</Label>
                    <Badge className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-sm px-3 py-1">
                      {gallery.category}
                    </Badge>
                  </div>

                  {/* Uploaded By */}
                  <div>
                    <Label>Uploaded By</Label>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <User className="h-4 w-4" />
                      <span>
                        {gallery.uploadedBy.firstName}{" "}
                        {gallery.uploadedBy.lastName}
                      </span>
                    </div>
                  </div>

                  {/* Upload Date */}
                  <div>
                    <Label>Upload Date</Label>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(gallery.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Technical Details Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Size
                      </div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatFileSize(gallery.bytes)}
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Dimensions
                      </div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {gallery.width}×{gallery.height}
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Format
                      </div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {gallery.format.toUpperCase()}
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Quality
                      </div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        HD
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {gallery.tags.length > 0 && (
                    <div>
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {gallery.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Social Actions */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-slate-300 dark:border-slate-600"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Like
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-slate-300 dark:border-slate-600"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Label component for consistency
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
      {children}
    </div>
  );
};
