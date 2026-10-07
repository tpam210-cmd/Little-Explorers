const storyTitle = document.querySelector("#story-title");
const storyImage = document.querySelector("#story-image");
const storyText = document.querySelector("#story-text");
const pageFlip = document.querySelector("#page-flip");
const pageTurnLeaf = pageFlip.querySelector(".page-turn-leaf");
const pageIndicator = document.querySelector("#page-indicator");
const previousButton = document.querySelector("#previous-page");
const nextButton = document.querySelector("#next-page");
const fullscreenToggle = document.querySelector("#fullscreen-toggle");
const fullscreenStatus = document.querySelector("#fullscreen-status");
const readerContainer = document.querySelector("#reader-container");
const storybookFrame = document.querySelector("#storybook-frame");
const storyError = document.querySelector("#story-error");
const requestedStoryId = new URLSearchParams(window.location.search).get("story");
const story = window.BIBLE_STORIES.find((item) => item.id === requestedStoryId);

if (!story) {
    storyTitle.textContent = "Story not found";
    storyText.hidden = true;
    storyImage.closest(".book-frame").hidden = true;
    document.querySelector("#storybook-frame").hidden = true;
    document.querySelector(".storybook-controls").hidden = true;
    fullscreenToggle.hidden = true;
    storyError.hidden = false;
    storyError.textContent = requestedStoryId
        ? "We couldn't find that story. Choose another adventure from the story library."
        : "Choose a story from the library to begin reading.";
} else {
    let currentPage = 0;
    let isTurningPage = false;
    storyTitle.textContent = story.title;
    document.title = `${story.title} | Little Explorers`;

    function showPage() {
        const page = story.pages[currentPage];
        storyImage.src = page.image;
        storyImage.alt = page.imageAlt;
        storyText.textContent = page.text;
        pageIndicator.textContent = `${currentPage + 1} / ${story.pages.length}`;
        previousButton.disabled = isTurningPage || currentPage === 0;
        nextButton.disabled = isTurningPage || currentPage === story.pages.length - 1;
    }

    function turnPage(direction) {
        const nextPage = currentPage + direction;
        if (isTurningPage || nextPage < 0 || nextPage >= story.pages.length) {
            return;
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            currentPage = nextPage;
            showPage();
            return;
        }

        const bookSpread = document.querySelector(".book-spread");
        const oldIllustration = bookSpread.querySelector(".storybook-illustration").cloneNode(true);
        const oldCopy = bookSpread.querySelector(".book-copy-page").cloneNode(true);
        [oldIllustration, oldCopy].forEach((element) => {
            element.querySelectorAll("[id]").forEach((child) => child.removeAttribute("id"));
            element.removeAttribute("id");
            element.classList.add("page-turn-copy");
        });
        pageTurnLeaf.replaceChildren(oldIllustration, oldCopy);
        pageFlip.className = `book-page-turn ${direction > 0 ? "turn-forward" : "turn-backward"}`;
        pageFlip.hidden = false;
        isTurningPage = true;
        currentPage = nextPage;
        showPage();

        pageTurnLeaf.addEventListener("animationend", () => {
            pageFlip.hidden = true;
            pageTurnLeaf.replaceChildren();
            isTurningPage = false;
            showPage();
        }, { once: true });
    }

    previousButton.addEventListener("click", () => turnPage(-1));
    nextButton.addEventListener("click", () => turnPage(1));

    function updateFullscreenButton() {
        const isFullscreen = document.fullscreenElement === readerContainer;
        fullscreenToggle.setAttribute("aria-pressed", String(isFullscreen));
        fullscreenToggle.innerHTML = isFullscreen
            ? '<span aria-hidden="true">⛶</span> Exit full screen'
            : '<span aria-hidden="true">⛶</span> Full screen';
    }

    fullscreenToggle.addEventListener("click", async () => {
        fullscreenStatus.hidden = true;
        if (!document.fullscreenEnabled || typeof readerContainer.requestFullscreen !== "function") {
            fullscreenStatus.textContent = "Full screen is not available in this browser.";
            fullscreenStatus.hidden = false;
            return;
        }

        try {
            if (document.fullscreenElement === readerContainer) {
                await document.exitFullscreen();
            } else {
                await readerContainer.requestFullscreen();
            }
        } catch {
            fullscreenStatus.textContent = "Full screen couldn't be opened. Please check your browser settings and try again.";
            fullscreenStatus.hidden = false;
        }
    });

    document.addEventListener("fullscreenchange", updateFullscreenButton);

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            turnPage(-1);
        } else if (event.key === "ArrowRight") {
            turnPage(1);
        }
    });

    if (!document.fullscreenEnabled || typeof readerContainer.requestFullscreen !== "function") {
        fullscreenToggle.disabled = true;
        fullscreenToggle.title = "Full screen is not available in this browser.";
    }

    showPage();
}
