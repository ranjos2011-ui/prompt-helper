import { ModuleId } from "./enums";

export interface ModuleDefinition {
  id: ModuleId;
  name: string;
  status: "active" | "coming_soon";
  description: string;
}
