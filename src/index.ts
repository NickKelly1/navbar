import $ from 'jquery';
import './styles/root.scss';
import './styles/layout.scss';
import './styles/nav.scss';
import './styles/main.scss';
import cat from './icons/cat.svg';
import chevronRight from './icons/chevron-right.svg';
import home from './icons/home.svg';
import moon from './icons/moon.svg';
import rocket from './icons/rocket.svg';
import virus from './icons/virus.svg';
import text from './text.txt';

const svgs: Record<string, string | undefined> = {
  cat,
  'chevron-right': chevronRight,
  home,
  moon,
  rocket,
  virus,
}


// load main text
$(async function() {
  const html = text
    .split('\n')
    .filter(Boolean)
    .map((paragraph: string) => `<p>${paragraph}</p>`)
    .join('\n');
  $(".main").append(html);
});


// load svgs
$('[data-icon]').each((_, container) => {
  const target = container.dataset.icon;
  if (!target) {
    console.warn(`failed to load icon: no target`);
    return;
  }
  const icon = svgs[target];
  if (!icon) {
    console.warn(`failed to load icon: not found "${container.dataset.icon}"`);
    return
  }
  $(container)
    .prepend(icon)
    .find('svg')
    .addClass('svg__icon')
});