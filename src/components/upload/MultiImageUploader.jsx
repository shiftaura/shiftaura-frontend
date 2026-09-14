import { useState, useRef } from 'react';
import { UploadCloud, Loader2, Image as ImageIcon } from 'lucide-react';
import { cloudinaryService } from '../../services/cloudinary.service';

export default function MultiImageUploader({ onUploadComplete, isSubmitting = false }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setError('');
    setUploadProgress({ current: 0, total: files.length });

    const uploadedUrls = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate individual file size (under 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`"${file.name}" exceeds the 5MB file size limit.`);
        }

        // Upload directly to Cloudinary using signed authorization
        const secureUrl = await cloudinaryService.uploadImage(file, 'event-gallery');
        uploadedUrls.push(secureUrl);

        setUploadProgress({ current: i + 1, total: files.length });
      }

      // Pass collected URLs back to parent component
      onUploadComplete(uploadedUrls);
    } catch (err) {
      setError(typeof err === 'string' ? err : err.message || 'Gallery upload failed.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full space-y-3">
      <div
        onClick={() => !isUploading && !isSubmitting && fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition text-center ${
          isUploading || isSubmitting
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-400'
            : 'border-gray-300 bg-white hover:border-brand-600 hover:bg-brand-50 cursor-pointer text-gray-600'
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center text-brand-600">
            <Loader2 className="animate-spin mb-2" size={28} />
            <span className="text-sm font-medium">
              Uploading image {uploadProgress.current} of {uploadProgress.total}...
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <UploadCloud size={28} className="mb-2 text-gray-400" />
            <span className="text-sm font-medium text-gray-800">
              Select Images for Event Gallery
            </span>
            <span className="text-xs text-gray-400 mt-1">
              Supports multiple PNG, JPG, or WEBP files up to 5MB each
            </span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg, image/png, image/webp"
          onChange={handleFiles}
          disabled={isUploading || isSubmitting}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-200">
          {error}
        </p>
      )}
    </div>
  );
}