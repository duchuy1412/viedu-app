import {
  API_BASE_URL,
  ACCESS_TOKEN,
  PRESENTATIONS_LIST_SIZE,
  REFRESH_TOKEN,
} from "../constants";

const request = (options) => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then((response) =>
    response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

export function getAllPresentations(page, size) {
  page = page || 0;
  size = size || PRESENTATIONS_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/presentations?page=" + page + "&size=" + size,
    method: "GET",
  });
}

export function getPresentation(presentationId) {
  return request({
    url: API_BASE_URL + "/presentation/" + presentationId,
    method: "GET",
  });
}

export function countPresentations() {
  return request({
    url: API_BASE_URL + "/presentations/count",
    method: "GET",
  });
}

export function createPresentation(presentationData) {
  return request({
    url: API_BASE_URL + "/presentation",
    method: "POST",
    body: JSON.stringify(presentationData),
  });
}

export function updatePresentation(presentationData) {
  return request({
    url: API_BASE_URL + "/presentation",
    method: "PUT",
    body: JSON.stringify(presentationData),
  });
}

export function addToPresentation(questions, presentationId) {
  return request({
    url: API_BASE_URL + "/presentation/" + presentationId + "/addQuestions",
    method: "POST",
    body: JSON.stringify(questions),
  });
}

export function deleteFromPresentation(questionId, presentationId) {
  return request({
    url:
      API_BASE_URL +
      "/presentation/" +
      presentationId +
      "/deleteQuestion/" +
      questionId,
    method: "DELETE",
  });
}

export function updateToPresentation(question, presentationId) {
  return request({
    url: API_BASE_URL + "/presentation/" + presentationId + "/updateQuestion",
    method: "PUT",
    body: JSON.stringify(question),
  });
}

export function deletePresentation(presentationId) {
  return request({
    url: API_BASE_URL + "/presentation/" + presentationId,
    method: "DELETE",
  });
}

export function deletePresentations(presentationIds) {
  return request({
    url: API_BASE_URL + "/presentations/" + presentationIds,
    method: "DELETE",
  });
}

export function getAllQuestions(page, size) {
  page = page || 0;
  size = size || PRESENTATIONS_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/questions?page=" + page + "&size=" + size,
    method: "GET",
  });
}

export function countQuestions() {
  return request({
    url: API_BASE_URL + "/questions/count",
    method: "GET",
  });
}

export function createQuestion(questionData) {
  return request({
    url: API_BASE_URL + "/question",
    method: "POST",
    body: JSON.stringify(questionData),
  });
}

export function updateQuestion(questionData) {
  return request({
    url: API_BASE_URL + "/question",
    method: "PUT",
    body: JSON.stringify(questionData),
  });
}

export function getQuestion(questionId) {
  return request({
    url: API_BASE_URL + "/question/" + questionId,
    method: "GET",
  });
}

export function deleteQuestion(questionId) {
  return request({
    url: API_BASE_URL + "/question/" + questionId,
    method: "DELETE",
  });
}

export function deleteQuestions(questionIds) {
  return request({
    url: API_BASE_URL + "/questions/" + questionIds,
    method: "DELETE",
  });
}

export function createGame(gameData) {
  return request({
    url: API_BASE_URL + "/game",
    method: "POST",
    body: JSON.stringify(gameData),
  });
}

export function getAllGames(page, size) {
  return request({
    url: API_BASE_URL + "/games?page=" + page + "&size=" + size,
    method: "GET",
  });
}

export function countGames() {
  return request({
    url: API_BASE_URL + "/games/count",
    method: "GET",
  });
}

export function getGame(gameId) {
  return request({
    url: API_BASE_URL + "/game/" + gameId,
    method: "GET",
  });
}

export function updateGame(gameData) {
  return request({
    url: API_BASE_URL + "/game",
    method: "PUT",
    body: JSON.stringify(gameData),
  });
}

export function deleteGame(gameId) {
  return request({
    url: API_BASE_URL + "/game/" + gameId,
    method: "DELETE",
  });
}

export function deleteGames(gameIds) {
  return request({
    url: API_BASE_URL + "/games/" + gameIds,
    method: "DELETE",
  });
}

export function checkExistByPIN(pin) {
  return request({
    url: API_BASE_URL + "/games/checkExistByPIN?pin=" + pin,
    method: "GET",
  });
}

export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/auth/signin",
    method: "POST",
    body: JSON.stringify(loginRequest),
  });
}

export function refreshToken(refreshTokenRequest) {
  return request({
    url: API_BASE_URL + "/auth/refreshtoken",
    method: "POST",
    body: JSON.stringify(refreshTokenRequest),
  });
}

export function signup(signupRequest) {
  return request({
    url: API_BASE_URL + "/auth/signup",
    method: "POST",
    body: JSON.stringify(signupRequest),
  });
}

export function checkUsernameAvailability(username) {
  return request({
    url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
    method: "GET",
  });
}

export function checkEmailAvailability(email) {
  return request({
    url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
    method: "GET",
  });
}

export function getCurrentUser() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/user/me",
    method: "GET",
  });
}

export function getUserProfile(username) {
  return request({
    url: API_BASE_URL + "/users/" + username,
    method: "GET",
  });
}

export function updateUserProfile(userProfile) {
  return request({
    url: API_BASE_URL + "/users",
    method: "PUT",
    body: JSON.stringify(userProfile),
  });
}

export function updatePassword(password, oldpassword) {
  return request({
    url:
      API_BASE_URL +
      "/user/updatePassword?password=" +
      password +
      "&oldpassword=" +
      oldpassword,
    method: "POST",
  });
}
