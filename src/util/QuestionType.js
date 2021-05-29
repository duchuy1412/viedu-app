export const QUESTION_CHOICE_ANSWER = "QUESTION_CHOICE_ANSWER";
export const QUESTION_TRUE_FALSE = "QUESTION_TRUE_FALSE";
export const QUESTION_INPUT_ANSWER = "QUESTION_INPUT_ANSWER";

export function getQuestionType(type) {
  let questionTypeName;
  switch (type) {
    case QUESTION_CHOICE_ANSWER:
      questionTypeName = "Choice answer";
      break;
    case QUESTION_TRUE_FALSE:
      questionTypeName = "True/false";
      break;
    case QUESTION_INPUT_ANSWER:
      questionTypeName = "Input answer";
      break;

    default:
      questionTypeName = "Choice answer";
      break;
  }

  return questionTypeName;
}
