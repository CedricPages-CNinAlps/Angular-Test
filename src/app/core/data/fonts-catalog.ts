export interface FontOption {
  key: string;
  label: string;
  family: string;
  googleFontName: string;
  weights: string;
  category: 'sans' | 'serif' | 'mono' | 'display';
}

export const FONT_CATALOG: FontOption[] = [
  { key: 'inter', label: 'Inter', family: "'Inter', sans-serif", googleFontName: 'Inter', weights: '400;500;600;700;800', category: 'sans' },
  { key: 'poppins', label: 'Poppins', family: "'Poppins', sans-serif", googleFontName: 'Poppins', weights: '400;500;600;700;800', category: 'sans' },
  { key: 'sora', label: 'Sora', family: "'Sora', sans-serif", googleFontName: 'Sora', weights: '400;500;600;700;800', category: 'sans' },
  { key: 'space-grotesk', label: 'Space Grotesk', family: "'Space Grotesk', sans-serif", googleFontName: 'Space Grotesk', weights: '400;500;600;700', category: 'display' },
  { key: 'outfit', label: 'Outfit', family: "'Outfit', sans-serif", googleFontName: 'Outfit', weights: '400;500;600;700;800', category: 'sans' },
  { key: 'manrope', label: 'Manrope', family: "'Manrope', sans-serif", googleFontName: 'Manrope', weights: '400;500;600;700;800', category: 'sans' },
  { key: 'plus-jakarta-sans', label: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', sans-serif", googleFontName: 'Plus Jakarta Sans', weights: '400;500;600;700;800', category: 'sans' },
  { key: 'unbounded', label: 'Unbounded', family: "'Unbounded', sans-serif", googleFontName: 'Unbounded', weights: '400;500;600;700;800', category: 'display' },
  { key: 'syne', label: 'Syne', family: "'Syne', sans-serif", googleFontName: 'Syne', weights: '400;500;600;700;800', category: 'display' },
  { key: 'lexend', label: 'Lexend', family: "'Lexend', sans-serif", googleFontName: 'Lexend', weights: '400;500;600;700', category: 'sans' },
  { key: 'urbanist', label: 'Urbanist', family: "'Urbanist', sans-serif", googleFontName: 'Urbanist', weights: '400;500;600;700;800', category: 'sans' },
  { key: 'playfair-display', label: 'Playfair Display', family: "'Playfair Display', serif", googleFontName: 'Playfair Display', weights: '400;500;600;700;800', category: 'serif' },
  { key: 'dm-serif-display', label: 'DM Serif Display', family: "'DM Serif Display', serif", googleFontName: 'DM Serif Display', weights: '400', category: 'serif' },
  { key: 'jetbrains-mono', label: 'JetBrains Mono', family: "'JetBrains Mono', monospace", googleFontName: 'JetBrains Mono', weights: '400;500;600;700', category: 'mono' },
];

export function getFontOption(key: string): FontOption {
  return FONT_CATALOG.find((f) => f.key === key) ?? FONT_CATALOG[0];
}

export function buildGoogleFontsUrl(keys: string[]): string {
  const unique = Array.from(new Set(keys));
  const families = unique
    .map((key) => getFontOption(key))
    .map((font) => `family=${encodeURIComponent(font.googleFontName)}:wght@${font.weights}`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
