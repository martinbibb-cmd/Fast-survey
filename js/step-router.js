// Lightweight step navigation shim for multi-section planner pages.
//
// Ensures that only a single `#step-section-*` panel is visible at a time and
// wires up "Next"/"Back" controls even if the main application bundle has not
// loaded. When the richer FastSurveyStepNav API is present the shim defers to
// it so behaviour stays consistent with the main experience.

(function () {
  const STEP_SELECTOR = 'section[id^="step-section-"]';
  const HASH_PATTERN = /^#step-section-(\d+)$/i;

  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  }

  function hasStepApi() {
    const api = window.FastSurveyStepNav;
    return (
      !!api &&
      typeof api.goToStep === 'function' &&
      typeof api.getCurrentStepIndex === 'function'
    );
  }

  onReady(() => {
    const steps = Array.from(document.querySelectorAll(STEP_SELECTOR));
    if (!steps.length) {
      return;
    }

    const totalSteps = steps.length;

    const clampIndex = (index) => Math.min(Math.max(index, 1), totalSteps);

    const readIndexFromHash = () => {
      const match = (window.location.hash || '').match(HASH_PATTERN);
      if (!match) {
        return 1;
      }
      const parsed = Number.parseInt(match[1], 10);
      return Number.isNaN(parsed) ? 1 : clampIndex(parsed);
    };

    const focusActiveSection = (index) => {
      if (hasStepApi()) {
        return;
      }

      const active = steps[index - 1];
      if (!active) {
        return;
      }

      if (typeof active.scrollTo === 'function') {
        active.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        active.scrollTop = 0;
      }
    };

    const applyFallbackVisibility = (index) => {
      if (hasStepApi()) {
        return;
      }

      steps.forEach((section, position) => {
        const isActive = position === index - 1;
        section.classList.toggle('is-active', isActive);
        section.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });

      focusActiveSection(index);
    };

    const ensureHash = () => {
      if (HASH_PATTERN.test(window.location.hash || '')) {
        return;
      }

      const firstId = steps[0]?.id;
      if (!firstId) {
        return;
      }

      if (window.history && typeof window.history.replaceState === 'function') {
        window.history.replaceState(null, '', `#${firstId}`);
      } else {
        window.location.hash = firstId;
      }
    };

    const getCurrentIndex = () => {
      if (hasStepApi()) {
        const apiIndex = window.FastSurveyStepNav.getCurrentStepIndex();
        return clampIndex(Number(apiIndex) + 1);
      }

      return readIndexFromHash();
    };

    const goTo = (targetIndex) => {
      const nextIndex = clampIndex(targetIndex);

      if (hasStepApi()) {
        window.FastSurveyStepNav.goToStep(nextIndex - 1, { scroll: true });
        return;
      }

      const id = steps[nextIndex - 1]?.id;
      if (!id) {
        return;
      }

      if (window.history && typeof window.history.replaceState === 'function') {
        window.history.replaceState(null, '', `#${id}`);
      } else {
        window.location.hash = id;
      }

      applyFallbackVisibility(nextIndex);
    };

    ensureHash();
    applyFallbackVisibility(getCurrentIndex());

    const NEXT_PATTERN = /^(next|next step)$/i;
    const PREV_PATTERN = /^(previous|previous step|back)$/i;

    const isNextControl = (element) => {
      if (!element) {
        return false;
      }

      const datasetNav = (element.dataset.nav || '').toLowerCase();
      if (datasetNav === 'next') {
        return true;
      }

      if (
        element.matches(
          '[data-step-next], [aria-label="Next step"], [title="Next step"]'
        )
      ) {
        return true;
      }

      const text = element.textContent ? element.textContent.trim() : '';
      return NEXT_PATTERN.test(text);
    };

    const isPrevControl = (element) => {
      if (!element) {
        return false;
      }

      const datasetNav = (element.dataset.nav || '').toLowerCase();
      if (datasetNav === 'prev' || datasetNav === 'previous' || datasetNav === 'back') {
        return true;
      }

      if (
        element.matches(
          '[data-step-prev], [aria-label="Previous step"], [title="Previous step"]'
        )
      ) {
        return true;
      }

      const text = element.textContent ? element.textContent.trim() : '';
      return PREV_PATTERN.test(text);
    };

    document.addEventListener('click', (event) => {
      const control = event.target.closest('button, a');
      if (!control) {
        return;
      }

      if (isNextControl(control)) {
        event.preventDefault();
        goTo(getCurrentIndex() + 1);
      } else if (isPrevControl(control)) {
        event.preventDefault();
        goTo(getCurrentIndex() - 1);
      }
    });

    window.addEventListener('hashchange', () => {
      applyFallbackVisibility(readIndexFromHash());
    });

    window.addEventListener('fastsurvey:stepchange', (event) => {
      const detailIndex =
        event && typeof event.detail?.index === 'number'
          ? clampIndex(event.detail.index + 1)
          : getCurrentIndex();

      applyFallbackVisibility(detailIndex);
    });
  });
})();

