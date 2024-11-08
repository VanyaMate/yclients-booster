export const getBearerTokenDomAction = function (): string {
    return document.head.innerHTML.match(/ms\.auth\.user_partner_token\s*=\s*'(.*?)'/)?.[1] ?? '';
};