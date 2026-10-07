const library = document.querySelector("#story-library");
const stories = window.BIBLE_STORIES;

if (!Array.isArray(stories) || !library) {
    throw new Error("The Bible story catalog could not be loaded.");
}

library.replaceChildren(...stories.map((story) => {
    const link = document.createElement("a");
    link.className = "library-card";
    link.href = `storybook.html?story=${encodeURIComponent(story.id)}`;
    link.setAttribute("aria-label", `Read ${story.title}`);

    const image = document.createElement("img");
    image.src = story.pages[0].image;
    image.alt = story.pages[0].imageAlt;
    image.loading = "lazy";

    const content = document.createElement("span");
    content.className = "library-card-content";

    const title = document.createElement("span");
    title.className = "library-card-title";
    title.textContent = story.title;

    const description = document.createElement("span");
    description.className = "library-card-description";
    description.textContent = story.description;

    const callToAction = document.createElement("span");
    callToAction.className = "library-card-link";
    callToAction.textContent = "Read this story →";

    content.append(title, description, callToAction);
    link.append(image, content);
    return link;
}));
