export const checkEmailValidation = (email: string) => {
  const regex =
    /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
  const regexCheck = regex.test(email);
  const regexCheckText = "メールアドレスが不適切です";
  if (!regexCheck) {
    return regexCheckText;
  }

  return false;
};

export const checkPasswordValidation = (password: string) => {
  if (password.length < 8) {
    const passwordErrorText = "パスワードは8字以上で入力してください";
    return passwordErrorText;
  } else if (password.length > 20) {
    const passwordErrorText = "パスワードは20字以内で入力してください";
    return passwordErrorText;
  }

  return false;
};

export const checkPasswordConfirmValidation = (password: string) => {
  if (password.length < 8) {
    const passwordErrorText = "パスワードは8字以上で入力してください";
    return passwordErrorText;
  }

  return false;
};

export const checkNameValidation = (name: string) => {
  if (!name) {
    const nameErrorText = "空白にしないでください";
    return nameErrorText;
  }

  if (name.length > 20) {
    const nameErrorText = "20文字以内で入力してください";
    return nameErrorText;
  }

  return false;
};

export const checkIntroductionValidation = (introduction: string) => {
  if (!introduction) {
    const introductionErrorText = "空白にしないでください";
    return introductionErrorText;
  }

  if (introduction.length > 200) {
    const introductionErrorText = "200文字以内で入力してください";
    return introductionErrorText;
  }

  return false;
};

export const checkQuestionValidation = (question: string) => {
  if (!question) {
    const questionErrorText = "空白にしないでください";
    return questionErrorText;
  }

  if (question.length > 400) {
    const questionErrorText = "400文字以内で入力してください";
    return questionErrorText;
  }

  return false;
};

export const checkAnswerValidation = (answer: string) => {
  if (answer.length > 400) {
    const answerErrorText = "400文字以内で入力してください";
    return answerErrorText;
  }

  return false;
};
