const featuredStories = document.querySelector(".story-cards");

if (featuredStories && Array.isArray(window.BIBLE_STORIES)) {
    const cards = window.BIBLE_STORIES.slice(0, 3).map((story) => {
        const link = document.createElement("a");
        link.className = "story-card";
        link.href = `storybook.html?story=${encodeURIComponent(story.id)}`;
        link.setAttribute("aria-label", `Read ${story.title}`);

        const image = document.createElement("img");
        image.src = story.pages[0].image;
        image.alt = story.pages[0].imageAlt;
        image.loading = "lazy";

        const title = document.createElement("span");
        title.className = "story-card-title";
        title.textContent = story.title;
        link.append(image, title);
        return link;
    });
    featuredStories.replaceChildren(...cards);
}

document.querySelectorAll("[data-stories-link]").forEach((button) => {
    button.addEventListener("click", () => {
        window.location.href = "stories.html";
    });
});

const revealTargets = document.querySelectorAll(
    ".hero h1, .hero p, .hero button, .featured-stories h2, .story-card, .view-all, .about h2, .about p, .help-bar p"
);

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    revealTargets.forEach((target) => {
        target.classList.add("scroll-reveal");
        revealObserver.observe(target);
    });
}
