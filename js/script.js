$(document).ready(function () {

    // =====================================
    // 0. SETTINGS
    // =====================================

    const CONTACT_EMAIL = "your.email@example.com";


    // =====================================
    // 1. AUTOMATIC FOOTER YEAR
    // =====================================

    $("#current-year").text(new Date().getFullYear());


    // =====================================
    // 2. MOBILE NAVIGATION
    // =====================================

    $(".menu-toggle").on("click", function () {

        const expanded =
            $(this).attr("aria-expanded") === "true";

        $(this).attr("aria-expanded", String(!expanded));

        $(this).attr(
            "aria-label",
            expanded ? "Open navigation" : "Close navigation"
        );

        $("#primary-nav").toggleClass("is-open", !expanded);

    });


    // Close the mobile menu after clicking a link.

    $(".navigation a").on("click", function () {

        $("#primary-nav").removeClass("is-open");

        $(".menu-toggle")
            .attr("aria-expanded", "false")
            .attr("aria-label", "Open navigation");

    });


    // =====================================
    // 3. AJAX PROJECT LOADING
    // =====================================

    let allProjects = [];


    // -------------------------------------
    // 3A. PROJECT DETAIL SECTION MAPPING
    // -------------------------------------

    // Fallback only. The main link now comes from the
    // "href" field in data/projects.json (see 3D).

    const PROJECT_DETAIL_IDS = {
        "academic fraud detection": "academic-fraud-detection",
        "flagship": "flagship",
        "enerpeers": "enerpeers",
        "secure login-based encrypted file sharing system": "secure-file-sharing",
        "apartment": "apartment-opengl",
        "orkaos": "orkaos"
    };


    function getProjectDetailId(project) {

        if (project.detailId) {
            return project.detailId;
        }

        const title = String(project.title || "")
            .toLowerCase()
            .trim();

        return PROJECT_DETAIL_IDS[title] || "";

    }


    // -------------------------------------
    // 3B. HTML ESCAPING
    // -------------------------------------

    function escapeHTML(value) {

        return String(value ?? "").replace(/[&<>"']/g, function (character) {

            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return entities[character];

        });

    }


    // -------------------------------------
    // 3C. SAFE EXTERNAL LINKS
    // -------------------------------------

    function safeExternalURL(url) {

        if (!url || typeof url !== "string") {
            return "";
        }

        try {

            const parsedURL = new URL(url, window.location.href);

            if (
                parsedURL.protocol === "https:" ||
                parsedURL.protocol === "http:"
            ) {
                return escapeHTML(parsedURL.href);
            }

        } catch (error) {

            return "";

        }

        return "";

    }


    // -------------------------------------
    // 3D. SAFE PROJECT DESTINATIONS
    // -------------------------------------

    function getProjectDestination(project) {

        // Prefer the href from projects.json,
        // e.g. "projects.html#flagship".
        // Fall back to the old title lookup if href is missing.
        let detailId = "";

        if (typeof project.href === "string" && project.href.includes("#")) {
            detailId = project.href.split("#")[1];
        } else {
            detailId = getProjectDetailId(project);
        }

        if (!detailId) {
            return "projects.html";
        }

        const isProjectsPage =
            window.location.pathname.toLowerCase().endsWith("projects.html");

        if (isProjectsPage) {
            return "#" + encodeURIComponent(detailId);
        }

        return "projects.html#" + encodeURIComponent(detailId);

    }


    // -------------------------------------
    // 3E. PROJECT LINKS
    // -------------------------------------

    function renderProjectLinks(project) {

        let links = "";

        const githubURL = safeExternalURL(project.github);
        const demoURL = safeExternalURL(project.demo);

        if (githubURL) {

            links += `
                <a
                    href="${githubURL}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link"
                >
                    GitHub ↗
                </a>
            `;

        }

        if (demoURL) {

            links += `
                <a
                    href="${demoURL}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link"
                >
                    Live Demo ↗
                </a>
            `;

        }

        if (!links) {
            return "";
        }

        return `
            <div class="project-links">
                ${links}
            </div>
        `;

    }


    // -------------------------------------
    // 3F. PROJECT VISUAL
    // -------------------------------------

    function renderProjectVisual(project) {

        if (!project.visual) {
            return "";
        }

        const visualURL = safeExternalURL(project.visual);

        if (!visualURL) {
            return "";
        }

        return `
            <figure class="project-visual">

                <img
                    src="${visualURL}"
                    alt="${escapeHTML(
                        project.visualAlt || project.title + " project visual"
                    )}"
                    loading="lazy"
                >

                ${
                    project.visualCaption
                    ? `
                        <figcaption>
                            ${escapeHTML(project.visualCaption)}
                        </figcaption>
                    `
                    : ""
                }

            </figure>
        `;

    }


    // -------------------------------------
    // 3G. PROJECT CARD TECHNOLOGIES
    // -------------------------------------

    function renderProjectTechnologies(project) {

        if (
            !Array.isArray(project.technologies) ||
            project.technologies.length === 0
        ) {
            return "";
        }

        return `
            <div class="project-card-technologies">

                ${project.technologies.map(function (technology) {

                    return `
                        <span class="project-tech-tag">
                            ${escapeHTML(technology)}
                        </span>
                    `;

                }).join("")}

            </div>
        `;

    }


    // -------------------------------------
    // 3H. PROJECT CARD
    // -------------------------------------

    // This is the shared card layout used on
    // BOTH index.html and projects.html.

    function createProjectMarkup(project, index) {

        const title = project.title || "Untitled Project";

        const category = project.categoryLabel || "Project";

        const status = project.status || "In Progress";

        const description =
            project.description ||
            project.overview ||
            "";

        const categoryClass = escapeHTML(
            project.category || "other"
        );

        const projectNumber = String(index + 1).padStart(2, "0");

        const destination = getProjectDestination(project);

        const visual = project.visual
            ? renderProjectVisual(project)
            : "";

        return `

            <article
                class="project-card project-${categoryClass}"
                data-category="${categoryClass}"
            >

                <a
                    href="${escapeHTML(destination)}"
                    class="project-card-link"
                    aria-label="View ${escapeHTML(title)} project details"
                >

                    <div class="project-card-top">

                        <span class="project-card-number">
                            ${projectNumber}
                        </span>

                        <span class="project-card-category">
                            ${escapeHTML(category)}
                        </span>

                        <span class="project-card-arrow" aria-hidden="true">
                            ↗
                        </span>

                    </div>


                    ${visual}


                    <div class="project-card-content">

                        <span class="project-card-status">
                            <span class="status-dot"></span>
                            ${escapeHTML(status)}
                        </span>

                        <h3 class="project-card-title">
                            ${escapeHTML(title)}
                        </h3>

                        <p class="project-card-description">
                            ${escapeHTML(description)}
                        </p>

                    </div>


                    <div class="project-card-footer">

                        ${renderProjectTechnologies(project)}

                    </div>

                </a>

            </article>

        `;

    }


    // -------------------------------------
    // 3I. RENDER ALL PROJECT CARDS
    // -------------------------------------

    function renderProjects(projects) {

        const grid = $("#project-grid");

        if (!grid.length) {
            return;
        }

        grid.empty();


        // No matching projects

        if (!projects || projects.length === 0) {

            grid.append(`

                <p class="empty-message">
                    No projects in this category yet.
                </p>

            `);

            return;

        }


        // Generate compact project cards.

        projects.forEach(function (project, index) {

            const projectMarkup =
                createProjectMarkup(project, index);

            grid.append(projectMarkup);

        });

    }


    // -------------------------------------
    // 3J. AJAX REQUEST
    // -------------------------------------

    // Runs on both the homepage and Projects page.
    // Both pages use the same #project-grid ID.

    if ($("#project-grid").length) {

        $.ajax({

            url: "data/projects.json",

            method: "GET",

            dataType: "json"

        })

        .done(function (data) {

            allProjects = Array.isArray(data.projects)
                ? data.projects
                : [];

            renderProjects(allProjects);

        })

        .fail(function () {

            $("#project-grid").html(`

                <p class="error-message">

                    Projects could not be loaded.

                    Check that data/projects.json exists
                    and that the website is running through a local server.

                </p>

            `);

        });

    }



    // =====================================
    // 4. PROJECT CATEGORY FILTERING
    // =====================================

    $(".filter-button").on("click", function () {

        const selectedFilter = $(this).data("filter");


        // Update the active button.

        $(".filter-button")
            .removeClass("active")
            .attr("aria-pressed", "false");


        $(this)
            .addClass("active")
            .attr("aria-pressed", "true");


        // Filter the project array.
        // A project matches if any of its categories
        // (the "categories" list, or the single "category") matches.

        let filteredProjects;


        if (selectedFilter === "all") {

            filteredProjects = allProjects;

        } else {

            filteredProjects = allProjects.filter(function (project) {

                const categories = Array.isArray(project.categories)
                    ? project.categories
                    : [project.category];

                return categories.includes(selectedFilter);

            });

        }


        // Display filtered cards only.
        // Static project detail sections are not removed.

        renderProjects(filteredProjects);

    });



    // =====================================
    // 5. CONTACT FORM
    // Validation + Email Options
    // =====================================

    const contactForm = document.getElementById("contact-form");


    if (contactForm) {

        const nameInput = document.getElementById("contact-name");
        const emailInput = document.getElementById("contact-email");
        const reasonSelect = document.getElementById("contact-reason");
        const messageInput = document.getElementById("contact-message");


        const nameError = document.getElementById("name-error");
        const emailError = document.getElementById("email-error");
        const reasonError = document.getElementById("reason-error");
        const senderError = document.getElementById("sender-error");
        const messageError = document.getElementById("message-error");


        const successBox = document.getElementById("form-success");


        // -------------------------------------
        // EMAIL VALIDATION
        // -------------------------------------

        const isValidEmail = function (value) {

            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

        };


        // -------------------------------------
        // DISPLAY ERRORS
        // -------------------------------------

        const showError = function (input, errorElement, message) {

            errorElement.textContent = message;

            if (input) {
                input.setAttribute("aria-invalid", "true");
            }

        };


        // -------------------------------------
        // CLEAR ERRORS
        // -------------------------------------

        const clearErrors = function () {

            [
                nameError,
                emailError,
                reasonError,
                senderError,
                messageError
            ].forEach(function (element) {

                element.textContent = "";

            });


            [
                nameInput,
                emailInput,
                reasonSelect,
                messageInput
            ].forEach(function (element) {

                element.removeAttribute("aria-invalid");

            });

        };


        // -------------------------------------
        // FORM VALIDATION
        // -------------------------------------

        const validateForm = function () {

            let firstInvalid = null;

            let isValid = true;


            // NAME

            const name = nameInput.value.trim();

            if (name === "") {

                showError(
                    nameInput,
                    nameError,
                    "Name cannot be empty."
                );

                firstInvalid = firstInvalid || nameInput;

                isValid = false;

            } else if (name.length < 2) {

                showError(
                    nameInput,
                    nameError,
                    "Name must be at least 2 characters."
                );

                firstInvalid = firstInvalid || nameInput;

                isValid = false;

            }


            // EMAIL

            const email = emailInput.value.trim();

            if (email === "") {

                showError(
                    emailInput,
                    emailError,
                    "Email cannot be empty."
                );

                firstInvalid = firstInvalid || emailInput;

                isValid = false;

            } else if (!isValidEmail(email)) {

                showError(
                    emailInput,
                    emailError,
                    "Please enter a valid email, such as name@example.com."
                );

                firstInvalid = firstInvalid || emailInput;

                isValid = false;

            }


            // REASON

            if (reasonSelect.value === "") {

                showError(
                    reasonSelect,
                    reasonError,
                    "Please choose a topic."
                );

                firstInvalid = firstInvalid || reasonSelect;

                isValid = false;

            }


            // SENDER TYPE

            const sender = document.querySelector(
                'input[name="sender-type"]:checked'
            );

            if (!sender) {

                senderError.textContent = "Please select one option.";

                firstInvalid = firstInvalid ||
                    document.querySelector('input[name="sender-type"]');

                isValid = false;

            }


            // MESSAGE

            const message = messageInput.value.trim();

            if (message === "") {

                showError(
                    messageInput,
                    messageError,
                    "Message cannot be empty."
                );

                firstInvalid = firstInvalid || messageInput;

                isValid = false;

            } else if (message.length < 10) {

                showError(
                    messageInput,
                    messageError,
                    "Message must be at least 10 characters."
                );

                firstInvalid = firstInvalid || messageInput;

                isValid = false;

            }


            // Focus on the first invalid field.

            if (firstInvalid) {
                firstInvalid.focus();
            }


            return isValid;

        };


        // -------------------------------------
        // EMAIL OPTIONS
        // -------------------------------------

        const showEmailOptions = function (subject, body) {

            const enc = encodeURIComponent;


            const mailtoUrl =
                "mailto:" + CONTACT_EMAIL +
                "?subject=" + enc(subject) +
                "&body=" + enc(body);


            const gmailUrl =
                "https://mail.google.com/mail/?view=cm&fs=1" +
                "&to=" + enc(CONTACT_EMAIL) +
                "&su=" + enc(subject) +
                "&body=" + enc(body);


            const outlookUrl =
                "https://outlook.live.com/mail/0/deeplink/compose" +
                "?to=" + enc(CONTACT_EMAIL) +
                "&subject=" + enc(subject) +
                "&body=" + enc(body);


            successBox.innerHTML = "";


            const heading = document.createElement("strong");

            heading.textContent =
                "Your message is ready. Choose how to send it: ";

            successBox.appendChild(heading);


            const options = [

                {
                    label: "Open in Gmail",
                    href: gmailUrl
                },

                {
                    label: "Open in Outlook",
                    href: outlookUrl
                },

                {
                    label: "Open default mail app",
                    href: mailtoUrl
                }

            ];


            options.forEach(function (option, index) {

                if (index > 0) {

                    successBox.appendChild(
                        document.createTextNode(" · ")
                    );

                }


                const link = document.createElement("a");

                link.href = option.href;

                link.textContent = option.label;

                link.target = "_blank";

                link.rel = "noopener";


                successBox.appendChild(link);

            });


            successBox.appendChild(
                document.createTextNode(" · ")
            );


            // COPY MESSAGE BUTTON

            const copyButton = document.createElement("button");

            copyButton.type = "button";

            copyButton.textContent = "Copy message";

            copyButton.className = "copy-draft";


            copyButton.addEventListener("click", function () {

                const fullText =
                    "To: " + CONTACT_EMAIL +
                    "\nSubject: " + subject +
                    "\n\n" + body;


                if (navigator.clipboard) {

                    navigator.clipboard.writeText(fullText).then(function () {

                        copyButton.textContent = "Copied!";

                    });

                }

            });


            successBox.appendChild(copyButton);

            successBox.hidden = false;

        };


        // -------------------------------------
        // CONTACT FORM SUBMISSION
        // -------------------------------------

        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();

            clearErrors();

            successBox.hidden = true;


            if (!validateForm()) {
                return;
            }


            const name = nameInput.value.trim();

            const email = emailInput.value.trim();

            const reason = reasonSelect.value;

            const sender = document.querySelector(
                'input[name="sender-type"]:checked'
            ).value;

            const message = messageInput.value.trim();


            const subject = "Portfolio enquiry: " + reason;


            const body =

                "Name: " + name + "\n" +

                "Email: " + email + "\n" +

                "Contacting as: " + sender + "\n" +

                "Topic: " + reason + "\n\n" +

                message;


            showEmailOptions(subject, body);

        });

    }


});