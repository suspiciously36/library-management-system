export const passwordRegEx =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/;

export const phoneRegEx =
  /^\+?[1-9]\d{1,14}$|^(\(\d{1,4}\)|\d{1,4})[-.\s]?(\d{1,4}[-.\s]?){1,4}$/;

export const emailRegEx = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

export const isbnRegEx =
  /^(?:ISBN(?:-13)?:? )?(?<gs1>\d{3})(?:(?<number>\d{9})|(?=[\d -]{14}$)[ -](?<registrationGroup>\d{1,5})[ -](?<registrant>\d{1,7})[ -](?<publication>\d{1,6})[ -])(?<checkDigit>\d)$/gm;
