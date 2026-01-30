export const Colors = {
  // Primary Purple Gradient
  primary: {
    light: '#8B5CF6',
    dark: '#6D28D9',
    gradient: ['#8B5CF6', '#6D28D9'],
  },
  
  // Secondary
  secondary: {
    lavender: '#E9D5FF',
    lightGrey: '#F3F4F6',
  },
  
  // Accent
  accent: {
    gold: '#F59E0B',
    amber: '#FCD34D',
  },
  
  // Text
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    light: '#9CA3AF',
  },
  
  // Background
  background: {
    main: '#F9FAFB',
    white: '#FFFFFF',
    card: '#FFFFFF',
  },
  
  // Status
  status: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#FCD34D',
  },
};

export const Typography = {
  // Font Families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  
  // Font Weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const Shadow = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Layout = {
  minTouchTarget: 44,
  screenPadding: 16,
  cardPadding: 16,
};
