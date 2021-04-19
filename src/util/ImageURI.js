import { BASE_URL } from "constants/index";

export const resoleImageURI = (nameFile) => {
  return BASE_URL + "/downloadFile/" + nameFile;
};
