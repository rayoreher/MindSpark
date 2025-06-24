import { Copy } from "lucide-react";
import { Button } from "../../../../components/ui/Button";

interface CopyPromptButtonProps {
  onError?: (message: string) => void;
}
export const CopyNextButton = ({
  onError,
}: CopyPromptButtonProps) => {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(JSON.stringify({
        command: "##NEXT##"
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
      Copy Next Question Prompt
    </Button>
  );
};