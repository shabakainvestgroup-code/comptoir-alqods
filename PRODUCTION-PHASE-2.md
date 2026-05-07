# Phase 2 - Commandes réelles

Ce document liste les réglages nécessaires pour activer les commandes réelles de Comptoir AlQods.

## 1. Base de données Supabase

1. Créer un projet sur Supabase.
2. Ouvrir SQL Editor.
3. Copier le contenu de `supabase-schema.sql`.
4. Exécuter le script.
5. Dans Vercel, ajouter :

```txt
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Important : `SUPABASE_SERVICE_ROLE_KEY` est une clé serveur. Ne jamais l’exposer côté navigateur.

## 2. Back-office sécurisé

Ajouter dans Vercel :

```txt
ADMIN_PASSWORD=mot-de-passe-fort
```

Le back-office est disponible ici :

```txt
/admin
```

Fonctions déjà prêtes :

- connexion par mot de passe ;
- liste des commandes ;
- changement de statut ;
- liste produits ;
- suivi stock faible ;
- bascule automatique vers données de démonstration si Supabase n’est pas configuré.

## 3. Emails Resend

Créer un compte Resend, vérifier le domaine email, puis ajouter dans Vercel :

```txt
RESEND_API_KEY=...
EMAIL_FROM=Comptoir AlQods <contact@comptoiralqods.ma>
ADMIN_ORDER_EMAIL=contact@comptoiralqods.ma
```

Emails prévus :

- confirmation au client ;
- notification de nouvelle commande à l’équipe.

## 4. Paiement CMI ou PayZone

En attendant le compte marchand, garder :

```txt
PAYMENT_PROVIDER=demo
```

Quand CMI est prêt :

```txt
PAYMENT_PROVIDER=cmi
CMI_MERCHANT_ID=...
CMI_STORE_KEY=...
CMI_GATEWAY_URL=...
```

Quand PayZone est prêt :

```txt
PAYMENT_PROVIDER=payzone
PAYZONE_MERCHANT_ID=...
PAYZONE_SECRET_KEY=...
PAYZONE_GATEWAY_URL=...
```

## 5. Déploiement

Après modification :

```powershell
git add .
git commit -m "Add real orders admin and email preparation"
git push
```

Vercel redéploie automatiquement.
