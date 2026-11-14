// Pick the cheapest model that does the step well. Sorting an enquiry into a category is a one-word job,
// so it belongs on claude-haiku-5-5. Writing a reply that follows a handbook is worth claude-opus-5-5.
// Right now everything uses the big model. Give chooseModel('classify') the small one, and throw for a step it doesn't know.
export const MODELS = {
  classify: 'claude-opus-5-5',
  plan: 'claude-opus-5-5',
};

export function chooseModel(step) {
  return MODELS[step] ?? MODELS.plan;
}
