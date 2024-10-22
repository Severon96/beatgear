export type SnackbarError = {
    message: string;
}

export interface ErrorContextType {
    errors: SnackbarError[];
    addError: (error: SnackbarError) => void;
}

export const errorContextDefault: ErrorContextType = {
    errors: [],
    addError: (error: SnackbarError) => console.log(error)
}