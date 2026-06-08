export interface ButtonConfigField {
  id: string;
}

export interface ButtonConfig {
  fields: ButtonConfigField[];
}

const buttonConfig: ButtonConfig = {
  fields: [
    { id: 'LAST_12_HOURS' },
    { id: 'LAST_24_HOURS' },
    { id: 'LAST_WEEK' },
    { id: 'LAST_MONTH' },
    { id: 'ALL_TIME' },
  ],
};

export const getLastValidDate = (id: string): Date | null => {
  switch (id) {
    case 'ALL_TIME':
      return null;
    case 'LAST_MONTH': {
      const now = new Date();
      return new Date(now.setMonth(now.getMonth() - 1));
    }
    case 'LAST_WEEK': {
      const now = new Date();
      return new Date(now.setDate(now.getDate() - 7));
    }
    case 'LAST_12_HOURS': {
      const now = new Date();
      return new Date(now.setHours(now.getHours() - 12));
    }
    case 'LAST_24_HOURS': {
      const now = new Date();
      return new Date(now.setDate(now.getDate() - 1));
    }
    default:
      return null;
  }
};

export default buttonConfig;
