import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Upload, File, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../Button';
import { QuestionsSchema, QuestionsValidationResult } from '../../../utils/validation/questionSchemas';

interface FileUploaderProps {
  onFileUpload: (file: File, content: any) => void;
  onValidationChange: (result: QuestionsValidationResult) => void;
  onError?: (error: string) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in MB
  className?: string;
}

export interface FileUploaderRef {
  clearFile: () => void;
}

export const FileUploader = forwardRef<FileUploaderRef, FileUploaderProps>(({
  onFileUpload,
  onValidationChange,
  onError,
  acceptedFileTypes = ['.json'],
  maxFileSize = 5,
  className = ''
}, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<QuestionsValidationResult>({
    isValid: false,
    errors: []
  });

  // Expose clearFile method to parent component
  useImperativeHandle(ref, () => ({
    clearFile: () => {
      handleRemoveFile();
    }
  }));

  const validateFile = (file: File): string | null => {
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFileTypes.includes(fileExtension)) {
      return `Only ${acceptedFileTypes.join(', ')} files are allowed`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    return null;
  };

  const validateJsonSchema = (data: any): QuestionsValidationResult => {
    try {
      const validatedData = QuestionsSchema.parse(data);
      return {
        isValid: true,
        errors: [],
        data: validatedData
      };
    } catch (error: any) {
      const errors = error.errors?.map((err: any) => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
      }) || ['Invalid schema format'];

      return {
        isValid: false,
        errors,
        data: null
      };
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const jsonContent = JSON.parse(text);
      
      // Validate against schema
      const validation = validateJsonSchema(jsonContent);
      setValidationResult(validation);
      onValidationChange(validation);
      
      if (validation.isValid) {
        setUploadedFile(file);
        onFileUpload(file, validation.data);
      } else {
        // Clear file if validation fails
        setUploadedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onError?.(`Schema validation failed: ${validation.errors.join(', ')}`);
      }
    } catch (error) {
      const errorMsg = 'Invalid JSON file. Please check the file format.';
      setValidationResult({ isValid: false, errors: [errorMsg] });
      onValidationChange({ isValid: false, errors: [errorMsg] });
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onError?.(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Only process the first file (single file upload)
    const file = files[0];
    const validationError = validateFile(file);

    if (validationError) {
      setValidationResult({ isValid: false, errors: [validationError] });
      onValidationChange({ isValid: false, errors: [validationError] });
      onError?.(validationError);
      return;
    }

    processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setValidationResult({ isValid: false, errors: [] });
    onValidationChange({ isValid: false, errors: [] });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes.join(',')}
        onChange={handleInputChange}
        className="hidden"
      />

      {!uploadedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
            ${isDragOver 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }
            ${!validationResult.isValid && validationResult.errors.length > 0 ? 'border-error-500 bg-error-50' : ''}
          `}
          onClick={handleBrowseClick}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center
              ${!validationResult.isValid && validationResult.errors.length > 0
                ? 'bg-error-100 text-error-600' 
                : 'bg-gray-100 text-gray-600'
              }
            `}>
              {isProcessing ? (
                <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-8 h-8" />
              )}
            </div>

            <div>
              <p className="text-lg font-medium text-gray-900 mb-1">
                {isProcessing ? 'Processing file...' : 'Drop your JSON file here'}
              </p>
              <p className="text-gray-600">
                or <span className="text-primary-600 font-medium">browse</span> to choose a file
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports: {acceptedFileTypes.join(', ')} (max {maxFileSize}MB)
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Single file upload only
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className={`
          border rounded-lg p-6 
          ${validationResult.isValid 
            ? 'border-success-200 bg-success-50' 
            : 'border-error-200 bg-error-50'
          }
        `}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                ${validationResult.isValid 
                  ? 'bg-success-100 text-success-600' 
                  : 'bg-error-100 text-error-600'
                }
              `}>
                {validationResult.isValid ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
              </div>
              
              <div>
                <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                <p className="text-sm text-gray-600">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              icon={X}
              className="text-gray-500 hover:text-gray-700"
            >
              Remove
            </Button>
          </div>

          {validationResult.isValid && (
            <div className="mt-3 p-3 bg-success-100 rounded-lg">
              <p className="text-sm text-success-800 font-medium">
                ✓ File validated successfully - Schema matches requirements
              </p>
            </div>
          )}
        </div>
      )}

      {!validationResult.isValid && validationResult.errors.length > 0 && (
        <div className="mt-3 p-3 bg-error-100 border border-error-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-error-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-error-800 font-medium mb-1">Schema Validation Errors:</p>
              <ul className="text-sm text-error-700 space-y-1">
                {validationResult.errors.map((error, index) => (
                  <li key={index} className="list-disc list-inside">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

FileUploader.displayName = 'FileUploader';