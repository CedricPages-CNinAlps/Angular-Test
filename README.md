# CV — Cédric Pagès

CV en ligne animé (site public monopage) avec un backoffice complet permettant d'éditer tout le contenu,
le thème (couleurs, polices, styles de titres), les images et l'ordre des sections. Généré à partir
d'[Angular CLI](https://github.com/angular/angular-cli) version 22.0.6.

## Premier lancement

1. `npm install`
2. `ng serve`, puis ouvrir `http://localhost:4200/` — le site public s'affiche avec un contenu d'exemple
   (aucune configuration requise pour l'explorer).
3. Aller sur `http://localhost:4200/admin/setup` pour créer le mot de passe administrateur. Une URL secrète
   (`/admin/<token>`) est générée et affichée **une seule fois** : notez-la, c'est le seul moyen d'accéder
   au backoffice ensuite (elle peut être régénérée depuis Technique → Sécurité si besoin).
4. Dans le backoffice, éditer le contenu (onglet **Contenu**), l'apparence (**Apparence**), puis publier.

## Connecter JSONBin (stockage du contenu)

Le site public lit son contenu depuis un [bin JSONBin.io](https://jsonbin.io). Tant qu'aucun bin n'est
configuré, le site affiche un contenu d'exemple embarqué.

1. Créer un compte gratuit sur jsonbin.io.
2. Créer un bin contenant `{}`.
3. Créer une **clé d'accès restreinte** à ce bin (lecture + écriture), pas la clé principale du compte.
4. Renseigner le Bin ID et la clé dans le backoffice, onglet **Technique**, puis « Tester la connexion ».
5. Publier depuis le backoffice pour écrire le contenu dans le bin.

## Connecter EmailJS (formulaire de contact)

1. Créer un compte sur [emailjs.com](https://www.emailjs.com), un service d'envoi et un template.
2. Renseigner Service ID / Template ID / Public Key dans le backoffice, onglet **Technique**.
3. Utiliser « Envoyer un e-mail de test » pour valider la configuration.

## ⚠️ Avertissement sécurité

Ce site n'a pas de serveur : la clé JSONBin en écriture et le mot de passe administrateur (hashé) restent
dans le navigateur (`localStorage`) et transitent dans le code livré au client. La protection de l'URL
secrète + mot de passe est **dissuasive**, pas une sécurité serveur — un visiteur déterminé inspectant le
bundle JS pourrait retrouver la clé JSONBin. Utilisez toujours une clé JSONBin restreinte à ce seul bin.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
