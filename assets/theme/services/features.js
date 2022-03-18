/**
 * Build a PNG from a SVG
 * This function uses canvas to fill the content
 * then will extract it to a PNG.
 * Sadly, this won't work on Firefox until the user
 * enable the canvas extraction permission.
 *
 * @param svg SVG Element to transform to PNG
 * @returns Promise<File>
 */
export function buildPNG(svg) {
    const canvas = document.createElement('canvas');
    canvas.width = parseInt(svg.getAttribute('width') || '0', 10);
    canvas.height = parseInt(svg.getAttribute('height') || '0', 10);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
    const url = window.URL.createObjectURL(blob);
    return new Promise((res, rej) => {
        const baseimage = new Image();
        baseimage.style.background = '#000';
        baseimage.onload = function () {
            ctx.drawImage(baseimage, 1, 1, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                const file = new File([blob], 'minimator.png', { type: 'image/png' });
                res(file);
            });
        };
        baseimage.onerror = rej;
        baseimage.src = url;
    });
}
// Build the downloader anchor
let downloadAnchor = document.createElement('a');
downloadAnchor.style.display = 'none';
document.body.appendChild(downloadAnchor);
/**
 * Utility to start a download
 *
 * From http://jsfiddle.net/koldev/cw7w5/
 * >> +1 Good Job!
 *
 * @param svgContent SVG content for download
 * @param fileName File name for download
 */
export function downloader(pngContent, fileName) {
    console.log("Download");
    let blob = new Blob([pngContent], { type: 'octet/stream' }), url = window.URL.createObjectURL(blob);
    downloadAnchor.href = url;
    downloadAnchor.download = fileName;
    downloadAnchor.click();
    window.setTimeout(function () {
        window.URL.revokeObjectURL(url);
    }, 10);
}
