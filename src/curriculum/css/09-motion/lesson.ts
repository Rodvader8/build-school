import type { LessonMeta } from '../../types';
import { computed, keyframes, rulesInMedia, ruleValue } from '../../helpers';

export default {
  title: 'Transitions and keyframes',
  minutes: 20,
  kind: 'web',
  entry: 'style.css',
  checks: [
    { label: 'The button is a gold pill', test: (c) => computed(c, '.nm-button', 'background-color') === 'rgb(242, 195, 139)' && computed(c, '.nm-button', 'border-top-left-radius') === '999px' && computed(c, '.nm-button', 'display') === 'inline-block' },
    { label: 'It transitions transform over 200ms', test: (c) => computed(c, '.nm-button', 'transition-property').includes('transform') && computed(c, '.nm-button', 'transition-duration').split(',')[0].trim() === '0.2s' },
    { label: 'On hover it lifts with transform', test: ({ doc }) => /translateY\(\s*-/.test(ruleValue(doc, '.nm-button:hover', 'transform')) },
    { label: 'It has a focus-visible outline', test: ({ doc }) => !!ruleValue(doc, '.nm-button:focus-visible', 'outline') || !!ruleValue(doc, '.nm-button:focus-visible', 'outline-style') },
    { label: '@keyframes nm-rise exists', test: ({ doc }) => keyframes(doc, 'nm-rise') },
    { label: 'The hero copy plays nm-rise', test: (c) => computed(c, '.nm-hero-copy', 'animation-name') === 'nm-rise' },
    { label: 'Reduced motion switches animations off', test: ({ doc }) => rulesInMedia(doc, /prefers-reduced-motion:\s*reduce/).some((r) => /0\.01ms|^0s?$|none/.test((r as CSSStyleRule).style?.getPropertyValue('animation-duration') ?? '')) },
  ],
  hints: [
    'transition goes on .nm-button itself, not on :hover. Otherwise it only animates one way.',
    'Name the keyframes exactly nm-rise, then use that name in the animation shorthand: animation: nm-rise 800ms ease-out both;',
  ],
} satisfies LessonMeta;
