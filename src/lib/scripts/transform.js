const bold = new RegExp("\\[b](.*)\\[\\/b]", "gm");
const italics = new RegExp("\\[i](.*)\\[\\/i]", "gm");
const underline = new RegExp("\\[u](.*)\\[\\/u]", "gm");
const region = new RegExp("\\[region](.*)\\[\\/region]", "gm");
const nation = new RegExp("\\[nation](.*)\\[\\/nation]", "gm");

/**
 * @param text {string}
 */
const textToHtml = (text) => {
  for (const match of text.matchAll(bold)) {
    const segment = match[0];
    const match1 = match[1];
    text = text.replace(segment, `<strong>${match1}</strong>`);
  }

  for (const match of text.matchAll(italics)) {
    const segment = match[0];
    const match1 = match[1];
    text = text.replace(segment, `<i>${match1}</i>`);
  }

  for (const match of text.matchAll(underline)) {
    const segment = match[0];
    const match1 = match[1];
    text = text.replace(segment, `<u>${match1}</u>`);
  }

  for (const match of text.matchAll(nation)) {
    const segment = match[0];
    const match1 = match[1];
    text = text.replace(segment, `<a href="https://nationstates.net/nation=${match1}" style="color: green">${match1}</a>`);
  }

  for (const match of text.matchAll(region)) {
    const segment = match[0];
    const match1 = match[1];
    text = text.replace(segment, `<a href="https://nationstates.net/region=${match1}" style="color: saddlebrown">${match1}</a>`);
  }

  return text;
};

export { textToHtml };