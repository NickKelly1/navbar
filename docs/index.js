"use-strict";

// load main text
$(async function() {
  const text = await $.ajax('/text.txt');
  const html = /* html */ text
    .split('\n')
    .filter(Boolean)
    .map(paragraph => `<p>${paragraph}</p>`)
    .join('\n');
  $(".main").append(html);
});


// load svgs
$('[data-icon]').each(async (_, container) => {
  const icon = container.dataset.icon;
  const url = `/icons/${icon}.svg`;
  console.log(`fetching icon: "${icon}"`);
  await $
    .ajax(url)
    .then(svgDocument => {
      $(svgDocument)
        .find('svg')
        .addClass('nav__icon')
        .prependTo(container);
    })
    .catch(error => {
      console.log(`failed to load icon: "${icon}"`, error);
    });
});