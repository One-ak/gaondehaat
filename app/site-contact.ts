export const WHATSAPP_NUMBER = '9196702525';
export const WHATSAPP_DISPLAY_NUMBER = '+91 91967 02525';
export const COMPANY_EMAIL = 'Gaondehat31@gmail.com';

export function createWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const generalWhatsAppLink = createWhatsAppLink(
  'Hello Gao Dehat Team, I would like to make a product or business enquiry.'
);
