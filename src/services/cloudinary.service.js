import api from './api';
import axios from 'axios';

export const cloudinaryService = {
  /**
   * Orchestrates the secure upload flow directly to Cloudinary.
   * @param {File} file - The selected image file.
   * @param {string} type - 'avatar', 'event', or 'event-gallery'.
   * @returns {Promise<string>} - The secure HTTPS image URL.
   */
  uploadImage: async (file, type) => {
    try {
      if (!file) {
        throw new Error('Please select an image file to upload.');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds the 5MB limit.');
      }

      // 1. Fetch credentials and cryptographic signature from your backend
      const signatureResponse = await api.get(`/media/upload-signature?type=${type}`);
      const creds = signatureResponse.data?.data;

      // 2. Validate backend returned genuine credentials (not placeholders)
      if (!creds || !creds.cloudName || creds.cloudName === 'your_cloud_name') {
        throw new Error(
          'Backend is returning an unconfigured Cloudinary Cloud Name ("your_cloud_name"). ' +
          'Please update CLOUDINARY_CLOUD_NAME in your backend .env file.'
        );
      }

      const { cloudName, apiKey, timestamp, signature, folder } = creds;

      // 3. Build multi-part payload with signed parameters
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);

      if (folder) {
        formData.append('folder', folder);
      }

      // 4. Dispatch directly to the active Cloudinary endpoint
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const uploadResponse = await axios.post(cloudinaryUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return uploadResponse.data.secure_url;
    } catch (error) {
      const displayError =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        'Image upload failed';

      console.error('Cloudinary Upload Rejection:', {
        status: error.response?.status,
        details: error.response?.data,
        message: displayError,
      });

      throw displayError;
    }
  },
};