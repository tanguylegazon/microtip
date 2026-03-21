(() => {
    const init = () => {
        const hover = matchMedia("(hover: hover) and (pointer: fine)").matches;
        if (!(document.getElementsByClassName("tooltip")[0] && !document.querySelector(".ui-tooltip"))) return;

        const bubble = Object.assign(document.createElement("div"), { className: "ui-tooltip", hidden: true });
        const style = bubble.style;
        const data = bubble.dataset;
        const clamp = (v, min, max) => v < min ? min : v > max ? max : v;
        const text = (e) => (e?.dataset.tooltip || e?.getAttribute("aria-label") || "").trim();
        const toggle = (e) => e?.dataset.tooltipTrigger === "toggle";
        const pick = (e) => e.target.closest?.(".tooltip");
        const delay = 500;
        const hideDelay = 140;
        const gap = 10;
        const pad = 12;
        const arrow = 14;

        let active = null;
        let mode = 0;
        let showTimer = 0;
        let hideTimer = 0;
        let frame = 0;

        bubble.setAttribute("role", "tooltip");
        bubble.setAttribute("aria-hidden", "true");
        document.body.appendChild(bubble);

        const sync = (v) => toggle(active) && active.setAttribute("aria-expanded", v ? "true" : "false");

        const place = () => {
            frame = 0;
            if (!active) return;

            const rect = active.getBoundingClientRect();
            const width = bubble.offsetWidth;
            const height = bubble.offsetHeight;
            const center = rect.left + rect.width / 2;
            const below = rect.bottom + gap + height + pad <= innerHeight;
            const ideal = center - width / 2;
            const min = pad;
            const max = innerWidth - width - pad;
            const low = Math.max(min, center - width + arrow);
            const high = Math.min(max, center - arrow);
            const left = clamp(ideal, low <= high ? low : min, low <= high ? high : max);

            data.side = below ? "bottom" : "top";
            style.left = `${left}px`;
            style.top = `${below ? rect.bottom + gap : Math.max(pad, rect.top - height - gap)}px`;
            style.setProperty("--_tooltip-arrow-left", `${clamp(center - left, arrow, width - arrow)}px`);
        };

        const queue = () => active && !frame && (frame = requestAnimationFrame(place));

        const show = (element, nextMode) => {
            const value = text(element);
            if (!value) return;

            clearTimeout(showTimer);
            clearTimeout(hideTimer);
            active !== element && sync(0);
            active = element;
            mode = nextMode;
            bubble.textContent = value;
            bubble.hidden = false;
            bubble.setAttribute("aria-hidden", "false");
            toggle(element) && element.setAttribute("aria-expanded", "true");
            place();
            requestAnimationFrame(() => active === element && (data.visible = "true"));
        };

        const hide = () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
            frame && cancelAnimationFrame(frame);
            frame = 0;
            sync(0);
            active = null;
            mode = 0;
            delete data.visible;
            hideTimer = setTimeout(() => {
                bubble.hidden = true;
                bubble.setAttribute("aria-hidden", "true");
            }, hideDelay);
        };

        if (hover) {
            document.addEventListener("mouseover", (event) => {
                const element = pick(event);
                if (!element || toggle(element) || mode || element.contains(event.relatedTarget) || (element === active && !bubble.hidden)) return;
                clearTimeout(showTimer);
                showTimer = setTimeout(show, delay, element, 0);
            });

            document.addEventListener("mouseout", (event) => {
                const element = pick(event);
                if (!element || toggle(element) || mode || element.contains(event.relatedTarget)) return;
                hide();
            });
        }

        document.addEventListener("click", (event) => {
            const element = event.target.closest?.('.tooltip[data-tooltip-trigger="toggle"]');
            if (!element) return mode && hide();
            element === active && mode && !bubble.hidden ? hide() : show(element, 1);
        });

        document.addEventListener("keydown", (event) => event.key === "Escape" && active && hide());
        document.addEventListener("scroll", queue, { passive: true, capture: true });
        addEventListener("resize", queue);
    };

    document.readyState === "loading"
        ? document.addEventListener("DOMContentLoaded", init, { once: true })
        : init();
})();
