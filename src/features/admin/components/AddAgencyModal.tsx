import { useState } from 'react';
import { 
  Building, 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Check, 
  Plus
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import type { AgencyDetail, AgencyPlan } from '../types';
import { toast } from 'sonner';

interface AddAgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAgency: (agency: AgencyDetail) => void;
  existingAgencies: AgencyDetail[];
}

export function AddAgencyModal({
  isOpen,
  onClose,
  onAddAgency,
  existingAgencies,
}: AddAgencyModalProps) {
  const [name, setName] = useState('');
  const [responsable, setResponsable] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [ninea, setNinea] = useState('');
  const [plan, setPlan] = useState<AgencyPlan>('Plan Pro');
  
  // Gateways
  const [waveEnabled, setWaveEnabled] = useState(true);
  const [omEnabled, setOmEnabled] = useState(true);
  const [waEnabled, setWaEnabled] = useState(true);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const getShortName = (str: string): string => {
    const words = str.trim().split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase() || 'AG';
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = "Le nom de l'agence est obligatoire";
    else if (existingAgencies.some((a) => a.name.toLowerCase() === name.trim().toLowerCase())) {
      errs.name = "Une agence portant ce nom existe déjà";
    }

    if (!responsable.trim()) errs.responsable = "Le nom du responsable est obligatoire";

    if (!email.trim()) errs.email = "L'email professionnel est obligatoire";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Format d'adresse email invalide";
    } else if (existingAgencies.some((a) => a.email.toLowerCase() === email.trim().toLowerCase())) {
      errs.email = "Cette adresse email est déjà enregistrée";
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone.trim()) errs.phone = "Le numéro de téléphone est obligatoire";
    else if (cleanPhone.length < 9) {
      errs.phone = "Numéro de téléphone invalide (au moins 9 chiffres)";
    } else if (existingAgencies.some((a) => a.phone.replace(/\D/g, '').slice(-9) === cleanPhone.slice(-9))) {
      errs.phone = "Ce numéro de téléphone est déjà attribué à une agence";
    }

    if (!city.trim()) errs.city = "La ville ou région d'implantation est requise";
    if (!address.trim()) errs.address = "L'adresse du siège est requise";
    if (!ninea.trim()) errs.ninea = "Le numéro NINEA est requis";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(now);

    const quota = plan === 'Entreprise' ? 9999 : plan === 'Plan Pro' ? 100 : 50;
    const commissionRate = plan === 'Entreprise' ? 1.0 : plan === 'Plan Pro' ? 1.5 : 2.0;

    const newAgency: AgencyDetail = {
      id: Date.now(),
      name: name.trim(),
      shortName: getShortName(name),
      responsable: responsable.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim().startsWith('+221') ? phone.trim() : `+221 ${phone.trim()}`,
      city: city.trim(),
      address: address.trim(),
      ninea: ninea.trim(),
      plan,
      status: 'active',
      locataires: 0,
      quota,
      volumeMensuel: 0,
      commissionRate,
      commissionsTotal: 0,
      tauxRecouvrement: 100.0,
      dateAdhesion: formattedDate,
      gateways: {
        wave: {
          enabled: waveEnabled,
          merchantId: waveEnabled ? `WV-${getShortName(name)}-${Math.floor(100 + Math.random() * 900)}` : undefined,
          status: waveEnabled ? 'operational' : 'not_configured',
        },
        orangeMoney: {
          enabled: omEnabled,
          merchantNumber: omEnabled ? phone.trim() : undefined,
          status: omEnabled ? 'operational' : 'not_configured',
        },
        whatsapp: {
          enabled: waEnabled,
          phoneNumber: waEnabled ? phone.trim() : undefined,
          status: waEnabled ? 'operational' : 'not_configured',
        },
      },
      locatairesList: [],
    };

    onAddAgency(newAgency);
    toast.success(`Agence "${newAgency.name}" enregistrée avec succès !`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <Card className="relative z-10 w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#121318] border border-white/10 text-white shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <CardHeader className="p-5 border-b border-white/5 bg-gradient-to-r from-rose-500/10 via-[#14151B] to-transparent shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center font-bold text-white text-base shadow-md">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-white">
                  Enregistrer une Agence Partenaire
                </CardTitle>
                <CardDescription className="text-xs text-neutral-400 mt-0.5">
                  Créez le profil d'une nouvelle agence cliente sur la plateforme KeurGui Pay.
                </CardDescription>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>

        {/* Modal Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Nom Agence */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-rose-400" /> Nom de l'Agence Immobilière *
              </label>
              <input
                type="text"
                placeholder="Ex: Keur Massar Immobilier & Terres"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                className={`w-full px-3 py-2 rounded-xl bg-black/40 border text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 ${
                  errors.name ? 'border-rose-500' : 'border-white/10'
                }`}
              />
              {errors.name && <p className="text-[10px] text-rose-400">{errors.name}</p>}
            </div>

            {/* Responsable Légal */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-rose-400" /> Gérant / Responsable Légal *
              </label>
              <input
                type="text"
                placeholder="Ex: Moussa Diagne"
                value={responsable}
                onChange={(e) => {
                  setResponsable(e.target.value);
                  if (errors.responsable) setErrors((prev) => ({ ...prev, responsable: '' }));
                }}
                className={`w-full px-3 py-2 rounded-xl bg-black/40 border text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 ${
                  errors.responsable ? 'border-rose-500' : 'border-white/10'
                }`}
              />
              {errors.responsable && <p className="text-[10px] text-rose-400">{errors.responsable}</p>}
            </div>

            {/* NINEA */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-rose-400" /> Numéro Fiscal NINEA *
              </label>
              <input
                type="text"
                placeholder="Ex: 00492817293-1A"
                value={ninea}
                onChange={(e) => {
                  setNinea(e.target.value);
                  if (errors.ninea) setErrors((prev) => ({ ...prev, ninea: '' }));
                }}
                className={`w-full px-3 py-2 rounded-xl bg-black/40 border text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 font-mono ${
                  errors.ninea ? 'border-rose-500' : 'border-white/10'
                }`}
              />
              {errors.ninea && <p className="text-[10px] text-rose-400">{errors.ninea}</p>}
            </div>

            {/* Email Professionnel */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-rose-400" /> Email Professionnel *
              </label>
              <input
                type="email"
                placeholder="Ex: contact@keurmassar-immo.sn"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                className={`w-full px-3 py-2 rounded-xl bg-black/40 border text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 ${
                  errors.email ? 'border-rose-500' : 'border-white/10'
                }`}
              />
              {errors.email && <p className="text-[10px] text-rose-400">{errors.email}</p>}
            </div>

            {/* Téléphone Pro */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-rose-400" /> Téléphone de Contact *
              </label>
              <input
                type="text"
                placeholder="Ex: 77 123 45 67"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                }}
                className={`w-full px-3 py-2 rounded-xl bg-black/40 border text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 font-mono ${
                  errors.phone ? 'border-rose-500' : 'border-white/10'
                }`}
              />
              {errors.phone && <p className="text-[10px] text-rose-400">{errors.phone}</p>}
            </div>

            {/* Ville / Région */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-rose-400" /> Ville / Zone *
              </label>
              <input
                type="text"
                placeholder="Ex: Dakar (Keur Massar)"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (errors.city) setErrors((prev) => ({ ...prev, city: '' }));
                }}
                className={`w-full px-3 py-2 rounded-xl bg-black/40 border text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 ${
                  errors.city ? 'border-rose-500' : 'border-white/10'
                }`}
              />
              {errors.city && <p className="text-[10px] text-rose-400">{errors.city}</p>}
            </div>

            {/* Adresse Siège */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-rose-400" /> Adresse du Siège *
              </label>
              <input
                type="text"
                placeholder="Ex: Route de Boune, Immeuble Horizon"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                }}
                className={`w-full px-3 py-2 rounded-xl bg-black/40 border text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 ${
                  errors.address ? 'border-rose-500' : 'border-white/10'
                }`}
              />
              {errors.address && <p className="text-[10px] text-rose-400">{errors.address}</p>}
            </div>

            {/* Formule d'Abonnement */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-neutral-300">
                Formule d'Abonnement & Quota *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Gratuit', 'Plan Pro', 'Entreprise'] as AgencyPlan[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlan(p)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      plan === p
                        ? p === 'Plan Pro'
                          ? 'border-[#E5B842] bg-[#E5B842]/10 text-white'
                          : 'border-rose-500 bg-rose-500/10 text-white'
                        : 'border-white/5 bg-black/40 text-neutral-400 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{p}</span>
                      {plan === p && <Check className="h-3.5 w-3.5 text-[#E5B842]" />}
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-1">
                      {p === 'Gratuit' ? '15k F (50 loc.)' : p === 'Plan Pro' ? '25k F (100 loc.)' : 'Pro (Illimité)'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Passerelles de paiement */}
            <div className="space-y-2 sm:col-span-2 pt-2 border-t border-white/5">
              <label className="text-xs font-semibold text-neutral-300">
                Passerelles de Recouvrement Automatique
              </label>
              <div className="grid grid-cols-3 gap-2">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-white/5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={waveEnabled}
                    onChange={(e) => setWaveEnabled(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-0"
                  />
                  <span>Wave Sénégal</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-white/5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={omEnabled}
                    onChange={(e) => setOmEnabled(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-0"
                  />
                  <span>Orange Money</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-white/5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={waEnabled}
                    onChange={(e) => setWaEnabled(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-0"
                  />
                  <span>WhatsApp Relances</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-black/40 border-white/10 text-neutral-300 hover:bg-neutral-800 text-xs h-9 px-4"
            >
              Annuler
            </Button>

            <Button
              type="submit"
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs h-9 px-4 gap-1.5 shadow-md"
            >
              <Plus className="h-4 w-4" /> Enregistrer l'Agence
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
