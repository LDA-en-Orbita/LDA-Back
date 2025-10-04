const messages: any = {
    es: {
    },
    en: {
    }
};

export function __(key: string, locale: 'es' | 'en' = 'es'): string {
    const [mainKey, subKey] = key.split('.');
    const value = messages[locale]?.[mainKey as keyof typeof messages['es']]?.[subKey as keyof typeof messages['es'][string]];
    return value ?? key;
}
