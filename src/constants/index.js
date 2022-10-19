import URL from 'url-parse';

export const API_BASE_URL = '/api';
export const ACCESS_TOKEN = 'accessToken';

export const NAME_MIN_LENGTH = 4;
export const NAME_MAX_LENGTH = 40;

export const USERNAME_MIN_LENGTH = 4;
export const USERNAME_MAX_LENGTH = 15;

export const EMAIL_MAX_LENGTH = 40;

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 20;

let defaultServletPath = "/";

let url = new URL(window.location.href);
let reactPath= url.pathname.startsWith(defaultServletPath) ? defaultServletPath : "/" ;
export const REACT_PATH = reactPath;

