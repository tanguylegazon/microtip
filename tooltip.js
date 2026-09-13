/*!
 * microtip is licensed under the MIT License.
 * https://github.com/tanguylegazon/microtip/blob/main/LICENSE
 */

(() => {
    const init = () => {
        const hover = matchMedia("(hover: hover) and (pointer: fine)").matches;
        if (document.querySelector(".ui-tooltip")) return;

        const bubble = Object.assign(document.createElement("div"), { className: "ui-tooltip", hidden: true });
        let bubbleId = "ui-tooltip";
        for (let index = 2; document.getElementById(bubbleId); index++) bubbleId = "ui-tooltip-" + index;
        bubble.id = bubbleId;
        const style = bubble.style;
        const data = bubble.dataset;
        const clamp = (v, min, max) => v < min ? min : v > max ? max : v;
        const text = (e) => (e?.dataset.tooltip || e?.getAttribute("aria-label") || "").trim();
        const toggle = (e) => e?.dataset.tooltipTrigger === "toggle";
        const pick = (e) => e.target.closest?.(".tooltip");
        const delay = 500;
        const leaveDelay = 100;
        const hideDelay = 150;
        const gap = 10;
        const pad = 12;

        let active = null;
        let mode = 0;
        let showTimer = 0;
        let hideTimer = 0;
        let frame = 0;

        bubble.setAttribute("role", "tooltip");
        bubble.setAttribute("aria-hidden", "true");
        document.body.appendChild(bubble);

        const sync = (v) => toggle(active) && active.setAttribute("aria-expanded", v ? "true" : "false");
        const describe = (element) => {
            if (!element.dataset.tooltip) return;
            const ids = (element.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
            if (!ids.includes(bubble.id)) element.setAttribute("aria-describedby", [...ids, bubble.id].join(" "));
        };
        const undescribe = () => {
            if (!active?.dataset.tooltip) return;
            const ids = (active.getAttribute("aria-describedby") || "").split(/\s+/).filter(id => id && id !== bubble.id);
            ids.length ? active.setAttribute("aria-describedby", ids.join(" ")) : active.removeAttribute("aria-describedby");
        };

        const place = () => {
            frame = 0;
            if (!active) return;

            const rect = active.getBoundingClientRect();
            const width = bubble.offsetWidth;
            const height = bubble.offsetHeight;
            const center = rect.left + rect.width / 2;
            const roomBelow = innerHeight - rect.bottom - gap - pad;
            const roomAbove = rect.top - gap - pad;
            const below = roomBelow >= height || roomBelow >= roomAbove;
            const ideal = center - width / 2;
            const min = pad;
            const max = innerWidth - width - pad;
            const computed = getComputedStyle(bubble);
            const borderStart = parseFloat(computed.borderLeftWidth) || 0;
            const borderEnd = parseFloat(computed.borderRightWidth) || 0;
            const contentWidth = width - borderStart - borderEnd;
            const arrowSize = parseFloat(getComputedStyle(bubble, "::before").width) || 10;
            const radius = parseFloat(computed.borderTopLeftRadius) || 0;
            const arrow = Math.min(Math.max(arrowSize, radius) + 2, contentWidth / 2);
            const low = Math.max(min, center - borderStart - contentWidth + arrow);
            const high = Math.min(max, center - borderStart - arrow);
            const left = clamp(ideal, low <= high ? low : min, low <= high ? high : max);
            const arrowLeft = clamp(center - left - borderStart, arrow, contentWidth - arrow);

            data.side = below ? "bottom" : "top";
            style.left = left + "px";
            style.top = (below ? Math.min(rect.bottom + gap, innerHeight - height - pad) : Math.max(pad, rect.top - height - gap)) + "px";
            Math.abs(left - ideal) < .5
                ? style.removeProperty("--_tooltip-arrow-left")
                : style.setProperty("--_tooltip-arrow-left", arrowLeft + "px");
        };

        const queue = () => active && !frame && (frame = requestAnimationFrame(place));

        const show = (element, nextMode) => {
            const value = text(element);
            if (!value) return;

            clearTimeout(showTimer);
            clearTimeout(hideTimer);
            if (active !== element) {
                sync(0);
                undescribe();
                active = element;
                describe(element);
            }
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
            undescribe();
            active = null;
            mode = 0;
            delete data.visible;
            hideTimer = setTimeout(() => {
                bubble.hidden = true;
                bubble.setAttribute("aria-hidden", "true");
            }, hideDelay);
        };
        const queueHide = () => {
            clearTimeout(hideTimer);
            hideTimer = setTimeout(hide, leaveDelay);
        };

        if (hover) {
            document.addEventListener("mouseover", (event) => {
                const element = pick(event);
                if (!element || toggle(element)) return;
                clearTimeout(hideTimer);
                if (mode || element.contains(event.relatedTarget) || (element === active && !bubble.hidden)) return;
                clearTimeout(showTimer);
                showTimer = setTimeout(show, delay, element, 0);
            });

            document.addEventListener("mouseout", (event) => {
                const element = pick(event);
                if (!element || toggle(element) || mode || element.contains(event.relatedTarget)) return;
                queueHide();
            });

            bubble.addEventListener("mouseenter", () => clearTimeout(hideTimer));
            bubble.addEventListener("mouseleave", queueHide);
        }

        document.addEventListener("focusin", (event) => {
            const element = pick(event);
            if (element && !toggle(element)) show(element, 2);
        });

        document.addEventListener("focusout", (event) => {
            const element = pick(event);
            if (element && !toggle(element) && !element.contains(event.relatedTarget)) hide();
        });

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
