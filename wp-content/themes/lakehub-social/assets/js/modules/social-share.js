/**
 * Blog post social share actions (X, LinkedIn, Facebook, and Copy Link).
 *
 * @package LakeHub_Social
 */

(() => {
  const shareContainers = document.querySelectorAll('.lakehub-social-share-links');
  if (!shareContainers.length) return;

  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(document.title);

  document.querySelectorAll('.lakehub-share-btn.share-x').forEach((btn) => {
    btn.href = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
  });
  document.querySelectorAll('.lakehub-share-btn.share-linkedin').forEach((btn) => {
    btn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
  });
  document.querySelectorAll('.lakehub-share-btn.share-facebook').forEach((btn) => {
    btn.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
  });
  document.querySelectorAll('.lakehub-share-btn.share-copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        const originalTitle = btn.getAttribute('title') || 'Copy link';
        btn.setAttribute('title', 'Copied!');
        btn.classList.add('is-copied');
        setTimeout(() => {
          btn.setAttribute('title', originalTitle);
          btn.classList.remove('is-copied');
        }, 2000);
      } catch {
        const input = document.createElement('input');
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        btn.classList.add('is-copied');
        setTimeout(() => btn.classList.remove('is-copied'), 2000);
      }
    });
  });
})();
