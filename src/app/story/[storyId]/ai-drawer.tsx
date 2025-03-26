"use client";

import React, { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
  DrawerHeader,
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

type DrawerProps = {
  context: string | undefined;
};

// Response component to handle AI response display
function AIResponse({ response }: { response: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy text. Error: " + err);
    }
  };

  return (
    <div className="bg-muted/50 p-4 rounded-md my-4 relative">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium">AI Response:</h3>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={copyToClipboard} title="Copy to clipboard">
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <div className="text-sm whitespace-pre-wrap user-select-all" style={{ userSelect: "text" }}>
        {response}
      </div>
    </div>
  );
}

// Loading fallback component
function ResponseLoader() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Your AI assistant is thinking...</span>
    </div>
  );
}

export default function AIDrawer({ context }: DrawerProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ context, prompt })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate response");
      }

      setResponse(data.response);
    } catch (error) {
      setResponse("Sorry, there was an error generating a response. Please try again. Error: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger className="flex float-right" asChild>
          <Button variant="outline">Ask 🤖</Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Your AI Writing Assistant</DrawerTitle>
            <DrawerDescription>
              Ask for help with your story - get ideas, feedback, or help with specific aspects of your writing.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 py-2">
            <Textarea
              placeholder="Ask your AI assistant for help with your story..."
              value={prompt}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
              className="min-h-[100px] resize-none mb-4"
            />

            <Suspense fallback={<ResponseLoader />}>
              {isLoading ? <ResponseLoader /> : response && <AIResponse response={response} />}
            </Suspense>
          </div>

          <DrawerFooter>
            <Button onClick={handleSubmit} disabled={isLoading || !prompt.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Response"
              )}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
