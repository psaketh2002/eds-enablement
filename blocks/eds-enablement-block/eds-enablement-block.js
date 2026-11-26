import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('eds-enablement-block-row');
    [...row.children].forEach((cell) => {
      const picture = cell.querySelector('picture');
      const imageOnly = picture && !cell.textContent.trim();
      cell.classList.add(`eds-enablement-block-${imageOnly ? 'media' : 'body'}`);
    });
  });

  block.querySelectorAll('picture > img').forEach((image) => {
    const picture = createOptimizedPicture(
      image.src,
      image.alt,
      image.loading === 'eager',
      [{ media: '(min-width: 900px)', width: '1200' }, { width: '750' }],
    );
    const optimizedImage = picture.querySelector('img');
    ['width', 'height'].forEach((attribute) => {
      if (image.hasAttribute(attribute)) {
        optimizedImage.setAttribute(attribute, image.getAttribute(attribute));
      }
    });
    image.closest('picture').replaceWith(picture);
  });
}
