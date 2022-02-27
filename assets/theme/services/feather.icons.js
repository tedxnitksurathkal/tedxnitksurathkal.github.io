/**
 * Lucide icons : lucide.dev
 * Fork of Feather Icons
 */
const ICON_CATALOG = {
    grid: `
    <line x1="6" y1="6" x2="6" y2="6"></line>
    <line x1="6" y1="10" x2="6" y2="10"></line>
    <line x1="6" y1="14" x2="6" y2="14"></line>
    <line x1="6" y1="18" x2="6" y2="18"></line>
    <line x1="10" y1="6" x2="10" y2="6"></line>
    <line x1="10" y1="10" x2="10" y2="10"></line>
    <line x1="10" y1="14" x2="10" y2="14"></line>
    <line x1="10" y1="18" x2="10" y2="18"></line>
    <line x1="14" y1="6" x2="14" y2="6"></line>
    <line x1="14" y1="10" x2="14" y2="10"></line>
    <line x1="14" y1="14" x2="14" y2="14"></line>
    <line x1="14" y1="18" x2="14" y2="18"></line>
    <line x1="18" y1="6" x2="18" y2="6"></line>
    <line x1="18" y1="10" x2="18" y2="10"></line>
    <line x1="18" y1="14" x2="18" y2="14"></line>
    <line x1="18" y1="18" x2="18" y2="18"></line>`,
    download: `
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>`,
    eraser: `
    <path d="M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4L20 11L11 20"/>
    <path d="M6 11L13 18"/>`,
    pen: `
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>`,
    info: `
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12" y2="8"></line>`,
};
export function icon(name, ref, alt) {
    const iconData = ICON_CATALOG[name];
    if (!iconData) {
        throw new Error(`The '${name}' icon, doesn't exists.`);
    }
    const dataRef = ref ? `data-ref="${ref}"` : '';
    const altWrap = alt ? `alt="${alt}"` : '';
    const titleWrap = alt ? `<title>${alt}</title>` : '';
    return `<svg ${dataRef} ${altWrap} class="feather" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    ${titleWrap}
    ${iconData}
  </svg>`;
}
