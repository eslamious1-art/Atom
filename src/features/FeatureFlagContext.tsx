import React, { createContext, useContext, useMemo, useState } from 'react';

type FeatureFlags = {
  implant_guide_easy_mode: boolean;
};

type FeatureFlagContextValue = {
  flags: FeatureFlags;
  setFlag: <K extends keyof FeatureFlags>(flag: K, value: FeatureFlags[K]) => void;
};

const defaultFlags: FeatureFlags = {
  implant_guide_easy_mode: true,
};

const FeatureFlagContext = createContext<FeatureFlagContextValue | undefined>(undefined);

export const FeatureFlagProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);

  const value = useMemo<FeatureFlagContextValue>(() => ({
    flags,
    setFlag: (flag, value) =>
      setFlags((prev) => {
        if (prev[flag] === value) {
          return prev;
        }
        return { ...prev, [flag]: value };
      }),
  }), [flags]);

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>;
};

export function useFeatureFlags(): FeatureFlags {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context.flags;
}

export function useFeatureFlag<K extends keyof FeatureFlags>(flag: K): FeatureFlags[K] {
  const flags = useFeatureFlags();
  return flags[flag];
}

export function useSetFeatureFlag(): FeatureFlagContextValue['setFlag'] {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useSetFeatureFlag must be used within a FeatureFlagProvider');
  }
  return context.setFlag;
}
