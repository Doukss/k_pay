import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const registerSchema = z
  .object({
    nomAgence: z.string().min(2, "Le nom de l'agence est requis"),
    nomResponsable: z.string().min(2, 'Le nom du responsable est requis'),
    email: z.string().min(1, "L'email est requis").email('Adresse email invalide'),
    telephone: z
      .string()
      .min(1, 'Le numéro de téléphone est requis')
      .refine((val) => isValidPhoneNumber(val, 'SN'), {
        message: 'Numéro de téléphone sénégalais invalide',
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