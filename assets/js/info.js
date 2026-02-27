document.addEventListener('DOMContentLoaded', () => {
    // Accordion Logic
    const accordions = document.querySelectorAll('.accordion-header');

    accordions.forEach((acc) => {
        acc.addEventListener('click', function () {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // Contact Form Submission (EmailJS)
    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const getCurrentLang = () => {
        const saved = localStorage.getItem('siteLang');
        return saved && translations[saved] ? saved : 'it';
    };

    const t = (key, fallback) => {
        const lang = getCurrentLang();
        return (translations[lang] && translations[lang][key]) || fallback;
    };

    const getSubmitDefaultText = () => t('info.form_btn_send', 'Invia Messaggio');

    let submitDefaultText = submitBtn ? submitBtn.textContent : getSubmitDefaultText();
    const statusEl = document.createElement('p');
    statusEl.style.marginTop = '0.8rem';
    statusEl.style.fontSize = '0.92rem';
    statusEl.style.fontWeight = '600';
    form.appendChild(statusEl);

    // EmailJS configuration
    const EMAILJS_PUBLIC_KEY = 'ahfQL8yqKhM-BwGYn';
    const EMAILJS_SERVICE_ID = 'service_jb6wlbp';
    const EMAILJS_TEMPLATE_ID = 'template_sc435nq';

    const EMAILJS_CDN_FALLBACKS = [
        'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js',
        'https://unpkg.com/@emailjs/browser@4/dist/email.min.js'
    ];

    async function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => reject(new Error(`Failed to load ${src}`));
            document.head.appendChild(script);
        });
    }

    async function ensureEmailJsLoaded() {
        if (window.emailjs) return true;
        for (const src of EMAILJS_CDN_FALLBACKS) {
            try {
                await loadScript(src);
                if (window.emailjs) return true;
            } catch (_error) {
                // Try next fallback.
            }
        }
        return false;
    }

    let emailJsInitialized = false;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailJsReady = await ensureEmailJsLoaded();
        if (!emailJsReady) {
            statusEl.textContent = t(
                'info.form_status_lib_error',
                'Invio non disponibile: libreria EmailJS non caricata. Verifica connessione o blocchi browser.'
            );
            statusEl.style.color = '#b42318';
            return;
        }

        if (
            !EMAILJS_PUBLIC_KEY ||
            !EMAILJS_SERVICE_ID ||
            !EMAILJS_TEMPLATE_ID ||
            EMAILJS_PUBLIC_KEY === 'REPLACE_WITH_EMAILJS_PUBLIC_KEY' ||
            EMAILJS_SERVICE_ID === 'REPLACE_WITH_EMAILJS_SERVICE_ID' ||
            EMAILJS_TEMPLATE_ID === 'REPLACE_WITH_EMAILJS_TEMPLATE_ID'
        ) {
            statusEl.textContent = t(
                'info.form_status_config_error',
                'Configura EmailJS in assets/js/info.js (public key, service id, template id).'
            );
            statusEl.style.color = '#b42318';
            return;
        }

        if (!emailJsInitialized) {
            window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
            emailJsInitialized = true;
        }

        const nameInput = form.querySelector('#name');
        const emailInput = form.querySelector('#email');
        const subjectSelect = form.querySelector('#subject');
        const messageInput = form.querySelector('#message');

        const subjectText = subjectSelect && subjectSelect.options[subjectSelect.selectedIndex]
            ? subjectSelect.options[subjectSelect.selectedIndex].text
            : '';

        const templateParams = {
            to_email: 'segnalazioni@mestreinsalute.it',
            from_name: nameInput ? nameInput.value.trim() : '',
            from_email: emailInput ? emailInput.value.trim() : '',
            reply_to: emailInput ? emailInput.value.trim() : '',
            subject: subjectSelect ? subjectSelect.value : '',
            subject_text: subjectText,
            message: messageInput ? messageInput.value.trim() : ''
        };

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = t('info.form_sending', 'Invio in corso...');
            statusEl.textContent = '';

            await window.emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams
            );

            statusEl.textContent = t(
                'info.form_status_success',
                'Grazie per averci contattato! Il tuo messaggio è stato inviato.'
            );
            statusEl.style.color = '#067647';
            form.reset();
        } catch (error) {
            const errorDetail =
                (error && (error.text || error.message)) ? ` (${error.text || error.message})` : '';
            statusEl.textContent = t(
                'info.form_status_send_error',
                'Errore durante l\'invio{detail}. Verifica template/parametri EmailJS.'
            ).replace('{detail}', errorDetail);
            statusEl.style.color = '#b42318';
        } finally {
            submitBtn.disabled = false;
            submitDefaultText = getSubmitDefaultText();
            submitBtn.textContent = submitDefaultText;
        }
    });

    document.addEventListener('i18n:changed', () => {
        if (submitBtn && !submitBtn.disabled) {
            submitDefaultText = getSubmitDefaultText();
            submitBtn.textContent = submitDefaultText;
        }
    });
});
