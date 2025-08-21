import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import {
  useState,
  ChangeEvent,
  FormEvent,
  useCallback,
  useMemo,
} from "react";

interface UseCustomChatProps {
  api: string;
}

interface UseCustomChatResult {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  messages: UIMessage[]; // Replace 'any' with the actual type of your messages
  sendMessage: (message: UIMessage) => void; // Replace 'any' with the actual type of your message
  status: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export const useCustomChat = ({ api }: UseCustomChatProps): UseCustomChatResult => {
  const [input, setInput] = useState("");

  const chat = useChat({
    transport: useMemo(() => new DefaultChatTransport({ api }), [api]),
  });

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    [setInput]
  );

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmedInput = input.trim();
      if (trimmedInput) {
        chat.sendMessage({ text: trimmedInput });
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