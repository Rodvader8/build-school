// Bundle Monaco (the editor inside VS Code) locally instead of loading it from a CDN.
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import EditorWorker from 'monaco-editor/editor/editor.worker?worker';
import HtmlWorker from 'monaco-editor/languages/features/html/html.worker?worker';
import CssWorker from 'monaco-editor/languages/features/css/css.worker?worker';
import JsonWorker from 'monaco-editor/languages/features/json/json.worker?worker';
import TsWorker from 'monaco-editor/languages/features/typescript/ts.worker?worker';

self.MonacoEnvironment = {
  getWorker(_moduleId: string, label: string) {
    if (label === 'html' || label === 'handlebars' || label === 'razor') return new HtmlWorker();
    if (label === 'css' || label === 'scss' || label === 'less') return new CssWorker();
    if (label === 'json') return new JsonWorker();
    if (label === 'typescript' || label === 'javascript') return new TsWorker();
    return new EditorWorker();
  },
};

loader.config({ monaco });

// VS Code's Dark+ syntax colours on a dark violet canvas.
monaco.editor.defineTheme('rfd-night', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#0b0810',
    'editor.lineHighlightBackground': '#ffffff08',
    'editor.lineHighlightBorder': '#00000000',
    'editorLineNumber.foreground': '#5a5266',
    'editorLineNumber.activeForeground': '#d6d6dc',
    'editor.selectionBackground': '#b100fc40',
    'editor.inactiveSelectionBackground': '#b100fc22',
    'editorCursor.foreground': '#00dada',
    'editorIndentGuide.background1': '#ffffff0f',
    'editorWidget.background': '#120d18',
    'editorSuggestWidget.background': '#120d18',
    'editorSuggestWidget.selectedBackground': '#b100fc33',
    'minimap.background': '#0b0810',
    'scrollbarSlider.background': '#ffffff14',
    'scrollbarSlider.hoverBackground': '#ffffff22',
  },
});

export { monaco };

const LANGUAGES: Record<string, string> = {
  html: 'html', htm: 'html', css: 'css', js: 'javascript', mjs: 'javascript', ts: 'typescript',
  py: 'python', rs: 'rust', toml: 'ini', json: 'json', md: 'markdown', svg: 'xml', xml: 'xml',
};

export function languageFor(file: string) {
  return LANGUAGES[file.split('.').pop()?.toLowerCase() ?? ''] ?? 'plaintext';
}
