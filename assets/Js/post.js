document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postUrl = urlParams.get('post');

    fetch(postUrl)
        .then(response => response.text())
        .then(text => {
            const trimmedText = text.trim();
            const frontMatter = trimmedText.match(/---[\r\n]+([\s\S]+?)[\r\n]+---/);

            const content = trimmedText.replace(frontMatter[0], '');
            const frontMatterData = frontMatter[1].split('\n').reduce((acc, curr) => {
                const [key, value] = curr.split(': ');
                if (key && value) acc[key.trim()] = value.trim();
                return acc;
            }, {});

            const postTitle = document.getElementById('post-title');
            const postImage = document.getElementById('post-image');
            const postContent = document.getElementById('post-content');

            postTitle.innerText = frontMatterData.title || 'No title found';
            postImage.src = frontMatterData.image || '';
            postImage.alt = frontMatterData.title || 'No title';
            postContent.innerHTML = marked.parse(content);
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
});
