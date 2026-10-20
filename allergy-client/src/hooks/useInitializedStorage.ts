import { useEffect, useState } from "react";
import { migrateLegacyEntries } from "../db/migrations";
import { resetMockEntries } from "../utils/seedData";

export const useInitializeStorage = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
const initialize = async () => {
    await migrateLegacyEntries();

    if (import.meta.env.DEV) {
    await resetMockEntries();
  }

  setIsReady(true);
}

    initialize()
      .catch((reason: unknown) => {
        const migrationError =
          reason instanceof Error
            ? reason
            : new Error("Failed to migrate local entries");

        console.error("Local entry migration failed:", migrationError);
        setError(migrationError);
      });
  }, []);

  return { isReady, error };
};