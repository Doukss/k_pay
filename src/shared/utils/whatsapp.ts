export interface WhatsAppMessagePayload {
  id: number;
  name: string;
  phone: string;
  property: string;
  rentVal: number;
}

export const createWhatsAppPaymentMessage = (loc: WhatsAppMessagePayload) => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const paymentUrl = `${origin}/paiement?tenantId=${loc.id}`;
  
  const rawDigits = loc.phone.replace(/\D/g, '');
  const cleanPhone = rawDigits.startsWith('221') ? rawDigits : `221${rawDigits.slice(-9)}`;

  const text = `Bonjour ${loc.name},\n\nVotre loyer de ${loc.rentVal.toLocaleString()} FCFA pour le bien "${loc.property}" est en attente de règlement.\n\nVous pouvez régler en 1 clic en toute sécurité via Wave ou Orange Money en cliquant sur ce lien sécurisé :\n${paymentUrl}\n\nUne quittance de loyer certifiée vous sera délivrée immédiatement après validation.\n\nMerci de votre confiance,\nAgence KeurGui Pay`;

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;

  return {
    phone: cleanPhone,
    text,
    paymentUrl,
    whatsappUrl,
  };
};
