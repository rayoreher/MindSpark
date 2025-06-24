import { FileUp, Clipboard, Trash2, UploadIcon } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import {
  FileUploader,
  FileUploaderRef,
} from "../../../components/ui/FileUploader";
import { useRef, useState } from "react";
import {
  LearningContentSchema,
  QuestionsValidationResult,
} from "../../../utils/validation/questionSchemas";
import { SupabaseData } from "../../../types/supabaseQuestion";

type ErrorType = {
  name: string;
  message: string;
  errors?: { path: string[]; message: string }[];
};

interface JsonUploadProps {
  onUploadError: (error: string) => void;
  onJsonReady: (data: SupabaseData) => void;
}
export const JsonUpload = ({ onUploadError, onJsonReady }: JsonUploadProps) => {
  const fileUploaderRef = useRef<FileUploaderRef>(null);
  const [jsonText, setJsonText] = useState("");
  const [isValidatingText, setIsValidatingText] = useState(false);
  const [inputMode, setInputMode] = useState<"file" | "text">("file");
  const [validatedData, setValidatedData] = useState<SupabaseData | null>(null);
  const [validationResult, setValidationResult] =
    useState<QuestionsValidationResult>({
      isValid: false,
      errors: [],
    });

  const canSwitchMode = !validatedData && !validationResult.isValid;
  const hasInputData =
    (inputMode === "file" && validatedData) ||
    (inputMode === "text" && jsonText.trim());

  function handleFileUpload(content: SupabaseData): void {
    setValidatedData(content);
    onJsonReady(content);
  }

  const handleModeSwitch = (mode: "file" | "text") => {
    if (validatedData || validationResult.isValid) {
      return;
    }

    setInputMode(mode);
    setJsonText("");
    setValidationResult({ isValid: false, errors: [] });
    setValidatedData(null);

    if (mode === "text" && fileUploaderRef.current) {
      fileUploaderRef.current.clearFile();
    }
  };

  const clearCurrentInput = () => {
    if (inputMode === "file") {
      fileUploaderRef.current?.clearFile();
    } else {
      setJsonText("");
    }

    setValidationResult({ isValid: false, errors: [] });
    setValidatedData(null);
  };

  const validateJsonText = (text: string) => {
    setIsValidatingText(true);
    try {
      const jsonContent = JSON.parse(text);
      const validatedData = LearningContentSchema.parse(jsonContent);

      const result: QuestionsValidationResult = {
        isValid: true,
        errors: [],
        data: validatedData,
      };

      setValidationResult(result);
      setValidatedData(validatedData);
      onJsonReady(validatedData);
    } catch (error) {
      let errors: string[] = [];
      const currentError = error as ErrorType;
      if (currentError.name === "SyntaxError") {
        errors = [currentError.message];
      } else if (currentError.errors) {
        errors = currentError.errors.map((err) => {
          const path = err.path.join(".");
          return `${path}: ${err.message}`;
        });
      } else {
        errors = [currentError.message || "Unknown validation error"];
      }

      const result: QuestionsValidationResult = {
        isValid: false,
        errors,
        data: undefined,
      };

      setValidationResult(result);
      setValidatedData(null);
    } finally {
      setIsValidatingText(false);
    }
  };

  const handleJsonTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonText(value);

    if (validationResult.isValid || validationResult.errors.length > 0) {
      setValidationResult({ isValid: false, errors: [] });
      setValidatedData(null);
    }
  };

  const handleValidateText = () => {
    if (jsonText.trim()) {
      validateJsonText(jsonText.trim());
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <UploadIcon className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Upload Method
            </h2>
          </div>

          {/* Clear Button */}
          {hasInputData && (
            <Button
              variant="outline"
              size="sm"
              icon={Trash2}
              onClick={clearCurrentInput}
              className="text-error-600 hover:text-error-700 hover:bg-error-50 border-error-300"
            >
              Clear Input
            </Button>
          )}
        </div>

        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => handleModeSwitch("file")}
            disabled={!canSwitchMode}
            className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
              inputMode === "file"
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : canSwitchMode
                ? "border-gray-300 hover:border-primary-300 hover:bg-gray-50"
                : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center justify-center space-x-3">
              <FileUp className="w-4 h-4" />
              <span className="font-medium">Upload File</span>
            </div>
            <p className="text-sm mt-1 opacity-75">
              Upload a JSON file from your computer
            </p>
          </button>

          <button
            onClick={() => handleModeSwitch("text")}
            disabled={!canSwitchMode}
            className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
              inputMode === "text"
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : canSwitchMode
                ? "border-gray-300 hover:border-primary-300 hover:bg-gray-50"
                : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center justify-center space-x-3">
              <Clipboard className="w-4 h-4" />
              <span className="font-medium">Paste JSON</span>
            </div>
            <p className="text-sm mt-1 opacity-75">
              Paste JSON content directly
            </p>
          </button>
        </div>

        {!canSwitchMode && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You cannot switch input methods after data
              has been validated. Use the "Clear Input" button to reset and
              switch methods.
            </p>
          </div>
        )}
      </div>

      {/* 2. File Upload Section */}
      {inputMode === "file" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <FileUp className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Upload File</h2>
          </div>

          <p className="text-gray-600 mb-4">
            Upload a JSON file from your computer
          </p>

          <FileUploader
            ref={fileUploaderRef}
            onFileUpload={handleFileUpload}
            onError={onUploadError}
            acceptedFileTypes={[".json"]}
            maxFileSize={5}
          />
        </div>
      )}

      {/* 2. Text Input Section */}
      {inputMode === "text" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Clipboard className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Paste JSON Content
              </h2>
            </div>

            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleValidateText}
                disabled={!jsonText.trim() || isValidatingText}
                isLoading={isValidatingText}
              >
                {isValidatingText ? "Validating..." : "Validate"}
              </Button>
            </div>
          </div>

          <p className="text-gray-600 mb-4">
            Paste your JSON content below and click "Validate" to check the
            format and schema.
          </p>

          <div className="space-y-4">
            <textarea
              value={jsonText}
              onChange={handleJsonTextChange}
              placeholder="Paste your JSON content here..."
              className={`w-full h-64 p-4 border rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                validationResult.errors.length > 0
                  ? "border-error-500 bg-error-50"
                  : validationResult.isValid
                  ? "border-success-500 bg-success-50"
                  : "border-gray-300"
              }`}
            />

            {/* Validation Results */}
            {validationResult.errors.length > 0 && (
              <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5">
                    ⚠️
                  </div>
                  <div>
                    <p className="text-sm text-error-800 font-medium mb-1">
                      Validation Errors:
                    </p>
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

            {validationResult.isValid && (
              <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 text-success-600">✅</div>
                  <p className="text-sm text-success-800 font-medium">
                    JSON validated successfully - Schema matches requirements
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
