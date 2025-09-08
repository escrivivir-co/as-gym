/**
 * Internationalization system
 */

export interface I18nMessages {
  SISTEMA: {
    STARTING_LABEL: string;
  };
}

export class I18n {
  private messages: I18nMessages;

  constructor(messages: I18nMessages) {
    this.messages = messages;
  }

  get SISTEMA() {
    return this.messages.SISTEMA;
  }
}

// Spanish messages
const spanishMessages: I18nMessages = {
  SISTEMA: {
    STARTING_LABEL: "Iniciando sistema FIA..."
  }
};

// English messages
const englishMessages: I18nMessages = {
  SISTEMA: {
    STARTING_LABEL: "Starting FIA system..."
  }
};

// Default export
export const i18 = new I18n(spanishMessages);

// Utility function for system messages
export function systemMessage(message: string): string {
  return `[SYSTEM] ${message}`;
}
