export const ENV = {
    // Google Maps API Key (Required for Maps & Places)
    GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',

    // Supabase Config (Deprecated/Legacy)
    NEXT_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',

    // Backend URL
    API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
};
