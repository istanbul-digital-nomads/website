"use client";

import { useState } from "react";
import { RelocationAgentForm } from "./relocation-agent-form";
import { RelocationAgentResult } from "./relocation-agent-result";
import type {
  RelocationIntake,
  RelocationPlanResponse,
} from "@/lib/agent/types";

interface SubmitState {
  intake: RelocationIntake;
  response: RelocationPlanResponse;
}

export function RelocationAgentShell() {
  const [state, setState] = useState<SubmitState | null>(null);

  if (state) {
    return (
      <RelocationAgentResult
        intake={state.intake}
        response={state.response}
        onReset={() => setState(null)}
      />
    );
  }
  return (
    <RelocationAgentForm
      onResult={(intake, response) => setState({ intake, response })}
    />
  );
}
