export type SnackbarError = {
    message: string;
}

export interface ErrorContextType {
    errors: SnackbarError[];
    addError: (error: SnackbarError) => void;
}