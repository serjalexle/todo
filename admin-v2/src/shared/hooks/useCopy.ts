import { toast } from "react-toastify";

const useCopy = () => {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);

    toast.success("Copied to clipboard");
  };

  return handleCopy;
};

export default useCopy;
