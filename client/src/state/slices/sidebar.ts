import { createSlice } from "@reduxjs/toolkit";

interface SidebarState {
    collabse: boolean;
}

const initialState: SidebarState = {
    collabse: false,
};

export const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        collabse: (state) => {
            state.collabse = !state.collabse;
        }
    }
})

export const SidebarReducer = sidebarSlice.reducer;
export const { collabse } = sidebarSlice.actions

