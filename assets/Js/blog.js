document.addEventListener('DOMContentLoaded', function() {
    const isMainPage = document.getElementById('blog-container') !== null;
    const blogContainer = isMainPage ? document.getElementById('blog-container') : document.getElementById('all-blogs-container');
    const blogPosts = [
        'assets/markdown/first_post.md',
        'assets/markdown/how-to-write-a-code-in-html-css.md',
        'assets/markdown/test.md',
        
    ];
    const maxBlogsToShow = 3;

    if (blogPosts.length === 0) {
        console.error('No markdown files found in the directory.');
        return;
    }

    const postsToShow = isMainPage ? blogPosts.slice(0, maxBlogsToShow) : blogPosts;

    postsToShow.forEach(url => {
        fetch(url)
            .then(response => response.text())
            .then(text => {
                const trimmedText = text.trim();
                const frontMatterMatch = trimmedText.match(/---[\r\n]+([\s\S]+?)[\r\n]+---/);

                if (!frontMatterMatch) {
                    console.error('Frontmatter not found in the markdown file:', url);
                    return;
                }

                const frontMatter = frontMatterMatch[0];
                const content = trimmedText.replace(frontMatter, '');

                const frontMatterData = frontMatterMatch[1].split('\n').reduce((acc, curr) => {
                    const [key, value] = curr.split(': ');
                    if (key && value) acc[key.trim()] = value.trim();
                    return acc;
                }, {});

                const contentHtml = marked.parse(content);
                const blogCard = `
                    <article class="blog__card">
                        <a href="post.html?post=${encodeURIComponent(url)}" class="blog__link">
                            <img src="${frontMatterData.image}" alt="image" class="blog__img">
                            <h2 class="blog__title">${frontMatterData.title}</h2>
                            <p class="blog__description">${frontMatterData.description}</p>
                            <i class="ri-arrow-right-line"></i>
                        </a>
                    </article>
                `;
                blogContainer.innerHTML += blogCard;
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));
    });
});

