document.addEventListener('DOMContentLoaded', () => {
    const accordionHeaders = document.querySelectorAll('.service-accordion .accordion-header');
    const accordionItems = Array.from(document.querySelectorAll('.service-accordion .accordion-item'));
    const searchInput = document.getElementById('servicesSearch');
    const searchInfo = document.getElementById('servicesSearchInfo');

    const searchableSelectors = '.accordion-body p, .accordion-body li';

    function getCurrentLang() {
        const saved = localStorage.getItem('siteLang');
        return saved && translations[saved] ? saved : 'it';
    }

    function t(key, fallback) {
        const lang = getCurrentLang();
        return (translations[lang] && translations[lang][key]) || fallback;
    }

    function closeAllAccordions() {
        accordionHeaders.forEach((header) => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            item.classList.remove('open');
            header.classList.remove('active');
            content.style.maxHeight = null;
        });
    }

    function openAccordion(item) {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        item.classList.add('open');
        header.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
    }

    function escapeRegex(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function clearHighlights(item) {
        item.querySelectorAll('mark.services-highlight').forEach((mark) => {
            const parent = mark.parentNode;
            if (!parent) return;
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize();
        });
    }

    function highlightTermInElement(element, termRegex) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        const nodes = [];

        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.nodeValue && node.nodeValue.trim()) {
                nodes.push(node);
            }
        }

        nodes.forEach((node) => {
            const text = node.nodeValue;
            termRegex.lastIndex = 0;
            if (!termRegex.test(text)) return;
            termRegex.lastIndex = 0;

            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            let match;

            while ((match = termRegex.exec(text)) !== null) {
                if (match.index > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
                }

                const mark = document.createElement('mark');
                mark.className = 'services-highlight';
                mark.textContent = match[0];
                fragment.appendChild(mark);
                lastIndex = match.index + match[0].length;
            }

            if (lastIndex < text.length) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
            }

            if (node.parentNode) {
                node.parentNode.replaceChild(fragment, node);
            }
        });
    }

    function highlightTerms(item, terms) {
        item.querySelectorAll(searchableSelectors).forEach((el) => {
            terms.forEach((term) => {
                const regex = new RegExp(escapeRegex(term), 'gi');
                highlightTermInElement(el, regex);
            });
        });
    }

    function applySearch() {
        if (!searchInput) return;

        const query = searchInput.value.trim();
        const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

        closeAllAccordions();

        if (terms.length === 0) {
            accordionItems.forEach((item) => {
                item.classList.remove('search-hidden');
                clearHighlights(item);
            });
            if (searchInfo) {
                searchInfo.textContent = t(
                    'services.search_info_idle',
                    'Digita una o più parole chiave per filtrare ed evidenziare i risultati.'
                );
            }
            return;
        }

        let visibleCount = 0;

        accordionItems.forEach((item) => {
            clearHighlights(item);

            const body = item.querySelector('.accordion-body');
            const itemText = body ? body.textContent.toLowerCase() : '';
            const hasMatch = terms.every((term) => itemText.includes(term));

            if (hasMatch) {
                item.classList.remove('search-hidden');
                highlightTerms(item, terms);
                openAccordion(item);
                visibleCount += 1;
            } else {
                item.classList.add('search-hidden');
            }
        });

        if (searchInfo) {
            searchInfo.textContent = visibleCount > 0
                ? t('services.search_results', '{count} risultato/i trovati.').replace('{count}', String(visibleCount))
                : t('services.search_no_results', 'Nessun risultato trovato. Prova con un termine diverso.');
        }
    }

    accordionHeaders.forEach((header) => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            const isOpen = item.classList.contains('open');

            closeAllAccordions();

            if (!isOpen) {
                item.classList.add('open');
                header.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', applySearch);
    }

    document.addEventListener('i18n:changed', () => {
        if (!searchInput) return;
        if (searchInput.value.trim()) {
            applySearch();
            return;
        }
        if (searchInfo) {
            searchInfo.textContent = t(
                'services.search_info_idle',
                'Digita una o più parole chiave per filtrare ed evidenziare i risultati.'
            );
        }
    });
});
