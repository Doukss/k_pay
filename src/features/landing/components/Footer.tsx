import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const FOOTER_LINKS = {
  produit: [
    { label: 'Fonctionnalités', href: '#fonctionnalites' },
    { label: 'Comment ça marche', href: '#comment-ca-marche' },
    { label: 'Tarifs', href: '#tarifs' },
  ],
  entreprise: [
    { label: 'À propos', href: '/a-propos' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: "Conditions générales d'utilisation", href: '/cgu' },
    { label: 'Politique de confidentialité', href: '/confidentialite' },
    { label: 'Mentions légales', href: '/mentions-legales' },
  ],
};

const SOCIAL_LINKS = [
  { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Colonne marque */}
          <div>
            <a href="/" className="flex items-center gap-2 text-lg font-semibold">
              <span className="text-primary">KeurGui</span>
              <span>Pay</span>
            </a>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              La plateforme SaaS d'automatisation des relances et du
              recouvrement de loyers par Mobile Money, pensée pour le Sénégal.
            </p>

            {/* Réseaux sociaux */}
            <div className="mt-5 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Colonne Produit */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Produit</h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.produit.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne Entreprise */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Entreprise</h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.entreprise.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne Légal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Légal</h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bas de footer */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} KeurGui Pay. Tous droits réservés.
          </p>
          <p className="text-xs text-muted-foreground">Fait à Dakar 🇸🇳</p>
        </div>
      </div>
    </footer>
  );
}