export default async function init(id) {
  const element = document.querySelector('[use\\:editor]');
  if (element.localName !== 'div') {
    throw new Error('The "use:editor" directive can only be used on a <div> node!')
  }
  if (element) {
    const { default: setup } = await import('./setup.js');
    setup(element, id);
  }
}
