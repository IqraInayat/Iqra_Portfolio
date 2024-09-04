
document.addEventListener('DOMContentLoaded', function() {
    const isMainPage = document.getElementById('blog-container') !== null;
    const blogContainer = isMainPage ? document.getElementById('blog-container') : document.getElementById('all-blogs-container');
    const markdownDirectory = 'assets/markdown/';
    const maxBlogsToShow = 3;

    fetch(markdownDirectory)
        .then(response => response.text())
        .then(text => {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(text, 'text/html');
            const links = htmlDoc.querySelectorAll('a');
            const blogPosts = [];

            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href.endsWith('.md')) {
                    let fullPath = href;
                    if (!href.startsWith(markdownDirectory)) {
                        fullPath = markdownDirectory + href.replace(markdownDirectory, '');
                    }
                    blogPosts.push(fullPath);
                }
            });

            if (blogPosts.length === 0) {
                console.error('No markdown files found in the directory.');
                return;
            }

            // Display only 3 blogs on the main page
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
        })
        .catch(error => console.error('Error fetching markdown directory:', error));
});

