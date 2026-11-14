import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Calling an AI model and getting JSON back',
  minutes: 35,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'build_request has model, max_tokens and messages', test: ({ output }) => passed(output, 'build_request has model, max_tokens and messages') },
    { label: 'A system prompt is added only when you give one', test: ({ output }) => passed(output, 'a system prompt is added only when given') },
    { label: 'ask sends the key and version headers and returns the reply', test: ({ output }) => passed(output, 'ask sends the key and version headers and returns the response') },
    { label: 'A wrong key raises an HTTP error', test: ({ output }) => passed(output, 'a wrong key raises an HTTP error') },
    { label: 'extract_text joins the text blocks and skips the rest', test: ({ output }) => passed(output, 'extract_text joins the text blocks and skips the rest') },
    { label: 'extract_text refuses a reply that was cut off', test: ({ output }) => passed(output, 'extract_text refuses a reply that was cut off') },
    { label: 'parse_json_reply copes with plain, fenced and chatty replies', test: ({ output }) => passed(output, 'parse_json_reply handles plain, fenced and chatty replies') },
    { label: 'parse_json_reply raises ValueError on rubbish', test: ({ output }) => passed(output, 'parse_json_reply raises ValueError on rubbish') },
    { label: 'validate_mention accepts good data', test: ({ output }) => passed(output, 'validate_mention accepts good data') },
    { label: 'validate_mention rejects bad shapes and names the field', test: ({ output }) => passed(output, 'validate_mention rejects bad shapes and names the field') },
    { label: 'check_visibility returns validated data end to end', test: ({ output }) => passed(output, 'check_visibility returns validated data') },
    { label: 'The prompt names the brand and the question, and asks for JSON', test: ({ output }) => passed(output, 'the prompt names the brand, the question and asks for JSON') },
    { label: 'It copes with a fenced, chatty reply', test: ({ output }) => passed(output, 'it copes with a fenced, chatty reply') },
    { label: 'It rejects a reply with the wrong shape', test: ({ output }) => passed(output, 'it rejects a reply with the wrong shape') },
    { label: 'It rejects a reply that was cut off', test: ({ output }) => passed(output, 'it rejects a reply that was cut off') },
  ],
  hints: [
    'The response body\'s "content" is a list of blocks, not a string. A plain answer is one block like {"type": "text", "text": "..."}.',
    'For parse_json_reply, text.find("{") and text.rfind("}") give you the slice to parse. That survives code fences and chatty intros.',
    'In validate_mention, remember True is also an int in Python. Check isinstance(position, bool) first so that true can\'t slip through as position 1.',
  ],
} satisfies LessonMeta;
