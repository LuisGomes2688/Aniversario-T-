tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            colors: {
                wine: {
                    900: '#4A1525',
                    800: '#5C1A2E',
                    700: '#722F37', // Burgundy
                    600: '#8B3A45',
                },
                rose: {
                    100: '#FFE4E6',
                    200: '#FECDD3',
                    900: '#881337',
                }
            },
            animation: {
                'fade-in': 'fadeIn 1.5s ease-out forwards',
                'fade-up': 'fadeUp 1s ease-out forwards',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        }
    }
}