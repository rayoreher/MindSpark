import React, { useState, useRef } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { useTranslation } from "react-i18next";
import {
  FileUploader,
  FileUploaderRef,
} from "../../components/ui/FileUploader";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Toast } from "../../components/ui/Toast";
import {
  FileText,
  Upload as UploadIcon,
  UploadCloud as CloudUpload,
  Type,
  FileUp,
  Clipboard,
  Eye,
  EyeOff,
  Trash2,
  Lock,
  Globe,
  MessageSquare,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import { QuestionsValidationResult } from "../../utils/validation/questionSchemas";
import { JsonQuestions as QuestionsType } from "../../types/questions";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";

type InputMode = "file" | "text";
type VisibilityLevel = "private" | "public";

interface QuestionInfo {
  open_questions: number;
  multiple_choice_questions: number;
  fill_in_the_blank: number;
  flashcards: number;
  micro_reels: number;
}

export const Upload: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileUploaderRef = useRef<FileUploaderRef>(null);
  const [inputMode, setInputMode] = useState<InputMode>("file");
  const [validatedData, setValidatedData] = useState<QuestionsType | null>(
    null
  );
  const [validationResult, setValidationResult] =
    useState<QuestionsValidationResult>({
      isValid: false,
      errors: [],
    });
  const [questionSetName, setQuestionSetName] = useState("");
  const [nameError, setNameError] = useState("");
  const [question, setQuestion] = useState("");
  const [questionError, setQuestionError] = useState("");
  const [answer, setAnswer] = useState("");
  const [answerError, setAnswerError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Text input specific states
  const [jsonText, setJsonText] = useState("");
  const [isValidatingText, setIsValidatingText] = useState(false);
  const [showBeautified, setShowBeautified] = useState(false);

  const extractQuestionInfo = (data: QuestionsType): QuestionInfo => {
    return {
      open_questions: data.open_questions?.length || 0,
      multiple_choice_questions: data.multiple_choice_questions?.length || 0,
      fill_in_the_blank: data.fill_in_the_blank?.length || 0,
      flashcards: data.flashcards?.length || 0,
      micro_reels: data.micro_reels?.length || 0,
    };
  };

  const handleFileUpload = (file: File, content: QuestionsType) => {
    setValidatedData(content);
  };

  const handleValidationChange = (result: QuestionsValidationResult) => {
    setValidationResult(result);
    if (!result.isValid) {
      setValidatedData(null);
    }
  };

  const handleUploadError = (error: string) => {
    setToastMessage(error);
    setToastType("error");
    setShowToast(true);

    setTimeout(() => setShowToast(false), 5000);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuestionSetName(value);

    // Validate name length
    if (value.length > 0 && value.length < 5) {
      setNameError("Name must be at least 5 characters long");
    } else {
      setNameError("");
    }
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setQuestion(value);

    // Validate question length
    if (value.length > 0 && value.length < 5) {
      setQuestionError("Question must be at least 5 characters long");
    } else {
      setQuestionError("");
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setAnswer(value);

    // Validate answer length
    if (value.length > 0 && value.length < 5) {
      setAnswerError("Answer must be at least 5 characters long");
    } else {
      setAnswerError("");
    }
  };

  const handleModeSwitch = (mode: InputMode) => {
    // Only allow switching if no data has been validated yet
    if (validatedData || validationResult.isValid) {
      return;
    }

    setInputMode(mode);

    // Clear any existing data when switching modes
    setJsonText("");
    setValidationResult({ isValid: false, errors: [] });
    setValidatedData(null);
    setShowBeautified(false);

    // Clear file uploader if switching away from file mode
    if (mode === "text" && fileUploaderRef.current) {
      fileUploaderRef.current.clearFile();
    }
  };

  const clearCurrentInput = () => {
    if (inputMode === "file") {
      // Clear file uploader
      fileUploaderRef.current?.clearFile();
    } else {
      // Clear text input
      setJsonText("");
      setShowBeautified(false);
    }

    // Clear validation results and data
    setValidationResult({ isValid: false, errors: [] });
    setValidatedData(null);
  };

  const validateJsonText = async (text: string) => {
    setIsValidatingText(true);

    try {
      // Parse JSON
      const jsonContent = JSON.parse(text);

      // Import validation schema dynamically
      const { QuestionsSchema } = await import(
        "../../utils/validation/questionSchemas"
      );

      // Validate against schema
      const validatedData = QuestionsSchema.parse(jsonContent);

      const result: QuestionsValidationResult = {
        isValid: true,
        errors: [],
        data: validatedData,
      };

      setValidationResult(result);
      setValidatedData(validatedData);
    } catch (error: any) {
      let errors: string[] = [];

      if (error.name === "SyntaxError") {
        errors = [error.message];
      } else if (error.errors) {
        // Zod validation errors
        errors = error.errors.map((err: any) => {
          const path = err.path.join(".");
          return `${path}: ${err.message}`;
        });
      } else {
        errors = [error.message || "Unknown validation error"];
      }

      const result: QuestionsValidationResult = {
        isValid: false,
        errors,
        data: null,
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

    // Clear previous validation when text changes
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

  const beautifyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const beautified = JSON.stringify(parsed, null, 2);
      setJsonText(beautified);
      setShowBeautified(true);
    } catch (error) {
      handleUploadError(
        "Cannot beautify invalid JSON. Please fix syntax errors first."
      );
    }
  };

  const isFormValid = () => {
    return (
      validatedData &&
      validationResult.isValid &&
      questionSetName.trim().length >= 5 &&
      !nameError &&
      question.trim().length >= 5 &&
      !questionError &&
      answer.trim().length >= 5 &&
      !answerError
    );
  };

  const handleUploadToServer = async () => {
    if (!isFormValid() || !user) return;

    setIsUploading(true);

    try {
      // Extract question count information
      const questionInfo = extractQuestionInfo(validatedData!);

      // Insert the questions data into Supabase with name, visibility, question, answer, and info
      const { error } = await supabase
        .from("questions")
        .insert([
          {
            bucket_id: id,
            name: questionSetName.trim(),
            data: validatedData,
            info: questionInfo,
            question: question.trim(),
            answer: answer.trim(),
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setToastMessage(
        `Questions uploaded successfully! "${questionSetName}"`
      );
      setToastType("success");
      setShowToast(true);

      // Reset form after successful upload
      setValidatedData(null);
      setValidationResult({ isValid: false, errors: [] });
      setQuestionSetName("");
      setNameError("");
      setQuestion("");
      setQuestionError("");
      setAnswer("");
      setAnswerError("");
      setJsonText("");
      setShowBeautified(false);

      // Clear the file uploader
      fileUploaderRef.current?.clearFile();

      setTimeout(() => setShowToast(false), 3000);
    } catch (error: any) {
      console.error("Upload error:", error);
      setToastMessage(
        `Failed to upload questions: ${error.message || "Unknown error"}`
      );
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } finally {
      setIsUploading(false);
    }
  };

  const getQuestionCounts = (data: QuestionsType) => {
    return {
      openQuestions: data.open_questions?.length || 0,
      multipleChoice: data.multiple_choice_questions?.length || 0,
      fillInTheBlank: data.fill_in_the_blank?.length || 0,
      flashcards: data.flashcards?.length || 0,
      microReels: data.micro_reels?.length || 0,
      total:
        (data.open_questions?.length || 0) +
        (data.multiple_choice_questions?.length || 0) +
        (data.fill_in_the_blank?.length || 0) +
        (data.flashcards?.length || 0) +
        (data.micro_reels?.length || 0),
    };
  };

  const canSwitchMode = !validatedData && !validationResult.isValid;
  const hasInputData =
    (inputMode === "file" && validatedData) ||
    (inputMode === "text" && jsonText.trim());

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
            <Button
              variant="outline"
              icon={ArrowLeft}
              onClick={() => navigate(`/buckets/${id}`)}
            >
              Back to Bucket Details
            </Button>
          </div>
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t("navigation.upload")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("upload.subtitle")}
            </p>
          </div>
          {/* 3. Question Set Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Type className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Question Set Details
              </h2>
            </div>

            <div className="grid gap-6 mb-6">
              {/* Question Set Name */}
              <div>
                <Input
                  label="Question Set Name"
                  placeholder="Enter a descriptive name for your question set"
                  value={questionSetName}
                  onChange={handleNameChange}
                  error={nameError}
                  helperText="Give your question set a memorable name (minimum 5 characters)"
                  required
                />
              </div>
            </div>

            {/* Question and Answer Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Question Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
                  <textarea
                    value={question}
                    onChange={handleQuestionChange}
                    placeholder="Enter your question here..."
                    className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm resize-none h-24 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                      questionError
                        ? "border-error-500 focus:border-error-500 focus:ring-error-500"
                        : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {questionError && (
                  <p className="text-sm text-error-600 mt-1">{questionError}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Enter the main question for this question set (minimum 5
                  characters)
                </p>
              </div>

              {/* Answer Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <HelpCircle className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
                  <textarea
                    value={answer}
                    onChange={handleAnswerChange}
                    placeholder="Enter the answer here..."
                    className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm resize-none h-24 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                      answerError
                        ? "border-error-500 focus:border-error-500 focus:ring-error-500"
                        : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {answerError && (
                  <p className="text-sm text-error-600 mt-1">{answerError}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Enter the correct answer for the question (minimum 5
                  characters)
                </p>
              </div>
            </div>
          </div>
          {/* 1. Input Mode Toggle */}
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
                  <strong>Note:</strong> You cannot switch input methods after
                  data has been validated. Use the "Clear Input\" button to
                  reset and switch methods.
                </p>
              </div>
            )}
          </div>

          {/* 2. File Upload Section */}
          {inputMode === "file" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <FileUp className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {t("upload.upload.title")}
                </h2>
              </div>

              <p className="text-gray-600 mb-4">
                {t("upload.upload.description")}
              </p>

              <FileUploader
                ref={fileUploaderRef}
                onFileUpload={handleFileUpload}
                onValidationChange={handleValidationChange}
                onError={handleUploadError}
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
                    variant="outline"
                    size="sm"
                    onClick={beautifyJson}
                    disabled={!jsonText.trim() || isValidatingText}
                    icon={showBeautified ? Eye : EyeOff}
                  >
                    Beautify JSON
                  </Button>
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
                        JSON validated successfully - Schema matches
                        requirements
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. Upload Button Section */}
          {validatedData && validationResult.isValid && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <CloudUpload className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Upload Question Set
                </h2>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Ready to upload:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {(() => {
                      const counts = getQuestionCounts(validatedData);
                      return (
                        <>
                          <span>Open Questions: {counts.openQuestions}</span>
                          <span>Multiple Choice: {counts.multipleChoice}</span>
                          <span>Fill in Blank: {counts.fillInTheBlank}</span>
                          <span>Flashcards: {counts.flashcards}</span>
                          <span>Micro Reels: {counts.microReels}</span>
                          <span className="font-medium">
                            Total: {counts.total}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <Button
                  onClick={handleUploadToServer}
                  disabled={!isFormValid() || isUploading}
                  isLoading={isUploading}
                  icon={CloudUpload}
                  size="lg"
                  className="ml-4"
                >
                  {isUploading ? "Uploading..." : "Upload Questions"}
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast
            type={toastType}
            title={toastType === "success" ? "Success" : "Error"}
            message={toastMessage}
            onClose={() => setShowToast(false)}
          />
        </div>
      )}
    </MainLayout>
  );
};
