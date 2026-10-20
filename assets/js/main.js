// Highlight the section currently reached by scrolling or sidebar navigation.
(function () {
    var links = Array.from(document.querySelectorAll('.section-sidebar a'));
    if (!links.length) return;
    var sections = links.map(function (link) { return document.querySelector(link.getAttribute('href')); });
    var pending = false;
    function update() {
        var active = 0;
        sections.forEach(function (section, index) {
            if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.35) active = index;
        });
        links.forEach(function (link, index) {
            link.classList.toggle('active', index === active);
            if (index === active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
        pending = false;
    }
    function schedule() {
        if (pending) return;
        pending = true;
        window.requestAnimationFrame(update);
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
}());

// Keep the welcome screen fitted below the navigation, including its mobile menu.
(function () {
    var header = document.querySelector('header');
    if (!header) return;
    function updateNavigationHeight() {
        document.documentElement.style.setProperty('--navigation-height', header.getBoundingClientRect().height + 'px');
    }
    updateNavigationHeight();
    window.addEventListener('resize', updateNavigationHeight);
    if ('ResizeObserver' in window) {
        new ResizeObserver(updateNavigationHeight).observe(header);
    }
}());

// Run independently of the portfolio's jQuery controls.
(function () {
    var section = document.querySelector('.welcome-section');
    if (!section) return;
    var stage = section.querySelector('.welcome-stage');
    var portrait = section.querySelector('.welcome-portrait');
    var image = portrait.querySelector('img');
    var title = section.querySelector('.welcome-title');
    var hint = section.querySelector('.welcome-scroll');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var pending = false;

    function render() {
        var bounds = section.getBoundingClientRect();
        var width = stage.clientWidth;
        var height = stage.clientHeight;
        var distance = section.offsetHeight - height;
        var progress = reducedMotion.matches ? 0 : Math.max(0, Math.min(1, -bounds.top / Math.max(1, distance)));
        var radius = 85 + (Math.hypot(width / 2, height * 0.52) - 85) * progress;
        portrait.style.clipPath = 'circle(' + radius + 'px at 50% 52%)';
        image.style.width = (170 + (width - 170) * progress) + 'px';
        image.style.height = (170 + (height - 170) * progress) + 'px';
        image.style.top = (52 - 2 * progress) + '%';
        title.style.opacity = Math.max(0, 1 - progress * 3);
        hint.style.opacity = Math.max(0, 1 - progress * 4);
        hint.style.visibility = progress >= 0.25 ? 'hidden' : 'visible';
        pending = false;
    }
    function scheduleRender() {
        if (pending) return;
        pending = true;
        window.requestAnimationFrame(render);
    }
    window.addEventListener('scroll', scheduleRender, { passive: true });
    window.addEventListener('resize', scheduleRender);
    reducedMotion.addEventListener('change', scheduleRender);
    render();
}());
$(function () {
    $('.filter').on('click', function () {
        var category = $(this).data('filter');

        $('.filter').removeClass('active').attr('aria-pressed', 'false');
        $(this).addClass('active').attr('aria-pressed', 'true');

        $('.project-item').each(function () {
            $(this).prop(
                'hidden',
                category !== 'all' && $(this).data('category') !== category
            );
        });
    });

    $('.navbar-nav a').on('click', function () {
        $('#navigation').collapse('hide');
    });

    var projects = {
        nails: [
            'Red & Pink Nail Art',
            'A red and pink nail design featuring polka dots and silver bow accents.'
        ],
        graphic: [
            'Anime Graphic',
            'An anime composition pairing a deep red palette with expressive script typography.'
        ],
        cafe: [
            'Klasik Grounds',
            'A cafe website design with a coffee shop backdrop, bold typography, and clear ordering buttons.'
        ]
    };

    $('.project-preview').on('click', function () {
        var project = projects[$(this).data('project')];
        var image = $(this).find('img');

        $('#projectTitle').text(project[0]);
        $('#projectDescription').text(project[1]);
        $('#projectImage').attr({
            src: image.attr('src'),
            alt: image.attr('alt')
        });
        $('#projectModal').modal('show');
    });
});
