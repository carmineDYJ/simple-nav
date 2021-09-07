const x = localStorage.getItem('x');
const searchEngine = localStorage.getItem('searchEngine') === null ? '百度' : localStorage.getItem('searchEngine');
$("#searchEngine").html(searchEngine + ' <i class="layui-icon layui-icon-down layui-font-12"></i>');
const xObject = JSON.parse(x);
const hashMap = (xObject !== null && xObject.length !== 0) ? xObject : [
    { logo: 'm', logoType: 'text', url: 'https://developer.mozilla.org' },
    { logo: 'c', logoType: 'text', url: 'https://css-tricks.com' },
    { logo: 'j', logoType: 'text', url: 'https://zh.javascript.info' },
];
const $siteList = $('.siteList');
const $lastLi = $siteList.find('li.last');
const simplifyUrl = (url) => {
    return url.replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .replace(/\/.*/, '');
};
const urlAlreadyExist = (url) => {
    for (let i = 0; i < hashMap.length; i++) {
        if (hashMap[i].url === url) {
            return true;
        }
    }
    return false;
}
const render = () => {
    $siteList.find('li:not(.last)').remove();
    hashMap.forEach((node, index) => {
        const $li = $(`
        <li>
            <a href="${node.url}">
                <div class="site">
                    <div class="logo">${node.logo}</div>
                    <div class="link">${simplifyUrl(node.url)}</div>
                    <div class="edit">
                        <svg class="icon">
                            <use xlink:href="#icon-editor"></use>
                        </svg>
                    </div>
                    <div class="close">
                        <svg class="icon">
                            <use xlink:href="#icon-searchClose"></use>
                        </svg>
                    </div>
                    <div class="left">
                        <svg class="icon">
                            <use xlink:href="#icon-left"></use>
                        </svg>
                    </div>
                    <div class="right">
                        <svg class="icon">
                            <use xlink:href="#icon-right"></use>
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
        $li.on('click', '.edit', (e) => {
            e.preventDefault();
            let newUrl = window.prompt("请输入你想要更新该链接为：", hashMap[index].url);
            while (newUrl === '') {
                newUrl = window.prompt('请输入你想要更新该链接为(不能为空)：');
            }
            if (newUrl.indexOf('http') !== 0) {
                newUrl = 'https://' + newUrl;
            }
            if (urlAlreadyExist(newUrl)) {
                window.alert('该链接已经存在');
            } else {
                let newLogo = window.prompt("请输入该链接显示的logo为（可留空自动生成，仅一位有效）：");
                if (newLogo === '') {
                    newLogo = simplifyUrl(newUrl)[0];
                } else {
                    newLogo = newLogo[0];
                }
                if (newUrl !== null && newLogo !== null) {
                    hashMap.splice(index, 1, { logo: newLogo, logoType: 'text', url: newUrl });
                }
                render();
            }
        });
        $li.on('click', '.left', (e) => {
            e.preventDefault();
            if (index !== 0 && hashMap.length !== 1) {
                [hashMap[index], hashMap[index - 1]] = [hashMap[index - 1], hashMap[index]];
            }
            render();
        });
        $li.on('click', '.right', (e) => {
            e.preventDefault();
            if (index !== hashMap.length - 1 && hashMap.length !== 1) {
                [hashMap[index], hashMap[index + 1]] = [hashMap[index + 1], hashMap[index]];
            }
            render();
        });
    });
};
const setSearchEngine = (searchEngine) => {
    if (searchEngine === '百度') {
        $('.searchForm').attr('action', 'https://www.baidu.com/s');
        $('.searchForm input').attr('name', 'wd');
    } else if (searchEngine === '谷歌') {
        $('.searchForm').attr('action', 'https://www.google.com/search');
        $('.searchForm input').attr('name', 'q');
    } else if (searchEngine === '必应') {
        $('.searchForm').attr('action', 'https://cn.bing.com/search');
        $('.searchForm input').attr('name', 'q');
    }
}

setSearchEngine(searchEngine);
render();

$('.addButton').on('click', () => {
    let url = window.prompt('请输入你想要添加的链接：');
    while (url === '') {
        url = window.prompt('请输入你想要添加的链接(不能为空)：');
    }
    if (url.indexOf('http') !== 0) {
        url = 'https://' + url;
    }
    if (urlAlreadyExist(url)) {
        window.alert('该链接已经存在');
    } else {
        hashMap.push({ logo: simplifyUrl(url)[0], logoType: 'text', url: url });
        $siteList.find('li:not(.last)').remove();
        render();
    }
});

$(document).on('keypress', (e) => {
    const { key } = e;
    if (key === 'Enter') {
        $('.searchForm').submit();
    }
});

layui.use('dropdown', function () {
    let dropdown = layui.dropdown;
    dropdown.render({
        elem: '#searchEngine'
        , data: [
            {
                title: '百度',
                href: '#'
            },
            {
                title: '谷歌',
                href: '#'
            },
            {
                title: '必应',
                href: '#'
            },
        ]
        , id: 'searchEngine'
        , click: function (obj) {
            $("#searchEngine").html(obj.title + ' <i class="layui-icon layui-icon-down layui-font-12"></i>');
            setSearchEngine(obj.title);
        }
    });
});

window.onbeforeunload = () => {
    const string = JSON.stringify(hashMap);
    localStorage.setItem('x', string);
    localStorage.setItem('searchEngine', $("#searchEngine").text().trim());
};