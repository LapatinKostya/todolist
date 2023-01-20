import {RootState} from "../../app/store";

export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn