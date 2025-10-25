export type TelemetryEventName =
  | 'wizard_generate_click'
  | 'ai_generation_complete'
  | 'error_shown';

export type TelemetryPayload = Record<string, unknown> | undefined;

export const trackEvent = (name: TelemetryEventName, payload?: TelemetryPayload): void => {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info(`[telemetry] ${name}`, payload ?? {});
  }
};
