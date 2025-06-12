export interface CustomError extends Error {
    statusCode?: number;
    data?: any;
    array(): any;
}
