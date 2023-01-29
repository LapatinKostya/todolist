import {RootState} from "../../utils/types";

export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn