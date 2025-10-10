import { osintRegistry } from "../../../../packages/core/src/osint/registry";
import { AmassTool } from "../../../../packages/core/src/osint/adapters/amass";

// À appeler au démarrage de l'API (ex: dans app bootstrap)
export function registerOsintTools() {
  // Enregistrer ici tous les outils disponibles
  osintRegistry.register(new AmassTool());
}