export const PROPRINT_WHATSAPP_NUMBER = '919322126863';

export const getWhatsAppUrl = (message?: string): string => {
  const defaultText = 'Hello Proprint! I would like to inquire about printing services.';
  const text = encodeURIComponent(message?.trim() || defaultText);
  return `https://wa.me/${PROPRINT_WHATSAPP_NUMBER}?text=${text}`;
};

export const openDirectWhatsApp = (message?: string): void => {
  const url = getWhatsAppUrl(message);
  window.open(url, '_blank', 'noopener,noreferrer');
};
