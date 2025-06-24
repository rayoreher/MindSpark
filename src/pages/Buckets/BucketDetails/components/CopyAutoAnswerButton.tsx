import { Copy } from "lucide-react";
import { Button } from "../../../../components/ui/Button";

interface CopyPromptButtonProps {
  onError?: (message: string) => void;
}
export const CopyAutoAnswerButton = ({
  onError,
}: CopyPromptButtonProps) => {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(JSON.stringify({
        command: "##AUTOMATIC_ANSWER##"
      }, null, 2))
      .then(() => {})
      .catch((err) => {
        onError?.(`Failed to copy prompt: ${err}`);
      });
  };

  return (
    <Button
      icon={Copy}
      onClick={handleCopy}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Copy Automatic Answer Prompt
    </Button>
  );
};