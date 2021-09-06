const render = () => {
    hashMap.forEach(node => {
        const $li = $(`
        <li>
            <a href="${node.url}">
                <div class="site">
                    <div class="logo">${node.logo}</div>
                    <div class="link">${node.url}</div>
                </div>
            </a>
        </li>
        `).insertBefore($lastLi);
    });
}
const x = localStorage.getItem('x');
const xObject = JSON.parse(x);
const hashMap = xObject || [
    { logo: 'A', logoType: 'text', url: 'https://www.acfun.cn' },
    { logo: 'B', logoType: 'text', url: 'https://www.bilibili.com' }
];
console.log(x);
const $siteList = $('.siteList');
const $lastLi = $siteList.find('li.last');

render();

$('.addButton').on('click', () => {
    let url = window.prompt('网址');
    if (url.indexOf('http') !== 0) {
        url = 'https://' + url;
    }
    hashMap.push({ logo: url[0], logoType: 'text', url: url });
    $siteList.find('li:not(.last)').remove();
    render();
});

window.onbeforeunload = () => {
    const string = JSON.stringify(hashMap);
    localStorage.setItem('x', string);
};
