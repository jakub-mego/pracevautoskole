"use client";

import { useEffect } from "react";
import { markConversationReadAction } from "@/app/zpravy/actions";

export function MarkReadOnMount({ conversationId }: { conversationId: string }) {
  useEffect(() => {
    void markConversationReadAction(conversationId);
  }, [conversationId]);
  return null;
}
