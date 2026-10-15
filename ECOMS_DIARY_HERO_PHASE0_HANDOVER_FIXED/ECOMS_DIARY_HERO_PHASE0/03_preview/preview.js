const dialog = document.getElementById('preview-dialog');
const closeButton = document.getElementById('close-dialog');
for (const button of document.querySelectorAll('[data-preview-action]')) {
  button.addEventListener('click', () => {
    if (dialog?.showModal) dialog.showModal();
    else alert('PHASE 0 DEMO: Chưa có luồng nhận hồ sơ hoặc ghép team.');
  });
}
closeButton?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {if(event.target === dialog) dialog.close()});
// No network requests, no cookies, no localStorage, no collection of personal data.
