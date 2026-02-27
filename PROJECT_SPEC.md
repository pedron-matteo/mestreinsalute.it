# Specifiche del Progetto: Sito Web "Mestre in Salute"

## Panoramica
Sito web moderno e responsive per una medicina di gruppo composta da 10 medici di base. Il sito deve fornire informazioni chiare e accessibili ai pazienti, gestire gli orari dei medici e presentare i servizi infermieristici.

## Tecnologie
- **Core**: HTML5, CSS3, JavaScript (Vanilla).
- **Design**: Moderno, "Premium", Mobile-first, Responsive.
- **Librerie Esterne**: Google Fonts (Inter/Roboto), FontAwesome (Icone - opzionale o SVG diretti), Google Maps Embed.

## Struttura del Sito (Sitemap)

1.  **Home Page (`index.html`)**
    - Header con navigazione e logo "Mestre in Salute".
    - Hero Section con immagine accattivante e CTA (Call to Action) rapida (es. "Prenota appuntamento", "Orari oggi").
    - Sezione "Chi siamo" (breve intro).
    - Highlights servizi principali.
    - Footer con contatti rapidi e link legali.

2.  **I Nostri Medici (`medici.html`)**
    - Griglia/Lista dei 10 medici.
    - Ogni card medico include: Nome, Foto (placeholder o generata), Specializzazione.
    - **Funzionalità**: Cliccando sul medico si espande una sezione o si apre un modale/pagina con la tabella orari personalizzata e note specifiche (es. modalità di prenotazione).

3.  **Infermeria & Servizi (`infermeria.html`)**
    - Elenco servizi offerti:
        - Gestione piani terapeutici.
        - Medicazioni.
        - Vaccinazioni.
        - Monitoraggio parametri (pressione, glicemia, etc.).
    - Orari di apertura dell'infermeria.
    - Modalità di accesso (su appuntamento/accesso libero).

4.  **Informazioni & Contatti (`info.html`)**
    - **Guida ai Servizi**: PDF scaricabile o sezione dettagliata.
    - **Dove Siamo**: Mappa interattiva (Google Maps embedding) e indirizzo.
    - **Contatti**: Form di contatto, numeri di telefono segreteria, email.
    - **Metodi di Accesso**: Come prenotare, regole per le ricette, guardia medica.

## Design System & UI/UX
- **Palette Colori**: 
    - Primario: Blu Salute Profondo (#0056b3) o Verde Acqua Moderno (#00a896).
    - Secondario: Grigio Chiaro/Bianco per pulizia (#f8f9fa).
    - Accento: Colore caldo per CTA (es. Arancione soft).
- **Tipografia**: Pulita, sans-serif (es. 'Inter', 'Poppins' o 'Roboto').
- **Responsività**: Layout fluido che si adatta a Desktop, Tablet e Mobile. Menu "Burger" su mobile.
- **Effetti**: Hover delicati, transizioni fluide, shadow per profondità (Glassmorphism dove appropriato).

## Dettagli Funzionali
- **Tabella Orari**: Deve essere chiara, leggibile su mobile.
- **Form Contatti**: Validazione lato client (HTML5/JS).
- **Prestazioni**: Immagini ottimizzate, codice minificato dove possibile (manuale o strutturato bene).
