import { useState, useRef } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { cloudinaryService } from '../../services/cloudinary.service';

export default function ImageUploader({ type, onUploadSuccess, currentImage }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const secureUrl = await cloudinaryService.uploadImage(file, type);
      onUploadSuccess(secureUrl);
    } catch (err) {
      setError(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      {currentImage && !isUploading ? (
        <div className="relative inline-block">
          <img src={currentImage} alt="Uploaded" className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm" />
          <button 
            type="button"
            onClick={() => onUploadSuccess('')}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-600 hover:bg-brand-50 transition"
        >
          {isUploading ? (
            <div className="flex flex-col items-center text-brand-600">
              <Loader2 className="animate-spin mb-2" size={24} />
              <span className="text-sm font-medium">Uploading securely...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <UploadCloud size={24} className="mb-2" />
              <span className="text-sm font-medium">Click to upload {type}</span>
              <span className="text-xs mt-1 text-gray-400">Max size 5MB</span>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg, image/png, image/webp" 
            className="hidden" 
            disabled={isUploading}
          />
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}