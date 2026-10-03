import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

const isSenegalesePhone = (val: string) => {
  const cleaned = val.replace(/\s+/g, '');
  if (isValidPhoneNumber(val, 'SN')) return true;
  if (isValidPhoneNumber('+221' + cleaned, 'SN')) return true;
  return /^(?:\+221|00221)?[78][05678]\d{7}$/.test(cleaned);
};

export const registerSchema = z
  .object({
    nomAgence: z.string().min(2, "Le nom de l'agence est requis"),
    nomResponsable: z.string().min(2, 'Le nom du responsable est requis'),
    email: z.string().min(1, "L'email est requis").email('Adresse email invalide'),
    telephone: z
      .string()
      .min(1, 'Le numéro de téléphone est requis')
      .refine(isSenegalesePhone, {
        message: 'Numéro de téléphone sénégalais invalide (ex: 77 123 45 67)',
      }),
    password: z
      .string()
      .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;