import {
  createElement,
  type ElementType,
  forwardRef,
  type Ref,
  useEffect,
  type ReactNode,
  type SyntheticEvent,
  useCallback,
  useRef,
  type RefObject,
} from 'react';

const JSX_RENDER_ID_ATTRIBUTE_NAME = 'data-render-id';
/** Builds an SVG grid that stretches to the given pixel box */
export function buildGridPlaceholder(w: number, h: number): string {
  const size = Math.max(w, h);
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 895 895" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="895" height="895" fill="#E9E7E7"/>
<g>
<line x1="447.505" y1="-23" x2="447.505" y2="901" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="889.335" y1="447.505" x2="5.66443" y2="447.505" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="889.335" y1="278.068" x2="5.66443" y2="278.068" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="889.335" y1="57.1505" x2="5.66443" y2="57.1504" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="61.8051" y1="883.671" x2="61.8051" y2="6.10572e-05" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="282.495" y1="907" x2="282.495" y2="-30" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="611.495" y1="907" x2="611.495" y2="-30" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="832.185" y1="883.671" x2="832.185" y2="6.10572e-05" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="889.335" y1="827.53" x2="5.66443" y2="827.53" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="889.335" y1="606.613" x2="5.66443" y2="606.612" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="4.3568" y1="4.6428" x2="889.357" y2="888.643" stroke="#C0C0C0" stroke-width="1.00975"/>
<line x1="-0.3568" y1="894.643" x2="894.643" y2="0.642772" stroke="#C0C0C0" stroke-width="1.00975"/>
<circle cx="447.5" cy="441.5" r="163.995" stroke="#C0C0C0" stroke-width="1.00975"/>
<circle cx="447.911" cy="447.911" r="237.407" stroke="#C0C0C0" stroke-width="1.00975"/>
<circle cx="448" cy="442" r="384.495" stroke="#C0C0C0" stroke-width="1.00975"/>
</g>
</svg>
`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

type PropsOf<As extends ElementType> = Omit<React.ComponentPropsWithRef<As>, 'as' | 'ref'>;

interface ExtraProps {
  renderId?: string;
}

type PolymorphicProps<As extends ElementType> = PropsOf<As> &
  ExtraProps & {
    as: As;
    children?: ReactNode;
  };

/**
 * Returns a fallback ref if no ref or a callback ref is passed.
 * Otherwise, it returns the original ref.
 */
function useOptionalRef<T>(ref?: Ref<T> | null): RefObject<T> {
  const fallbackRef = useRef<T>(null);
  if (ref && 'instance' in ref) return fallbackRef;
  return (ref as RefObject<T> | null) ?? fallbackRef;
}

const CreatePolymorphicComponent = forwardRef(
  // @ts-ignore
  function CreatePolymorphicComponentRender<As extends ElementType = 'div'>(
    { as, children, renderId, onError, ...rest }: PolymorphicProps<As>,
    forwardedRef?: Ref<Element>
  ) {
    // Augment <img> with fail-safe logic
    const props =
      as === 'img'
        ? {
            ...rest,
            // keep the original type of onError for <img>
            onError: (e: SyntheticEvent<HTMLImageElement, Event>) => {
              if (typeof onError === 'function') onError(e);
              const img = e.currentTarget;
              const { width, height } = img.getBoundingClientRect();
              img.dataset.hasFallback = '1';
              img.onerror = null;
              img.src = buildGridPlaceholder(Math.round(width) || 128, Math.round(height) || 128);
              img.style.objectFit = 'cover';
            },
          }
        : rest;
    const ref = useOptionalRef(forwardedRef);

    // If a grid placeholder is active, regenerate it on resize
    useEffect(() => {
      const el = ref && 'current' in (ref as any) ? (ref as any).current : null;
      if (!el) return;
      if (as !== 'img') {
        const placeholder = () => {
          const { width, height } = el.getBoundingClientRect();
          return buildGridPlaceholder(Math.round(width) || 128, Math.round(height) || 128);
        };

        const applyBgFallback = () => {
          el.dataset.hasFallback = '1';
          el.style.backgroundImage = `url("${placeholder()}")`;
          el.style.backgroundSize = 'cover';
        };

        const probeBg = () => {
          const bg = getComputedStyle(el).backgroundImage;
          const match = /url\(["']?(.+?)["']?\)/.exec(bg);
          const src = match?.[1];
          if (!src) return;

          const probe = new Image();
          probe.onerror = applyBgFallback;
          probe.src = src;
        };

        probeBg();

        const ro = new ResizeObserver(([entry]) => {
          if (!el.dataset.hasFallback) return;
          const { width, height } = entry.contentRect;
          el.style.backgroundImage = `url("${buildGridPlaceholder(
            Math.round(width) || 128,
            Math.round(height) || 128
          )}")`;
        });
        ro.observe(el);

        const mo = new MutationObserver(probeBg);
        mo.observe(el, {
          attributes: true,
          attributeFilter: ['style', 'class'],
        });

        return () => {
          ro.disconnect();
          mo.disconnect();
        };
      }
      if (!el.dataset.hasFallback) return;

      const ro = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        el.src = buildGridPlaceholder(Math.round(width) || 128, Math.round(height) || 128);
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, [as, ref]);

    return createElement(
      as,
      Object.assign({}, props, {
        ref,
        ...(renderId ? { [JSX_RENDER_ID_ATTRIBUTE_NAME]: renderId } : undefined),
      }),
      children
    );
  }
);

export default CreatePolymorphicComponent;
