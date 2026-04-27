"use client";

import { useState } from "react";
import { RelocationAgentForm } from "./relocation-agent-form";
import { RelocationAgentResult } from "./relocation-agent-result";
import type { RelocationPlanResponse } from "@/lib/agent/types";

export function RelocationAgentShell() {
  const [response, setResponse] = useState<RelocationPlanResponse | null>(null);

  if (response) {
    return (
      <RelocationAgentResult
        response={response}
        onReset={() => setResponse(null)}
      />
    );
  }
  return <RelocationAgentForm onResult={setResponse} />;
}
