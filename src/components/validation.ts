export const Validation = (email: string, password: string) => {
  const emailErrorText = checkEmailValidation(email);
  const passwordErrorText = checkPasswordValidation(password);
  return {
    emailErrorText: emailErrorText,
    passwordErrorText: passwordErrorText,
  };
};

export const checkEmailValidation = (email: string) => {
  const regex =
    /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
  const regexCheck = regex.test(email);
  const regexCheckText = "メールアドレスが不適切です";
  if (!regexCheck) {
    return regexCheckText;
  }
};

export const checkPasswordValidation = (password: string) => {
  if (password.length < 8) {
    const passwordErrorText = "パスワードは8字以上で入力してください";
    return passwordErrorText;
  }
};

export const checkPasswordConfirmValidation = (password: string) => {
  if (password.length < 8) {
    const passwordErrorText = "パスワードは8字以上で入力してください";
    return passwordErrorText;
  }
};
