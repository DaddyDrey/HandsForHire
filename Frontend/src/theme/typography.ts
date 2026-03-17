const typography = {
  fontFamily:
    'InterVariable, Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
  h1: { fontWeight: 800, fontSize: '3rem', letterSpacing: '-0.02em' },
  h2: { fontWeight: 800, fontSize: '2.25rem', letterSpacing: '-0.02em' },
  h3: { fontWeight: 750, fontSize: '1.75rem' },
  h4: { fontWeight: 750, fontSize: '1.35rem' },
  body1: { fontSize: '1rem', lineHeight: 1.7 },
  body2: { fontSize: '0.95rem', lineHeight: 1.7 },
  button: { textTransform: 'none', fontWeight: 650 },
} as const;

export default typography;
