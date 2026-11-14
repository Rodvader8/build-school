// Pick the cheapest model that does the step well. Sorting an enquiry into a category is a one-word job.
// Writing a reply that follows a handbook is worth the bigger model.
export const MODELS = {
  classify: 'claude-haiku-5-5',
  plan: 'claude-opus-5-5',
};

export function chooseModel(step) {
  const model = MODELS[step];
  if (!model) throw new Error(`Unknown step: ${step}`);
  return model;
}
