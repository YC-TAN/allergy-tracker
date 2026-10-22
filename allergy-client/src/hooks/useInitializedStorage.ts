import { useEffect, useState } from "react";
import { migrateLegacyEntries } from "../db/migrations";
import { resetMockEntries } from "../utils/seedData";

export const useInitializeStorage = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await migrateLegacyEntries();
      } catch (error: unknown) {
        console.error("Local entry migration failed:", error);
        setError(
          error instanceof Error
            ? error
            : new Error("Failed to migrate local entries"),
        );
        return; // don't start app if migration fail
      }

      if (import.meta.env.DEV) {
        try {
          await resetMockEntries();
        } catch (error: unknown) {
          console.error("Mock entry seeding failed:", error);
          // dev only: log and continue, never block the app
        }
      }

      setIsReady(true);
    };

    void initialize();
  }, []);

  return { isReady, error };
};
