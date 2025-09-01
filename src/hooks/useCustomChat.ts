import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage, UIMessagePart, UIDataTypes, UITools } from "ai";
import {
  useState,
  ChangeEvent,
  FormEvent,
  useCallback,
  useMemo,
} from "react";
import { v4 as uuidv4 } from 'uuid';

interface UseCustomChatProps {
  api: string;
  id?: string;

}

interface UseCustomChatResult {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  messages: UIMessage[];
  sendMessage: (message: UIMessage) => void;
  status: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>, files?: File[]) => void;
}

const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const useCustomChat = ({ api, id }: UseCustomChatProps): UseCustomChatResult => {
  const [input, setInput] = useState("");
  const [sessionId] = useState(id || uuidv4());

  const chat = useChat({
    id: sessionId,
    transport: useMemo(() => new DefaultChatTransport({ api }), [api]),
  });

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value),
    [setInput]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>, files: File[] = []) => {
      e.preventDefault();
      const trimmedInput = input.trim();

      if (!trimmedInput && files.length === 0) return;

      const messageParts: UIMessagePart<UIDataTypes, UITools>[] = [];
      if (trimmedInput) {
        messageParts.push({ type: 'text', text: trimmedInput });
      }

      // Procesar y añadir las imágenes
      for (const file of files) {
        console.log({ file })
        const dataUrl = await fileToDataURL(file);
        messageParts.push({
          type: 'file',
          mediaType: file.type,
          filename: file.name,
          url: dataUrl
        });
      }

      if (messageParts.length > 0) {
        chat.sendMessage({ role: 'user', parts: messageParts });
        setInput("");
      }
    },
    [chat.sendMessage, input, setInput]
  );

  return {
    input,
    setInput,
    messages: chat.messages,
    sendMessage: chat.sendMessage,
    status: chat.status,
    handleInputChange,
    handleSubmit,
  };
};