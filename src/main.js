const x = localStorage.getItem('x');
const xObject = JSON.parse(x);
const hashMap = (xObject.length !== 0) ? xObject : [
    { logo: 'a', logoType: 'text', url: 'https://www.acfun.cn' },
    { logo: 'b', logoType: 'text', url: 'https://www.bilibili.com' }
];
const $siteList = $('.siteList');
const $lastLi = $siteList.find('li.last');
const simplifyUrl = (url) => {
    return url.replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .replace(/\/.*/, '');
};
const render = () => {
    console.log(xObject)
    console.log(hashMap);
    $siteList.find('li:not(.last)').remove();
    hashMap.forEach((node, index) => {
        const $li = $(`
        <li>
            <a href="${node.url}">
                <div class="site">
                    <div class="logo">${node.logo}</div>
                    <div class="link">${simplifyUrl(node.url)}</div>
                    <div class="close">
                        <svg class="icon">
                            <use xlink:href="#icon-searchClose"></use>
                        </svg>
                    </div>
                </div>
            </a>
        </li>
        `).insertBefore($lastLi);
        $li.on('click', '.close', (e) => {
            e.preventDefault();
            hashMap.splice(index, 1);
            render();
        });
    });
};

render();

$('.addButton').on('click', () => {
    let url = window.prompt('网址');
    if (url.indexOf('http') !== 0) {
        url = 'https://' + url;
    }
    hashMap.push({ logo: simplifyUrl(url)[0], logoType: 'text', url: url });
    $siteList.find('li:not(.last)').remove();
    render();
});

window.onbeforeunload = () => {
    const string = JSON.stringify(hashMap);
    console.log(string);
    localStorage.setItem('x', string);
};

$(document).on('keypress', (e)=>{
    const {key} = e;
    for (let i = 0; i < hashMap.length; i++){
        if(hashMap[i].logo.toLowerCase() === key){
            window.open(hashMap[i].url);
        }
    }
})