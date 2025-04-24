import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '960px',
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        theme: {
          DEFAULT: 'var(--zerithium-color-theme)',
          secondary: 'var(--zerithium-tc-secondary)',
          'non-opaque': 'var(--zerithium-color-theme-non-opaque)',
        },
        tc: {
          DEFAULT: 'var(--zerithium-color-theme)',
          primary: 'var(--zerithium-tc-primary)',
          secondary: 'var(--zerithium-tc-secondary)',
          tertiary: 'var( --zerithium-tc-tertiary)',
          'on-button': 'var(--zerithium-tc-on-button)',
        },
        background: {
          DEFAULT: 'var(--zerithium-color-theme)',
          light: 'var(--zerithium-color-theme-light)',
          primary: 'var(--zerithium-bg-primary)',
          'e-primary': 'var(--zerithium-bg-e-primary)',
          secondary: 'var(--zerithium-bg-secondary)',
          'e-secondary': 'var(--zerithium-bg-e-secondary)',
          toast: 'var(--zerithium-toast)',
          separator: 'var(--zerithium-separator-opaque)',
          'non-separator': 'var(--zerithium-separator-non-opaque)',
        },
        fill: {
          primary: 'var(--zerithium-fill-primary)',
          'e-primary': 'var(--zerithium-fill-e-primary)',
          secondary: 'var(--zerithium-fill-secondary)',
          'e-secondary': 'var(--zerithium-fill-e-secondary)',
          niubi: 'var(--zerithium-fill-niubi)',
          niubi2: 'var(--zerithium-fill-niubi2)',
          niubi3: 'var(--zerithium-fill-niubi3)',
          niubi4: 'var(--zerithium-fill-niubi4)',
        },
        status: {
          info: 'var(--zerithium-color-info)',
          error: 'var(--zerithium-color-error)',
          warning: 'var(--zerithium-color-warning)',
          success: 'var(--zerithium-color-success)',
          'info-non-opaque': 'var(--zerithium-color-info-non-opaque)',
          'warning-non-opaque': 'var(--zerithium-color-warning-non-opaque)',
          'error-non-opaque': 'var(--zerithium-color-error-non-opaque)',
        },
        line: {
          primary: 'var(--zerithium-line-primary)',
          primary2: 'var(--zerithium-line-primary2)',
        },
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1',
        '2xl': '1.5rem',
        full: '50%',
      },
      keyframes: {
        hide: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        pop: {
          from: { transform: 'scale(1)', 'box-shadow': 'var(--box-shadow)' },
          to: {
            transform: 'scale(var(--scale))',
            'box-shadow': ' var(--box-shadow-picked-up)',
          },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideIn: {
          from: {
            transform: 'translateX(calc(100% + var(--viewport-padding)))',
          },
          to: { transform: 'translateX(0)' },
        },
        swipeOut: {
          from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
          to: { transform: 'translateX(calc(100% + var(--viewport-padding)))' },
        },
        slideDown: {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        slideUp: {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        slideUpAndFade: {
          from: { opacity: '0', transform: 'translateY(2px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideRightAndFade: {
          from: { opacity: '0', transform: 'translateX(-2px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideDownAndFade: {
          from: { opacity: '0', transform: 'translateY(-2px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeftAndFade: {
          from: { opacity: '0', transform: 'translateX(2px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        overlayShow: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        contentShow: {
          from: {
            opacity: '0',
            transform: 'translate(-50%, -48%) scale(0.96)',
          },
          to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
        spin: {
          from: {
            transform: 'rotate(0deg)',
          },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        pop: 'pop 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22',
        fadeIn: 'fadeIn 500ms ease;',
        hide: 'hide 100ms ease-in',
        slideIn: 'slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        swipeOut: 'swipeOut 100ms ease-out',
        slideDown: 'slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        slideUp: 'slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade:
          'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideDownAndFade:
          'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideLeftAndFade:
          'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        spin: 'spin 1s linear infinite',
      },
      boxShadow: {
        sm: 'var(--zerithium-shadow-sm)',
        md: 'var(--zerithium-shadow-md)',
        lg: 'var(--zerithium-shadow-lg)',
        xl: 'var(--zerithium-shadow-xl)',
        xxl: 'var(--zerithium-shadow-xxl)',
      },
    },
  },
};
export default config;
