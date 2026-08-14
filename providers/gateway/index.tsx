import { gateway } from "@ai-sdk/gateway";
import type { GatewayLanguageModelEntry } from "@ai-sdk/gateway";
import type { ReactNode } from "react";
import { GatewayProviderClient } from "./client";

interface GatewayProviderProps {
  children: ReactNode;
}

export const GatewayProvider = async ({ children }: GatewayProviderProps) => {
  let models: GatewayLanguageModelEntry[] = [];

  try {
    ({ models } = await gateway.getAvailableModels());
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !error.message.toLowerCase().includes("authentication")
    ) {
      throw error;
    }
  }
  const textModels = models.filter((model) => model.modelType === "language");
  const imageModels = models.filter((model) => model.modelType === "image");
  const videoModels = models.filter((model) => model.modelType === "video");

  return (
    <GatewayProviderClient
      imageModels={imageModels}
      models={textModels}
      videoModels={videoModels}
    >
      {children}
    </GatewayProviderClient>
  );
};
