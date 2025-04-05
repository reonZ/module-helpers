function getCurrentUser() {
    return game.user ?? game.data.users.find((x) => x._id === game.userId);
}
function userIsGM(user = getCurrentUser()) {
    return user && user.role >= CONST.USER_ROLES.ASSISTANT;
}
export { userIsGM };
